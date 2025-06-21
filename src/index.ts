import { Bomb } from "./bomb";
import { Entity } from "./entity";
import { Renderer } from "./renderer";
import { Scene } from "./scene";
import { XmasTree } from "./xmas-tree";

export function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = canvas.getBoundingClientRect().width;
  canvas.height = canvas.getBoundingClientRect().height;
  window.addEventListener('resize', () => {
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
  });
  const ctx = canvas.getContext('2d')!;
  const renderer = new Renderer(canvas, ctx);
  const scene = new Scene(renderer);

  let time = Date.now();
  function tick() {
    const deltaTime = Date.now() - time;
    time += deltaTime;
    renderer.clear();
    scene.update(deltaTime);
    scene.render();
    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);

  const handleSelect = () => {
    scene.clear();
    switch (selectElem.value) {
      case 'xmas-tree':
        scene.add(new XmasTree());
        break;
      case 'bomb':
        scene.add(new Bomb());
        break;
    }
  };

  const selectElem = document.getElementById('select') as HTMLSelectElement;
  selectElem.addEventListener('change', handleSelect);
  handleSelect();
}

main();
