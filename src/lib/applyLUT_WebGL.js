import { parse } from 'cube-lut.js';

// Vertex Shader Source
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// Fragment Shader Source
const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform sampler2D u_lut;
  varying vec2 v_texCoord;

  vec4 applyLUT(vec4 color) {
    float size = 33.0; // LUT size
    float sliceSize = size * size; // Number of pixels per slice
    float slicePixelWidth = 1.0 / sliceSize; // Width of each pixel in the LUT texture
    float slicePixelHeight = 1.0 / size; // Height of each pixel in the LUT texture

    vec3 index = floor(color.rgb * (size - 1.0));
    vec3 fraction = fract(color.rgb * (size - 1.0));

    float rIndex = index.r + index.g * size + index.b * size * size;
    float rNext = rIndex + 1.0;

    vec2 texCoord1 = vec2(
      mod(rIndex, sliceSize) * slicePixelWidth,
      floor(rIndex / sliceSize) * slicePixelHeight
    );

    vec2 texCoord2 = vec2(
      mod(rNext, sliceSize) * slicePixelWidth,
      floor(rNext / sliceSize) * slicePixelHeight
    );

    vec4 color1 = texture2D(u_lut, texCoord1);
    vec4 color2 = texture2D(u_lut, texCoord2);

    return mix(color1, color2, fraction.r);
  }

  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    gl_FragColor = applyLUT(color);
  }
`;

// Initialize WebGL
const initWebGL = canvas => {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return null;
  }
  return gl;
};

// Compile Shader
const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      'An error occurred compiling the shaders:',
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

// Initialize Shader Program
const initShaderProgram = (gl, vsSource, fsSource) => {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      'Unable to initialize the shader program:',
      gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
};

// Initialize Buffers
const initBuffers = gl => {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

  const texCoords = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    texCoord: texCoordBuffer,
  };
};

// Load Texture from URL
const loadTexture = (gl, url) => {
  return new Promise((resolve, reject) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
      resolve(texture);
    };
    image.onerror = reject;
    image.src = url;
  });
};

// Check if a value is a power of 2
const isPowerOf2 = value => {
  return (value & (value - 1)) === 0;
};

// Apply LUT
const applyLUT = async (imageURL, lutURL) => {
  const canvas = document.createElement('canvas');
  const gl = initWebGL(canvas);
  if (!gl) return;

  const shaderProgram = initShaderProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'a_position'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'a_texCoord'),
    },
    uniformLocations: {
      u_image: gl.getUniformLocation(shaderProgram, 'u_image'),
      u_lut: gl.getUniformLocation(shaderProgram, 'u_lut'),
    },
  };

  const buffers = initBuffers(gl);
  const imageTexture = await loadTexture(gl, imageURL);

  // Fetch and parse the LUT file
  const lutResponse = await fetch(lutURL);
  const lutText = await lutResponse.text();
  const lutData = parse(lutText);

  // Create a flattened 2D texture for the LUT
  const lutArray = new Uint8Array(33 * 33 * 33 * 4);
  for (let i = 0; i < lutData.data.length; i++) {
    lutArray[i * 4] = lutData.data[i][0] * 255;
    lutArray[i * 4 + 1] = lutData.data[i][1] * 255;
    lutArray[i * 4 + 2] = lutData.data[i][2] * 255;
    lutArray[i * 4 + 3] = 255; // Alpha channel
  }

  const lutTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, lutTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1089,
    33,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    lutArray
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Setup and execute WebGL program
  gl.useProgram(programInfo.program);

  // Bind position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  // Bind texture coordinate buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    2,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

  // Bind image texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, imageTexture);
  gl.uniform1i(programInfo.uniformLocations.u_image, 0);

  // Bind LUT texture
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, lutTexture);
  gl.uniform1i(programInfo.uniformLocations.u_lut, 1);

  // Draw the scene
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // Output the result
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;
  const ctx = outputCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0);

  // Clean up WebGL resources
  gl.deleteTexture(imageTexture);
  gl.deleteTexture(lutTexture);
  gl.deleteProgram(shaderProgram);

  return outputCanvas.toDataURL();
};

export default applyLUT;
