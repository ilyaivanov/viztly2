import { onEngineTick } from "./animations";

import { AnimatedNumber, createAnimatedNumber } from "./animations";
import { initCanvas } from "./canvas";
import { layoutChildren } from "./gridLayout";
import sp from "./spacings";
import { getItemByName } from "./tree";
import viztly from "./viztly.json";

initCanvas();

const root = viztly as Item;

const tree: Tree = {
  root,
  selectedItem: root.children[0],
  focusedItem: root,
};

const gallery = getItemByName(tree, "Viztly 6.0");
gallery.view = "gallery";
gallery.isOpen = true;
const app: AppState = {
  views: new Map(),
  tree,
};

layoutChildren(app.tree.root, 8, 2, (item, gridX, gridY) => {
  const view = {
    gridX,
    gridY,
    x: createAnimatedNumber(gridX * sp.gridSize),
    y: createAnimatedNumber(gridY * sp.gridSize),
    item,
  };
  app.views.set(item, view);
});

const render = () => {
  window.ctx.clear("#FAF9F7");
  for (const view of app.views.values()) {
    const x = view.x.current;
    const y = view.y.current;

    const xOffset = sp.textOffsetFromCircleCenter;
    const yOffset = 1;
    const { item } = view;

    const color = tree.selectedItem === item ? "red" : "#000";

    window.ctx.outlineCircle(x, y, 3.2, 1, color);

    window.ctx.fillTextAtMiddle(item.title, x + xOffset, y + yOffset, color);
  }
};

onEngineTick(render);

render();
