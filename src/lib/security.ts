import { supabase } from './supabase';

export async function redactSensitiveInfo(text: string, userId: string) {
  // Get user-specific redaction patterns
  const { data: patterns } = await supabase
    .from('user_redactions')
    .select('patterns')
    .eq('user_id', userId)
    .single();

  if (!patterns) return text;

  return patterns.reduce((str: string, pattern: string) => 
    str.replace(new RegExp(pattern, 'gi'), '[REDACTED]'), text);
}

export async function validateRecipient(userId: string, email: string) {
  const { count } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('email', email);

  return count !== null && count > 0;
}