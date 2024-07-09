'use client';

import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [luts, setLuts] = useState([]);

  useEffect(() => {
    const fetchLuts = async () => {
      const response = await fetch('/api/luts');
      const data = await response.json();
      setLuts(data);
    };

    fetchLuts();
  }, []);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>LUT Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {luts.map(lut => (
          <div key={lut.id} className='bg-white shadow-md rounded-lg p-4'>
            <h2 className='text-xl font-semibold'>{lut.name}</h2>
            <p className='text-gray-600'>{lut.description}</p>
            <a
              href={lut.url}
              className='text-blue-500 hover:underline mt-2 block'
              target='_blank'
              rel='noopener noreferrer'
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
