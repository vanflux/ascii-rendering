import { Entity } from "../../entity";
import { Vec3 } from "../../utils/vec3";

export class Light extends Entity {
  public color = '#ffffff';

  constructor(position: Vec3) {
    super();
    this.position = position;
  }

  render() {
    let w1 = this.scene.modelMatrix.mulVec(new Vec3());
    let s1 = this.scene.projectionMatrix.mulVec(w1);
    s1 = s1.divScalar(s1.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);

    this.renderer.fillColor = this.color;
    this.renderer.fontSize = 12;
    this.renderer.text(s1.x, s1.y, 'o', w1.z);
  }
}
