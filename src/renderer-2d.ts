import { Renderer } from "./renderer";

export class Renderer2d extends Renderer {
  private ctx = this.canvas.getContext('2d')!;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    super.clear();
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
        this.ctx.fillStyle = `#${
          command.colorR.toString(16).padStart(2, '0')
        }${
          command.colorG.toString(16).padStart(2, '0')
        }${
          command.colorB.toString(16).padStart(2, '0')
        }${
          (Math.floor(intensity * 255)).toString(16).padStart(2, '0')
        }`;
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
