import Rand from "rand-seed";

export function randomLightColorHex(v: number): string {
  let h = v, i = Math.floor(h * 6);
  let f = h * 6 - i;
  let q = 1 - f;
  let rgb: number[] = [0, 0, 0];

  switch(i % 6) {
    case 0: rgb = [1, f, 0]; break;
    case 1: rgb = [q, 1, 0]; break;
    case 2: rgb = [0, 1, f]; break;
    case 3: rgb = [0, q, 1]; break;
    case 4: rgb = [f, 0, 1]; break;
    case 5: rgb = [1, 0, q]; break;
  }

  for (let j = 0; j < 3; j++) {
    rgb[j] = Math.round((rgb[j] * 0.6 + 0.4) * 255);
  }

  return '#' + rgb.map(x => ('0' + x.toString(16)).slice(-2)).join('');
}