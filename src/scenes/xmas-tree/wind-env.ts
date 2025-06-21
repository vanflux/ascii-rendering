import { Entity } from "../../entity";
import { Vec3 } from "../../utils/vec3";
import { Wind } from "./wind";

export class WindEnv extends Entity {
  private lastWind = 0;

  update() {
    if (Date.now() - this.lastWind > 200) {
      this.add(new Wind(new Vec3(Math.random() * 4 - 2.5, Math.random() * 3 - 2.5, Math.random() * 4 - 2)));
      this.lastWind = Date.now();
    }
  }
}
