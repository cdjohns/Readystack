import { NextResponse } from "next/server";

import { getAppEnv } from "@readystack/config";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "readystack-web",
    environment: getAppEnv(),
  });
}
