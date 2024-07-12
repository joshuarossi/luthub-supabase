'use client';

import React, { useEffect, useState } from 'react';
import LutCard from '../../components/LutCard';
import { initWebGL } from '../../lib/applyLUT_WebGL';

const Dashboard = () => {
  const [luts, setLuts] = useState([]);
  const [gl, setGL] = useState(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const glContext = initWebGL(canvas);
    setGL(glContext);
  }, []);

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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {luts.map(lut => (
          <LutCard key={lut.id} lut={lut} gl={gl} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
