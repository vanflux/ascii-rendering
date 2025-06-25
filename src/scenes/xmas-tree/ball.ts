import { Entity } from "../../entity";
import { Vec3 } from "../../utils/vec3";

const colors = [
  [255, 0, 0],
  [255, 0, 0],
  [255, 0, 0],
  [238, 238, 0],
  [64, 64, 255],
  [204, 204, 204],
];

export class Ball extends Entity {
  private color = colors[Math.floor(Math.random() * colors.length)];
  public colorR = this.color[0];
  public colorG = this.color[1];
  public colorB = this.color[2];

  constructor(position: Vec3) {
    super();
    this.position = position;
  }

  render() {
    let w1 = this.scene.modelMatrix.mulVec(new Vec3());
    let s1 = this.scene.projectionMatrix.mulVec(w1);
    s1 = s1.divScalar(s1.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);

    this.renderer.fillColorR = this.colorR;
    this.renderer.fillColorG = this.colorG;
    this.renderer.fillColorB = this.colorB;
    this.renderer.fontSize = 10;
    this.renderer.text(s1.x - 16, s1.y, ' ax ', w1.z);
    this.renderer.text(s1.x - 16, s1.y + 8, 'AAax', w1.z);
    this.renderer.text(s1.x - 16, s1.y + 16, 'BAAa', w1.z);
    this.renderer.text(s1.x - 16, s1.y + 24, ' BB ', w1.z);
  }
}
