import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Tag = {
  tag: string;
  tagName: string;
};

const FIXED_TAGS = ["AI", "Apple", "Google"] as const;

/**
 * Builds a de-duplicated tag list from posts and the fixed blog categories.
 *
 * - The fixed categories stay visible even before they have published posts.
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - `tag` is the slug used in URLs; `tagName` is the display label
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueTags(posts: CollectionEntry<"posts">[]) {
  const tags: Tag[] = [
    ...FIXED_TAGS.map(tagName => ({
      tag: slugifyStr(tagName),
      tagName,
    })),
    ...posts
      .filter(postFilter)
      .flatMap(post => post.data.tags)
      .map(tag => ({ tag: slugifyStr(tag), tagName: tag })),
  ]
    .filter(
      (value, index, self) =>
        self.findIndex(tag => tag.tag === value.tag) === index
    )
    .sort((tagA, tagB) => {
      const fixedIndexA = FIXED_TAGS.findIndex(
        fixedTag => slugifyStr(fixedTag) === tagA.tag
      );
      const fixedIndexB = FIXED_TAGS.findIndex(
        fixedTag => slugifyStr(fixedTag) === tagB.tag
      );

      if (fixedIndexA !== -1 || fixedIndexB !== -1) {
        if (fixedIndexA === -1) return 1;
        if (fixedIndexB === -1) return -1;
        return fixedIndexA - fixedIndexB;
      }

      return tagA.tag.localeCompare(tagB.tag);
    });

  return tags;
}
