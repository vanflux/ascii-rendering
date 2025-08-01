import { Mat4x4 } from "../../utils/mat4x4";
import { TextUtils } from "../../utils/text-utils";
import { Vec3 } from "../../utils/vec3";
import { Entity } from "../../entity";

export class Bomb extends Entity {
  private bombHorizontalLines = 16;
  private chars1 = new Array(this.bombHorizontalLines).fill(0).map(() => TextUtils.randomAlphaNumber());
  private chars2 = new Array(this.bombHorizontalLines).fill(0).map(() => TextUtils.randomAlphaNumber());

  constructor() {
    super();
  }

  render() {
    const lines: [Vec3, Vec3, string, number, number, number, 'stretch' | 'spaced'][] = [];
    for (let i = 0; i < this.bombHorizontalLines; i++) {
      const newLines: [Vec3, Vec3, string, number, number, number, 'stretch' | 'spaced'][] = [
        [new Vec3(0, 0, 0), new Vec3(0.1, 0.3, 0), '<', 255, 255, 255, 'spaced'],
        [new Vec3(0.1, 0.3, 0), new Vec3(0.3, 0.5, 0), this.chars1[i], 255, 255, 255, 'spaced'],
        [new Vec3(0.3, 0.5, 0), new Vec3(0.6, 0.7, 0), this.chars1[i], 255, 255, 255, 'spaced'],
        [new Vec3(0.6, 0.7, 0), new Vec3(1.1, 0.8, 0), this.chars1[i], 255, 255, 255, 'spaced'],
        [new Vec3(1.1, 0.8, 0), new Vec3(1.5, 0.8, 0), this.chars1[i], 255, 255, 255, 'spaced'],
        [new Vec3(1.5, 0.8, 0), new Vec3(2.0, 0.6, 0), this.chars1[i], 255, 255, 255, 'spaced'],
        [new Vec3(2.0, 0.6, 0), new Vec3(2.3, 0.35, 0), this.chars1[i], 187, 187, 187, 'spaced'],
        [new Vec3(2.3, 0.35, 0), new Vec3(2.5, 0.35, 0), this.chars1[i], 170, 170, 170, 'spaced'],
        [new Vec3(2.5, 0.35, 0), new Vec3(2.9, 0.45, 0), this.chars2[i], 153, 153, 153, 'spaced'],
        [new Vec3(2.9, 0.45, 0), new Vec3(3.4, 0.8, 0), this.chars2[i], 136, 136, 136, 'spaced'],
      ];
      const theta = i / this.bombHorizontalLines * Math.PI * 2;
      for (let j = 0; j < newLines.length; j++) {
        let line = newLines[j];
        if (i == 0 && (j == 3 || j == 4 || j == 5)) {
          line = [new Vec3(0.8, 0.7, 0), new Vec3(1.9, 0.6, 0), '|DANGER|', 255, 0, 0, 'stretch'];
        }
        if (i == Math.floor(this.bombHorizontalLines / 2) && (j == 3 || j == 4 || j == 5)) {
          line = [new Vec3(0.8, 0.7, 0), new Vec3(1.9, 0.6, 0), '!!BOMB!!', 255, 0, 0, 'stretch'];
        }
        const matRotX = Mat4x4.createRotationX(theta);
        const v1 = matRotX.mulVec(line[0]);
        const v2 = matRotX.mulVec(line[1])
        lines.push([v1, v2, line[2], line[3], line[4], line[5], line[6]]);
      }
    }
    for (let i = 0; i < 20; i++) {
      const v1 = i / 20 * Math.PI * 2;
      const v2 = (i + 1) / 20 * Math.PI * 2;
      lines.push([new Vec3(2.4, Math.cos(v1) * 0.5, Math.sin(v1) * 0.5), new Vec3(2.4, Math.cos(v2) * 0.5, Math.sin(v2) * 0.5), '/', 255, 255, 255, 'spaced']);
      lines.push([new Vec3(0.2, Math.cos(v1) * 0.5, Math.sin(v1) * 0.5), new Vec3(0.2, Math.cos(v2) * 0.5, Math.sin(v2) * 0.5), '/', 255, 255, 255, 'spaced']);
    }
    for (let i = 0; i < 30; i++) {
      const v1 = i / 30 * Math.PI * 2;
      const v2 = (i + 1) / 30 * Math.PI * 2;
      lines.push([new Vec3(i / 30 * 5, Math.cos(v1 * 2) * 2, Math.sin(v1 * 2) * 2), new Vec3((i + 1) / 30 * 5, Math.cos(v2 * 2) * 2, Math.sin(v2 * 2) * 2), '/', 255, 255, 255, 'spaced']);
    }

    this.renderer.fontSize = 24;
    for (const line of lines) {
      line[0] = line[0].add(-2, 0, 0);
      line[1] = line[1].add(-2, 0, 0);
    }

    for (const line of lines) {
      let w1 = this.scene.modelMatrix.mulVec(line[0]);
      let w2 = this.scene.modelMatrix.mulVec(line[1]);
      let s1 = this.scene.projectionMatrix.mulVec(w1);
      let s2 = this.scene.projectionMatrix.mulVec(w2);
      s1 = s1.divScalar(s1.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
      s2 = s2.divScalar(s2.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
      
      this.renderer.fillColorR = line[3];
      this.renderer.fillColorG = line[4];
      this.renderer.fillColorB = line[5];
      if (line[6] === 'spaced') {
        this.renderer.lineSpacedText(s1.x, s1.y, s2.x, s2.y, line[2], 24, w1.z);
      } else {
        this.renderer.lineStretchText(s1.x, s1.y, s2.x, s2.y, line[2], w1.z);
      }
    }
  }

  update() {
    this.rotation.x = Math.cos(this.scene.time * 0.5) * 2;
    this.rotation.y = this.scene.time * 1.1;
    this.rotation.z = Math.cos(this.scene.time * 0.5) * 0.1;
  }
}
