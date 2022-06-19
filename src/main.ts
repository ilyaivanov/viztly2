import * as actions from "./actions";
import { onEngineTick, getHexColor } from "./animations";
import { initCanvas, onResize, VIEWPORT_MAX_WIDTH } from "./canvas";
import { rotateTheme } from "./colors";
import { drawGrid } from "./gridLayout";
import { forEachChild } from "./tree";
import { viewItem } from "./viewItem";
import viztly from "./viztly.json";
import * as colors from "./colors";

initCanvas();

const root = viztly as Item;
forEachChild(root, (child, parent) => (child.parent = parent));

const tree: Tree = {
  root,
  selectedItem: root.children[0],
  focusedItem: root,
};

const app: AppState = {
  views: new Map(),
  tree,
};

actions.init(app);

const render = () => {
  window.ctx.clear(getHexColor(colors.bgColor.currentValue));
  drawGrid();

  for (const view of app.views.values()) {
    const { item } = view;
    viewItem(
      view,
      tree.selectedItem == item,
      item.parent && app.views.get(item.parent)
    );
    window.ctx.htmlContext.globalAlpha = 1;
  }
};

document.addEventListener("keydown", (e) => {
  if (e.code.startsWith("Digit")) {
    const number = parseInt(e.code.substring(5));
    actions.setGalleryColumns(app, app.tree.selectedItem, number);
    e.preventDefault();
  }
  if (e.code === "KeyJ") actions.onMovement(app, "down");
  else if (e.code === "KeyK") actions.onMovement(app, "up");
  else if (e.code === "KeyL") actions.onMovement(app, "right");
  else if (e.code === "KeyH") actions.onMovement(app, "left");
  else if (e.code === "KeyG") actions.setSelectedAsGallery(app);
  else if (e.code === "KeyB") actions.setSelectedAsBoard(app);
  else if (e.code === "KeyR") rotateTheme();
  else if (e.code === "KeyT") actions.setSelectedAsTree(app);

  render();
});

onResize(render);

onEngineTick(render);

render();
