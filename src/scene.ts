import { Entity } from "./entity";
import { Renderer } from "./renderer";
import { Root } from "./root";

export class Scene {
  public time = 0;
  public deltaTime = 0;
  private root = new Root(this);

  constructor(public renderer: Renderer) {
    renderer.charShader = (command) => {
      const v = Math.cos(command.y * 0.01 + this.time * 0.004) * Math.max(0, renderer.height - command.y - 100) * 0.04;
      command.x += v;
      command.y += Math.cos(v * 0.1) * 10;
    };
  }

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
    this.renderer.render();
  }
}
