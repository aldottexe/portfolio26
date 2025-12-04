<script lang="ts">
	import type { Action } from 'svelte/action';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/Addons.js';
	import { material } from './GlassMaterial';
	import html2canvas from 'html2canvas';
	import { onDestroy } from 'svelte';

	const { primaryC = '#4964D1', accentC = '#bfc9ef' }: { primaryC: string; accentC: string } =
		$props();

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(120, 1, 0.1, 1000);
	camera.position.z = 7;
	scene.add(camera);

	const light = new THREE.PointLight(0xffffff, 10);
	light.position.set(0, 0, 2);
	scene.add(light);
	scene.add(new THREE.PointLightHelper(light));

	scene.add(new THREE.AmbientLight(0xffffff, 1));

	const mat = material;
	let renderer: THREE.WebGLRenderer;

	async function createScene(node: HTMLCanvasElement) {
		renderer = new THREE.WebGLRenderer({ antialias: false, canvas: node, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);

		window.setTimeout(async () => {
			const c = await html2canvas(document.body, {
				x: 0,
				y: window.scrollY, // ✅ THIS is the correct offset
				width: window.innerWidth,
				height: window.innerHeight,
				scale: window.devicePixelRatio,
				windowWidth: document.documentElement.clientWidth,
				windowHeight: document.documentElement.clientHeight,

				ignoreElements: (el) => el.hasAttribute('data-three-glass')
			});
			const domTexture = new THREE.CanvasTexture(c);
			domTexture.needsUpdate = true;
			mat.uniforms.screenTex.value = domTexture;
			mat.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
			mat.needsUpdate = true;
		}, 100);

		// const oc = new OrbitControls(camera, node);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		const mesh = (await new GLTFLoader().loadAsync('ovallogo.glb')).scene;
		mesh.rotateX(Math.PI / 2);
		const scale = 6;
		mesh.scale.set(scale, scale, scale);
		mesh.traverse((o) => {
			if (o.isMesh) {
				o.material = mat;
			}
		});
		scene.add(mesh);
		console.log(mesh);

		const timer = new THREE.Timer();
		renderer.setAnimationLoop(() => {
			const d = timer.getDelta();
			mesh.rotateZ(d);
			renderer.render(scene, camera);
			timer.update();
		});

		let to = 0;
		window.addEventListener('scroll', () => {
			window.clearTimeout(to);

			to = window.setTimeout(async () => {
				const c = await html2canvas(document.body, {
					x: 0,
					y: window.scrollY, // ✅ THIS is the correct offset
					width: window.innerWidth,
					height: window.innerHeight,
					scale: window.devicePixelRatio,
					windowWidth: document.documentElement.clientWidth,
					windowHeight: document.documentElement.clientHeight,

					ignoreElements: (el) => el.hasAttribute('data-three-glass')
				});

				mat.uniforms.screenTex.value.image = c;
				mat.uniforms.screenTex.value.needsUpdate = true;
			}, 100);
		});
	}
	const setup: Action<HTMLCanvasElement> = (node) => {
		createScene(node);
	};
	onDestroy(() => {
		renderer?.dispose();
		scene.traverse((obj) => {
			if (obj.geometry) obj.geometry.dispose();
			if (obj.material) {
				if (obj.material.map) obj.material.map.dispose();
				obj.material.dispose();
			}
		});
	});
</script>

<canvas
	use:setup
	class="pointer-events-none fixed top-0 left-0 z-[2] h-screen w-screen"
	data-three-glass
></canvas>

<style>
	canvas {
	}
</style>
