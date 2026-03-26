import React, { useRef } from "react";
import { Animated, Text } from "react-native";
import {
  Gesture,
  GestureDetector,
  Directions,
} from "react-native-gesture-handler";
import { useGame } from "../context/GameContext";

const SIZE = 120;

export default function ClickerObject() {
  const { dispatch } = useGame();

  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const holdStartRef = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0 });

  const flash = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // --- Gestures ---
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(300)
    .onEnd(() => {
      flash();
      dispatch({ type: "DOUBLE_TAP" });
    });

  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      flash();
      dispatch({ type: "TAP" });
    });

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      holdStartRef.current = Date.now();
    })
    .onEnd(() => {
      const duration = Date.now() - holdStartRef.current;
      dispatch({ type: "RECORD_HOLD", durationMs: duration });
      dispatch({ type: "LONG_PRESS" });
      flash();
    });

  // Pan requires a small delay so fast swipes trigger Fling instead
  const pan = Gesture.Pan()
    .activateAfterLongPress(250)
    .minDistance(10)
    .onStart(() => {
      posRef.current = { x: (translateX as any)._value || 0, y: (translateY as any)._value || 0 };
    })
    .onChange((e) => {
      translateX.setValue(posRef.current.x + e.translationX);
      translateY.setValue(posRef.current.y + e.translationY);
    })
    .onEnd(() => {
      posRef.current = { x: (translateX as any)._value || 0, y: (translateY as any)._value || 0 };
      dispatch({ type: "PAN" });
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .numberOfPointers(1)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      dispatch({ type: "FLING_RIGHT", points: pts });
      flash();
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .numberOfPointers(1)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      dispatch({ type: "FLING_LEFT", points: pts });
      flash();
    });

  const pinch = Gesture.Pinch()
    .onChange((e) => {
      scale.setValue(e.scale);
    })
    .onEnd(() => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      dispatch({ type: "PINCH" });
      flash();
    });

  // Compose gestures
  // Exclusive: first gesture that activates wins (priority order)
  const taps = Gesture.Exclusive(doubleTap, singleTap);
  const flings = Gesture.Exclusive(flingRight, flingLeft);
  // Flings first (fast swipe), then pan (long-press + drag)
  const movementGestures = Gesture.Exclusive(flings, pan);
  const composed = Gesture.Simultaneous(
    taps,
    longPress,
    movementGestures,
    pinch
  );

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: "#6366f1",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        }}
      >
        <Text style={{ fontSize: 40 }}>🎯</Text>
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: 12,
            marginTop: 2,
          }}
        >
          НАТИСНИ
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}
