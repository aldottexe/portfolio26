<script lang="ts">
	import type { Action } from 'svelte/action';
	import * as THREE from 'three';
	import {
		GLTFLoader,
		OutputPass,
		RenderPass,
		RGBShiftShader,
		ShaderPass
	} from 'three/examples/jsm/Addons.js';
	import { EffectComposer } from 'three/examples/jsm/Addons.js';
	import { getDistortionShaderDefinition } from './fisheye';
	import { onDestroy } from 'svelte';

	const { primaryC = '#4964D1', accentC = '#bfc9ef' }: { primaryC: string; accentC: string } =
		$props();

	let renderer: THREE.WebGLRenderer;
	let composer: EffectComposer;
	let scene = new THREE.Scene();

	let camera = new THREE.PerspectiveCamera(120, 1, 0.1, 1000);
	camera.position.z = 7;

	let mat = new THREE.MeshBasicMaterial({ name: 'base', color: '#FFF' });

	const mouse = new THREE.Vector2(9999, 9999);
	const rc = new THREE.Raycaster();
	const tempMtrx = new THREE.Matrix4();

	let parts: THREE.InstancedMesh[] = [];

	function alignPatternToScreen(part: THREE.InstancedMesh) {
		const bounds = { tl: new THREE.Vector2(), br: new THREE.Vector2() };
		camera.getViewBounds(20, bounds.tl, bounds.br);
		part.position.setX(bounds.tl.x);
		part.position.setY(-bounds.tl.y / 2);
	}

	// effectively onResize
	function resize() {
		renderer?.setSize(window.innerWidth, window.innerHeight);
		composer?.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		parts.forEach((p) => alignPatternToScreen(p));
	}
	let accent = new THREE.Color(accentC);
	// const gray = new THREE.Color('#ec4e20');
	const gray = new THREE.Color(primaryC);

	async function createScene(node: HTMLCanvasElement) {
		console.log('Initial size:', window.innerWidth, window.innerHeight);
		renderer = new THREE.WebGLRenderer({ depth: false, antialias: true, canvas: node });

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(gray);
		renderer.setPixelRatio(window.devicePixelRatio);

		camera.aspect = window.innerWidth / window.innerHeight;
		scene.add(camera);

		const logo = (await new GLTFLoader().loadAsync('/logo.glb')).scene;

		const w = 20;
		const h = 20;

		//theres three meshes that makeup the logo
		logo.children.forEach((c) => {
			// make enough instances to fill the screen
			const part = new THREE.InstancedMesh(c.geometry, mat, w * h);
			part.rotateX(Math.PI / 2);
			part.rotateY(-Math.PI / 2);
			const scale = 1.2;
			part.scale.set(scale, scale, scale);

			for (let j = 0; j < part.count; j++) {
				part.getMatrixAt(j, tempMtrx);
				part.setMatrixAt(j, tempMtrx.makeTranslation(Math.floor(j / w) * 2, 0, -(j % w) * 5));
				part.setColorAt(j, gray);
			}
			scene.add(part);
			parts.push(part);
		});

		///////////////////////////////// effects ////////////////////////////////////////////////////
		composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(scene, camera));

		// const bloomPass = new BloomPass(
		// 	0.5, // strength
		// 	10, // kernel size
		// 	2 // sigma ?
		// );
		// composer.addPass(bloomPass);

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
		effect2.uniforms['amount'].value = 0.002;
		composer.addPass(effect2);

		composer.addPass(new OutputPass());

		parts.forEach((p) => {
			alignPatternToScreen(p);
		});
		renderer.setAnimationLoop(() => animate(parts));
	}

	////////////////////////////////////////////////////////////////////////////////////////////////
	const tempC = new THREE.Color();
	// const accent = new THREE.Color(0x4964d1);

	const tempPos = new THREE.Vector3();
	const tempScl = new THREE.Vector3();
	const tempRos = new THREE.Quaternion();

	const animate = (parts: THREE.InstancedMesh[]) => {
		rc.setFromCamera(mouse, camera);
		parts.forEach((part) => {
			//bring all colors back to gray
			for (let i = 0; i < part.count; i++) {
				part.getColorAt(i, tempC);
				tempC.r = tempC.r + (gray.r - tempC.r) / 40;
				tempC.g = tempC.g + (gray.g - tempC.g) / 40;
				tempC.b = tempC.b + (gray.b - tempC.b) / 40;
				part.setColorAt(i, tempC);
				part.getMatrixAt(i, tempMtrx);
				tempMtrx.decompose(tempPos, tempRos, tempScl);
				tempPos.setY(tempPos.y / 1.1);
				part.setMatrixAt(i, tempMtrx.compose(tempPos, tempRos, tempScl));
			}

			//raycast stuff
			const intersect = rc.intersectObject(part);
			if (intersect.length > 0) {
				const instanceID = intersect[0].instanceId || 0;
				part.setColorAt(instanceID, accent);
				part.getMatrixAt(instanceID, tempMtrx);
				tempMtrx.decompose(tempPos, tempRos, tempScl);
				tempPos.setY(-0.1);
				part.setMatrixAt(instanceID, tempMtrx.compose(tempPos, tempRos, tempScl));
			}

			if (part.instanceColor) part.instanceColor.needsUpdate = true;
			if (part.instanceMatrix) part.instanceMatrix.needsUpdate = true;
		});
		composer.render();
	};

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
<!-- <div class="fixed h-full w-full"></div> -->
<canvas use:setup class="fixed top-0 left-0 z-[-2] h-screen w-screen"></canvas>

<style>
	div {
		z-index: -1;
		mask: radial-gradient(#00000022, #000000ff);
		/* background-color: #00000088; */
		backdrop-filter: blur(2px);
	}
</style>
