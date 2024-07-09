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

export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get('name');
  const description = formData.get('description');
  const file = formData.get('file');
  const input = formData.get('input');
  const output = formData.get('output');
  const size = formData.get('size');
  const type = formData.get('type');

  // Extract the Authorization header
  const authHeader = request.headers.get('Authorization');
  const token = authHeader ? authHeader.split(' ')[1] : null;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Fetch the authenticated user
  const { data: user, error: userError } =
    await supabase.auth.api.getUser(token);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('luts')
    .upload(`public/${file.name}`, file);

  if (uploadError) {
    return new Response(JSON.stringify({ error: uploadError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lutURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${uploadData.path}`;

  const { data: insertData, error: insertError } = await supabase
    .from('luts')
    .insert([
      {
        name,
        description,
        url: lutURL,
        input,
        output,
        size,
        type,
        uploaded_by: user.email,
      },
    ]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ lut: insertData[0] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
