
const alphas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const alphanumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export class TextUtils {
  static randomAlpha() {
    return alphas[Math.floor(Math.random() * alphas.length)];
  }
  
  static randomNumber() {
    return numbers[Math.floor(Math.random() * numbers.length)];
  }
  
  static randomAlphaNumber() {
    return alphanumbers[Math.floor(Math.random() * alphanumbers.length)];
  }
}
