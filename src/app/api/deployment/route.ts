export async function GET(request: Request) {
  const path = new URL(request.url).pathname;

  return Response.json(
    {
      service: "launchboard",
      environment: process.env.VERCEL_ENV ?? "local",
      releaseLabel: process.env.APP_RELEASE_LABEL ?? "LaunchBoard Local",
      path,
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
