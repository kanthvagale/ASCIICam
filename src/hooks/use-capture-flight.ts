import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import type { Rect } from "@/components/camera/capture-flyover";

/** Only captures this fresh animate; older ones are store hydration or edits elsewhere. */
const FRESH_MS = 5_000;

export type CaptureFlight = { id: string; from: Rect; to: Rect };

type Options = {
  latest?: { id: string; createdAt: number };
  isActive: boolean;
  /** The flight is drawn here; rects are relative to its origin. */
  overlayRef: RefObject<View | null>;
  fromRef: RefObject<View | null>;
  toRef: RefObject<View | null>;
};

function measure(ref: RefObject<View | null>): Promise<Rect | null> {
  return new Promise((resolve) => {
    const node = ref.current;
    if (!node) return resolve(null);
    node.measureInWindow((x, y, width, height) => resolve(width > 0 && height > 0 ? { x, y, width, height } : null));
  });
}

const relativeTo = (rect: Rect, origin: Rect): Rect => ({ ...rect, x: rect.x - origin.x, y: rect.y - origin.y });

/** The thumbnail keeps the previous capture (`thumbId`) until the flight lands. */
export function useCaptureFlight({ latest, isActive, overlayRef, fromRef, toRef }: Options) {
  const reduceMotion = useReducedMotion();
  const [thumbId, setThumbId] = useState(latest?.id);
  const [flight, setFlight] = useState<CaptureFlight | null>(null);
  const seenId = useRef(latest?.id);

  useEffect(() => {
    const id = latest?.id;
    if (id === seenId.current) return;
    seenId.current = id;

    const fresh = latest !== undefined && Date.now() - latest.createdAt < FRESH_MS;
    void (async () => {
      if (!id || !fresh || !isActive || reduceMotion) {
        setThumbId(id);
        return;
      }
      const [overlay, from, to] = await Promise.all([measure(overlayRef), measure(fromRef), measure(toRef)]);
      if (!overlay || !from || !to) {
        setThumbId(id);
        return;
      }
      setFlight({ id, from: relativeTo(from, overlay), to: relativeTo(to, overlay) });
    })();
  }, [fromRef, isActive, latest, overlayRef, reduceMotion, toRef]);

  const flightId = flight?.id;
  const onLanded = useCallback(() => setThumbId(flightId), [flightId]);
  const onDone = useCallback(() => setFlight(null), []);

  return { thumbId, flight, onLanded, onDone };
}
