// src/app/page.js
'use client';
import TestSupabase from '../components/TestSupabase';

export default function Home() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold'>Welcome to LUTHub</h1>
      <TestSupabase />
    </div>
  );
}
