import { Scene } from "../../scene";
import { Vec3 } from "../../utils/vec3";
import { Boid } from "./boid";

export class BoidsScene extends Scene {
  init() {
    this.root.position.z = 4.5;
    const boids: Boid[] = [];
    for (let i = 0; i < 50; i++) {
      const boid = new Boid(boids);
      boid.position = new Vec3(Math.random() * this.renderer.width, Math.random() * this.renderer.height);
      boids.push(boid);
      this.add(boid);
    }
  }
}
