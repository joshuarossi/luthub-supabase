// src/app/page.js
'use client';
import TestSupabase from '../components/TestSupabase';
import { useState } from 'react';
import Image from 'next/image';
import ReactCompareImage from 'react-compare-image';

export default function Home() {
  const [showConverted, setShowConverted] = useState(false);
  const [showGraded, setShowGraded] = useState(false);

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
            leftImage={
              showConverted ? '/images/converted.png' : '/images/raw.png'
            }
            rightImage={
              showGraded ? '/images/graded.png' : '/images/converted.png'
            }
          />
        </div>
      </div>
    </div>
  );
}
