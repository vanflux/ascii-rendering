
interface Command {
  x: number;
  y: number;
  z: number;
  char: string;
  color: string;
  fontSize: number;
}

export class Renderer {
  private occupied = new Array(Math.floor(this.height)).fill(0).map(() => new Array(Math.floor(this.width)).fill(0));
  public fontSize = 16;
  public fillColor = '#ffffff';
  public strokeColor = '#ffffff';
  public charShader?: (command: Command) => void;
  private commandQueue: Command[] = [];

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
  ) {}

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let y = 0; y < this.occupied.length; y++) {
      for (let x = 0; x < this.occupied[y].length; x++) {
        this.occupied[y][x] = 0;
      }
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
    for (let i = 0; i <= chars.length; i++) {
      const progress = i / chars.length;
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
      const occupiedX = Math.floor(command.x / this.width * this.occupied[0].length);
      const occupiedY = Math.floor(command.y / this.height * this.occupied.length);
      const v = this.occupied[occupiedY]?.[occupiedX] ?? 0;
      const intensity = Math.max(0, 1 - v * 0.7);
      const color = `${command.color}${(Math.floor(intensity * 255)).toString(16).padStart(2, '0')}`;

      this.ctx.fillStyle = color;
      this.ctx.font = `${command.fontSize}px Arial`;
      this.ctx.fillText(command.char, command.x, command.y);

      const c = 0.8;
      const size = Math.ceil(command.fontSize * c);
      for (let dy = - size; dy < size; dy++) {
        for (let dx = - size; dx < size; dx++) {
          const rx = occupiedX + dx;
          const ry = occupiedY + dy;
          if (ry < 0 || ry >= this.occupied.length) continue;
          if (rx < 0 || rx >= this.occupied[ry].length) continue;
          this.occupied[ry][rx] += intensity * 0.5;
        }
      }
    }
    this.commandQueue.length = 0;
  }
}
