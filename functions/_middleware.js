export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get("user-agent") || "";

  const isWeChatBrowser =
    /MicroMessenger/i.test(userAgent) ||
    /WeChat/i.test(userAgent);

  if (isWeChatBrowser) {
    const url = new URL(request.url);

    const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow,noarchive" />
  <title>请在浏览器中打开</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fbfbfd;
      color: #1d1d1f;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.7;
    }
    .box {
      width: min(88vw, 520px);
      padding: 32px 24px;
      border-radius: 24px;
      background: #fff;
      box-shadow: 0 12px 40px rgba(0,0,0,.08);
      text-align: center;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 12px;
    }
    p {
      margin: 8px 0;
      color: #555;
      font-size: 16px;
    }
    .url {
      margin-top: 18px;
      padding: 12px;
      border-radius: 12px;
      background: #f5f5f7;
      color: #333;
      font-size: 14px;
      word-break: break-all;
      user-select: all;
    }
    .tip {
      margin-top: 18px;
      font-size: 14px;
      color: #86868b;
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>请在浏览器中打开</h1>
    <p>当前页面不支持在微信内置浏览器中访问。</p>
    <p>请点击右上角「…」，选择「在浏览器打开」。</p>
    <div class="url">${url.href}</div>
    <p class="tip">不要艾特我 · 290935.xyz</p>
  </div>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate",
        "x-robots-tag": "noindex, nofollow, noarchive",
        "referrer-policy": "no-referrer",
      },
    });
  }

  return next();
}
