import { appendTo, createAnimatedNumber, switchTo } from "./animations";
import { layoutChildren, layoutRoot } from "./gridLayout";
import spacings from "./spacings";
import { forEachOpenChild } from "./tree";

export const init = (app: AppState) => {
  layoutRoot(app.tree.root, (item, gridX, gridY) =>
    app.views.set(item, createView(item, gridX, gridY))
  );
};

const createView = (item: Item, gridX: number, gridY: number): ItemView => ({
  gridX,
  gridY,
  x: createAnimatedNumber(gridX * spacings.gridSize),
  y: createAnimatedNumber(gridY * spacings.gridSize),
  item,
  opacity: createAnimatedNumber(1),
});

export const onMovement = (app: AppState, direction: Direction) => {
  const { tree } = app;
  if (isInGallery(tree.selectedItem)) {
    moveInsideGallery(app, direction);
  } else {
    arrowHandlers[direction](app);
  }
};

const onArrowDown = ({ tree }: AppState) => {
  const itemBelow = getItemBelow(tree.selectedItem);

  if (itemBelow) tree.selectedItem = itemBelow;
};

const onArrowUp = (app: AppState) => {
  const { tree } = app;
  const itemBelow = getItemAbove(tree.selectedItem);

  if (itemBelow) tree.selectedItem = itemBelow;
};

const onArrowRight = (app: AppState) => {
  const { tree } = app;
  if (!tree.selectedItem.isOpen && hasChildren(tree.selectedItem)) {
    tree.selectedItem.isOpen = true;
    animatePositions(app);
    const view = app.views.get(tree.selectedItem);
    if (view) {
      layoutChildren(view, (item, gridX, gridY) => {
        const view = createView(item, gridX + 1, gridY + 1);
        app.views.set(item, view);
        fadeIn(view);
      });
    }
  } else if (hasChildren(tree.selectedItem))
    tree.selectedItem = tree.selectedItem.children[0];
};

const onArrowLeft = (app: AppState) => {
  const { tree } = app;
  if (tree.selectedItem.isOpen) {
    tree.selectedItem.isOpen = false;
    forEachOpenChild(app.tree.selectedItem, (item) => fadeOut(app, item));
    animatePositions(app);
  } else if (tree.selectedItem.parent && !isRoot(tree.selectedItem.parent))
    tree.selectedItem = tree.selectedItem.parent;
};

const arrowHandlers: Record<Direction, (app: AppState) => void> = {
  down: onArrowDown,
  left: onArrowLeft,
  right: onArrowRight,
  up: onArrowUp,
};

export const setSelectedAsBoard = (app: AppState) => {
  app.tree.selectedItem.view = "board";
  animatePositions(app);
};

export const setSelectedAsTree = (app: AppState) => {
  app.tree.selectedItem.view = "tree";
  animatePositions(app);
};

export const setSelectedAsGallery = (app: AppState) => {
  const { selectedItem } = app.tree;
  selectedItem.view = "gallery";

  if (!selectedItem.galleryOptions)
    selectedItem.galleryOptions = {
      heightInGrid: 0,
      widthInGrid: 0,
      numberOfColumns: 6,
    };

  animatePositions(app);
};

const fadeOut = (app: AppState, item: Item) => {
  const view = app.views.get(item);
  if (view) {
    appendTo(view.x, -10);
    switchTo(view.opacity, 0);
  }
};
const fadeIn = (view: ItemView) => {
  // view.x.current -= 10;
  // // view.x.opacity.current = 0;
  // appendTo(view.x, 10);
  // fromTo(view.opacity, 0, 1);
};

type Direction = "up" | "down" | "left" | "right";
const moveInsideGallery = (app: AppState, direction: Direction) => {
  const { selectedItem } = app.tree;
  if (selectedItem.parent) {
    const galleryOptions = selectedItem.parent.galleryOptions;
    if (assertNotEmpty(galleryOptions)) {
      const context = selectedItem.parent.children;
      const currentIndex = context.indexOf(selectedItem);

      const nextIndexGenerator: Record<Direction, (index: number) => number> = {
        down: (index) => index + galleryOptions.numberOfColumns,
        left: (index) => index - 1,
        right: (index) => index + 1,
        up: (index) => index - galleryOptions.numberOfColumns,
      };

      const nextIndex = nextIndexGenerator[direction](currentIndex);
      if (nextIndex < 0) {
        app.tree.selectedItem = selectedItem.parent;
      } else if (nextIndex > context.length - 1) {
        const nextItem = getFollowingItem(selectedItem.parent);
        if (nextItem) app.tree.selectedItem = nextItem;
      } else {
        app.tree.selectedItem = context[nextIndex];
      }
    }
  }
};
export const setGalleryColumns = (
  app: AppState,
  galleryItem: Item,
  numberOfColumns: number
) => {
  if (galleryItem.view === "gallery" && galleryItem.galleryOptions) {
    galleryItem.galleryOptions.numberOfColumns = numberOfColumns;
  }

  animatePositions(app);
};

const animatePositions = (app: AppState) => {
  layoutRoot(app.tree.root, (item, gridX, gridY) => {
    const view = app.views.get(item);

    if (view) {
      if (view.gridX !== gridX) {
        view.gridX = gridX;
        switchTo(view.x, gridX * spacings.gridSize);
      }

      if (view.gridY !== gridY) {
        view.gridY = gridY;
        switchTo(view.y, gridY * spacings.gridSize);
      }
    }
  });
};

const getItemBelow = (item: Item): Item | undefined =>
  item.isOpen && item.children ? item.children![0] : getFollowingItem(item);

const getFollowingItem = (item: Item): Item | undefined => {
  const followingItem = getFollowingSibling(item);
  if (followingItem && !isBoard(item.parent)) return followingItem;
  else {
    let parent = item.parent;
    while (parent && (isLast(parent) || isBoard(parent.parent))) {
      parent = parent.parent;
    }
    if (parent) return getFollowingSibling(parent);
  }
};

const getItemAbove = (item: Item): Item | undefined => {
  const parent = item.parent;
  if (parent) {
    if (parent.view === "board") return parent;

    const index = parent.children.indexOf(item);
    if (index > 0) {
      const previousItem = parent.children[index - 1];
      if (previousItem.view === "board" && previousItem.isOpen)
        return getLastNestedItem(previousItem.children[0]);
      return getLastNestedItem(previousItem);
    } else if (!isRoot(parent)) return parent;
  }
};
const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

const getFollowingSibling = (item: Item): Item | undefined =>
  getRelativeSibling(item, (currentIndex) => currentIndex + 1);

const getRelativeSibling = (
  item: Item,
  getItemIndex: F2<number, number>
): Item | undefined => {
  const context = item.parent?.children;
  if (context) {
    const index = context.indexOf(item);
    return context[getItemIndex(index)];
  }
};

const hasVisibleChildren = (item: Item) => item.isOpen && hasChildren(item);
const hasChildren = (item: Item) => item.children.length > 0;

const isBoard = (item: Item | undefined): boolean => item?.view === "board";
const isRoot = (item: Item) => !item.parent;

const isLast = (item: Item): boolean => !getFollowingSibling(item);

const isInGallery = (item: Item) =>
  item.parent && item.parent.view === "gallery";

const assertNotEmpty = <T>(val: T | undefined): val is T => {
  if (typeof val === "undefined")
    throw new Error("Expected value not to be undefined");
  return true;
};
