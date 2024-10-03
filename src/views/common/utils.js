const INTERVAL = 50;
const TIME_OUT = 5000;

// func 조건이 만족할때까지 반복하는 함수
export function waitFor(func) {
  return new Promise((resolve, reject) => {
    let time = 0;

    const interval = setInterval(() => {
      if (func()) {
        clearInterval(interval);
        resolve();
      }

      time += INTERVAL
      if (time >= TIME_OUT) {
        clearInterval(interval);
        reject(new Error('Timeout'));
      }
    }, INTERVAL);
  });
}