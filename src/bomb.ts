import { Mat4x4 } from "./utils/mat4x4";
import { Renderer } from "./renderer";
import { multiplyMatrixVector } from "./utils/multiply-matrix-vector";
import { TextUtils } from "./utils/text-utils";
import { Vec3 } from "./utils/vec3";
import { Object3d } from "./object3d";

export class Bomb extends Object3d {
  private time = 0;
  private bombHorizontalLines = 16;
  private chars1 = new Array(this.bombHorizontalLines).fill(0).map(() => TextUtils.randomAlphaNumber());
  private chars2 = new Array(this.bombHorizontalLines).fill(0).map(() => TextUtils.randomAlphaNumber());

  constructor() {
    super();
    this.x = 150;
    this.y = 150;
  }

  update(deltaTime: number) {
    super.update(deltaTime);
    this.time += deltaTime;
  }

  render(renderer: Renderer) {
    const near = 0.1;
    const far = 1000;
    const fov = 90;
    const aspectRatio = renderer.height / renderer.width;
    const fovRad = 1 / Math.tan(fov * 0.5 / 180 * Math.PI);

    const matProj = new Mat4x4();
    matProj.m[0][0] = aspectRatio * fovRad;
    matProj.m[1][1] = fovRad;
    matProj.m[2][2] = far / (far - near);
    matProj.m[3][2] = (-far * near) / (far - near);
    matProj.m[2][3] = 1;
    matProj.m[3][3] = 0;

    const theta = this.time * 0.002;

    const matRotZ =new Mat4x4();
    const matRotY =new Mat4x4();
    const matRotX =new Mat4x4();
    matRotZ.m[0][0] = Math.cos(theta);
    matRotZ.m[0][1] = Math.sin(theta);
    matRotZ.m[1][0] = -Math.sin(theta);
    matRotZ.m[1][1] = Math.cos(theta);
    matRotZ.m[2][2] = 1;
    matRotZ.m[3][3] = 1;
    
    matRotX.m[0][0] = 1;
    matRotX.m[1][1] = Math.cos(theta * 0.5);
    matRotX.m[1][2] = Math.sin(theta * 0.5);
    matRotX.m[2][1] = -Math.sin(theta * 0.5);
    matRotX.m[2][2] = Math.cos(theta * 0.5);
    matRotX.m[3][3] = 1;

    matRotY.m[0][0] = Math.cos(theta * 0.5);
    matRotY.m[0][2] = Math.sin(theta * 0.5);
    matRotY.m[1][1] = 1;
    matRotY.m[2][0] = -Math.sin(theta * 0.5);
    matRotY.m[2][2] = Math.cos(theta * 0.5);
    matRotY.m[3][3] = 1;

    const lines: [Vec3, Vec3, string, string, 'stretch' | 'spaced'][] = [];
    for (let i = 0; i < this.bombHorizontalLines; i++) {
      const newLines: [Vec3, Vec3, string, string, 'stretch' | 'spaced'][] = [
        [new Vec3(0, 0, 0), new Vec3(0.1, 0.3, 0), '<', '#ffffff', 'spaced'],
        [new Vec3(0.1, 0.3, 0), new Vec3(0.3, 0.5, 0), this.chars1[i], '#ffffff', 'spaced'],
        [new Vec3(0.3, 0.5, 0), new Vec3(0.6, 0.7, 0), this.chars1[i], '#ffffff', 'spaced'],
        [new Vec3(0.6, 0.7, 0), new Vec3(1.1, 0.8, 0), this.chars1[i], '#ffffff', 'spaced'],
        [new Vec3(1.1, 0.8, 0), new Vec3(1.5, 0.8, 0), this.chars1[i], '#ffffff', 'spaced'],
        [new Vec3(1.5, 0.8, 0), new Vec3(2.0, 0.6, 0), this.chars1[i], '#ffffff', 'spaced'],
        [new Vec3(2.0, 0.6, 0), new Vec3(2.3, 0.35, 0), this.chars1[i], '#bbbbbb', 'spaced'],
        [new Vec3(2.3, 0.35, 0), new Vec3(2.5, 0.35, 0), this.chars1[i], '#aaaaaa', 'spaced'],
        [new Vec3(2.5, 0.35, 0), new Vec3(2.9, 0.45, 0), this.chars2[i], '#999999', 'spaced'],
        [new Vec3(2.9, 0.45, 0), new Vec3(3.4, 0.8, 0), this.chars2[i], '#888888', 'spaced'],
      ];
      const theta = i / this.bombHorizontalLines * Math.PI * 2;
      for (let j = 0; j < newLines.length; j++) {
        let line = newLines[j];
        if (i == 0 && (j == 3 || j == 4 || j == 5)) {
          line = [new Vec3(0.8, 0.7, 0), new Vec3(1.9, 0.6, 0), '|DANGER|', '#ff0000', 'stretch'];
        }
        if (i == Math.floor(this.bombHorizontalLines / 2) && (j == 3 || j == 4 || j == 5)) {
          line = [new Vec3(0.8, 0.7, 0), new Vec3(1.9, 0.6, 0), '!!BOMB!!', '#ff0000', 'stretch'];
        }
        const matRotX = new Mat4x4();
        matRotX.m[0][0] = 1;
        matRotX.m[1][1] = Math.cos(theta);
        matRotX.m[1][2] = Math.sin(theta);
        matRotX.m[2][1] = -Math.sin(theta);
        matRotX.m[2][2] = Math.cos(theta);
        matRotX.m[3][3] = 1;
        const v1 = multiplyMatrixVector(line[0], matRotX);
        const v2 = multiplyMatrixVector(line[1], matRotX);
        lines.push([v1, v2, line[2], line[3], line[4]]);
      }
    }
    for (let i = 0; i < 20; i++) {
      const v1 = i / 20 * Math.PI * 2;
      const v2 = (i + 1) / 20 * Math.PI * 2;
      lines.push([new Vec3(2.4, Math.cos(v1) * 0.5, Math.sin(v1) * 0.5), new Vec3(2.4, Math.cos(v2) * 0.5, Math.sin(v2) * 0.5), '/', '#ffffff', 'spaced']);
      lines.push([new Vec3(0.2, Math.cos(v1) * 0.5, Math.sin(v1) * 0.5), new Vec3(0.2, Math.cos(v2) * 0.5, Math.sin(v2) * 0.5), '/', '#ffffff', 'spaced']);
    }
    for (let i = 0; i < 30; i++) {
      const v1 = i / 30 * Math.PI * 2;
      const v2 = (i + 1) / 30 * Math.PI * 2;
      lines.push([new Vec3(i / 30 * 5, Math.cos(v1 * 2) * 2, Math.sin(v1 * 2) * 2), new Vec3((i + 1) / 30 * 5, Math.cos(v2 * 2) * 2, Math.sin(v2 * 2) * 2), '/', '#ffffff', 'spaced']);
    }

    renderer.fontSize = 24;
    const position = new Vec3(0, 0, 4);
    for (const line of lines) {
      let v1 = line[0];
      let v2 = line[1];
      v1 = v1.add(-2, 0, 0);
      v2 = v2.add(-2, 0, 0);
      v1 = multiplyMatrixVector(v1, matRotZ);
      v2 = multiplyMatrixVector(v2, matRotZ);
      v1 = multiplyMatrixVector(v1, matRotX);
      v2 = multiplyMatrixVector(v2, matRotX);
      v1 = v1.addVec(position);
      v2 = v2.addVec(position);
      line[0] = v1;
      line[1] = v2;
    }
    lines.sort((a, b) => a[0].z - b[0].z);
    for (const line of lines) {
      // if ((line[0].z + line[1].z) / 2 > 3.8) continue;
      const v1 = multiplyMatrixVector(line[0], matProj);
      const v2 = multiplyMatrixVector(line[1], matProj);
      v1.x += 1;
      v1.y += 1;
      v2.x += 1;
      v2.y += 1;
      v1.x *= 0.5 * renderer.width;
      v1.y *= 0.5 * renderer.height;
      v2.x *= 0.5 * renderer.width;
      v2.y *= 0.5 * renderer.height;
      
      renderer.fillColor = line[3];
      renderer.strokeColor = line[3];
      if (line[4] === 'spaced') {
        renderer.lineSpacedText(v1.x, v1.y, v2.x, v2.y, line[2], 24);
      } else {
        renderer.lineStretchText(v1.x, v1.y, v2.x, v2.y, line[2]);
      }
      // renderer.line(v1.x, v1.y, v2.x, v2.y);
    }
  }
}
