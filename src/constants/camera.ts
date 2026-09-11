import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

export const resolutionWidth = 96;
export const resolutionHeight = Math.floor(resolutionWidth * (3 / 4));
export const pixelCount = resolutionHeight * resolutionWidth;

export const chars = "    ....----===+++***##%%@@";

export const asciiFontSize = (width / resolutionWidth) * 1.5;
