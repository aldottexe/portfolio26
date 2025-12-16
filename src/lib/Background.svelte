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
	import { myMat } from './myMat';

	const init: Action<HTMLCanvasElement> = (canvas) => {
		const renderer = new THREE.WebGLRenderer({
			powerPreference: 'high-performance',
			canvas: canvas,
			antialias: false
		});
		renderer.setPixelRatio(devicePixelRatio);
		renderer.setClearColor(0x000000);

		const camera = new THREE.PerspectiveCamera();
		camera.near = 0.001;
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

		const simpleMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffffff) });
		let logo: THREE.Group<THREE.Object3DEventMap> | undefined;
		new GLTFLoader().load('/ovallogo.glb', (m) => {
			logo = m.scene;
			const scale = 0.3;
			logo.scale.set(scale, scale, scale);
			logo.rotateX(Math.PI / 2);
			logo.traverse((c) => {
				if (c.isMesh) {
					c.material = simpleMat;
				}
			});
			scene.add(logo);
			onScroll();
		});

		const computerMat = myMat();
		// let computer: THREE.Group<THREE.Object3DEventMap> | undefined;
		// new GLTFLoader().load('/computer.glb', (m) => {
		// 	computer = m.scene;
		// 	const scale = 0.3;
		// 	computer.scale.set(scale, scale, scale);
		// 	computer.children[0].material = simpleMat;
		// 	computer.children[1].material = computerMat;
		// 	scene.add(computer);
		// });
		let computer = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), computerMat);
		scene.add(computer);

		const composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(scene, camera));
		const pp = PostProcess();
		pp.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
		const myEffect = new ShaderPass(pp);
		composer.addPass(myEffect);

		//event listeners
		function resize() {
			renderer.setSize(window.innerWidth, window.innerHeight);
			composer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
		}
		resize();
		window.addEventListener('resize', resize);

		let lastScroll = 0;
		function onScroll() {
			if (computer) {
				const v =
					(-document.body.scrollHeight + window.scrollY + window.innerHeight) / window.innerHeight;
				computer.position.y = v;
				computer.rotation.y = v;
				const r = 1.75 + 4 * v;
				computer.position.z = r < 0.5 ? 0.5 : r;
			}
			if (logo) {
				logo.position.y = window.scrollY / window.innerHeight + 0.2;
				logo.rotation.z += (window.scrollY - lastScroll) / 100;
				lastScroll = window.scrollY;
			}
		}
		window.addEventListener('scroll', onScroll);
		onScroll();

		//animation
		const t = new THREE.Timer();
		renderer.setAnimationLoop(() => {
			myEffect.uniforms.u_time.value = t.getElapsed();
			myEffect.needsSwap = true;

			computerMat.uniforms.u_time.value = t.getElapsed();
			computerMat.needsUpdate = true;
			computerMat.uniformsNeedUpdate = true;

			logo?.rotateZ(t.getDelta() / 2);
			composer.render();
			t.update();
		});

		//teardown
		$effect(() => {
			return () => {
				window.removeEventListener('resize', resize);
				window.removeEventListener('scroll', onScroll);
				renderer?.dispose();
				scene.traverse((obj) => {
					if (obj.geometry) obj.geometry.dispose();
					if (obj.material) {
						if (obj.material.map) obj.material.map.dispose();
						obj.material.dispose();
					}
				});
			};
		});
	};
</script>

<canvas use:init class="fixed inset-0 z-[-1] h-screen w-screen [image-rendering:pixelated]"
></canvas>
