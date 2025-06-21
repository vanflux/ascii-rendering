import { Vec3 } from "./vec3";

export class Mat4x4 {
  public m: number[][];

  constructor() {
    this.m = new Array(4).fill(0).map(item => new Array(4).fill(0));
  }

  setAll(n: number) {
    for (let y = 0; y < this.m.length; y++) {
      for (let x = 0; x < this.m[y].length; x++) {
        this.m[y][x] = n;
      }
    }
  }

  mulVec(v: Vec3) {
    const o = new Vec3();
    o.x = v.x * this.m[0][0] + v.y * this.m[1][0] + v.z * this.m[2][0] + v.w * this.m[3][0];
    o.y = v.x * this.m[0][1] + v.y * this.m[1][1] + v.z * this.m[2][1] + v.w * this.m[3][1];
    o.z = v.x * this.m[0][2] + v.y * this.m[1][2] + v.z * this.m[2][2] + v.w * this.m[3][2];
    o.w = v.x * this.m[0][3] + v.y * this.m[1][3] + v.z * this.m[2][3] + v.w * this.m[3][3];
    return o;
  }

  mulMat(m: Mat4x4) {
    const o = new Mat4x4();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        o.m[r][c] = this.m[r][0] * m.m[0][c] + this.m[r][1] * m.m[1][c] + this.m[r][2] * m.m[2][c] + this.m[r][3] * m.m[3][c];
      }
    }
    return o;
  }

  static createIdentity() {
    const mat = new Mat4x4();
    mat.m[0][0] = 1;
    mat.m[1][1] = 1;
    mat.m[2][2] = 1;
    mat.m[3][3] = 1;
    return mat;
  }
  
  static createTranslation(x: number, y: number, z: number) {
    const mat = new Mat4x4();
    mat.m[0][0] = 1;
    mat.m[1][1] = 1;
    mat.m[2][2] = 1;
    mat.m[3][3] = 1;
    mat.m[3][0] = x;
    mat.m[3][1] = y;
    mat.m[3][2] = z;
    return mat;
  }
  
  static createTranslationVec(v: Vec3) {
    const mat = new Mat4x4();
    mat.m[0][0] = 1;
    mat.m[1][1] = 1;
    mat.m[2][2] = 1;
    mat.m[3][3] = 1;
    mat.m[3][0] = v.x;
    mat.m[3][1] = v.y;
    mat.m[3][2] = v.z;
    return mat;
  }
  
  static createRotationVec(v: Vec3) {
    return this.createRotationX(v.x).mulMat(this.createRotationY(v.y)).mulMat(this.createRotationZ(v.z));
  }
  
  static createRotationX(theta: number) {
    const mat = new Mat4x4();
    mat.m[0][0] = 1;
    mat.m[1][1] = Math.cos(theta);
    mat.m[1][2] = Math.sin(theta);
    mat.m[2][1] = -Math.sin(theta);
    mat.m[2][2] = Math.cos(theta);
    mat.m[3][3] = 1;
    return mat;
  }
  
  static createRotationY(theta: number) {
    const mat = new Mat4x4();
    mat.m[0][0] = Math.cos(theta);
    mat.m[0][2] = Math.sin(theta);
    mat.m[1][1] = 1;
    mat.m[2][0] = -Math.sin(theta);
    mat.m[2][2] = Math.cos(theta);
    mat.m[3][3] = 1;
    return mat;
  }
  
  static createRotationZ(theta: number) {
    const mat = new Mat4x4();
    mat.m[0][0] = Math.cos(theta);
    mat.m[0][1] = Math.sin(theta);
    mat.m[1][0] = -Math.sin(theta);
    mat.m[1][1] = Math.cos(theta);
    mat.m[2][2] = 1;
    mat.m[3][3] = 1;
    return mat;
  }

}
