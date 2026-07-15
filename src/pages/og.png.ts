import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import config from "@/config";
import { loadOgFonts } from "@/utils/loadOgFonts";

export const GET: APIRoute = async ({ url }) => {
  const fonts = await loadOgFonts(url);
  const hostname = new URL(config.site.url).hostname;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfbfd",
          color: "#1d1d1f",
          padding: "64px 72px",
          fontFamily: "Noto Sans SC",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                      fontSize: 26,
                      fontWeight: 700,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: 58,
                            height: 58,
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#ffe60f",
                            color: "#000000",
                            fontSize: 42,
                            lineHeight: 1,
                            fontWeight: 700,
                          },
                          children: "@",
                        },
                      },
                      config.site.author,
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { color: "#6e6e73", fontSize: 24 },
                    children: hostname,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                maxWidth: 980,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 22,
                      color: "#0066cc",
                      fontSize: 28,
                      fontWeight: 700,
                    },
                    children: "数字生活笔记",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontSize: 76,
                      lineHeight: 1.16,
                      letterSpacing: "-2px",
                      fontWeight: 700,
                      marginBottom: 24,
                    },
                    children: "把复杂的数字服务，讲得简单一点。",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      color: "#6e6e73",
                      fontSize: 29,
                      lineHeight: 1.5,
                    },
                    children: config.site.description,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", gap: "14px" },
              children: ["Apple ID", "App Store", "AI 订阅", "数字工具"].map(
                label => ({
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      border: "1px solid #d2d2d7",
                      borderRadius: 999,
                      padding: "10px 18px",
                      color: "#3a3a3c",
                      background: "#ffffff",
                      fontSize: 22,
                    },
                    children: label,
                  },
                })
              ),
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, embedFont: true, fonts }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
