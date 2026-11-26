export async function GET(request: Request) {
  const path = new URL(request.url).pathname;

  return Response.json(
    {
      status: "ok",
      service: "launchboard",
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
