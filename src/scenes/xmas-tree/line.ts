import { Entity } from "../../entity";
import { Vec3 } from "../../utils/vec3";

export class Line extends Entity {
  constructor(
    position: Vec3,
    private destination: Vec3,
    public text: string,
    public colorR: number,
    public colorG: number,
    public colorB: number,
    public mode: 'stretch' | 'spaced',
  ) {
    super();
    this.position = position;
  }

  render() {
    this.renderer.fontSize = 24;
    let w1 = this.scene.modelMatrix.mulVec(new Vec3());
    let w2 = this.scene.modelMatrix.mulVec(this.destination);
    let s1 = this.scene.projectionMatrix.mulVec(w1);
    let s2 = this.scene.projectionMatrix.mulVec(w2);
    s1 = s1.divScalar(s1.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
    s2 = s2.divScalar(s2.w).add(1, 1, 0).mul(0.5 * this.renderer.width, 0.5 * this.renderer.height, 1);
    
    this.renderer.fillColorR = this.colorR;
    this.renderer.fillColorG = this.colorG;
    this.renderer.fillColorB = this.colorB;
    if (this.mode === 'spaced') {
      this.renderer.lineSpacedText(s1.x, s1.y, s2.x, s2.y, this.text, 32, w1.z);
    } else {
      this.renderer.lineStretchText(s1.x, s1.y, s2.x, s2.y, this.text, w1.z);
    }
  }
}
