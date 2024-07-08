// src/components/TestSupabase.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TestSupabase() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('non_existent_table')
        .select('*');
      if (error) {
        setMessage('Supabase is configured correctly');
      } else {
        setMessage('Unexpected success');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}
