import { track } from "@vercel/analytics";

type EventProperties = Record<string, string | number | boolean | null>;

export function trackEvent(name: string, properties?: EventProperties) {
  try {
    track(name, properties);
  } catch {
    // Analytics should never block user flows.
  }
}

export const analyticsEvents = {
  leadStarted: "Lead Started",
  leadSubmitted: "Lead Submitted",
  projectCreated: "Project Created",
  signupStarted: "Signup Started",
  signupCompleted: "Signup Completed",
  loginCompleted: "Login Completed",
  socialAuthStarted: "Social Auth Started",
};
