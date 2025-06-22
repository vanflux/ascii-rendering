
interface Command {
  x: number;
  y: number;
  z: number;
  char: string;
  color: string;
  fontSize: number;
}

export class Renderer {
  private occupied = new Float32Array(this.width * this.height);
  public fontSize = 16;
  public fillColor = '#ffffff';
  public strokeColor = '#ffffff';
  public charShader?: (command: Command) => void;
  private commandQueue: Command[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
  ) {
    this.clear();
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = 0;
    }
  }

  private char(x: number, y: number, char: string, z: number) {
    this.commandQueue.push({ x, y, z, char, color: this.fillColor, fontSize: this.fontSize });
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  lineSpacedText(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    text: string,
    spacing: number,
    z = 0,
  ) {
    const distance = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    const count = Math.ceil(distance / spacing);
    this.lineStretchText(x1, y1, x2, y2, text.repeat(Math.ceil(count / text.length)).substring(0, count), z);
  }

  lineStretchText(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    text: string,
    z = 0,
  ) {
    const chars = [...text];
    let index = 0;
    const vx1 = x1 < x2 ? x1 : x2;
    const vx2 = x1 < x2 ? x2 : x1;
    const vy1 = x1 < x2 ? y1 : y2;
    const vy2 = x1 < x2 ? y2 : y1;
    for (let i = 0; i < chars.length; i++) {
      const progress = i / (chars.length == 1 ? 1 : chars.length - 1);
      const x = vx1 + (vx2 - vx1) * progress;
      const y = vy1 + (vy2 - vy1) * progress;
      this.char(x, y, chars[index], z);
      index = (index + 1) % chars.length;
    }
  }

  text(x: number, y: number, text: string, z = 0) {
    const chars = [...text];
    for (let i = 0; i < chars.length; i++) {
      this.char(x + i * this.fontSize * 0.8, y, chars[i], z);
    }
  }

  render() {
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.commandQueue.sort((a, b) => a.z - b.z);
    for (const command of this.commandQueue) {
      this.charShader?.(command);
      const index = Math.floor(command.y) * this.width + Math.floor(command.x);
      if (index < 0 || index >= this.occupied.length) continue;
      const v = this.occupied[index];
      const intensity = Math.max(0, 1 - v * 0.7);
      if (intensity > 0) {
        this.ctx.fillStyle = `${command.color}${(Math.floor(intensity * 255)).toString(16).padStart(2, '0')}`;
        this.ctx.font = `${command.fontSize}px Arial`;
        this.ctx.fillText(command.char, command.x, command.y);

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
  }
}
