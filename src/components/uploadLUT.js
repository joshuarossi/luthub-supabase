import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UploadLUT = () => {
  const [lutFile, setLutFile] = useState(null);

  const handleLUTUpload = event => {
    setLutFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (lutFile) {
      const { data, error } = await supabase.storage
        .from('luts')
        .upload(`public/${lutFile.name}`, lutFile);

      if (error) {
        console.error('Error uploading file:', error);
        return;
      }

      // Optionally, you can refresh the page or trigger a fetch to update the dashboard
      window.location.reload(); // This is a simple way to refresh the dashboard
    }
  };

  return (
    <div>
      <input type='file' accept='.cube' onChange={handleLUTUpload} />
      <button onClick={handleUpload}>Upload LUT</button>
    </div>
  );
};

export default UploadLUT;
