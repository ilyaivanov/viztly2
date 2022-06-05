import * as actions from "./actions";
import { onEngineTick } from "./animations";
import { initCanvas, onResize } from "./canvas";
import { drawGrid } from "./gridLayout";
import { forEachChild, forEachParent, getItemByName } from "./tree";
import { viewItem } from "./viewItem";
import viztly from "./viztly.json";

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
  window.ctx.clear("#FAF9F7");
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
  if (e.code === "ArrowDown") actions.onArrowDown(app);
  else if (e.code === "ArrowUp") actions.onArrowUp(app);
  else if (e.code === "ArrowRight") actions.onArrowRight(app);
  else if (e.code === "ArrowLeft") actions.onArrowLeft(app);
  else if (e.code === "KeyG") actions.setSelectedAsGallery(app);
  else if (e.code === "KeyB") actions.setSelectedAsBoard(app);
  else if (e.code === "KeyT") actions.setSelectedAsTree(app);

  render();
});

onResize(render);

onEngineTick(render);

render();
