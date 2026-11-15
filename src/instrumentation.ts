import net from "node:net";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (typeof net !== "undefined" && typeof (net as any).setDefaultAutoSelectFamily === "function") {
      (net as any).setDefaultAutoSelectFamily(false);
    }
  }
}
