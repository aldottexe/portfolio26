<script lang="ts">
	import type { Snippet } from 'svelte';
	const { children }: { children: Snippet } = $props();

	const wl = 20; // squiggle width
	const amp = 20; // squiggle height
	const duration = '1s';

	const period = wl * 2;

	let clientWidth = $state(0);
	let clientHeight = $state(0);
	let wRounded = $derived(clientWidth - (clientWidth % period) + period);
	let hRounded = $derived(clientHeight - (clientHeight % period) + period);

	// let tb: string = $state();
	// let lr: string = $state();
	$effect(() => {
		let horizontalBorder = 'M2,2 ';
		for (let i = 0; i < clientWidth / wl + 1; i++) {
			horizontalBorder += !(i % 2)
				? `c${wl / 2},0,${wl / 2},${amp},${wl},${amp} `
				: `c${wl / 2},0,${wl / 2},-${amp},${wl},-${amp} `;
		}
		// tb = horizontalBorder;
	});
</script>

<div class="relative w-fit p-5" bind:clientWidth bind:clientHeight>
	{@render children()}
	<svg viewBox="0 0 {wRounded} {hRounded}" class="absolute inset-0 z-[-1]">
		<defs>
			<!-- top -->
			<pattern id="tpattern" width={2 * wl} height={amp} patternUnits="userSpaceOnUse">
				<path
					class="fill-transparent stroke-main-orange stroke-2"
					stroke-width="2"
					d="
					M{-2 * wl},2
						c{wl / 2},0,{wl / 2},{amp - 4},{wl},{amp - 4} 
						c{wl / 2},0,{wl / 2},-{amp - 4},{wl},-{amp - 4}
						c{wl / 2},0,{wl / 2},{amp - 4},{wl},{amp - 4} 
						c{wl / 2},0,{wl / 2},-{amp - 4},{wl},-{amp - 4}"
				>
					<animateTransform
						attributeName="transform"
						type="translate"
						to="{wl * 2}, 0"
						dur={duration}
						repeatDur="indefinite"
					/>
				</path>
			</pattern>
			<!-- bottom -->
			<pattern id="bpattern" width={2 * wl} height={amp} patternUnits="userSpaceOnUse">
				<path
					class="fill-transparent stroke-main-orange stroke-2"
					stroke-width="2"
					d="
					M0,2
						c{wl / 2},0,{wl / 2},{amp - 4},{wl},{amp - 4} 
						c{wl / 2},0,{wl / 2},-{amp - 4},{wl},-{amp - 4}
						c{wl / 2},0,{wl / 2},{amp - 4},{wl},{amp - 4} 
						c{wl / 2},0,{wl / 2},-{amp - 4},{wl},-{amp - 4}"
				>
					<animateTransform
						attributeName="transform"
						type="translate"
						to="{-wl * 2}, 0"
						dur={duration}
						repeatDur="indefinite"
					/>
				</path>
			</pattern>
			<!-- left -->
			<pattern id="lpattern" width={amp} height={2 * wl} patternUnits="userSpaceOnUse">
				<path
					class="fill-transparent stroke-main-orange stroke-2"
					stroke-width="2"
					d="
					M2, 0
					c0,{wl / 2},{amp - 4},{wl / 2},{amp - 4},{wl}
					c0,{wl / 2},-{amp - 4},{wl / 2},-{amp - 4},{wl}
					c0,{wl / 2},{amp - 4},{wl / 2},{amp - 4},{wl}
					c0,{wl / 2},-{amp - 4},{wl / 2},-{amp - 4},{wl}
					"
				>
					<animateTransform
						attributeName="transform"
						type="translate"
						to="0,{-wl * 2}"
						dur={duration}
						repeatDur="indefinite"
					/>
				</path>
			</pattern>
			<!-- right -->
			<pattern id="rpattern" width={amp} height={2 * wl} patternUnits="userSpaceOnUse">
				<path
					class="fill-transparent stroke-main-orange stroke-2"
					stroke-width="2"
					d="
					M2, {-2 * wl}
					c0,{wl / 2},{amp - 4},{wl / 2},{amp - 4},{wl}
					c0,{wl / 2},-{amp - 4},{wl / 2},-{amp - 4},{wl}
					c0,{wl / 2},{amp - 4},{wl / 2},{amp - 4},{wl}
					c0,{wl / 2},-{amp - 4},{wl / 2},-{amp - 4},{wl}
					"
				>
					<animateTransform
						attributeName="transform"
						type="translate"
						to="0,{wl * 2}"
						dur={duration}
						repeatDur="indefinite"
					/>
				</path>
			</pattern>
		</defs>
		<!-- top -->
		<rect x={amp} width={wRounded - 2 * amp} height={amp} fill="url(#tpattern)" />
		<!-- bottom -->
		<rect
			x={amp}
			y={hRounded - amp}
			width={wRounded - 2 * amp}
			height={amp}
			fill="url(#bpattern)"
		/>
		<!-- left -->
		<rect y={amp} height={hRounded - 2 * amp} width={amp} fill="url(#lpattern)" />
		<!-- right -->
		<rect
			x={wRounded - amp}
			y={amp}
			height={hRounded - 2 * amp}
			width={amp}
			fill="url(#rpattern)"
		/>
		<!-- tl-->
		<path class="fill-transparent stroke-main-orange stroke-2" stroke-width="2">
			<animate
				attributeName="d"
				dur={duration}
				repeatDur="indefinite"
				values="
					M{amp - 2},{amp}
					C{amp - 2},{amp - 2},{amp - 2},{amp - 2},{amp},{amp - 2};
					M2,{amp}
					C2,{amp / 2},{amp / 2} ,2,{amp},2;
					M{amp - 2},{amp}
					C{amp - 2},{amp - 2},{amp - 2},{amp - 2},{amp},{amp - 2};
						"
				calcMode="spline"
				keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
				keyTimes="0;0.5;1"
			/>
		</path>
	</svg>
</div>
