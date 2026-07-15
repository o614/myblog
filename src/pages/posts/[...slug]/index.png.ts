import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { getPostSlug } from "@/utils/getPostPaths";
import { loadOgFonts } from "@/utils/loadOgFonts";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) return [];

  const posts = await getCollection("posts").then(items =>
    items.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const fonts = await loadOgFonts(url);
  const title = props.data.title as string;
  const tags = (props.data.tags as string[] | undefined) ?? [];
  const date = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: config.site.timezone,
  }).format(new Date(props.data.modDatetime ?? props.data.pubDatetime));
  const titleSize = title.length > 34 ? 50 : title.length > 24 ? 58 : 66;

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
          padding: "58px 68px 56px",
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
                      gap: "16px",
                      fontSize: 25,
                      fontWeight: 700,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: 52,
                            height: 52,
                            borderRadius: 15,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#ffe60f",
                            color: "#000000",
                            fontSize: 38,
                            lineHeight: 1,
                            fontWeight: 700,
                          },
                          children: "@",
                        },
                      },
                      config.site.title,
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { color: "#6e6e73", fontSize: 22 },
                    children: "290935.xyz",
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
                maxWidth: 1050,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      color: "#0066cc",
                      fontSize: 24,
                      fontWeight: 700,
                      marginBottom: 20,
                    },
                    children: "实用教程",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      maxHeight: 252,
                      overflow: "hidden",
                      fontSize: titleSize,
                      lineHeight: 1.24,
                      letterSpacing: "-1.5px",
                      fontWeight: 700,
                    },
                    children: title,
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
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #d2d2d7",
                paddingTop: 24,
                color: "#6e6e73",
                fontSize: 22,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", gap: "12px" },
                    children: (tags.length
                      ? tags.slice(0, 3)
                      : ["数字生活"]
                    ).map(tag => ({
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          borderRadius: 999,
                          background: "#f0f0f2",
                          padding: "8px 14px",
                        },
                        children: `#${tag}`,
                      },
                    })),
                  },
                },
                { type: "div", props: { children: `更新于 ${date}` } },
              ],
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
