import { Entity } from "./entity";
import { Scene } from "./scene";

export class Root extends Entity {
  constructor(private _scene: Scene) {
    super();
  }

  get scene() {
    return this._scene;
  }

  renderAll() {
    this._render();
  }

  updateAll() {
    this._update();
  }
}
