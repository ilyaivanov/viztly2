import spacings, { colors } from "./spacings";

export const layoutChildren = (
  item: Item,
  gridX: number,
  gridY: number,
  fn: A3<Item, number, number>
) => {
  if (item.view === "gallery" && item.galleryOptions)
    return renderGallery(item.galleryOptions, item.children, gridX, gridY, fn);

  const renderer = item.view === "tree" ? traverseItems : renderBoardChildren;

  return renderer(item.children, gridX, gridY, fn);
};

export const drawGrid = () => {
  const ctx = window.ctx;
  const { gridSize } = spacings;
  for (let x = 0; x < ctx.width; x += gridSize) {
    for (let y = 0; y < ctx.height; y += gridSize) {
      ctx.drawRect(x - 1, y - 1, 2, 2, colors.gridPoint);
    }
  }
};

const traverseItems = (
  items: Item[],
  gridX: number,
  gridY: number,
  fn: A3<Item, number, number>
): number =>
  items.reduce((totalGridHeight, child) => {
    const currentGridY = gridY + totalGridHeight;
    fn(child, gridX, currentGridY);

    return (
      totalGridHeight +
      1 +
      (hasVisibleChildren(child)
        ? layoutChildren(child, gridX + 1, currentGridY + 1, fn)
        : 0)
    );
  }, 0);

const renderGallery = (
  gallery: GalleryOptions,
  items: Item[],
  gridX: number,
  gridY: number,
  fn: A3<Item, number, number>
) => {
  let x = gridX;
  let y = gridY;
  const { galleryImageWidth, galleryImageHeight } = spacings;
  let itemsInRow = 0;
  for (const item of items) {
    fn(item, x, y);
    x += galleryImageWidth + 1;
    itemsInRow += 1;
    if (itemsInRow >= gallery.numberOfColumns) {
      x = gridX;
      y += galleryImageHeight + 1;
      itemsInRow = 0;
    }
  }
  gallery.heightInGrid = y - gridY + galleryImageHeight + 2;
  gallery.widthInGrid = gallery.numberOfColumns * (galleryImageWidth + 1) + 1;
  return y - gridY + galleryImageHeight + 2;
};

const renderBoardChildren = (
  items: Item[],
  gridX: number,
  gridY: number,
  fn: A3<Item, number, number>
) => {
  let maxHeight = 0;
  const viewY = gridY + 1;

  let viewX = gridX;
  items.forEach((child) => {
    fn(child, viewX, viewY);

    let xOffset = gridDistanceForText(child.title);

    if (hasVisibleChildren(child)) {
      const subtreeHeight = traverseItems(
        child.children,
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
export const textWidthWithMarging = (label: string) =>
  window.ctx.getTextWidth(label) + spacings.textOffsetFromCircleCenter * 2;

export const gridDistanceForText = (label: string) =>
  Math.ceil(textWidthWithMarging(label) / spacings.gridSize);
