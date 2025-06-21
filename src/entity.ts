import { Scene } from "./scene";
import { Mat4x4 } from "./utils/mat4x4";
import { Vec3 } from "./utils/vec3";

export abstract class Entity {
  protected _parent?: Entity;
  public position = new Vec3(0, 0, 0);
  public rotation = new Vec3(0, 0, 0);
  public scale = new Vec3(1, 1, 1);
  public readonly childs: Entity[] = [];
  private initialized = false;

  get scene(): Scene {
    if (!this._parent?.scene) throw new Error('Entity outside scene!');
    return this._parent?.scene;
  }

  get renderer() {
    return this.scene.renderer;
  }

  protected _render() {
    const oldModelMatrix = this.scene.modelMatrix;
    this.scene.modelMatrix =
      Mat4x4.createRotationVec(this.rotation)
      .mulMat(Mat4x4.createTranslationVec(this.position))
      .mulMat(this.scene.modelMatrix);
    this.render();
    for (const ent of this.childs) ent._render();
    this.scene.modelMatrix = oldModelMatrix;
  }

  protected _update() {
    if (!this.initialized) {
      this.init();
      this.initialized = true;
    }
    this.update();
    for (const ent of this.childs) ent._update();
  }

  init() {}

  add(ent: Entity) {
    this.childs.push(ent);
    ent._parent = this;
  }

  remove(ent: Entity) {
    const index = this.childs.indexOf(ent);
    if (index >= 0) this.childs.splice(index, 1);
    ent._parent = undefined;
  }

  removeSelf() {
    this._parent?.remove(this);
  }

  render() {}

  update() {}
}
