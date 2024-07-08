'use client';

import { supabase } from '../lib/supabaseClient';

export default function SimpleLogin() {
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) console.error('Error logging in with Google:', error.message);
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      className='bg-blue-500 text-white p-2 rounded'
    >
      Sign in with Google
    </button>
  );
}
