import {
  init,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onArrowUp,
  setGalleryColumns,
} from "./actions";
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

getItemByName(tree, "Viztly 6.0").isOpen = false;
getItemByName(tree, "Viztly").isOpen = false;
getItemByName(tree, "Deep house").isOpen = false;
getItemByName(tree, "Viztly 7.0").isOpen = false;

const gallery = getItemByName(tree, "Xenia (Radio Intense)");

gallery.view = "gallery";
gallery.galleryOptions = {
  heightInGrid: 0,
  widthInGrid: 0,
  numberOfColumns: 6,
};
forEachParent(gallery, (i) => (i.isOpen = true));
gallery.isOpen = true;

tree.selectedItem = gallery;

const app: AppState = {
  views: new Map(),
  tree,
};

init(app);

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
    setGalleryColumns(app, app.tree.selectedItem, number);
    e.preventDefault();
  }
  if (e.code === "ArrowDown") onArrowDown(app);
  else if (e.code === "ArrowUp") onArrowUp(app);
  else if (e.code === "ArrowRight") onArrowRight(app);
  else if (e.code === "ArrowLeft") onArrowLeft(app);

  render();
});

onResize(render);

onEngineTick(render);

render();
