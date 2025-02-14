import { GoogleGenerativeAI } from "@google/generative-ai";
import { redactSensitiveInfo } from '../security';
import { LearningSystem } from './LearningModel';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateResponse(query: string, userId: string) {
  try {
    // Initialize learning system
    const learningSystem = new LearningSystem(userId);
    await learningSystem.initialize();

    // Predict intent using ML model
    const intent = await learningSystem.predictIntent(query);

    // Redact sensitive information
    const cleanQuery = await redactSensitiveInfo(query, userId);
    
    // Check if CRM data is needed based on ML prediction
    if (intent === 'task' || intent === 'meeting' || intent === 'email') {
      const crmData = await fetchCRMData(userId, cleanQuery);
      return formatCRMResponse(crmData, intent);
    }

    // Use Gemini for general queries
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(cleanQuery);
    return result.response.text();

  } catch (error) {
    return "I encountered an error processing your request. Please try again.";
  }
}

async function fetchCRMData(userId: string, query: string) {
  // Implement CRM data fetching logic based on query context
  const { data } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);

  return data || {};
}

function formatCRMResponse(data: any, intent: string): string {
  switch (intent) {
    case 'task':
      return "I'll help you create a task. What would you like to add to your task list?";
    case 'meeting':
      return "I can help you schedule a meeting. When would you like to schedule it?";
    case 'email':
      return "I'll assist you with composing an email. Who would you like to send it to?";
    default:
      return "Here's what I found in your CRM...";
  }
}