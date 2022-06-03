import { onEngineTick } from "./animations";

import { createAnimatedNumber } from "./animations";
import { initCanvas } from "./canvas";
import { drawGrid, layoutChildren } from "./gridLayout";
import sp from "./spacings";
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

const app: AppState = {
  views: new Map(),
  tree,
};

layoutChildren(app.tree.root, 8, 2, (item, gridX, gridY) => {
  const view: ItemView = {
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
  drawGrid();
  for (const view of app.views.values()) {
    const { item } = view;
    viewItem(
      view,
      tree.selectedItem == item,
      item.parent && app.views.get(item.parent)
    );
  }
};

onEngineTick(render);

render();
