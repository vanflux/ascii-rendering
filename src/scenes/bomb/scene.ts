import { Scene } from "../../scene";
import { Bomb } from "./bomb";

export class BombScene extends Scene {
  init() {
    this.root.position.z = 4;
    this.add(new Bomb());
  }
}
