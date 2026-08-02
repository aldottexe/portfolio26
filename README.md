# Personal Portfolio

My full-stack web portfolio built with SvelteKit, Three.js, WebGL, Tailwind CSS, and MDsveX. Features interactive 3D visualizations, custom shader work, and a collection of design and development projects.

**Live:** [alexlutz.com](https://alexlutz.com)

## Explore the codebase
If you're intersted in looking around, here's some highlights:
### Threejs Background
The animated background that spans the website. The component persists through navigation to minimize load times, and changes state based on routing.

[Background.svelte](https://github.com/aldottexe/portfolio26/blob/main/src/lib/Background.svelte)
### Dynamic Animations
The border around the project section. It might seem subtle, but notice how it can scale in both height and width without deforming. And of course, it's paramentric. You can adjust the amplitude, wavelength, and period and the calculations will be handled automatically. Once the resize handler has completed, the border is just an animated SVG, so the performance impact is negligable. 

[Squiggle.svelte](https://github.com/aldottexe/portfolio26/blob/main/src/lib/squiggle.svelte)
### Post Processing
A WebGL post-processing shader that is the heart of the site's *vibes*.

[postprocessing.ts](https://github.com/aldottexe/portfolio26/blob/main/src/lib/postProcessing.ts)
### No libraries? No problem.
The feature component uses minimal js for state management, and all motion is done through vanilla css.

[FeaturePost.svelte](https://github.com/aldottexe/portfolio26/blob/main/src/lib/FeaturePost.svelte)
