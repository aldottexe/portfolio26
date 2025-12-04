<script lang="ts">
	import type { Action } from 'svelte/action';
	import * as THREE from 'three';
	import { GLTFLoader, RenderPass, RGBShiftShader, ShaderPass } from 'three/examples/jsm/Addons.js';
	import { EffectComposer } from 'three/examples/jsm/Addons.js';
	import { getDistortionShaderDefinition } from './fisheye';
	import { onDestroy } from 'svelte';

	const { primaryC = '#4964D1', accentC = '#bfc9ef' }: { primaryC: string; accentC: string } =
		$props();

	let renderer: THREE.WebGLRenderer;
	let composer: EffectComposer;
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
	camera.position.z = 10;

	const light = new THREE.PointLight(0xffffff, 50);
	light.position.set(0, 0, 6);
	scene.add(light);
	// scene.add(new THREE.PointLightHelper(light));

	const gl = new THREE.AmbientLight(0xffffff, 1);
	scene.add(gl);

	const mouse = new THREE.Vector2(9999, 9999);

	// effectively onResize
	function resize() {
		renderer?.setSize(window.innerWidth, window.innerHeight);
		composer?.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
	const gray = new THREE.Color(primaryC);

	async function createScene(node: HTMLCanvasElement) {
		console.log('Initial size:', window.innerWidth, window.innerHeight);
		renderer = new THREE.WebGLRenderer({ antialias: true, canvas: node });

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(gray);
		renderer.setPixelRatio(window.devicePixelRatio);

		camera.aspect = window.innerWidth / window.innerHeight;
		scene.add(camera);

		const logo = (await new GLTFLoader().loadAsync('/ovallogo.glb')).scene.children[0];

		logo.rotateX(Math.PI / 2);
		const scale = 100;

		const mat = new THREE.MeshStandardMaterial();
		logo.traverse((m) => {
			if (m.isMesh) {
				m.material = mat;
			}
		});
		console.log(logo);

		logo.scale.set(scale, scale, scale);
		scene.add(logo);

		///////////////////////////////// effects ////////////////////////////////////////////////////
		composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(scene, camera));

		const effect = new ShaderPass(getDistortionShaderDefinition());
		composer.addPass(effect);

		// Setup distortion effect
		var strength = 0.5;
		var cylindricalRatio = 1;
		var height = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) / camera.aspect;

		// camera.fov = (Math.atan(height) * 2 * 180) / 3.1415926535;
		camera.updateProjectionMatrix();

		effect.uniforms['strength'].value = strength;
		effect.uniforms['height'].value = height;
		effect.uniforms['aspectRatio'].value = camera.aspect;
		effect.uniforms['cylindricalRatio'].value = cylindricalRatio;

		const effect2 = new ShaderPass(RGBShiftShader);
		effect2.uniforms['amount'].value = 0.001;
		composer.addPass(effect2);

		// composer.addPass(new OutputPass());

		const timer = new THREE.Timer();
		const animate = () => {
			const d = timer.getDelta();
			logo.rotateZ(d);

			composer.render();
			timer.update();
		};
		renderer.setAnimationLoop(() => animate());
	}

	////////////////////////////////////////////////////////////////////////////////////////////////

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

<svelte:window
	onmousemove={(e) =>
		mouse.set((e.x / window.innerWidth) * 2 - 1, -(e.y / window.innerHeight) * 2 + 1)}
	onresize={resize}
/>
<canvas use:setup class="fixed top-0 left-0 z-[-2] h-screen w-screen"></canvas>

<style>
	canvas {
		image-rendering: pixelated;
	}
</style>
