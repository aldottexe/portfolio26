import MdGlobImporter from "$lib/MdGlobImporter";

// provides md info for the project list widget
export const load = MdGlobImporter(import.meta.glob('/src/lib/blogs/*.md'));
