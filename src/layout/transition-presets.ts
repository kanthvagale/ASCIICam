import {
  interpolate,
  interpolateColor,
  type WithSpringConfig,
} from "react-native-reanimated";
import type { ScreenTransitionConfig } from "react-native-screen-transitions";

export const DefaultSpec: WithSpringConfig = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: false,
  // @ts-expect-error Reanimated v3 spring config support.
  restSpeedThreshold: 0.02,
};

export const DefaultSnapSpec: WithSpringConfig = {
  stiffness: 500,
  damping: 50,
  mass: 1,
};

export const FlingSpec: WithSpringConfig = {
  damping: 23.5,
  stiffness: 170,
  mass: 1,
  overshootClamping: false,
  energyThreshold: 6e-9,
};

export const SlideFromTopTransition = (
  config: Partial<ScreenTransitionConfig> = {},
): ScreenTransitionConfig => {
  return {
    //@ts-expect-error - Should not lead to any issues
    enableTransitions: true,
    gestureEnabled: true,
    gestureDirection: { gesture: "vertical-inverted", area: "edge" },
    screenStyleInterpolator: ({
      layouts: {
        screen: { height },
      },
      progress,
    }) => {
      "worklet";

      if (progress > 1) {
        const y = interpolate(progress, [1, 2], [0, height / 10]);

        return {
          content: {
            style: {
              transform: [{ translateY: y }],
            },
          },
        };
      }

      const y = interpolate(progress, [0, 1], [-height, 0]);

      return {
        content: {
          style: {
            transform: [{ translateY: y }],
          },
        },
      };
    },
    transitionSpec: {
      open: DefaultSpec,
      close: DefaultSpec,
    },
    ...config,
  };
};

export const SlideFromBottomTransition = (
  config: Partial<ScreenTransitionConfig> = {},
): ScreenTransitionConfig => {
  return {
    //@ts-expect-error - Should not lead to any issues
    enableTransitions: true,
    gestureEnabled: true,
    gestureDirection: { gesture: "vertical", area: "edge" },
    screenStyleInterpolator: ({
      layouts: {
        screen: { height },
      },
      progress,
    }) => {
      "worklet";

      if (progress > 1) {
        const y = interpolate(progress, [1, 2], [0, -height]);

        return {
          content: {
            style: {
              transform: [{ translateY: y / 10 }],
            },
          },
        };
      }

      const y = interpolate(progress, [0, 1], [height, 0]);
      const scale = interpolate(progress, [0, 0.8, 1], [0.9, 0.9, 1]);
      const borderRadius = interpolate(progress, [0, 0.8, 1], [50, 50, 0]);

      return {
        content: {
          style: {
            transform: [{ translateY: y }, { scale: scale }],
            borderRadius: borderRadius,
            overflow: "hidden",
          },
        },
        backdrop: {
          backgroundColor: interpolateColor(
            progress,
            [0, 1],
            ["transparent", "#000000b3"],
          ),
        },
      };
    },
    transitionSpec: {
      open: DefaultSpec,
      close: DefaultSpec,
    },
    ...config,
  };
};

export const SlideFromBottomTranslucentTransition = (
  config: Partial<ScreenTransitionConfig> = {},
): ScreenTransitionConfig => {
  return {
    //@ts-expect-error - Should not lead to any issues
    enableTransitions: true,
    gestureEnabled: true,
    gestureDirection: { gesture: "vertical", area: "screen" },
    screenStyleInterpolator: ({
      layouts: {
        screen: { height },
      },
      progress,
    }) => {
      "worklet";

      if (progress > 1) {
        const y = interpolate(progress, [1, 2], [0, 0]);

        return {
          content: {
            style: {
              transform: [{ translateY: y }],
            },
          },
        };
      }

      const y = interpolate(progress, [0, 1], [height, 0]);
      const rotate = interpolate(progress, [0, 0.3, 1], [0, -90, 0]);

      return {
        content: {
          style: {
            transform: [
              { translateY: y },
              { scale: progress },
              { perspective: 1000 },
              { rotateX: `${rotate}deg` },
            ],
          },
        },
        backdrop: {
          backgroundColor: interpolateColor(
            progress,
            [0, 1],
            ["transparent", "#000000b3"],
          ),
        },
      };
    },
    transitionSpec: {
      open: DefaultSpec,
      close: DefaultSpec,
    },
    ...config,
  };
};

export const CurtainTransition = (
  config: Partial<ScreenTransitionConfig> = {},
): ScreenTransitionConfig => {
  return {
    //@ts-expect-error - Should not lead to any issues
    enableTransitions: true,
    gestureEnabled: true,
    gestureDirection: { gesture: "horizontal", area: 60 },
    screenStyleInterpolator: ({
      layouts: {
        screen: { width },
      },
      progress,
    }) => {
      "worklet";

      if (progress > 1) {
        const x = interpolate(progress, [1, 2], [0, -width / 4]);

        return {
          content: {
            style: {
              transform: [{ translateX: x }],
            },
          },
        };
      }

      const x = interpolate(progress, [0, 1], [width, 0]);

      return {
        content: {
          style: {
            transform: [{ translateX: x }],
          },
        },
      };
    },
    transitionSpec: {
      open: DefaultSpec,
      close: DefaultSpec,
    },
    ...config,
  };
};
