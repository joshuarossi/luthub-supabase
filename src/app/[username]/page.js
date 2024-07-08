'use client'; // Ensure this is a client component

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) return;
      const { data, error } = await supabase
        .from('profiles') // Assuming you have a 'profiles' table
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
      } else {
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (!userProfile) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-4xl font-bold'>Loading...</h1>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold'>{userProfile.email}'s Profile</h1>
      {/* Display other user profile details here */}
    </div>
  );
}
