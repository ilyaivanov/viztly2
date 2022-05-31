import {
  appendTo,
  createAnimatedColor,
  createAnimatedNumber,
  getHexColor,
  onEngineTick,
  switchColorTo,
  switchTo,
} from "./animations";

const canvas = document.createElement("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const cube = {
  x: createAnimatedNumber(500),
  y: createAnimatedNumber(500),
  width: createAnimatedNumber(20),
  height: createAnimatedNumber(20),
  backgroundColor: createAnimatedColor("#ff0044"),
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = getHexColor(cube.backgroundColor.currentValue);
  ctx.fillRect(
    cube.x.current,
    cube.y.current,
    cube.width.current,
    cube.height.current
  );

  ctx.fillStyle = "rgba(100, 100, 100, 0.2)";

  ctx.fillRect(
    cube.x.target,
    cube.y.target,
    cube.width.target,
    cube.height.target
  );
};

let isBlack = false;
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    isBlack = !isBlack;
    switchColorTo(cube.backgroundColor, isBlack ? "#00FF00" : "#ff0044");
  }
  if (e.code === "KeyW") appendTo(cube.y, -50);
  if (e.code === "KeyS") appendTo(cube.y, 50);
  if (e.code === "KeyA") appendTo(cube.x, -50);
  if (e.code === "KeyD") appendTo(cube.x, 50);
});

onEngineTick(render);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// for (const view of appState.views.values()) {
//   const x = view.x.current;
//   const y = view.y.current;

//   const xOffset = sp.textOffsetFromCircleCenter;
//   const yOffset = 1;

//   outlineCircle(x, y, 3.2, 1, "black");
//   const { item } = view;
//   fillTextAtMiddle(item.title, x + xOffset, y + yOffset, "#141414");
// }

// const root = loadItems().root;

// const views = new Map<t.Item, t.ItemView>();
// layoutChildren(
//   root,
//   (item, gridX, gridY) => {
//     views.set(item, {
//       gridX,
//       gridY,
//       item,
//       opacity: new AnimatedNumber(1),
//       x: new AnimatedNumber(gridX * 20),
//       y: new AnimatedNumber(gridY * 20),
//     });
//   },
//   8,
//   2
// );
// const appState = {
//   root,
//   views,
// };

// const outlineCircle = (
//   x: number,
//   y: number,
//   r: number,
//   lineWidth: number,
//   color: string
// ) => {
//   ctx.strokeStyle = color;
//   ctx.beginPath();
//   ctx.arc(x, y, r, 0, 2 * Math.PI);
//   ctx.lineWidth = lineWidth;
//   ctx.stroke();
// };

// const fillTextAtMiddle = (
//   text: string,
//   x: number,
//   y: number,
//   color: string
// ) => {
//   ctx.fillStyle = color;
//   ctx.textBaseline = "middle";
//   ctx.font = `${sp.fontSize}px Roboto, sans-serif`;
//   ctx.fillText(text, x, y);
// };
render();
