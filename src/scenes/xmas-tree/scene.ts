import { Entity } from "../../entity";
import { WindEnv } from "./wind-env";
import { XmasTree } from "./xmas-tree";

export class XmasTreeScene extends Entity {
  init() {
    this.position.y = 1;
    this.position.z = 4;
    this.add(new XmasTree());
    this.add(new WindEnv());
  }
}
