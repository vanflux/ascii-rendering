import { Entity } from "./entity";
import { Scene } from "./scene";

export class Root extends Entity {
  constructor(scene: Scene) {
    super();
    this._scene = scene;
  }
}
