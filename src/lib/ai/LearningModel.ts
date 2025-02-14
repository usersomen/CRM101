import * as tf from '@tensorflow/tfjs';
import { supabase } from '../supabase';

export class LearningSystem {
  private userId: string;
  private nlpModel: tf.LayersModel | null;
  private feedbackQueue: any[];
  private vocab: Set<string>;

  constructor(userId: string) {
    this.userId = userId;
    this.nlpModel = null;
    this.feedbackQueue = [];
    this.vocab = new Set();
  }

  async initialize() {
    await this.loadVocab();
    try {
      this.nlpModel = await tf.loadLayersModel(`indexeddb://${this.userId}-nlp`);
    } catch {
      this.nlpModel = this.createNLPModel();
      await this.trainInitialModel();
    }
  }

  private createNLPModel(): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.embedding({ 
          inputDim: Math.max(1000, this.vocab.size), 
          outputDim: 32,
          inputLength: 100 
        }),
        tf.layers.lstm({ units: 64, returnSequences: true }),
        tf.layers.lstm({ units: 32 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 5, activation: 'softmax' })
      ]
    });

    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  }

  async processFeedback(feedback: any) {
    this.feedbackQueue.push(feedback);
    
    if (this.feedbackQueue.length >= 50) {
      await this.retrainModel();
      this.feedbackQueue = [];
    }
  }

  private async retrainModel() {
    if (!this.nlpModel) return;

    const trainingData = await this.prepareTrainingData();
    
    await this.nlpModel.fit(trainingData.xs, trainingData.ys, {
      epochs: 10,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          await this.logPerformance({
            epoch,
            accuracy: logs?.acc || 0,
            loss: logs?.loss || 0
          });
        }
      }
    });

    await this.saveModel();
  }

  private async prepareTrainingData() {
    const { data: interactions } = await supabase
      .from('interactions')
      .select('query, intent, feedback')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (!interactions) return { xs: tf.tensor2d([]), ys: tf.tensor2d([]) };

    const processedData = this.processInteractions(interactions);
    
    return {
      xs: tf.tensor2d(processedData.inputs),
      ys: tf.oneHot(tf.tensor1d(processedData.outputs, 'int32'), 5)
    };
  }

  private processInteractions(interactions: any[]) {
    const inputs: number[][] = [];
    const outputs: number[] = [];

    for (const interaction of interactions) {
      const vector = this.textToVector(interaction.query);
      if (vector) {
        inputs.push(vector);
        outputs.push(this.intentToLabel(interaction.intent));
      }
    }

    return { inputs, outputs };
  }

  private textToVector(text: string): number[] | null {
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    if (words.length === 0) return null;

    const vector = new Array(100).fill(0);
    words.forEach((word, i) => {
      if (i < 100) {
        const wordIndex = Array.from(this.vocab).indexOf(word);
        vector[i] = wordIndex === -1 ? 0 : wordIndex + 1;
      }
    });

    return vector;
  }

  private intentToLabel(intent: string): number {
    const intents = ['query', 'task', 'email', 'meeting', 'other'];
    return intents.indexOf(intent) !== -1 ? intents.indexOf(intent) : 4;
  }

  private async loadVocab() {
    const { data } = await supabase
      .from('nlp_vocabs')
      .select('vocab')
      .eq('user_id', this.userId)
      .single();

    if (data?.vocab) {
      this.vocab = new Set(data.vocab);
    }
  }

  private async saveModel() {
    if (!this.nlpModel) return;
    await this.nlpModel.save(`indexeddb://${this.userId}-nlp`);
  }

  private async logPerformance(metrics: { epoch: number; accuracy: number; loss: number }) {
    await supabase
      .from('model_versions')
      .upsert({
        user_id: this.userId,
        model_type: 'nlp',
        version: Date.now(),
        performance: metrics
      });
  }

  async predictIntent(text: string): Promise<string> {
    if (!this.nlpModel) return 'other';

    const vector = this.textToVector(text);
    if (!vector) return 'other';

    const prediction = this.nlpModel.predict(tf.tensor2d([vector])) as tf.Tensor;
    const intents = ['query', 'task', 'email', 'meeting', 'other'];
    const index = (await prediction.argMax(1).data())[0];
    
    return intents[index] || 'other';
  }
}