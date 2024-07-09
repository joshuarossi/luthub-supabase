// src/app/page.js
'use client';
import TestSupabase from '../components/TestSupabase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactCompareImage from 'react-compare-image';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [showConverted, setShowConverted] = useState(true);
  const [showGraded, setShowGraded] = useState(true);
  const rawURL =
    'https://lzfqrvvpfkrxxdvlrvss.supabase.co/storage/v1/object/sign/test-images/raw.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0LWltYWdlcy9yYXcucG5nIiwiaWF0IjoxNzIwNDkwODQ3LCJleHAiOjE3NTIwMjY4NDd9.OQyX24IJDSXaBqfterl0Y_XrB2jwOZGSURq3GiCq9HE&t=2024-07-09T02%3A07%3A27.334Z';
  const convertedURL =
    'https://lzfqrvvpfkrxxdvlrvss.supabase.co/storage/v1/object/sign/test-images/converted.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0LWltYWdlcy9jb252ZXJ0ZWQucG5nIiwiaWF0IjoxNzIwNDkwODY3LCJleHAiOjE3NTIwMjY4Njd9.8SNvcOMuvYqzCS2_RHXEoRIAjIDsS5PQ4oh2hlH3pCc&t=2024-07-09T02%3A07%3A47.795Z';
  const gradedURL =
    'https://lzfqrvvpfkrxxdvlrvss.supabase.co/storage/v1/object/sign/test-images/graded.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0LWltYWdlcy9ncmFkZWQucG5nIiwiaWF0IjoxNzIwNDkwODgzLCJleHAiOjE3NTIwMjY4ODN9.TUXiNzhNmAld-XGlmg36NAo5oDk6My2JAR8Id5jadbg&t=2024-07-09T02%3A08%3A03.134Z';
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold'>Welcome to LUTHub</h1>
      <TestSupabase />
      <input
        type='checkbox'
        id='showConverted'
        checked={showConverted}
        onChange={() => setShowConverted(!showConverted)}
      />
      <label htmlFor='showConverted'>
        {showConverted ? 'Show Raw' : 'Show Converted'}
      </label>
      <input
        type='checkbox'
        id='showGraded'
        checked={showGraded}
        onChange={() => setShowGraded(!showGraded)}
      />
      <label htmlFor='showGraded'>
        {showGraded ? 'Show Converted' : 'Show Graded'}
      </label>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            overflow: 'auto',
          }}
        >
          <ReactCompareImage
            leftImage={showConverted ? convertedURL : rawURL}
            rightImage={showGraded ? gradedURL : convertedURL}
          />
        </div>
      </div>
    </div>
  );
}
