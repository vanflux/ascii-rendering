import { Entity } from "../../entity";
import { Vec3 } from "../../utils/vec3";

export class Wind extends Entity {
  private startVx = 1.5;
  private vx = this.startVx;
  private frames = [
    [
      '     ',
      '     ',
      '_    ',
    ],
    [
      '     ',
      '     ',
      '__  ',
    ],
    [
      '     ',
      '     ',
      '___  ',
    ],
    [
      '     ',
      '     ',
      '____  ',
    ],
    [
      '     ',
      '     ',
      '____/',
    ],
    [
      '   _ ',
      '    \\',
      ' ___/',
    ],
    [
      '   _ ',
      '  / \\',
      '  __/',
    ],
    [
      '   _ ',
      '  / \\',
      '    /',
    ],
    [
      '   _ ',
      '  / \\',
      '     ',
    ],
    [
      '     ',
      '  /  ',
      '     ',
    ],
  ];

  constructor(position: Vec3) {
    super();
    this.position = position;
  }

  update() {
    this.position.x += this.vx * this.scene.deltaTime;
    this.vx -= Math.max(0, this.scene.deltaTime);
    if (this.vx <= 0) {
      this.removeSelf();
    }
  }

  render() {
    let w1 = this.scene.modelMatrix.mulVec(new Vec3());
    let s1 = this.scene.projectionMatrix.mulVec(w1);
    s1 = s1.divScalar(s1.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);

    this.renderer.fillColorR = 255;
    this.renderer.fillColorG = 255;
    this.renderer.fillColorB = 255;
    this.renderer.fontSize = 10;

    const index = Math.ceil((1 - this.vx / this.startVx) * this.frames.length);
    const frame = this.frames[index];
    if (frame) {
      for (let i = 0; i < frame.length; i++) {
        const line = frame[i];
        this.renderer.text(s1.x, s1.y + i * 10, line, w1.z);
      }
    }
  }
}
