import { Mat4x4 } from "./mat4x4";

export function createProjectionMatrix(aspectRatio: number, fov: number, near: number, far: number) {
  const fovRad = 1 / Math.tan(fov * 0.5 / 180 * Math.PI);
  const matProj = new Mat4x4();
  matProj.m[0][0] = aspectRatio * fovRad;
  matProj.m[1][1] = fovRad;
  matProj.m[2][2] = far / (far - near);
  matProj.m[3][2] = (-far * near) / (far - near);
  matProj.m[2][3] = 1;
  matProj.m[3][3] = 0;
  return matProj;
}
