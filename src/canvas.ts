import spacings from "./spacings";

let onResizeCb: () => void;

export const onResize = (cb: () => void) => {
  onResizeCb = cb;
};
export const initCanvas = () => {
  const canvas = document.createElement("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);

  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    onResizeCb();
  };

  window.addEventListener("resize", onResize);

  const canvasContext = canvas.getContext("2d")!;

  const context = {
    clear: (backgroundColor = "#FFFFFF") => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      context.drawRect(0, 0, canvas.width, canvas.height, backgroundColor);
    },
    drawRect: (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string
    ) => {
      canvasContext.fillStyle = color;
      canvasContext.fillRect(x, y, width, height);
    },

    fillTextAtMiddle: (text: string, x: number, y: number, color: string) => {
      canvasContext.fillStyle = color;
      canvasContext.textBaseline = "middle";
      canvasContext.font = `${spacings.fontSize}px Roboto, sans-serif`;
      canvasContext.fillText(text, x, y);
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
      canvasContext.arc(x, y, r, 0, 2 * Math.PI);
      canvasContext.lineWidth = lineWidth;
      canvasContext.stroke();
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
      canvasContext.moveTo(x, y);

      canvasContext.lineTo(x + w, y);
      canvasContext.lineTo(x + w, y + h);
      canvasContext.lineTo(x, y + h);
      canvasContext.closePath();
      canvasContext.stroke();
    },

    width: window.innerWidth,
    height: window.innerHeight,

    htmlContext: canvasContext,
  };

  window.ctx = context;
  return context;
};

declare global {
  interface Window {
    ctx: ReturnType<typeof initCanvas>;
  }
}
