import { Renderer } from "./renderer";
import { BombScene } from "./scenes/bomb/scene";
import { XmasTreeScene } from "./scenes/xmas-tree/scene";

export function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;
  const renderer = new Renderer(canvas, ctx);
  let scene = new XmasTreeScene(renderer);

  let time = Date.now() / 1000;
  function tick() {
    const deltaTime = Date.now() / 1000 - time;
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
        scene = new XmasTreeScene(renderer);
        break;
      case 'bomb':
        scene = new BombScene(renderer);
        break;
    }
  };

  const selectElem = document.getElementById('select') as HTMLSelectElement;
  selectElem.addEventListener('change', handleSelect);
  handleSelect();
}

main();
