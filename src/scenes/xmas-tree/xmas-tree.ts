import { Vec3 } from "../../utils/vec3";
import { randomLightColorHex } from "../../utils/random-light-color-hex";
import { Entity } from "../../entity";
import Rand from "rand-seed";
import { Ball } from "./ball";
import { Light } from "./light";
import { isLineBreak } from "typescript";
import { Line } from "./line";
import { Star } from "./star";

export class XmasTree extends Entity {
  private layers = 7;
  private curves = 10;
  private curveLines = 4;

  constructor() {
    super();
  }

  init() {
    const stemLines = 10;
    for (let i = 0; i < stemLines; i++) {
      const x = Math.cos(i / stemLines * Math.PI * 2);
      const z = Math.sin(i / stemLines * Math.PI * 2);
      const x1 = x * 0.3;
      const z1 = z * 0.3;
      const x2 = -x * 0.1;
      const z2 = -z * 0.1;
      this.add(new Line(new Vec3(x1, 1.21, z1), new Vec3(x2, -2.3, z2), '|', '#5c4033', 'spaced'));
    }

    const layerStart = 1.5;
    const layerEnd = 0.2;
    for (let i = 0; i < this.layers; i++) {
      const layerSize = layerStart + (layerEnd - layerStart) * i / this.layers;
      const balls = Math.max(this.layers - i, 0);
      const lights = Math.max(this.layers * 3 - i * 3, 0);
      for (let j = 0; j < lights; j++) {
        const v = new Vec3(Math.cos(i + j / lights * Math.PI * 2) * layerSize, - i * 0.4, Math.sin(i + j / lights * Math.PI * 2) * layerSize);
        const rnd = new Rand((Math.floor(this.scene.time * 2 + j)).toString());
        const color = randomLightColorHex(rnd.next())
        this.add(new Light(v, color));
      }
      for (let j = 0; j < balls; j++) {
        const v = new Vec3(Math.cos(i + j / balls * Math.PI * 2) * (layerSize + 0.1), - i * 0.4, Math.sin(i + j / balls * Math.PI * 2) * (layerSize + 0.1));
        this.add(new Ball(v.add(0, 0.1, 0)));
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
          this.add(new Line(curvePoint1, curvePoint2.subVec(curvePoint1), '*', '#00cc00', 'spaced'));
        }
      }
    }
    this.add(new Star(new Vec3(0, -2.85, 0)));
  }

  update() {
    this.rotation.y = this.scene.time * 0.5;
  }
}
