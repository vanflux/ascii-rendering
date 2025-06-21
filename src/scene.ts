import { Entity } from "./entity";
import { Renderer } from "./renderer";
import { Root } from "./root";
import { createProjectionMatrix } from "./utils/create-projection-matrix";
import { Mat4x4 } from "./utils/mat4x4";

export class Scene {
  public time = 0;
  public deltaTime = 0;
  protected root = new Root(this);
  private near = 0.1;
  private far = 1000;
  private fov = 90;
  private aspectRatio = this.renderer.height / this.renderer.width;
  public projectionMatrix = createProjectionMatrix(this.aspectRatio, this.fov, this.near, this.far);
  public modelMatrix = new Mat4x4();

  constructor(public renderer: Renderer) {
    this.init();
  }

  init() {}

  add(ent: Entity) {
    this.root.add(ent);
  }

  remove(ent: Entity) {
    this.root.remove(ent);
  }

  clear() {
    this.root.childs.length = 0;
  }

  update(deltaTime: number) {
    this.deltaTime = deltaTime;
    this.time += deltaTime;
    this.root.updateAll();
  }

  render() {
    this.modelMatrix = Mat4x4.createIdentity();
    this.root.renderAll();
    this.renderer.render();
  }
}
