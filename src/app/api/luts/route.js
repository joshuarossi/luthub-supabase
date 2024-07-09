import { supabase } from '../../../lib/supabaseClient';

export async function GET(request) {
  const { data, error } = await supabase.from('luts').select('*');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
