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
    return new Response(
      JSON.stringify({ msg: 'line 35', error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Fetch the authenticated user
  const { data: user, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return new Response(
      JSON.stringify({ msg: 'line 45', error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('luts')
    .upload(`${file.name}`, file);

  if (uploadError) {
    return new Response(
      JSON.stringify({ msg: 'line 56', error: uploadError.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  // https://lzfqrvvpfkrxxdvlrvss.supabase.co/storage/v1/object/public/luts/AppleLogToDWG33.cube
  const lutURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/luts/${uploadData.path}`;
  console.log(lutURL, uploadData.path);

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
    ])
    .select(); // Ensure the inserted data is returned

  if (insertError) {
    return new Response(
      JSON.stringify({ msg: 'line 79', error: insertError.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  console.log(insertData);
  if (!insertData || insertData.length === 0) {
    return new Response(
      JSON.stringify({
        msg: 'line 100',
        error: 'Insert operation failed',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  console.log(insertData);
  return new Response(JSON.stringify({ lut: insertData[0] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
