const SOURCE_PATTERN = /^[a-zA-Z0-9._@-]{1,64}$/;

export async function POST(request) {
  const rawSource = new URL(request.url).searchParams.get("src");
  const source = rawSource?.trim();

  if (source && SOURCE_PATTERN.test(source)) {
    console.info("ig_redirect_click", {
      source,
      timestamp: new Date().toISOString(),
    });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
