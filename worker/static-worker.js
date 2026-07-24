const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !url.pathname.includes(".")) {
      response = await env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
    }

    if (response.headers.get("content-type")?.includes("text/html")) {
      const html = (await response.text()).replaceAll("__SITE_ORIGIN__", url.origin);
      return new Response(html, response);
    }

    return response;
  },
};

export default worker;
