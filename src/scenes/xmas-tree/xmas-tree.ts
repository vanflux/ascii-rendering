import { Vec3 } from "../../utils/vec3";
import { Entity } from "../../entity";
import { Ball } from "./ball";
import { Light } from "./light";
import { Line } from "./line";
import { Star } from "./star";
import { PrizeBox } from "./prize-box-";

export class XmasTree extends Entity {
  private layers = 7;
  private layerStart = 1.5;
  private layerEnd = 0.2;
  private curves = 10;
  private curveLines = 4;
  private stemLines = 10;
  private lastLightChange = 0;
  private lightAux = 0;
  private lightColors = [
    [255, 0, 255],
    [255, 0, 0],
    [58, 58, 255],
    [255, 255, 0],
    [0, 255, 255],
  ];

  constructor() {
    super();
  }

  init() {
    for (let i = 0; i < this.stemLines; i++) {
      const x = Math.cos(i / this.stemLines * Math.PI * 2);
      const z = Math.sin(i / this.stemLines * Math.PI * 2);
      const x1 = x * 0.3;
      const z1 = z * 0.3;
      const x2 = -x * 0.1;
      const z2 = -z * 0.1;
      this.add(new Line(new Vec3(x1, 1.21, z1), new Vec3(x2, -2.3, z2), '|', 92, 64, 51, 'spaced'));
    }

    for (let i = 0; i < this.layers; i++) {
      const layerSize = this.layerStart + (this.layerEnd - this.layerStart) * i / this.layers;
      const balls = Math.max(this.layers - i, 3);
      const lights = Math.max(this.layers * 3 - i * 3, 0);
      for (let j = 0; j < lights; j++) {
        const v = new Vec3(Math.cos(i + j / lights * Math.PI * 2) * layerSize, - i * 0.4, Math.sin(i + j / lights * Math.PI * 2) * layerSize);
        this.add(new Light(v));
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
          this.add(new Line(curvePoint1, curvePoint2.subVec(curvePoint1), '*', 0, 204, 0, 'spaced'));
        }
      }
    }
    this.add(new Star(new Vec3(0, -2.85, 0)));
  }

  update() {
    this.rotation.y = this.scene.time * 0.5;
    if (Date.now() - this.lastLightChange > 400) {
      this.lastLightChange = Date.now();
      this.lightAux++;
      let i = 0;
      for (const child of this.childs) {
        if (child instanceof Light) {
          const [r, g, b] = this.lightColors[Math.floor(this.lightAux + i++) % this.lightColors.length];
          child.colorR = r;
          child.colorG = g;
          child.colorB = b;
        }
      }
    }
  }
}
