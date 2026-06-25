import { getAppEnv } from "@readystack/config";

export default function HomePage() {
  const appEnv = getAppEnv();

  return (
    <main>
      <h1>ReadyStack</h1>
      <p>The ReadyStack baseline application is running.</p>
      <p>Environment: {appEnv}</p>
    </main>
  );
}
