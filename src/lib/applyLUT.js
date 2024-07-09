import * as fx from 'glfx';

const applyLUT = async (imageURL, lutURL) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To handle CORS issues
    img.src = imageURL;

    img.onload = () => {
      const lutImg = new Image();
      lutImg.crossOrigin = 'Anonymous'; // To handle CORS issues
      lutImg.src = lutURL;

      lutImg.onload = () => {
        const canvas = fx.canvas();
        const texture = canvas.texture(img);
        const lutTexture = canvas.texture(lutImg);

        canvas.draw(texture).update();
        canvas.draw(texture).applyLUT(lutTexture).update();

        resolve(canvas.toDataURL());
      };

      lutImg.onerror = () => reject(new Error('Failed to load LUT image.'));
    };

    img.onerror = () => reject(new Error('Failed to load image.'));
  });
};

export default applyLUT;
