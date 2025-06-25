import { Renderer } from "./renderer";
import { Renderer2d } from "./renderer-2d";
import { RendererWebgl } from "./renderer-webgl";
import { Scene } from "./scene";
import { BombScene } from "./scenes/bomb/scene";
import { XmasTreeScene } from "./scenes/xmas-tree/scene";

export function main() {
  const canvasContainer = document.getElementById('canvas-container') as HTMLDivElement;
  let renderer: Renderer | undefined;
  let scene: Scene | undefined;

  let time = Date.now() / 1000;
  function tick() {
    const deltaTime = Date.now() / 1000 - time;
    time += deltaTime;
    renderer?.clear();
    scene?.update(deltaTime);
    scene?.render();
    window.requestAnimationFrame(tick);
  }
  window.requestAnimationFrame(tick);

  const refresh = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(canvas);
    switch (rendererSelect.value) {
      case '2d':
        renderer = new Renderer2d(canvas);
        break;
      case 'webgl':
        renderer = new RendererWebgl(canvas);
        break;
    }
    if (renderer) {
      switch (sceneSelect.value) {
        case 'xmas-tree':
          scene = new XmasTreeScene(renderer);
          break;
        case 'bomb':
          scene = new BombScene(renderer);
          break;
      }
    }
  };

  const sceneSelect = document.getElementById('scene-select') as HTMLSelectElement;
  sceneSelect.addEventListener('change', refresh);
  const rendererSelect = document.getElementById('renderer-select') as HTMLSelectElement;
  rendererSelect.addEventListener('change', refresh);

  refresh();
}

main();
