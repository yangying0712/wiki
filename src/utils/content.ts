/**
 * 将 Astro 5.x 的 content collection id 转换为 URL-friendly 的 slug
 * Astro 5.x 中 id 包含文件扩展名 (如 "shen-mo.mdx")
 * 此函数移除扩展名以生成干净的 URL slug
 */
export function idToSlug(id: string): string {
  return id.replace(/\.(mdx?|md)$/, '');
}
