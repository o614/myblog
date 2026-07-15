import { experimental_getFontFileURL, fontData } from "astro:assets";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";

export async function loadOgFonts(url: URL) {
  const fonts = fontData["--font-noto-sans-sc"];
  const regularFontPath = getFontPathByWeight(fonts, 400, {
    format: "woff",
  });
  const boldFontPath = getFontPathByWeight(fonts, 700, { format: "woff" });

  if (regularFontPath === undefined || boldFontPath === undefined) {
    throw new Error("Cannot find the Noto Sans SC font files for OG images.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(regularFontPath, url)).then(response =>
      response.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldFontPath, url)).then(response =>
      response.arrayBuffer()
    ),
  ]);

  return [
    {
      name: "Noto Sans SC",
      data: regularData,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Noto Sans SC",
      data: boldData,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}
