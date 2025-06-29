import { Entity } from "../../entity";
import { Vec3 } from "../../utils/vec3";

export class Boid extends Entity {
  private speed = 100 + Math.random() * 20;
  private viewDistance = 80;
  private wallDistance = 25;
  private collisionFactor = this.speed * 0.05;
  private separationFactor = 0.12;
  private alignmentFactor = 0.02;
  private cohesionFactor = 0.1;
  private vel = new Vec3(this.speed, this.speed, 0);
  private offset = Math.random();
  private debug = false;

  constructor(private boids: Boid[]) {
    super();
  }

  update() {
    let separation = new Vec3();
    let alignment = new Vec3();
    let cohesion = new Vec3();
    let neighborCount = 0;
    for (const boid of this.boids) {
      const distVec = boid.position.subVec(this.position);
      const dist = distVec.magnitude();
      if (dist > this.viewDistance) continue;
      if (boid === this) continue;
      const weight = this.viewDistance - dist;
      separation = separation.addVec(distVec.negate().normalize().mulScalar(weight));
      alignment = separation.addVec(boid.vel).mulScalar(weight);
      cohesion = cohesion.addVec(boid.position);
      neighborCount++;
    }
    separation = separation.mulScalar(this.separationFactor);
    alignment = alignment.mulScalar(this.alignmentFactor);
    cohesion = cohesion.divScalar(neighborCount > 0 ? neighborCount : 1).subVec(this.position).mulScalar(this.cohesionFactor);
    this.vel = this.vel.addVec(separation).addVec(alignment).addVec(cohesion);
    // Speed limit
    this.vel = this.vel.normalize().mulScalar(this.speed);
    // Collision
    if (this.position.x < this.wallDistance) {
      this.vel = this.vel.add((this.wallDistance - this.position.x) * this.collisionFactor, 0, 0);
    }
    if (this.position.x >= this.scene.renderer.width - this.wallDistance) {
      this.vel = this.vel.add((this.scene.renderer.width - this.wallDistance - this.position.x) * this.collisionFactor, 0, 0);
    }
    if (this.position.y < this.wallDistance) {
      this.vel = this.vel.add(0, (this.wallDistance - this.position.y) * this.collisionFactor, 0);
    }
    if (this.position.y >= this.scene.renderer.height - this.wallDistance) {
      this.vel = this.vel.add(0, (this.scene.renderer.height - this.wallDistance - this.position.y) * this.collisionFactor, 0);
    }
    // Speed limit
    this.vel = this.vel.normalize().mulScalar(this.speed);
    // Apply velocity
    this.position = this.position.addVec(this.vel.mulScalar(this.scene.deltaTime));
  }

  render() {
    this.renderer.fontSize = 16;
    this.renderer.fillColorR = 255;
    this.renderer.fillColorG = 255;
    this.renderer.fillColorB = 255;
    const b = Math.floor((this.offset + this.scene.time) * 3) % 2 === 0;
    this.renderer.text(
      this.position.x - 7,
      this.position.y + (b ? -2 : 2),
      b ? '\\' : '/',
      this.position.z
    );
    this.renderer.text(
      this.position.x + 7,
      this.position.y + (b ? -2 : 2),
      b ? '/' : '\\',
      this.position.z
    );
    if (this.debug) {
      this.renderer.fillColorR = 255;
      this.renderer.fillColorG = 0;
      this.renderer.fillColorB = 0;
      const circlePoints = 50;
      for (let i = 0; i < circlePoints; i++) {
        const x = Math.cos(i / circlePoints * Math.PI * 2) * this.viewDistance;
        const y = Math.sin(i / circlePoints * Math.PI * 2) * this.viewDistance;
        this.renderer.text(this.position.x + x, this.position.y + y, '.', 1);
      }
    }
  }
}
