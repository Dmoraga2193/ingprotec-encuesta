import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function getDeviceId() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}

export function generateSurveyId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isTestMode() {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true";
}

export function generateRandomSurveyResponse() {
  const questions = Array(10)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10 + 1).toString());

  return {
    questions,
    timestamp: new Date().toISOString(),
    deviceId: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    isTestSubmission: true,
  };
}
