<script lang="ts">
	import type { Snippet } from 'svelte';
	const { children, className = 'p-5 p-5' }: { children: Snippet; className?: string } = $props();

	const wl = 15; // squiggle width
	const amp = 20; // squiggle height
	const duration = '1s';
	const slope = (2 * amp) / wl;
	const period = wl * 2;

	let clientWidth = $state(0);
	let clientHeight = $state(0);
	let wRounded = $derived(clientWidth - ((clientWidth - 2 * amp) % period));
	let hRounded = $derived(clientHeight - ((clientHeight - 2 * amp) % period));

	interface corners_T {
		tl: corner_T;
		tr: corner_T;
		bl: corner_T;
		br: corner_T;
	}
	interface corner_T {
		f1: frame_T;
		f2: frame_T;
		f3: frame_T;
		f4: frame_T;
	}
	// p1 is absolute. p2-4 are relative to p1
	interface frame_T {
		p1: { x: number; y: number };
		p2: { x: number; y: number };
		p3: { x: number; y: number };
		p4: { x: number; y: number };
	}

	const keyframeToString = (f: unknown) =>
		`M${(f as frame_T).p1.x},${(f as frame_T).p1.y}` +
		`c${(f as frame_T).p2.x},${(f as frame_T).p2.y},` +
		`${(f as frame_T).p3.x},${(f as frame_T).p3.y},` +
		`${(f as frame_T).p4.x},${(f as frame_T).p4.y};`;

	const corners: corners_T = $derived({
		tl: {
			f1: {
				p1: { x: amp - 2, y: amp },
				p2: { x: 0, y: -2 },
				p3: { x: 0, y: -2 },
				p4: { x: 2, y: -2 }
			},
			f2: {
				p1: { x: amp / 2, y: amp },
				p2: { x: (amp * slope) / 4, y: -amp / 4 },
				p3: { x: amp / 4, y: (-amp * slope) / 4 - amp / 2 },
				p4: { x: amp / 2, y: -amp / 2 }
			},
			f3: {
				p1: { x: 2, y: amp },
				p2: { x: 0, y: -amp / 2 },
				p3: { x: amp / 2, y: 2 - amp },
				p4: { x: amp - 2, y: 2 - amp }
			},
			f4: {
				p1: { x: amp / 2, y: amp },
				p2: { x: -(amp * slope) / 4, y: -amp / 4 },
				p3: { x: amp / 4, y: (amp * slope) / 4 - amp / 2 },
				p4: { x: amp / 2, y: -amp / 2 }
			}
		},
		tr: {
			f1: {
				p1: { x: wRounded - amp, y: amp - 2 },
				p2: { x: amp / 2, y: 0 },
				p3: { x: amp - 2, y: -amp / 2 },
				p4: { x: amp - 2, y: 2 }
			},
			f2: {
				p1: { x: wRounded - amp, y: amp / 2 },
				p2: { x: amp / 4, y: (slope * amp) / 4 },
				p3: { x: amp / 2 - (slope * amp) / 4, y: amp / 4 },
				p4: { x: amp / 2, y: amp / 2 }
			},
			f3: {
				p1: { x: wRounded - amp, y: 2 },
				p2: { x: amp / 2, y: 0 },
				p3: { x: 2, y: amp / 2 },
				p4: { x: 2, y: amp - 2 }
			},
			f4: {
				// mid left
				p1: { x: wRounded - amp, y: amp / 2 },
				p2: { x: amp / 4, y: -(slope * amp) / 4 },
				p3: { x: amp / 2 + (slope * amp) / 4, y: -amp / 4 },
				p4: { x: amp / 2, y: amp / 2 }
			}
		},
		bl: {
			f1: {
				p1: { x: amp - 2, y: hRounded - amp },
				p2: { x: 0, y: amp / 2 },
				p3: { x: -amp / 2, y: amp - 2 },
				p4: { x: 2, y: amp - 2 }
			},
			f2: {
				p1: { x: amp / 2, y: hRounded - amp },
				p2: { x: -(slope * amp) / 4, y: amp / 4 },
				p3: { x: amp / 4, y: amp / 2 + (slope * amp) / 4 },
				p4: { x: amp / 2, y: amp / 2 }
			},
			f3: {
				p1: { x: 2, y: hRounded - amp },
				p2: { x: 0, y: amp / 2 },
				p3: { x: amp / 2, y: 2 },
				p4: { x: amp - 2, y: 2 }
			},
			f4: {
				p1: { x: amp / 2, y: hRounded - amp },
				p2: { x: (slope * amp) / 4, y: amp / 4 },
				p3: { x: amp / 4, y: amp / 2 - (slope * amp) / 4 },
				p4: { x: amp / 2, y: amp / 2 }
			}
		},
		br: {
			f1: {
				p1: { x: wRounded - amp, y: hRounded - 2 },
				p2: { x: amp / 2, y: 0 },
				p3: { x: amp - 2, y: -amp / 2 },
				p4: { x: amp - 2, y: 2 - amp }
			},
			f2: {
				//med left
				p1: { x: wRounded - amp, y: hRounded - amp / 2 },
				p2: { x: amp / 4, y: -(slope * amp) / 4 },
				p3: { x: amp / 2 + (slope * amp) / 4, y: -amp / 4 },
				p4: { x: amp / 2, y: -amp / 2 }
			},
			f3: {
				p1: { x: wRounded - amp, y: hRounded - amp + 2 },
				p2: { x: 2, y: 0 },
				p3: { x: 2, y: 0 },
				p4: { x: 2, y: -2 }
			},
			f4: {
				p1: { x: wRounded - amp, y: hRounded - amp / 2 },
				p2: { x: amp / 4, y: (slope * amp) / 4 },
				p3: { x: amp / 2 - (slope * amp) / 4, y: -amp / 4 },
				p4: { x: amp / 2, y: -amp / 2 }
			}
		}
	});
</script>

<div class="relative {className}" bind:clientWidth bind:clientHeight>
	<div class="relative" style="top: {(hRounded - clientHeight) / 2}px;">
		{@render children()}		
	</div>

	<svg viewBox="0 0 {wRounded} {hRounded}" class="absolute inset-0 z-[-1]">
		<defs>
			<!-- top -->
			<pattern id="tpattern" width={2 * wl} height={amp} patternUnits="userSpaceOnUse" x={amp - wl}>
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
						repeatCount="indefinite"
					/>
				</path>
			</pattern>
			<!-- bottom -->
			<pattern
				id="bpattern"
				width={2 * wl}
				height={amp}
				patternUnits="userSpaceOnUse"
				x={amp - wl}
				y={hRounded}
			>
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
						repeatCount="indefinite"
					/>
				</path>
			</pattern>
			<!-- left -->
			<pattern id="lpattern" width={amp} height={2 * wl} patternUnits="userSpaceOnUse" y={amp - wl}>
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
						repeatCount="indefinite"
					/>
				</path>
			</pattern>
			<!-- right -->
			<pattern
				id="rpattern"
				width={amp}
				height={2 * wl}
				patternUnits="userSpaceOnUse"
				y={amp - wl}
				x={wRounded}
			>
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
						repeatCount="indefinite"
					/>
				</path>
			</pattern>
		</defs>

		<!-- top -->
		<rect x={amp} width={Math.abs(wRounded - 2 * amp)} height={amp} fill="url(#tpattern)" />
		<!-- bottom -->
		<rect
			x={amp}
			y={hRounded - amp}
			width={Math.abs(wRounded - 2 * amp)}
			height={amp}
			fill="url(#bpattern)"
		/>
		<!-- left -->
		<rect y={amp} height={Math.abs(hRounded - 2 * amp)} width={amp} fill="url(#lpattern)" />
		<!-- right -->
		<rect
			x={wRounded - amp}
			y={amp}
			height={Math.abs(hRounded - 2 * amp)}
			width={amp}
			fill="url(#rpattern)"
		/>

		<!-- corners -->
		{#each Object.values(corners) as c, i (i)}
			<path
				class="fill-transparent stroke-main-orange stroke-2"
				stroke-width="2"
				stroke-linecap="round"
			>
				<animate
					attributeName="d"
					dur={duration}
					repeatCount="indefinite"
					values="
               {Object.values(c).map(keyframeToString).join('\n') + keyframeToString(c.f1)}"
					calcMode="spline"
					keySplines="0.5 0 0.75 0.5; 
                        0.25 0.5 0.5 1;
                        0.5 0 0.75 0.5; 
                        0.25 0.5 0.5 1;"
					keyTimes="0;0.25;0.5;0.75;1"
				/>
			</path>
		{/each}
	</svg>
</div>
