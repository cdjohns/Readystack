export type AppEnvironment = "development" | "test" | "production";

export function getNodeEnv(): string {
  return process.env.NODE_ENV ?? "development";
}

export function getAppEnv(): AppEnvironment {
  const nodeEnv = getNodeEnv();
  if (nodeEnv === "production" || nodeEnv === "test") {
    return nodeEnv;
  }
  return "development";
}
