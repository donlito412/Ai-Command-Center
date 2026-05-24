"use client";

import { useCallback, useEffect, useState } from "react";

export type HudSound = "click" | "transition" | "scan" | "alert";

type Subscriber = (enabled: boolean) => void;

let sharedAudioContext: AudioContext | null = null;
let sharedEnabled = true;
const subscribers = new Set<Subscriber>();

const soundMap: Record<HudSound, { frequency: number; duration: number; type: OscillatorType }> = {
  click: { frequency: 880, duration: 0.045, type: "square" },
  transition: { frequency: 420, duration: 0.09, type: "sawtooth" },
  scan: { frequency: 1160, duration: 0.12, type: "triangle" },
  alert: { frequency: 180, duration: 0.18, type: "sawtooth" }
};

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  sharedAudioContext ??= new AudioContextConstructor();
  return sharedAudioContext;
}

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber(sharedEnabled));
}

function setSharedEnabled(enabled: boolean) {
  sharedEnabled = enabled;
  notifySubscribers();
}

export function playHudSound(sound: HudSound) {
  if (!sharedEnabled) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume();
  }

  const config = soundMap[sound];
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(config.frequency * 0.66, now + config.duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(sound === "alert" ? 0.07 : 0.035, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + config.duration + 0.015);
}

export function useHudAudio() {
  const [enabled, setEnabledState] = useState(sharedEnabled);

  useEffect(() => {
    subscribers.add(setEnabledState);
    return () => {
      subscribers.delete(setEnabledState);
    };
  }, []);

  const setEnabled = useCallback((nextEnabled: boolean) => {
    setSharedEnabled(nextEnabled);
  }, []);

  const toggle = useCallback(() => {
    setSharedEnabled(!sharedEnabled);
  }, []);

  const play = useCallback((sound: HudSound) => {
    playHudSound(sound);
  }, []);

  return { enabled, setEnabled, toggle, play };
}
