import spacings, { colors } from "./spacings";

export const viewItem = (
  view: ItemView,
  isSelected: boolean,
  parentView?: ItemView
) => {
  const x = view.x.current;
  const y = view.y.current;

  const xOffset = spacings.textOffsetFromCircleCenter;
  const yOffset = 1;
  const { item } = view;

  const color = isSelected ? colors.selected : "#000";
  window.ctx.htmlContext.globalAlpha = view.opacity.current;
  if (view.item.view === "gallery" && view.item.isOpen) galleryOutline(view);

  if (parentView?.item.view === "gallery") {
    drawGalleryItem(view, isSelected);
  } else {
    window.ctx.outlineCircle(x, y, 3.2, 1, color);
    if (item.children.length > 0) {
      const filledCircle = isSelected ? colors.selected : "#A39E93";
      window.ctx.fillCircle(x, y, 3.2, filledCircle);
    }

    window.ctx.fillTextAtMiddle(item.title, x + xOffset, y + yOffset, color);

    if (parentView) {
      if (parentView.item.view === "board")
        boardChildtoParentLine(view, parentView);
      else lineBetween(view, parentView);
    }
  }
};

//TODO: think about how to animate between lineBetween and boardChildtoParentLine
const lineBetween = (view1: ItemView, view2: ItemView) => {
  const { circleRadius, lineToCircleDistance } = spacings;

  const x1 = view1.x.current - circleRadius - lineToCircleDistance;
  const y1 = view1.y.current;

  const x2 = view2.x.current;
  const y2 = view2.y.current + circleRadius + lineToCircleDistance;

  const ctx = window.ctx.htmlContext;
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y1);
  ctx.lineTo(x2, y2);

  ctx.stroke();
};

const boardChildtoParentLine = (from: ItemView, to: ItemView) => {
  const { circleRadius, lineToCircleDistance, gridSize } = spacings;

  const x1 = from.x.current;
  const y1 = from.y.current - circleRadius - lineToCircleDistance;

  const x2 = to.x.current;
  const y2 = to.y.current + circleRadius + lineToCircleDistance;

  const middleYPoint = (from.gridY - 1) * gridSize;

  const ctx = window.ctx.htmlContext;

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, middleYPoint);
  ctx.lineTo(x2, middleYPoint);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const galleryOutline = (itemView: ItemView) => {
  const { circleRadius, gridSize, textOffsetFromCircleCenter } = spacings;

  const distance = window.ctx.getTextWidth(itemView.item.title);
  const gallery = itemView.item.galleryOptions!;

  const topLeftX =
    itemView.x.current +
    distance +
    textOffsetFromCircleCenter * 2 -
    circleRadius;
  const topLeftY = itemView.y.current;

  const rightX = itemView.x.current + gallery.widthInGrid * gridSize;
  const topRightY = itemView.y.current;

  const bottomY = itemView.y.current + gallery.heightInGrid * gridSize;

  const LeftX = itemView.x.current;
  const topLeftEndX = itemView.y.current + textOffsetFromCircleCenter;

  const ctx = window.ctx.htmlContext;

  ctx.strokeStyle = colors.lines;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(topLeftX, topLeftY);

  ctx.lineTo(rightX, topRightY);
  ctx.lineTo(rightX, bottomY);
  ctx.lineTo(LeftX, bottomY);
  ctx.lineTo(LeftX, topLeftEndX);
  ctx.stroke();
};

function drawGalleryItem(view: ItemView, isSelected: boolean) {
  const x = view.x.current;
  const y = view.y.current;

  const { galleryImageHeight, galleryImageWidth, gridSize } = spacings;

  if (!view.image && view.item.videoId) {
    view.image = new Image();
    view.image.src = `https://i.ytimg.com/vi/${view.item.videoId}/default.jpg`;
  }
  window.ctx.drawRect(
    x,
    y,
    galleryImageWidth * gridSize,
    galleryImageHeight * gridSize,
    colors.lines
  );
  if (view.image)
    window.ctx.htmlContext.drawImage(
      view.image,
      0,
      (youtubeOriginalImageHeight - galleryImageHeight * gridSize) / 2,
      galleryImageWidth * gridSize,
      galleryImageHeight * gridSize,
      x,
      y,
      galleryImageWidth * gridSize,
      galleryImageHeight * gridSize
      // colors.lines
    );
  else {
    window.ctx.fillTextAtMiddle(view.item.title, x + 10, y + 15, "#000");
  }

  if (isSelected) {
    const width = galleryImageWidth * gridSize;
    const height = galleryImageHeight * gridSize;
    window.ctx.fillRect(x, y, width, height, 2, colors.selected);
  }
}
const youtubeOriginalImageHeight = 90;
