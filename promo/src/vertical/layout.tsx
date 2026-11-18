import type { ReactNode } from "react";

// Reels and Shorts cover roughly the top 250 px and bottom 400 px with their own UI,
// so headlines sit just below the top band and the phone owns the middle.
export const V_WIDTH = 1080;
export const V_HEIGHT = 1920;
export const PHONE_WIDTH = 480;
export const PHONE_Y = 1190;
const HEADLINE_TOP = 290;

export function TopHeadline({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: HEADLINE_TOP, display: "flex", justifyContent: "center" }}>
      {children}
    </div>
  );
}
