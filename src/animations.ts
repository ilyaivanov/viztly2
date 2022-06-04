interface AnimatedValue {
  isAnimating: boolean;
  tick: (deltaTime: number) => void;
}

const ANIMATION_SLOW_COEF = 2; // how much times to slow animation

const currentAnimations: Set<AnimatedValue> = new Set();

let onTick: () => void;

export const addAnimation = (val: AnimatedValue) => {
  if (currentAnimations.size === 0) requestAnimationFrame(engineTick);

  currentAnimations.add(val);
};

export const onEngineTick = (cb: () => void) => {
  onTick = cb;
};

let lastTickTime = 0;
const engineTick = (currentTime: number) => {
  const deltaTime = lastTickTime ? currentTime - lastTickTime : 1000 / 60;

  lastTickTime = currentTime;

  for (const val of currentAnimations) {
    val.tick(deltaTime / ANIMATION_SLOW_COEF);
    if (!val.isAnimating) currentAnimations.delete(val);
  }

  if (currentAnimations.size !== 0) requestAnimationFrame(engineTick);
  else lastTickTime = 0;

  onTick && onTick();
};

//VALUES

const stiffness = 0.02;
const damping = 2.5;
const invertedMass = 0.28;
// const springAnimation = (target: number) => {
//       const velocity = 0;
//   const current = target;
//   const spring = (deltaTime: number) => {
//     const force = -stiffness * (current - target);
//     const acceleration = force / invertedMass;
//     const nextVelocity = velocity + acceleration * deltaTime;
//     const nextCurrent = current + (velocity + nextVelocity) / 2 * deltaTime;
//     return { current: nextCurrent, velocity: nextVelocity };
//   };

//   return spring;
// }

// Animating Number

export const createAnimatedNumber = (initialValue: number): AnimatedNumber => ({
  last: initialValue,
  target: initialValue,
  current: initialValue,
  isAnimating: false,
  tick: onNumberTick,
});

export const switchTo = (v: AnimatedNumber, target: number) => {
  v.target = target;

  v.isAnimating = true;
  addAnimation(v);
};

export const fromTo = (v: AnimatedNumber, from: number, to: number) => {
  v.current = from;
  v.target = to;

  v.isAnimating = true;
  addAnimation(v);
};

export const appendTo = (v: AnimatedNumber, delta: number) => {
  v.target += delta;

  v.isAnimating = true;
  addAnimation(v);
};

export type AnimatedNumber = AnimatedValue & {
  last: number;
  target: number;
  current: number;
};

const precision = 0.01;

function onNumberTick(this: AnimatedNumber, deltaTime: number) {
  const { current, target, last } = this;
  const delta = target - current;
  const velocity = (current - last) / deltaTime;
  const spring = stiffness * delta;
  const damper = damping * velocity;
  const acceleration = (spring - damper) * invertedMass;
  const d = (velocity + acceleration) * deltaTime;

  if (Math.abs(d) < precision && Math.abs(delta) < precision) {
    // this.onDone && this.onDone();
    this.isAnimating = false;
    this.current = target;
  } else {
    this.last = this.current;
    this.current += d;
  }
}

// Animating Color

const transitionTimeMs = 200;
type AnimatedColor = AnimatedValue & {
  millisecondsEllapsed: number;
  targetColor: number;
  startingColor: number;
  currentValue: number;
};

export const createAnimatedColor = (initialValue: string): AnimatedColor => ({
  millisecondsEllapsed: 0,
  currentValue: parseHex(initialValue),
  startingColor: parseHex(initialValue),
  targetColor: parseHex(initialValue),
  isAnimating: false,
  tick: onColorTick,
});

export const getHexColor = (v: number) => "#" + v.toString(16).padStart(6, "0");

const parseHex = (s: string): number => parseInt(s.slice(1), 16);

export const switchColorTo = (v: AnimatedColor, target: string) => {
  v.targetColor = parseHex(target);
  v.startingColor = v.currentValue;
  v.millisecondsEllapsed = 0;
  v.isAnimating = true;
  addAnimation(v);
};

function onColorTick(this: AnimatedColor, deltaTimeMs: number) {
  this.millisecondsEllapsed += deltaTimeMs;
  if (this.millisecondsEllapsed > transitionTimeMs) {
    this.currentValue = this.targetColor;
    this.isAnimating = false;
    this.millisecondsEllapsed = 0;
  } else {
    const fraction = this.millisecondsEllapsed / transitionTimeMs;
    this.currentValue = lerpColor(
      this.startingColor,
      this.targetColor,
      fraction
    );
  }
}

/**
 * A linear interpolator for hex colors.
 *
 * Based on:
 * https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
 *
 * @param {Number} a  (hex color start val)
 * @param {Number} b  (hex color end val)
 * @param {Number} amount  (the amount to fade from a to b)
 *
 * @example
 * // returns 0x7f7f7f
 * lerpColor(0x000000, 0xffffff, 0.5)
 *
 * @returns {Number}
 */
export function lerpColor(a: number, b: number, amount: number) {
  const ar = a >> 16,
    ag = (a >> 8) & 0xff,
    ab = a & 0xff,
    br = b >> 16,
    bg = (b >> 8) & 0xff,
    bb = b & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (rr << 16) + (rg << 8) + (rb | 0);
}
