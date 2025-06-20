import { Renderer } from "./renderer";

export abstract class Object3d {
  public x = 0;
  public y = 0;
  private parent?: Object3d;
  public childs: Object3d[] = [];

  public get globalX() {
    return (this.parent?.x ?? 0) + this.x;
  }

  public get globalY() {
    return (this.parent?.y ?? 0) + this.y;
  }

  add(obj: Object3d) {
    this.childs.push(obj);
    obj.parent = this;
  }

  remove(obj: Object3d) {
    const index = this.childs.indexOf(obj);
    if (index >= 0) this.childs.splice(index, 1);
    obj.parent = undefined;
  }

  render(renderer: Renderer) {
    for (const obj of this.childs) obj.render(renderer);
  }

  update(deltaTime: number) {
    for (const obj of this.childs) obj.update(deltaTime);
  }
}
