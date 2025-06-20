
export class Mat4x4 {
  public m: number[][];

  constructor() {
    this.m = new Array(4).fill(0).map(item => new Array(4).fill(0));
  }
}
