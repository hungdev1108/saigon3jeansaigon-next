import { BACKEND_DOMAIN } from "@/api/config";

const ANALYTICS_SESSION_KEY = "sg3_analytics_session_id";

export const getOrCreateSessionId = () => {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem(ANALYTICS_SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const trackVisit = async ({ path, referrer } = {}) => {
  try {
    const sessionId = getOrCreateSessionId();

    const response = await fetch(`${BACKEND_DOMAIN}/api/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        path: path ?? (typeof window !== "undefined" ? window.location.pathname : ""),
        referrer: referrer ?? (typeof document !== "undefined" ? document.referrer : ""),
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error tracking visit:", error);
    return { success: false };
  }
};

export const getAnalyticsSummary = async (range = "week") => {
  try {
    const response = await fetch(`${BACKEND_DOMAIN}/api/analytics/summary?range=${range}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return { success: false };
  }
};



