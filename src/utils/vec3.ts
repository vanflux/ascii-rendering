
export class Vec3 {
  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
    public w = 1,
  ) {}

  add(x: number, y: number, z: number) {
    return new Vec3(this.x + x, this.y + y, this.z + z);
  }

  addVec(v: Vec3) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(x: number, y: number, z: number) {
    return new Vec3(this.x - x, this.y - y, this.z - z);
  }

  subVec(v: Vec3) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  divScalar(n: number) {
    return new Vec3(this.x / n, this.y / n, this.z / n);
  }

  mul(x: number, y: number, z: number) {
    return new Vec3(this.x * x, this.y * y, this.z * z);
  }

  mulScalar(n: number) {
    return new Vec3(this.x * n, this.y * n, this.z * n);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vec3();
    return this.divScalar(mag);
  }

  negate() {
    return this.mulScalar(-1);
  }
}
