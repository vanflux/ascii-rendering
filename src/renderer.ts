
interface Command {
  x: number;
  y: number;
  z: number;
  char: string;
  colorR: number;
  colorG: number;
  colorB: number;
  fontSize: number;
}

export abstract class Renderer {
  protected occupied = new Float32Array(this.width * this.height);
  public fontSize = 16;
  public fillColorR = 255;
  public fillColorG = 255;
  public fillColorB = 255;
  public charShader?: (command: Command) => void;
  protected commandQueue: Command[] = [];

  constructor(protected readonly canvas: HTMLCanvasElement) {}

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  clear() {
    for (let i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = 0;
    }
  }

  private char(x: number, y: number, char: string, z: number) {
    this.commandQueue.push({ x, y, z, char, colorR: this.fillColorR, colorG: this.fillColorG, colorB: this.fillColorB, fontSize: this.fontSize });
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

  abstract render(): void;
}
