import { Entity } from "./entity";
import { Renderer } from "./renderer";
import { Root } from "./root";

export class Scene {
  public time = 0;
  public deltaTime = 0;
  private root = new Root(this);

  constructor(public renderer: Renderer) {}

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
    this.root.update();
  }

  render() {
    this.root.render();
  }
}
