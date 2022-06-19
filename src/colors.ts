import { createAnimatedColor, switchColorTo } from "./animations";

const themes = {
  dark: {
    bg: "#1E1E1E",
    line: "#3C413D",
    font: "#E7E7E7",
    selected: "#B1E847",
    gridPoint: "#3C413D",
    filledCircle: "#A39E93",
    centerColor: "#2C392F",
  },
  light: {
    bg: "#FAF9F7",
    line: "#D3D3D3",
    gridPoint: "#D3D3D3",
    selected: "#1D0FFF",
    filledCircle: "#A39E93",
    centerColor: "#EAEAEA",
    font: "#000000",
  },
};

type Theme = keyof typeof themes;
type ThemeDef = typeof themes["dark"];

const allThemes: Theme[] = ["dark", "light"];

let currentTheme: Theme = "dark";

const currentThemeDef = themes[currentTheme];

export const bgColor = createAnimatedColor(currentThemeDef.bg);
export const line = createAnimatedColor(currentThemeDef.line);
export const gridPoind = createAnimatedColor(currentThemeDef.gridPoint);
export const font = createAnimatedColor(currentThemeDef.font);
export const selected = createAnimatedColor(currentThemeDef.selected);
export const filledCircle = createAnimatedColor(currentThemeDef.filledCircle);
export const centeredLine = createAnimatedColor(currentThemeDef.centerColor);

export const rotateTheme = () => {
  const index = allThemes.indexOf(currentTheme);
  const nextIndex = index >= allThemes.length - 1 ? 0 : index + 1;
  currentTheme = allThemes[nextIndex];
  assignTheme(themes[currentTheme]);
};

const assignTheme = (themeDef: ThemeDef) => {
  switchColorTo(bgColor, themeDef.bg);
  switchColorTo(line, themeDef.line);
  switchColorTo(selected, themeDef.selected);
  switchColorTo(filledCircle, themeDef.filledCircle);
  switchColorTo(centeredLine, themeDef.centerColor);
  switchColorTo(gridPoind, themeDef.gridPoint);
  switchColorTo(font, themeDef.font);
};
