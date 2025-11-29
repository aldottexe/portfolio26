export const load = async () => {
   // Grab all markdown/mdsvex posts recursively
   const modules = import.meta.glob('/src/lib/projects/*.md');

   // type pages_T = Array<[string, Record<string, unknown> | undefined]>
   //
   // const pages: pages_T = []

   type MarkdownModule_T = {
      metadata?: Record<string, unknown>;
      default: unknown;
   };
   type projects_T = {
      metadata?: Record<string, unknown>;
      slug: string;
   }[];

   // Load metadata and compute slugs
   const projects: projects_T = await Promise.all(
      Object.entries(modules).map(async ([path, resolver]) => {
         const { metadata } = await resolver() as MarkdownModule_T

         // Create a slug relative to /src/lib/posts/
         const slug = path
            .replace('/src/lib/projects/', '')
            .replace(/\.md$/, '');

         return {
            slug,
            metadata,
         };
      })
   );

   return { projects };
}
