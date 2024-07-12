import { useState, useEffect, Suspense } from 'react';
import applyLUT from '../lib/applyLUT_WebGL';
import ReactCompareImage from 'react-compare-image';

const LutCard = ({ lut }) => {
  console.log(lut);
  const [appliedImage, setAppliedImage] = useState(null);
  const rawURL =
    'https://lzfqrvvpfkrxxdvlrvss.supabase.co/storage/v1/object/sign/test-images/raw.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0LWltYWdlcy9yYXcucG5nIiwiaWF0IjoxNzIwNDkwODQ3LCJleHAiOjE3NTIwMjY4NDd9.OQyX24IJDSXaBqfterl0Y_XrB2jwOZGSURq3GiCq9HE&t=2024-07-09T02%3A07%3A27.334Z';
  useEffect(() => {
    const processImage = async () => {
      try {
        const gradedImage = await applyLUT(rawURL, lut.url);
        setAppliedImage(gradedImage);
      } catch (error) {
        console.error('Failed to apply LUT:', error);
      }
    };
    console.log('about to process Image');
    processImage();
  }, [lut.url]);

  return (
    <div key={lut.id} className='bg-gray-100 shadow-md rounded-lg p-4'>
      <h2 className='text-xl font-semibold text-gray-800'>{lut.name}</h2>
      <Suspense fallback={<div>Loading...</div>}>
        {appliedImage && (
          <ReactCompareImage leftImage={rawURL} rightImage={appliedImage} />
        )}
      </Suspense>
      <div className='description-box'>
        <p className='text-gray-700'>{lut.description}</p>
      </div>
      <div className='mt-2'>
        <strong className='text-gray-800'>Expects:</strong>{' '}
        <span className='text-gray-800'>{lut.input}</span>
      </div>
      <div className='mt-2'>
        <strong className='text-gray-800'>Returns:</strong>{' '}
        <span className='text-gray-700'>{lut.output}</span>
      </div>
      <div className='mt-2'>
        <strong className='text-gray-800'>LUT Size:</strong>{' '}
        <span className='text-gray-700'>{lut.size}</span>
      </div>
      <div className='mt-2'>
        <strong className='text-gray-800'>LUT Type:</strong>{' '}
        <span className='text-gray-700'>{lut.type}</span>
      </div>
      <div className='mt-2'>
        <strong className='text-gray-800'>Uploaded By:</strong>{' '}
        <span className='text-gray-700'>{lut.uploaded_by}</span>
      </div>
      <a
        href={lut.url}
        className='text-blue-600 hover:underline mt-2 block'
        target='_blank'
        rel='noopener noreferrer'
      >
        Download
      </a>
    </div>
  );
};

export default LutCard;
