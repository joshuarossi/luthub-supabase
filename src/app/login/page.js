'use client'; // Ensure this is a client component

import Login from '../../components/Login';

export default function LoginPage() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold'>Login</h1>
      <p className='mt-4 text-lg'>Login to upload and manage your files.</p>
      <Login />
    </div>
  );
}
