import { VIEWPORT_MAX_WIDTH } from "./canvas";
import spacings from "./spacings";
import * as color from "./colors";
import { getHexColor } from "./animations";

type LayoutCallback = (item: Item, gridX: number, gridY: number) => void;

export const layoutRoot = (root: Item, cb: LayoutCallback) =>
  layoutChildrenImp(root, 0, 2, cb);

export const layoutChildren = (view: ItemView, cb: LayoutCallback) =>
  layoutChildrenImp(view.item, view.gridX, view.gridY, cb);

const layoutChildrenImp = (
  item: Item,
  gridX: number,
  gridY: number,
  fn: LayoutCallback
) => {
  if (item.view === "gallery" && item.galleryOptions)
    return renderGallery(item.galleryOptions, item.children, gridX, gridY, fn);

  const renderer = item.view === "tree" ? traverseItems : renderBoardChildren;

  return renderer(item.children, gridX, gridY, fn);
};

export const drawGrid = () => {
  const ctx = window.ctx;

  const gridC = getHexColor(color.line.currentValue);
  //drawing 200x100 grid
  for (let gridX = -50; gridX < 50; gridX += 1) {
    for (let gridY = 0; gridY < 100; gridY += 1) {
      ctx.drawRectAtGridCenter(gridX, gridY, 2, 2, gridC);
    }
  }

  // vertical lines
  window.ctx.htmlContext.beginPath();

  window.ctx.moveTo(0, 0);
  window.ctx.lineTo(0, window.ctx.height);
  window.ctx.moveTo(VIEWPORT_MAX_WIDTH, 0);
  window.ctx.lineTo(VIEWPORT_MAX_WIDTH, window.ctx.height);
  window.ctx.htmlContext.lineWidth = 2;
  window.ctx.htmlContext.strokeStyle = getHexColor(
    color.centeredLine.currentValue
  );
  window.ctx.htmlContext.stroke();
};

const traverseItems = (
  items: Item[],
  gridX: number,
  gridY: number,
  fn: LayoutCallback
): number =>
  items.reduce((totalGridHeight, child) => {
    const currentGridY = gridY + totalGridHeight;
    fn(child, gridX, currentGridY);

    return (
      totalGridHeight +
      1 +
      (hasVisibleChildren(child)
        ? layoutChildrenImp(child, gridX + 1, currentGridY + 1, fn)
        : 0)
    );
  }, 0);

const renderGallery = (
  gallery: GalleryOptions,
  items: Item[],
  gridX: number,
  gridY: number,
  fn: LayoutCallback
) => {
  let x = gridX;
  let y = gridY;
  const { galleryImageWidth, galleryImageHeight } = spacings;
  let itemsInRow = 0;
  for (const item of items) {
    if (itemsInRow >= gallery.numberOfColumns) {
      x = gridX;
      y += galleryImageHeight + 1;
      itemsInRow = 0;
    }

    fn(item, x, y);
    x += galleryImageWidth + 1;
    itemsInRow += 1;
  }
  gallery.heightInGrid = y - gridY + galleryImageHeight + 2;
  gallery.widthInGrid = gallery.numberOfColumns * (galleryImageWidth + 1) + 1;
  return y - gridY + galleryImageHeight + 2;
};

const renderBoardChildren = (
  items: Item[],
  gridX: number,
  gridY: number,
  fn: LayoutCallback
) => {
  let maxHeight = 0;
  const viewY = gridY + 1;

  let viewX = gridX;
  items.forEach((child) => {
    fn(child, viewX, viewY);

    let xOffset = gridDistanceForText(child.title);

    if (hasVisibleChildren(child)) {
      const subtreeHeight = layoutChildrenImp(
        child,
        viewX + 1,
        viewY + 1,
        (item, x, y) => {
          const xGridDistanceToBoardItem = x - viewX;
          xOffset = Math.max(
            gridDistanceForText(item.title) + xGridDistanceToBoardItem,
            xOffset
          );
          fn(item, x, y);
        }
      );
      maxHeight = Math.max(subtreeHeight, maxHeight);
    }
    viewX += xOffset;
  });
  return 3 + maxHeight;
};

const hasVisibleChildren = (item: Item) =>
  item.isOpen && item.children.length > 0;

// text offset * 2 because it's from beggining and end
const textWidthWithMarging = (label: string) =>
  window.ctx.getTextWidth(label) + spacings.textOffsetFromCircleCenter * 2;

const gridDistanceForText = (label: string) =>
  Math.ceil(textWidthWithMarging(label) / spacings.gridSize);
