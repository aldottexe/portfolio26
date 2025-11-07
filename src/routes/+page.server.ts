export const load = async () => {
	// Grab all markdown/mdsvex posts recursively
	const modules = import.meta.glob('/src/lib/projects/**/*.md');

	interface files { subdirs: { [key: string]: files }, pages: { [key: string]: [string, Record<string, unknown> | undefined] } }

	const structure: files = { subdirs: {}, pages: {} }

	type MarkdownModule = {
		metadata?: Record<string, unknown>;
		default: unknown;
	};

	function structurePost(path: string, metadata: Record<string, unknown> | undefined) {
		const parts = path.split('/');
		let head: files = structure;
		while (parts.length > 1) {
			const part: string = parts.shift() ?? ""
			if (!head.subdirs[part]) {
				head.subdirs[part] = { subdirs: {}, pages: {} };
			}
			head = head.subdirs[part];
		}
		const filename: string = parts.shift() ?? ""
		head.pages[filename] = [path, metadata]
	}


	// Load metadata and compute slugs
	const posts = await Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const { metadata } = await resolver() as MarkdownModule

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
	posts.forEach(post => {
		structurePost(post.slug, post.metadata);
	});

	return { structure };
}
