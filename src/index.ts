import { Bomb } from "./bomb";
import { Object3d } from "./object3d";
import { Renderer } from "./renderer";
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
  const objs: Object3d[] = [];

  let time = Date.now();
  function tick() {
    const deltaTime = Date.now() - time;
    time += deltaTime;
    renderer.clear();
    for (const obj of objs) obj.update(deltaTime);
    for (const obj of objs) obj.render(renderer);
    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);

  const handleSelect = () => {
    objs.length = 0;
    switch (selectElem.value) {
      case 'xmas-tree':
        objs.push(new XmasTree());
        break;
      case 'bomb':
        objs.push(new Bomb());
        break;
    }
  };

  const selectElem = document.getElementById('select') as HTMLSelectElement;
  selectElem.addEventListener('change', handleSelect);
  handleSelect();
}

main();
