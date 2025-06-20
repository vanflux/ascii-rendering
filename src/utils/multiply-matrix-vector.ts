import { Mat4x4 } from "./mat4x4";
import { Vec3 } from "./vec3";

export function multiplyMatrixVector(i: Vec3, m: Mat4x4) {
  const o = new Vec3();
  o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
  o.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
  o.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];
  const w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];
  if (w != 0) {
    o.x /= w;
    o.y /= w;
    o.z /= w;
  }
  return o;
}
