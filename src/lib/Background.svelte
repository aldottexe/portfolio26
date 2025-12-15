<script lang="ts">
	import type { Action } from 'svelte/action';
	import * as THREE from 'three';
	import {
		EffectComposer,
		FilmPass,
		GLTFLoader,
		RenderPass,
		ShaderPass
	} from 'three/examples/jsm/Addons.js';
	import { PostProcess } from './postProcessing';

	const resize = (
		renderer: THREE.WebGLRenderer,
		camera: THREE.PerspectiveCamera,
		compositor: EffectComposer
	) => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		compositor.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	};
	const init: Action<HTMLCanvasElement> = (canvas) => {
		const renderer = new THREE.WebGLRenderer({
			powerPreference: 'high-performance',
			canvas: canvas,
			antialias: false
		});
		renderer.setPixelRatio(devicePixelRatio);
		renderer.setClearColor(0x000000);

		const camera = new THREE.PerspectiveCamera();
		camera.position.setZ(2);
		camera.aspect = window.innerHeight / window.innerWidth;

		const scene = new THREE.Scene();
		scene.add(camera);
		// scene.add(new THREE.GridHelper());

		const ambient = new THREE.AmbientLight(0xffffff, 0.1);
		scene.add(ambient);
		const l = new THREE.PointLight(0xffffff, 10);
		l.position.set(1, 1, 3);
		scene.add(l);

		let logo: THREE.Group<THREE.Object3DEventMap> | undefined;
		new GLTFLoader().load('/ovallogo.glb', (m) => {
			logo = m.scene;
			const simpleMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffffff) });
			const scale = 0.3;
			logo.scale.set(scale, scale, scale);
			logo.rotateX(Math.PI / 2);
			logo.traverse((c) => {
				if (c.isMesh) {
					c.material = simpleMat;
				}
			});
			scene.add(logo);
		});

		const composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(scene, camera));
		const pp = PostProcess();
		pp.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
		const myEffect = new ShaderPass(pp);
		composer.addPass(myEffect);
		// composer.addPass(new FilmPass(0.9));

		resize(renderer, camera, composer);

		const t = new THREE.Timer();
		renderer.setAnimationLoop(() => {
			myEffect.uniforms.u_time.value = t.getElapsed();
			myEffect.needsSwap = true;

			logo?.rotateZ(t.getDelta() / 2);
			composer.render();
			t.update();
		});
	};
</script>

<canvas use:init class="fixed inset-0 z-[-1] h-screen w-screen [image-rendering:pixelated]"
></canvas>
