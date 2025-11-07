import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {

  const slug = params.slug;

  let post;
  try {
    post = await import(`../../../lib/projects/${slug}.md`);
  } catch (err) {
    throw new Error(`project not found: ${slug}
${err}`,);
  }
  console.log(post);


  return {
    component: post.default,
    metadata: post.metadata ?? {}
  };
}
