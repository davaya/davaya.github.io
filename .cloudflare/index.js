export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. If the user typed http and/or a path without an extension, immediately update the request
    //    This executes locally at the Cloudflare Edge network.

    let modified = false;

    //    Upgrade HTTP to HTTPS
    if (url.protocol === "http:") {
      url.protocol = "https:";
      modified = true;
    }

    //    Add .jadn extension if missing from last path segment
    const lastSegment = url.pathname.split('/').pop();
    if (url.pathname.startsWith('/schema/') && !lastSegment.includes('.')) {
      url.pathname += '.jadn';
      modified = true;
    }

    if (modified) {
      return Response.redirect(url.toString(), 301);
    }

    // 2. Fetch directly from the backend origin zone.
    //    Cloudflare natively forwards `request` to your DNS destination.
    let response = await fetch(request);

    // 3. Clone headers to append security compliance flags
    const newHeaders = new Headers(response.headers);

    //    Inject HSTS to hardcode the browser to stay on HTTPS permanently
    newHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

    //    Prevent layout breakage by forcing internal assets to load securely
    newHeaders.set("Content-Security-Policy", "upgrade-insecure-requests");

    //    Set JSON content type (override default application/octet-stream)
    newHeaders.set("Content-Type", "application/json");

	// 4. Return the secure asset stream with injected headers to the user
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};