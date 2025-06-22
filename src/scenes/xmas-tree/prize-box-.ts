import { Entity } from "../../entity";
import { Vec3 } from "../../utils/vec3";

export class PrizeBox extends Entity {
  constructor(position: Vec3, rotation: Vec3, scale: Vec3) {
    super();
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  render() {
    let minX: number | undefined;
    let minY: number | undefined;
    let maxX: number | undefined;
    let maxY: number | undefined;
    const lines1: [Vec3, Vec3][] = [
      [new Vec3(0, 0, 0), new Vec3(1, 0, 0)],
      [new Vec3(0, 1, 0), new Vec3(1, 1, 0)],
      [new Vec3(0, 0, 1), new Vec3(1, 0, 1)],
      [new Vec3(0, 1, 1), new Vec3(1, 1, 1)],
      [new Vec3(0, 0, 0), new Vec3(0, 0, 1)],
      [new Vec3(0, 1, 0), new Vec3(0, 1, 1)],
      [new Vec3(1, 1, 0), new Vec3(1, 1, 1)],
      [new Vec3(1, 0, 0), new Vec3(1, 0, 1)],
      [new Vec3(0, 0, 0), new Vec3(0, 1, 0)],
      [new Vec3(0, 0, 1), new Vec3(0, 1, 1)],
      [new Vec3(1, 0, 1), new Vec3(1, 1, 1)],
      [new Vec3(1, 0, 0), new Vec3(1, 1, 0)],
    ];
    for (const line of lines1) {
      let w1 = this.scene.modelMatrix.mulVec(line[0]);
      let s1 = this.scene.projectionMatrix.mulVec(w1);
      s1 = s1.divScalar(s1.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
      let w2 = this.scene.modelMatrix.mulVec(line[1]);
      let s2 = this.scene.projectionMatrix.mulVec(w2);
      s2 = s2.divScalar(s2.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
      this.renderer.fontSize = 14;
      this.renderer.fillColor = '#cccc33';
      this.renderer.lineSpacedText(s1.x, s1.y, s2.x, s2.y, '#', 16, w2.z);
      minX = Math.min(minX ?? s1.x, s1.x, s2.x);
      minY = Math.min(minY ?? s1.y, s1.y, s2.y);
      maxX = Math.max(maxX ?? s1.x, s1.x, s2.x);
      maxY = Math.max(maxY ?? s1.y, s1.y, s2.y);
    }
    const middleX = 0.5;
    const middleY = -0.35;
    const middleZ = 0.5;
    const step = 0.3;
    const lines2: [Vec3, Vec3][] = [
      [new Vec3(0.1, 0.1, middleZ), new Vec3(middleX, middleY, middleZ)],
      [new Vec3(middleX, middleY, middleZ), new Vec3(middleX - step, middleY - step, middleZ)],
      [new Vec3(middleX - step, middleY - step, middleZ), new Vec3(middleX - step * 2, middleY, middleZ)],
      [new Vec3(middleX - step - step, middleY, middleZ), new Vec3(middleX - step, middleY + step, middleZ)],
      [new Vec3(middleX - step, middleY + step, middleZ), new Vec3(middleX + step, middleY - step, middleZ)],
      [new Vec3(middleX + step, middleY - step, middleZ), new Vec3(middleX + step * 2, middleY, middleZ)],
      [new Vec3(middleX + step * 2, middleY, middleZ), new Vec3(middleX + step, middleY + step, middleZ)],
      [new Vec3(middleX + step, middleY + step, middleZ), new Vec3(middleX, middleY, middleZ)],
      [new Vec3(middleX, middleY, middleZ), new Vec3(0.9, 0.1, middleZ)],
    ];
    for (const line of lines2) {
      let w1 = this.scene.modelMatrix.mulVec(line[0]);
      let s1 = this.scene.projectionMatrix.mulVec(w1);
      s1 = s1.divScalar(s1.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
      let w2 = this.scene.modelMatrix.mulVec(line[1]);
      let s2 = this.scene.projectionMatrix.mulVec(w2);
      s2 = s2.divScalar(s2.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
      this.renderer.fontSize = 14;
      this.renderer.fillColor = '#ff0000';
      this.renderer.lineSpacedText(s1.x, s1.y, s2.x, s2.y, 'o', 10, w1.z);
    }
    this.renderer.fillColor = '#ffffff';
    this.renderer.lineStretchText(
      minX! + 15, minY! + (maxY! - minY!) / 2 + 5,
      maxX! - 15, minY! + (maxY! - minY!) / 2 + 5,
      'GIFT',
      0,
    );
  }
}
