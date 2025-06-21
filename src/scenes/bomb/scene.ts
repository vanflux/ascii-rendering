import { Entity } from "../../entity";
import { Bomb } from "./bomb";

export class BombScene extends Entity {
  init() {
    this.position.z = 4;
    this.add(new Bomb());
  }
}
