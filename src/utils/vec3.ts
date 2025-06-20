
export class Vec3 {
  constructor(public x = 0, public y = 0, public z = 0) {}

  add(x: number, y: number, z: number) {
    return new Vec3(this.x + x, this.y + y, this.z + z);
  }

  addVec(v: Vec3) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  mul(x: number, y: number, z: number) {
    return new Vec3(this.x * x, this.y * y, this.z * z);
  }
}
