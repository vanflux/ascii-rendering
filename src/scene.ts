import { Entity } from "./entity";
import { Renderer } from "./renderer";
import { Root } from "./root";
import { createProjectionMatrix } from "./utils/create-projection-matrix";
import { Mat4x4 } from "./utils/mat4x4";
import { multiplyMatrixVector } from "./utils/multiply-matrix-vector";
import { Vec3 } from "./utils/vec3";

export class Scene {
  public time = 0;
  public deltaTime = 0;
  private root = new Root(this);
  private near = 0.1;
  private far = 1000;
  private fov = 90;
  private aspectRatio = this.renderer.height / this.renderer.width;
  public projectionMatrix = createProjectionMatrix(this.aspectRatio, this.fov, this.near, this.far);
  public modelMatrix = new Mat4x4();

  constructor(public renderer: Renderer) {
    const v = new Vec3(1, 0, 0);
    const m = new Mat4x4();
    m.m[0][3] = 2;
    m.m[1][3] = 2;
    m.m[2][3] = 2;
    m.m[3][3] = 1;
    console.log(multiplyMatrixVector(v, m));

    renderer.charShader = (command) => {
      const v = Math.cos(command.y * 0.01 + this.time * 4) * Math.max(0, renderer.height - command.y - 100) * 0.04;
      command.x += v;
      command.y += Math.cos(v * 0.1) * 10;

      // command.x += ((Math.cos(this.time * 1) + 0.5) * 200) * Math.max(0, renderer.height - command.y - 150) * 0.001;
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
    this.root.updateAll();
  }

  render() {
    this.modelMatrix = Mat4x4.createIdentity();
    this.root.renderAll();
    this.renderer.render();
  }
}
