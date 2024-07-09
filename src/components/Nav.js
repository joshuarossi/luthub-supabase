'use client'; // Ensure this is a client component

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Dropdown from '../components/Dropdown';

export default function Nav() {
  const { user, logout } = useAuth();

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        console.error('Error logging in with Google:', error.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }
  };

  return (
    <nav className='bg-gray-800 p-4'>
      <div className='container mx-auto flex justify-between items-end'>
        <div className='flex items-end space-x-8'>
          <Link href='/' className='rainbow-text text-4xl leading-none'>
            LH
          </Link>
          <div className='flex space-x-4 ml-8 items-center'>
            <Link
              href='/about'
              className='text-white hover:text-gray-400 leading-none'
            >
              About
            </Link>
            <Link
              href='/dashboard'
              className='text-white hover:text-gray-400 leading-none'
            >
              Dashboard
            </Link>
            {/* Add more nav links here */}
          </div>
        </div>
        <div>
          {user ? (
            <Dropdown label={user.email}>
              <Link
                href={`/profile/${user.id}`}
                className='block px-4 py-2 text-sm text-white hover:bg-gray-700'
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className='block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700'
              >
                Logout
              </button>
            </Dropdown>
          ) : (
            <button
              onClick={signInWithGoogle}
              className='text-white hover:text-gray-400'
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
