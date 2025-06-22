import { Scene } from "../../scene";
import { Vec3 } from "../../utils/vec3";
import { PrizeBox } from "./prize-box-";
import { WindEnv } from "./wind-env";
import { XmasTree } from "./xmas-tree";

export class XmasTreeScene extends Scene {
  init() {
    this.renderer.charShader = (command) => {
      const v = Math.cos(command.y * 0.01 + this.time * 4) * Math.max(0, this.renderer.height - command.y - 100) * 0.04;
      command.x += v;
      command.y += Math.cos(v * 0.1) * 10;
    };

    this.root.position.y = 1;
    this.root.position.z = 4;
    this.add(new XmasTree());
    this.add(new PrizeBox(new Vec3(-1.1, 1, -0.75), new Vec3(0, -0.2, 0), new Vec3(0.55, 0.55, 0.55)));
    this.add(new PrizeBox(new Vec3(0.7, 1, -0.9), new Vec3(0, 0.2, 0), new Vec3(0.55, 0.55, 0.55)));
    this.add(new WindEnv());
  }
}
