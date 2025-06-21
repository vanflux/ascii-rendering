import { Scene } from "./scene";

export abstract class Entity {
  protected _scene?: Scene;
  protected _parent?: Entity;
  public childs: Entity[] = [];

  get scene() {
    if (!this._scene) throw new Error('Entity outside scene!');
    return this._scene;
  }

  get renderer() {
    return this.scene.renderer;
  }

  add(ent: Entity) {
    this.childs.push(ent);
    ent._parent = this;
    ent._scene = this._scene;
  }

  remove(ent: Entity) {
    const index = this.childs.indexOf(ent);
    if (index >= 0) this.childs.splice(index, 1);
    ent._parent = undefined;
    ent._scene = undefined;
  }

  render() {
    for (const ent of this.childs) ent.render();
  }

  update() {
    for (const ent of this.childs) ent.update();
  }
}
