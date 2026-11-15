export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const net = await import("node:net");
    if (typeof (net as any).setDefaultAutoSelectFamily === "function") {
      (net as any).setDefaultAutoSelectFamily(false);
    }
  }
}
