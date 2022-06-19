import spacings from "./spacings";

let onResizeCb: () => void;

export const VIEWPORT_MAX_WIDTH = spacings.gridSize * 40;
export const onResize = (cb: () => void) => {
  onResizeCb = cb;
};
export const initCanvas = () => {
  const canvas = document.createElement("canvas");

  document.body.appendChild(canvas);

  const assignDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    context.width = width;
    context.height = height;

    context.useRelativePositioning();
    context.xOffset = Math.max(0, (width - VIEWPORT_MAX_WIDTH) / 2);

    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener("resize", () => {
    assignDimensions();
    onResizeCb();
  });

  const canvasContext = canvas.getContext("2d")!;

  const context = {
    useAbsolutePositioning: () => {
      context.xOffset = 0;
    },
    useRelativePositioning: () => {
      context.xOffset = Math.max(0, (context.width - VIEWPORT_MAX_WIDTH) / 2);
    },
    clear: (backgroundColor = "#FFFFFF") => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      context.drawRect(
        0 - context.xOffset,
        0,
        canvas.width,
        canvas.height,
        backgroundColor
      );
    },
    drawRect: (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string
    ) => {
      canvasContext.fillStyle = color;
      canvasContext.fillRect(x + context.xOffset, y, width, height);
    },

    drawRectAtGridCenter: (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string
    ) => {
      const { gridSize } = spacings;
      canvasContext.fillStyle = color;
      canvasContext.fillRect(
        x * gridSize + context.xOffset - width / 2,
        y * gridSize - height / 2,
        width,
        height
      );
    },

    fillTextAtMiddle: (text: string, x: number, y: number, color: string) => {
      canvasContext.fillStyle = color;
      canvasContext.textBaseline = "middle";
      canvasContext.font = `${spacings.fontSize}px Roboto, sans-serif`;
      canvasContext.fillText(text, x + context.xOffset, y);
    },

    getTextWidth: (text: string) => {
      canvasContext.font = `${spacings.fontSize}px Roboto, sans-serif`;
      return canvasContext.measureText(text).width;
    },

    outlineCircle: (
      x: number,
      y: number,
      r: number,
      lineWidth: number,
      color: string
    ) => {
      canvasContext.strokeStyle = color;
      canvasContext.beginPath();
      canvasContext.arc(x + context.xOffset, y, r, 0, 2 * Math.PI);
      canvasContext.lineWidth = lineWidth;
      canvasContext.stroke();
    },
    fillCircle: (x: number, y: number, r: number, color: string) => {
      canvasContext.fillStyle = color;
      canvasContext.beginPath();
      canvasContext.arc(x + context.xOffset, y, r, 0, 2 * Math.PI);
      canvasContext.fill();
    },

    fillRect: (
      x: number,
      y: number,
      w: number,
      h: number,
      lineWidth: number,
      color: string
    ) => {
      canvasContext.strokeStyle = color;
      canvasContext.lineWidth = lineWidth;
      canvasContext.beginPath();
      canvasContext.moveTo(x + context.xOffset, y);

      canvasContext.lineTo(x + w + context.xOffset, y);
      canvasContext.lineTo(x + w + context.xOffset, y + h);
      canvasContext.lineTo(x + context.xOffset, y + h);
      canvasContext.closePath();
      canvasContext.stroke();
    },
    moveTo: (x: number, y: number) => {
      canvasContext.moveTo(x + context.xOffset, y);
    },

    lineTo: (x: number, y: number) => {
      canvasContext.lineTo(x + context.xOffset, y);
    },

    drawImage: (
      image: CanvasImageSource,
      sx: number,
      sy: number,
      sw: number,
      sh: number,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ) => {
      canvasContext.drawImage(
        image,
        sx,
        sy,
        sw,
        sh,
        dx + context.xOffset,
        dy,
        dw,
        dh
      );
    },

    width: 0,
    height: 0,

    xOffset: 0,

    htmlContext: canvasContext,
  };

  assignDimensions();
  window.ctx = context;
  return context;
};

declare global {
  interface Window {
    ctx: ReturnType<typeof initCanvas>;
  }
}
