import { Renderer } from "./renderer";

const vertexShaderSource = `#version 300 es
in vec2 position;
in vec4 color;
in vec2 texcoord;
out vec4 Color;
out vec2 Texcoord;

void main() {
  Color = color;
  Texcoord = texcoord;
  gl_Position = vec4(position.x, position.y, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec4 Color;
in vec2 Texcoord;
out vec4 outColor;
uniform sampler2D tex;
uniform bool horizontal;
float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

void main() {
  // vec2 tex_offset = vec2(0.003, 0.003);
  // vec4 result = texture(tex, Texcoord) * Color * weight[0];
  // int size = 10;
  // int step = 3;
  // for(int y = -size; y < size; y += step)
  // {
  //   for(int x = -size; x < size; x += step)
  //   {
  //     result += texture(tex, Texcoord + vec2(tex_offset.x * float(x), tex_offset.y * float(y))) * Color * 0.1;
  //   }
  // }
  // outColor = result;
  outColor = texture(tex, Texcoord) * Color;
}
`;

export class RendererWebgl extends Renderer {
  private ctx = this.canvas.getContext('webgl2')!;
  private charSize = 48;
  private chars = 1;
  private maxChars = 2000;
  private vertices = new Float32Array(this.charSize * this.maxChars);

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    const gl = this.ctx;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    const program = gl.createProgram();
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    const posAttrib = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 8 * 4, 0);
    gl.enableVertexAttribArray(posAttrib);
    const colorAttrib = gl.getAttribLocation(program, 'color');
    gl.vertexAttribPointer(colorAttrib, 4, gl.FLOAT, false, 8 * 4, 2 * 4);
    gl.enableVertexAttribArray(colorAttrib);
    const texAttrib = gl.getAttribLocation(program, 'texcoord');
    gl.vertexAttribPointer(texAttrib, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
    gl.enableVertexAttribArray(texAttrib);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    const fontSize = 2048;
    const fontCanvas = document.createElement('canvas');
    fontCanvas.width = fontSize;
    fontCanvas.height = fontSize;
    const fontColumns = 10;
    const fontRows = 10;
    const fontCtx = fontCanvas.getContext('2d')!;
    fontCtx.textAlign = 'center';
    fontCtx.textBaseline = 'middle';
    fontCtx.fillStyle = '#ffffff';
    fontCtx.font = `${fontCanvas.height / fontRows * 0.98}px Arial`;
    for (let i = 0; i < 100; i++) {
      const char = String.fromCharCode(32 + i);
      const x = i % fontColumns * fontCanvas.width / fontColumns + (fontCanvas.width / fontColumns / 2);
      const y = Math.floor(i / fontRows) * fontCanvas.height / fontRows + (fontCanvas.height / fontRows / 2);
      fontCtx.fillText(char, x, y);
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fontCanvas);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  render() {
    const gl = this.ctx;

    this.chars = 0;
    this.commandQueue.sort((a, b) => a.z - b.z);
    for (const command of this.commandQueue) {
      this.charShader?.(command);
      const index = Math.floor(command.y) * this.width + Math.floor(command.x);
      if (index < 0 || index >= this.occupied.length) continue;
      const v = this.occupied[index];
      const intensity = Math.max(0, 1 - v * 0.7);
      if (intensity > 0) {
        const index = this.chars++;
        const x = command.x;
        const y = command.y;
        const width = command.fontSize;
        const height = command.fontSize;
        const char = command.char;
  
        const vertexStartX = (x - width / 2) / this.width * 2 - 1;
        const vertexStartY = 1 - ((y + height - height / 2) / this.height * 2);
        const vertexEndX = (x + width - width / 2) / this.width * 2 - 1;
        const vertexEndY = 1 - ((y - height / 2) / this.height * 2);
  
        const texRows = 10;
        const texColumns = 10;
        const texIndex = char.charCodeAt(0) - 32;
        const texX = (texIndex % texColumns) / texColumns + 0.005;
        const texY = Math.floor(texIndex / texColumns) / texRows + 0.005;
        const texSizeX = 1 / texColumns - 0.01;
        const texSizeY = 1 / texRows - 0.01;
  
        const r = command.colorR / 255;
        const g = command.colorG / 255;
        const b = command.colorB / 255;
        const a = intensity;
        const baseIndex = this.charSize * index;
        [
          vertexStartX,  vertexEndY, r, g, b, a, texX, texY,
          vertexEndX,   vertexEndY, r, g, b, a, texX + texSizeX, texY,
          vertexEndX,  vertexStartY, r, g, b, a, texX + texSizeX, texY + texSizeY,
          vertexEndX,  vertexStartY, r, g, b, a, texX + texSizeX, texY + texSizeY,
          vertexStartX, vertexStartY, r, g, b, a, texX, texY + texSizeY,
          vertexStartX,  vertexEndY, r, g, b, a, texX, texY,
        ].forEach((v, i) => this.vertices[baseIndex + i] = v);


        const sizeFactorX = 0.8;
        const sizeFactorY = 0.8;
        const sizeX = Math.ceil(command.fontSize * sizeFactorX);
        const sizeY = Math.ceil(command.fontSize * sizeFactorY);
        for (let dy = - sizeY; dy < sizeY; dy++) {
          for (let dx = - sizeX; dx < sizeX; dx++) {
            const index = (Math.floor(command.y) + dy) * this.width + Math.floor(command.x) + dx;
            if (index < 0 || index >= this.occupied.length) continue;
            this.occupied[index] += intensity * 0.5;
          }
        }
      }
    }

    this.commandQueue.length = 0;
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * 2 * this.chars);
  }
}
