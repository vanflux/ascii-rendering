import { Mat4x4 } from "./utils/mat4x4";
import { Renderer } from "./renderer";
import { multiplyMatrixVector } from "./utils/multiply-matrix-vector";
import { Vec3 } from "./utils/vec3";
import Rand from "rand-seed";
import { randomLightColorHex } from "./utils/random-light-color-hex";
import { Entity } from "./entity";

class Obj {
  constructor(public v: Vec3[] = []) {}

  render(matProj: Mat4x4, renderer: Renderer) {}
}

class Line extends Obj {
  constructor(
    v1: Vec3,
    v2: Vec3,
    public text: string,
    public color: string,
    public mode: 'stretch' | 'spaced',
  ) {
    super([v1, v2]);
  }

  render(matProj: Mat4x4, renderer: Renderer) {
    renderer.fontSize = 24;
    const v1 = multiplyMatrixVector(this.v[0], matProj);
    const v2 = multiplyMatrixVector(this.v[1], matProj);
    v1.x += 1;
    v1.y += 1;
    v2.x += 1;
    v2.y += 1;
    v1.x *= 0.5 * renderer.width;
    v1.y *= 0.5 * renderer.height;
    v2.x *= 0.5 * renderer.width;
    v2.y *= 0.5 * renderer.height;
    
    renderer.fillColor = this.color;
    renderer.strokeColor = this.color;
    if (this.mode === 'spaced') {
      renderer.lineSpacedText(v1.x, v1.y, v2.x, v2.y, this.text, 32);
    } else {
      renderer.lineStretchText(v1.x, v1.y, v2.x, v2.y, this.text);
    }
  }
}

class Ball extends Obj {
  constructor(v: Vec3) {
    super([v]);
  }

  render(matProj: Mat4x4, renderer: Renderer) {
    const v = multiplyMatrixVector(this.v[0], matProj);
    v.x += 1;
    v.y += 1;
    v.x *= 0.5 * renderer.width;
    v.y *= 0.5 * renderer.height;

    renderer.fillColor = '#ff0000';
    renderer.fontSize = 10;
    renderer.text(v.x - 16, v.y, ' ax ');
    renderer.text(v.x - 16, v.y + 8, 'AAax');
    renderer.text(v.x - 16, v.y + 16, 'BAAa');
    renderer.text(v.x - 16, v.y + 24, ' BB ');
  }
}

class Light extends Obj {
  constructor(v: Vec3, private color: string) {
    super([v]);
  }

  render(matProj: Mat4x4, renderer: Renderer) {
    const v = multiplyMatrixVector(this.v[0], matProj);
    v.x += 1;
    v.y += 1;
    v.x *= 0.5 * renderer.width;
    v.y *= 0.5 * renderer.height;

    renderer.fillColor = this.color;
    renderer.fontSize = 12;
    renderer.text(v.x, v.y, 'o');
  }
}

class Star extends Obj {
  constructor(v: Vec3) {
    super([v]);
  }

  render(matProj: Mat4x4, renderer: Renderer) {
    const v = multiplyMatrixVector(this.v[0], matProj);
    v.x += 1;
    v.y += 1;
    v.x *= 0.5 * renderer.width;
    v.y *= 0.5 * renderer.height;

    renderer.fillColor = '#ffff00';
    renderer.fontSize = 80;
    // renderer.text(v.x - 24, v.y, '⣀⣀⣸⣇⣀⣀');
    // renderer.text(v.x - 24, v.y + 16, '⠈⢹⣿⣿⡏⠁');
    // renderer.text(v.x - 24, v.y + 32, '⠀⠾⠁⠈⠷⠀');
    renderer.text(v.x, v.y, '*');
  }
}

class Text extends Obj {
  constructor(v: Vec3, public text: string) {
    super([v]);
  }

  render(matProj: Mat4x4, renderer: Renderer) {
    const v = multiplyMatrixVector(this.v[0], matProj);
    v.x += 1;
    v.y += 1;
    v.x *= 0.5 * renderer.width;
    v.y *= 0.5 * renderer.height;

    renderer.fillColor = '#ffffff';
    renderer.fontSize = 14;
    renderer.text(v.x, v.y, this.text);
  }
}

export class XmasTree extends Entity {
  private layers = 7;
  private curves = 10;
  private curveLines = 4;

  constructor() {
    super();
  }

  render() {
    const near = 0.1;
    const far = 1000;
    const fov = 90;
    const aspectRatio = this.renderer.height / this.renderer.width;
    const fovRad = 1 / Math.tan(fov * 0.5 / 180 * Math.PI);

    const matProj = new Mat4x4();
    matProj.m[0][0] = aspectRatio * fovRad;
    matProj.m[1][1] = fovRad;
    matProj.m[2][2] = far / (far - near);
    matProj.m[3][2] = (-far * near) / (far - near);
    matProj.m[2][3] = 1;
    matProj.m[3][3] = 0;

    const theta = this.scene.time * 0.002;

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
    matRotX.m[1][1] = Math.cos(theta * 0.2);
    matRotX.m[1][2] = Math.sin(theta * 0.2);
    matRotX.m[2][1] = -Math.sin(theta * 0.2);
    matRotX.m[2][2] = Math.cos(theta * 0.2);
    matRotX.m[3][3] = 1;

    matRotY.m[0][0] = Math.cos(theta * 0.2);
    matRotY.m[0][2] = Math.sin(theta * 0.2);
    matRotY.m[1][1] = 1;
    matRotY.m[2][0] = -Math.sin(theta * 0.2);
    matRotY.m[2][2] = Math.cos(theta * 0.2);
    matRotY.m[3][3] = 1;

    const objs: Obj[] = [];

    const stemLines = 10;
    for (let i = 0; i < stemLines; i++) {
      const x = Math.cos(i / stemLines * Math.PI * 2) * 0.3;
      const z = Math.sin(i / stemLines * Math.PI * 2) * 0.3;
      objs.push(new Line(new Vec3(x, 1.21, z), new Vec3(x * 0.3, -2.3, z * 0.3), '|', '#5c4033', 'spaced'));
    }

    const layerStart = 1.5;
    const layerEnd = 0.2;
    for (let i = 0; i < this.layers; i++) {
      const layerSize = layerStart + (layerEnd - layerStart) * i / this.layers;
      const balls = Math.max(this.layers - i, 0);
      const lights = Math.max(this.layers * 3 - i * 3, 0);
      for (let j = 0; j < lights; j++) {
        const v = new Vec3(Math.cos(i + j / lights * Math.PI * 2) * layerSize, - i * 0.4, Math.sin(i + j / lights * Math.PI * 2) * layerSize);
        const rnd = new Rand((Math.floor(this.scene.time / 500 + j)).toString());
        const color = randomLightColorHex(rnd.next())
        objs.push(new Light(v, color));
      }
      for (let j = 0; j < balls; j++) {
        const v = new Vec3(Math.cos(i + j / balls * Math.PI * 2) * (layerSize + 0.1), - i * 0.4, Math.sin(i + j / balls * Math.PI * 2) * (layerSize + 0.1));
        objs.push(new Ball(v.add(0, 0.1, 0)));
      }
      for (let j = 0; j < this.curves; j++) {
        const curveStart = new Vec3(Math.cos(j / this.curves * Math.PI * 2) * layerSize, - i * 0.4, Math.sin(j / this.curves * Math.PI * 2) * layerSize);
        const curveEnd = new Vec3(Math.cos((j + 1) / this.curves * Math.PI * 2) * layerSize, i * 10, Math.sin((j + 1) / this.curves * Math.PI * 2) * layerSize);
        for (let k = 0; k < this.curveLines; k++) {
          const curvePoint1 = new Vec3(
            curveStart.x + (curveEnd.x - curveStart.x) * k / this.curveLines,
            curveStart.y + Math.sin(k / this.curveLines * Math.PI) * 0.15 * layerSize,
            curveStart.z + (curveEnd.z - curveStart.z) * k / this.curveLines,
          );
          const curvePoint2 = new Vec3(
            curveStart.x + (curveEnd.x - curveStart.x) * (k + 1) / this.curveLines,
            curveStart.y + Math.sin((k + 1) / this.curveLines * Math.PI) * 0.15 * layerSize,
            curveStart.z + (curveEnd.z - curveStart.z) * (k + 1) / this.curveLines,
          );
          objs.push(new Line(curvePoint1, curvePoint2, '*', '#00cc00', 'spaced'));
        }
      }
    }
    objs.push(new Star(new Vec3(0, -2.8, 0)));
    objs.forEach(obj => obj.v.forEach((v, i, arr) => arr[i] = multiplyMatrixVector(v, matRotY).add(0, 1, 4)));

    objs.sort((a, b) => a.v[0].z - b.v[0].z);
    for (const obj of objs) {
      obj.render(matProj, this.renderer);
    }
  }
}
