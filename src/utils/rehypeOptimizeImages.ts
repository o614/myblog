import path from "node:path";
import sharp from "sharp";

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

/**
 * Adds stable dimensions and sensible loading hints to local Markdown images.
 * This keeps article screenshots from shifting the page while they load and
 * avoids downloading every image in a long tutorial up front.
 */
export function rehypeOptimizeImages() {
  return async (tree: HastNode) => {
    const images: HastNode[] = [];

    const wrapStandaloneImages = (node: HastNode) => {
      if (!node.children) return;

      node.children = node.children.map(child => {
        const meaningfulChildren = child.children?.filter(
          item => item.type !== "text" || item.value?.trim()
        );
        const image = meaningfulChildren?.[0];
        const alt = image?.properties?.alt;

        if (
          child.type === "element" &&
          child.tagName === "p" &&
          meaningfulChildren?.length === 1 &&
          image?.type === "element" &&
          image.tagName === "img" &&
          typeof alt === "string" &&
          alt.trim()
        ) {
          return {
            type: "element",
            tagName: "figure",
            properties: {},
            children: [
              image,
              {
                type: "element",
                tagName: "figcaption",
                properties: {},
                children: [{ type: "text", value: alt.trim() }],
              },
            ],
          };
        }

        wrapStandaloneImages(child);
        return child;
      });
    };

    wrapStandaloneImages(tree);

    const collectImages = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "img") {
        images.push(node);
      }
      node.children?.forEach(collectImages);
    };

    collectImages(tree);

    await Promise.all(
      images.map(async (image, index) => {
        const properties = (image.properties ??= {});
        const src = properties.src;

        properties.decoding ??= "async";
        if (index === 0) {
          properties.loading ??= "eager";
          properties.fetchPriority ??= "high";
        } else {
          properties.loading ??= "lazy";
        }

        if (
          typeof src !== "string" ||
          !src.startsWith("/") ||
          src.startsWith("//") ||
          properties.width ||
          properties.height
        ) {
          return;
        }

        const sourcePath = path.join(
          process.cwd(),
          "public",
          src.replace(/^\/+/, "")
        );

        try {
          const metadata = await sharp(sourcePath).metadata();
          if (metadata.width && metadata.height) {
            properties.width = metadata.width;
            properties.height = metadata.height;
          }
        } catch {
          // Leave remote, generated, or missing assets untouched.
        }
      })
    );
  };
}
