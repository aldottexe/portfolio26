import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }) => {

   const slug = params.slug;

   let post;
   try {
      post = await import(`../../lib/blogPosts/${slug}.md`);
   } catch (err) {
      throw new Error(`project not found: ${slug}
${err}`,);
   }


   return {
      component: post.default,
      metadata: post.metadata ?? {}
   };
}
