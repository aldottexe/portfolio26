type projects_T = {
   metadata?: Record<string, unknown>;
   slug: string;
}[];

export type ProjectsLoader_T = () => Promise<{ projects: projects_T }>;

export default function(modules: Record<string, () => Promise<unknown>>): ProjectsLoader_T {
   return async () => {
      // Grab all markdown/mdsvex posts recursively

      // type pages_T = Array<[string, Record<string, unknown> | undefined]>
      //
      // const pages: pages_T = []

      type MarkdownModule_T = {
         metadata?: Record<string, unknown>;
         default: unknown;
      };

      // Load metadata and compute slugs
      const projects: projects_T = await Promise.all(
         Object.entries(modules).map(async ([path, resolver]) => {
            const { metadata } = await resolver() as MarkdownModule_T

            // Create a slug relative to /src/lib/posts/
            const slug = path
               .replace(/\/.*\//, '')
               .replace(/\.md$/, '');

            return {
               slug,
               metadata,
            };
         })
      );

      return { projects };
   }
}
