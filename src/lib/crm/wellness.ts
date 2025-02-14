import { supabase } from '../supabase';

export async function calculateWellnessScore(userId: string) {
  const [tasks, meetings, emails] = await Promise.all([
    supabase.from('tasks').select('*').eq('user_id', userId),
    supabase.from('meetings').select('*').eq('user_id', userId),
    supabase.from('emails').select('*').eq('user_id', userId)
  ]);

  const workloadScore = calculateWorkload(
    tasks.data?.length || 0,
    meetings.data?.length || 0,
    emails.data?.length || 0
  );

  // Log wellness score
  await supabase.from('wellness_logs').upsert({
    user_id: userId,
    last_check: new Date().toISOString(),
    score: workloadScore,
    recommendations: getRecommendations(workloadScore)
  });

  return {
    score: workloadScore,
    message: getWellnessMessage(workloadScore)
  };
}

function calculateWorkload(tasks: number, meetings: number, emails: number) {
  const score = Math.min(100, 
    (tasks * 0.4) + 
    (meetings * 0.3) + 
    (emails * 0.3)
  );
  return Math.floor(score);
}

function getWellnessMessage(score: number): string {
  if (score > 80) return 'Consider taking a break soon! 🧘';
  if (score > 60) return 'You have a moderate workload ⚖️';
  return 'Your workload seems manageable ✅';
}

function getRecommendations(score: number): string[] {
  const recommendations: string[] = [];
  
  if (score > 80) {
    recommendations.push(
      'Consider delegating some tasks',
      'Take short breaks between meetings',
      'Block focus time in your calendar'
    );
  } else if (score > 60) {
    recommendations.push(
      'Review task priorities',
      'Group similar tasks together',
      'Schedule breaks proactively'
    );
  } else {
    recommendations.push(
      'Great job managing your workload!',
      'Plan ahead for upcoming projects',
      'Maintain your current work-life balance'
    );
  }
  
  return recommendations;
}