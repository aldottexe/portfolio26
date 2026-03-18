<script lang="ts">
	import type { Action } from 'svelte/action';
	import Pill from './Pill.svelte';

	export type skillList = {
		name: string;
		categories: string[];
	}[];

	interface node_T {
		name: string;
		x: number;
		y: number;
		vx: number;
		vy: number;
		isCategory: boolean;
	}

	const { skills }: { skills: skillList } = $props();

	let width = $state(500);
	let height = $state(500);

	let skillNodes: node_T[] = $state(
		skills.map((skill) => ({
			name: skill.name,
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			isCategory: false
		}))
	);

	let categoryNodes: node_T[] = $derived.by(() => {
		const categories = new Set(skills.flatMap((s) => s.categories));
		return Array.from(categories).map((c) => ({
			name: c,
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			isCategory: true
		}));
	});

	let nodes: node_T[] = $state([...categoryNodes, ...skillNodes]);

	interface edge_T {
		category: node_T;
		skill: node_T;
	}
	let edges: edge_T[] = $derived(
		skills.flatMap((s) => {
			const skillNodeIndex = nodes.find((sn) => sn.name === s.name);
			return s.categories.map((c) => ({
				category: nodes.find((cn) => cn.name === c)!,
				skill: skillNodeIndex!
			}));
		})
	);

	const options = {
		repultion: 3000,
		attraction: 0.01,
		damping: 0.8,
		idealLength: 100,
		centerAttraction: 0.012,
		idealLengthFromCenter: 50
	};

	function step() {
		// repulsive forces
		nodes.forEach((a) => {
			nodes.forEach((b) => {
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
				const force = options.repultion / (dist * dist);
				// get the components of the force by multiplying it by
				// that component's propotion
				const fx = force * (dx / dist);
				const fy = force * (dy / dist);

				// give each point opposing forces
				a.vx -= fx;
				a.vy -= fy;

				b.vx += fx;
				b.vy += fy;
			});
		});

		// attractive forces
		edges.forEach(({ category, skill }) => {
			const dx = skill.x - category.x;
			const dy = skill.y - category.y;
			const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
			const force = options.attraction * (dist - options.idealLength);
			const fx = (dx / dist) * force;
			const fy = (dy / dist) * force;
			skill.vx -= fx;
			skill.vy -= fy;
			category.vx += fx;
			category.vy += fy;
		});

		nodes.forEach((node) => {
			// coerse towards center
			const dx = node.x - width / 2;
			const dy = node.y - height / 2;
			// const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
			// const force = options.centerAttraction * (dist - options.idealLengthFromCenter);
			// const fx = ((dx / dist) * force) / (window.innerWidth / window.innerHeight);
			// const fy = (dy / dist) * force;

			const aspect = width / height;

			const fx = (dx * options.centerAttraction) / aspect;
			const fy = dy * options.centerAttraction;

			node.vx -= fx;
			node.vy -= fy;

			// Apply velocity
			node.vx *= options.damping;
			node.vy *= options.damping;
			node.x += node.vx;
			node.y += node.vy;
			// node.x = Math.min(Math.max(node.x, 0), width);
			// node.y = Math.min(Math.max(node.y, 0), height);
		});
	}

	// let frames = 999;

	function animate() {
		step();
		// frames--;
		// if (frames)
		requestAnimationFrame(animate);
	}

	const graph: Action<HTMLDivElement> = (e) => {
		nodes = nodes.map((node) => ({
			...node,
			x: Math.random() * e.clientWidth,
			y: Math.random() * e.clientHeight
		}));
		animate();
	};

	let selectedName = $state('');
	function showNode(node: node_T): boolean {
		return (
			selectedName === '' ||
			selectedName === node.name ||
			Boolean(edges.find((e) => e.skill.name === node.name && e.category.name === selectedName))
		);
	}
	function showEdge(edge: edge_T): boolean {
		return (
			selectedName === '' || edge.skill.name === selectedName || edge.category.name === selectedName
		);
	}
</script>

<div class="relative h-150" use:graph bind:clientWidth={width} bind:clientHeight={height}>
	<svg
		class="absolute"
		{width}
		{height}
		onclick={(e) => {
			selectedName = '';
		}}
	>
		{#each edges as edge, i (i)}
			{@const show = showEdge(edge)}
			<line
				x1={edge.category.x}
				y1={edge.category.y}
				x2={edge.skill.x}
				y2={edge.skill.y}
				style="stroke-width:3; opacity: 0.2;"
				style:stroke={show ? 'var(--color-main-orange)' : 'var(--color-main-white)'}
			></line>
		{/each}
	</svg>
	{#each nodes as node (node.name)}
		<button
			onmousemove={(e) => {
				const rect = e.currentTarget.getBoundingClientRect();
				node.vx += (rect.x - e.x + rect.width / 2) / 50;
				node.vy += (rect.y - e.y + rect.height / 2) / 50;
			}}
			onclick={() => (selectedName = node.name)}
			class="absolute transition-opacity"
			style:top="{node.y}px"
			style:left="{node.x}px"
			style:transform="translate(-50%, -50%)"
			style={showNode(node) ? 'opacity: 1' : 'opacity: 0.5; filter: saturate(0)'}
		>
			<Pill big={node.isCategory}>{node.name}</Pill>
		</button>
	{/each}
</div>
