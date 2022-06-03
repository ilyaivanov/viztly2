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

  const color = isSelected ? "red" : "#000";

  if (parentView?.item.view === "gallery") {
    const { galleryImageHeight, galleryImageWidth, gridSize } = spacings;
    window.ctx.drawRect(
      x,
      y,
      galleryImageWidth * gridSize,
      galleryImageHeight * gridSize,
      "grey"
    );
  } else {
    window.ctx.outlineCircle(x, y, 3.2, 1, color);

    window.ctx.fillTextAtMiddle(item.title, x + xOffset, y + yOffset, color);

    if (parentView) {
      if (parentView.item.view === "board")
        boardChildtoParentLine(view, parentView);
      else lineBetween(view, parentView);
    }
  }
  if (view.item.view === "gallery") galleryOutline(view);
};

//TODO: think about how to animate between lineBetween and boardChildtoParentLine
const lineBetween = (view1: ItemView, view2: ItemView) => {
  const { circleRadius, lineToCircleDistance } = spacings;

  const x1 = view1.x.current - circleRadius - lineToCircleDistance;
  const y1 = view1.y.current;

  const x2 = view2.x.current;
  const y2 = view2.y.current + circleRadius + lineToCircleDistance;

  const ctx = window.ctx.htmlContext;

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y1);
  ctx.lineTo(x2, y2);

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines;
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

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, middleYPoint);
  ctx.lineTo(x2, middleYPoint);
  ctx.lineTo(x2, y2);

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.lines;
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
  ctx.moveTo(topLeftX, topLeftY);

  ctx.lineTo(rightX, topRightY);
  ctx.lineTo(rightX, bottomY);
  ctx.lineTo(LeftX, bottomY);
  ctx.lineTo(LeftX, topLeftEndX);
  ctx.stroke();
};
