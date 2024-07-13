import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UploadLUTModal = ({ onClose, onUpload }) => {
  const [lutFile, setLutFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [size, setSize] = useState('');
  const [type, setType] = useState('');

  const handleLUTUpload = event => {
    setLutFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (lutFile && name && description && input && output && size && type) {
      const formData = new FormData();
      formData.append('file', lutFile);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('input', input);
      formData.append('output', output);
      formData.append('size', size);
      formData.append('type', type);

      // Get the current user's session to retrieve the access token
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log(session);
      if (error) {
        console.error('Failed to get session:', error.message);
        return;
      }

      // Check if the session is valid and has an access token
      if (!session || !session.access_token) {
        console.error('No valid session or access token found');
        return;
      }
      formData.append('uploaded_by', session.user.email); // Append the user's email to the form data
      const response = await fetch('/api/luts', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`, // Include the access token in the headers
        },
      });
      onClose();
      window.location.reload();
      if (response.ok) {
        const newLut = await response.json();
        onUpload(newLut.lut);
        onClose();
      } else {
        console.error('Failed to upload LUT');
      }
    } else {
      console.error('Please fill in all fields');
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
      <div className='bg-white p-4 rounded shadow-md z-50 w-96'>
        <h2 className='text-xl font-bold mb-4'>Upload LUT</h2>
        <input
          type='file'
          accept='.cube'
          onChange={handleLUTUpload}
          className='mb-4 p-2 border border-gray-300 rounded w-full text-black'
        />
        <input
          type='text'
          placeholder='LUT Name'
          value={name}
          onChange={e => setName(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded w-full text-black'
        />
        <textarea
          placeholder='Description'
          value={description}
          onChange={e => setDescription(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded w-full text-black'
        />
        <input
          type='text'
          placeholder='Input Color Space'
          value={input}
          onChange={e => setInput(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded w-full text-black'
        />
        <input
          type='text'
          placeholder='Output Color Space'
          value={output}
          onChange={e => setOutput(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded w-full text-black'
        />
        <input
          type='text'
          placeholder='Size'
          value={size}
          onChange={e => setSize(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded w-full text-black'
        />
        <input
          type='text'
          placeholder='Type'
          value={type}
          onChange={e => setType(e.target.value)}
          className='mb-4 p-2 border border-gray-300 rounded w-full text-black'
        />
        <div className='flex justify-end'>
          <button
            onClick={handleUpload}
            className='mr-2 px-4 py-2 bg-blue-500 text-white rounded'
          >
            Upload
          </button>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-500 text-white rounded'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadLUTModal;
