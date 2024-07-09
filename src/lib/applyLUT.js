import { parse, stringify } from 'cube-lut.js';

const applyLUT = async (imageURL, lutURL) => {
  console.log(lutURL);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle CORS issues
    img.src = imageURL;

    img.onload = async () => {
      try {
        // here we are getting the LUT file
        const response = await fetch(lutURL);
        const lutText = await response.text();
        // Now we parse it to turn it into a lut object
        const lutData = parse(lutText);
        // Here we are creating a canvas to draw the image on
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Here we need to apply the LUT to the image on the canvas
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const size = lutData.size;
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;

          const rIndex = Math.floor(r * (size - 1));
          const gIndex = Math.floor(g * (size - 1));
          const bIndex = Math.floor(b * (size - 1));

          // Calculate the index in the nested LUT array
          const lutIndex = rIndex + gIndex * size + bIndex * size * size;

          // Access LUT values
          const [lutR, lutG, lutB] = lutData.data[lutIndex];

          // Apply LUT values to the image data
          data[i] = lutR * 255;
          data[i + 1] = lutG * 255;
          data[i + 2] = lutB * 255;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      } catch (error) {
        reject(new Error('Failed to load LUT: ' + error.message));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image.'));
  });
};

export default applyLUT;
