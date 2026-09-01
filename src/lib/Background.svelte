<script lang="ts">
   import * as THREE from "three";
   import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
   import { type Snippet, type SvelteComponent, onDestroy } from "svelte";
   import { spring } from "svelte/motion";
   import { clamp } from "three/src/math/MathUtils.js";
   import { threeState } from './siteState.svelte';

   let {
      children,
      progress = $bindable(0),
	  onLoad = () => {}
   }: { children: Snippet; progress: number, onLoad: ()=>void} = $props();

   const PI = 3.141592;

   THREE.DefaultLoadingManager.onProgress = (_, itemsLoaded, itemsTotal) =>
      (progress = (itemsLoaded / itemsTotal) * 100);

   //animations function in delta time
   const clock = new THREE.Clock();

   let virtualPagePos = 0;

   let mousePos = { x: 0, y: 0 };

   let charPositionPixels = spring(
      { x: 0, y: 0 },
      { stiffness: 0.01, damping: 0.73 },
   );

   let safeZone = {
      minTarget: new THREE.Vector2(0, 0),
      maxTarget: new THREE.Vector2(0, 0),
      width: 0,
      height: 0,
   };

   let characterRotation = spring(0, { stiffness: 0.1, damping: 0.73 });
   let characterSpeed = 0;

   function init(canvas: HTMLElement) {
      (async () => {
         // create the renderer
         const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            canvas,
         });

         renderer.shadowMap.enabled = true;
         renderer.setPixelRatio(devicePixelRatio);

         // create the scene
         const scene: THREE.Scene = new THREE.Scene();

         //when the scene is destroyed, run the cleanup function
         onDestroy(() => {
            console.log(renderer.info);
            scene.traverse((o) => {
               if (o instanceof THREE.Mesh) {
                  o.geometry.dispose();
                  o.material.dispose();
                  if (o.material.map) {
                     console.log(o.material.map);
                  }
               }
            });
            renderer.dispose();
            renderer.info.programs[0].destroy();
            while (scene.children.length > 0) {
               scene.remove(scene.children[0]);
            }
            setTimeout(() => {
               console.log(renderer.info);

               console.log(scene.children.length);
            }, 1000);
         });

         // create the camera
         const fov: number = 50;
         const aspect: number = window.innerWidth / window.innerHeight;
         const near: number = 0.1;
         const far: number = 100;

         let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
            fov,
            aspect,
            near,
            far,
         );

         // scene.add(new THREE.GridHelper(10));

         //Position the camera
         camera.position.y = 10;
         camera.rotation.x = -PI / 2;
         scene.add(camera);

         const spot: THREE.DirectionalLight = new THREE.DirectionalLight(
            0xffffff,
            300,
         );

         spot.position.set(5, 5, 5);
         spot.rotation.z = 1;
         spot.castShadow = true;

         spot.shadow.mapSize.width = 2048;
         spot.shadow.mapSize.height = 2048;
         spot.shadow.camera.near = 0.5;
         spot.shadow.camera.far = 100;
         spot.shadow.camera.left = -9;
         spot.shadow.camera.right = 9;
         spot.shadow.camera.top = 9;
         spot.shadow.camera.bottom = -9;

         scene.add(spot);
         // scene.add(new THREE.DirectionalLightHelper(spot));

         const p: THREE.PlaneGeometry = new THREE.PlaneGeometry(20, 20);
         const m: THREE.Material = new THREE.ShadowMaterial();
         m.opacity = 0.2;
         const shadowCatcher: THREE.Mesh = new THREE.Mesh(p, m);
         shadowCatcher.rotateX(-PI / 2);
         shadowCatcher.receiveShadow = true;
         scene.add(shadowCatcher);

         //CHARACTER
         let { character, mixer, animationList } = await loadCharacter(scene);

         animationList.run.play();
         animationList.idle.play();

         resize(camera, renderer);
         window.onresize = () => resize(camera, renderer);

         startAnimation(
            renderer,
            scene,
            mixer,
            animationList,
            camera,
            shadowCatcher,
            spot,
            character,
         );

         window.addEventListener("mousemove", mouseMove);
         window.onscroll = scroll;
         scroll();
		 onLoad();
       threeState.loaded = true;
      })();
   }

   interface CharacterData {
      character: THREE.Mesh;
      mixer: THREE.AnimationMixer;
      animationList: AnimationList;
   }
   interface AnimationList {
      idle: THREE.AnimationAction;
      run: THREE.AnimationAction;
      walk: THREE.AnimationAction;
   }

   function loadCharacter(scene: THREE.Scene): Promise<CharacterData> {
      return new Promise((res) => {
         new GLTFLoader().load("/little alex.glb", (f: any) => {
            let character = f.scene.children[0];
            character.scale.set(0.2, 0.2, 0.2);
            character.rotateY(PI);

            character.children[0].children.forEach(
               (m: THREE.Mesh) => (m.castShadow = true),
            );

            character.position.y = 0.6;
            scene.add(character);

            let mixer = new THREE.AnimationMixer(character);
            let animationList = {
               idle: mixer.clipAction(f.animations[0]),
               run: mixer.clipAction(f.animations[1]),
               walk: mixer.clipAction(f.animations[2]),
            };

            res({ character, mixer, animationList });
         });
      });
   }

   function startAnimation(
      renderer: THREE.WebGLRenderer,
      scene: THREE.Scene,
      mixer: THREE.AnimationMixer,
      animationList: AnimationList,
      camera: THREE.Camera,
      shadowCatcher: THREE.Mesh,
      light: THREE.DirectionalLight,
      character: THREE.Mesh,
   ) {
      renderer.setAnimationLoop(() => {
         const delta = clock.getDelta();
         mixer.update(delta);

         shadowCatcher.position.z =
            (virtualPagePos / window.innerHeight) * safeZone.height;
         light.position.z =
            5 + (virtualPagePos / window.innerHeight) * safeZone.height;
         light.target.position.z =
            (virtualPagePos / window.innerHeight) * safeZone.height;
         light.target.updateMatrixWorld();
         shadowCatcher.addEventListener;
         moveCharacter(character, animationList);
         moveCamera(camera);
         renderer.render(scene, camera);
      });
   }

   function moveCamera(camera: THREE.Camera) {
      let rotation = clamp(window.scrollY / window.innerHeight, 0, 1);

      camera.position.z =
         (virtualPagePos / window.innerHeight) * safeZone.height;
      if (rotation <= 1) {
         camera.rotation.x = (-PI / 2) * rotation;
         camera.position.z += 10 * Math.cos((PI / 2) * rotation);
         camera.position.y = 10 * Math.sin((PI / 2) * rotation);
      }
   }

   function moveCharacter(
      character: THREE.Mesh,
      animationList: AnimationList,
   ): void {
      const x =
         ($charPositionPixels.x / window.innerWidth) * safeZone.width +
         safeZone.minTarget.x;
      const y =
         ($charPositionPixels.y / window.innerHeight) * safeZone.height +
         safeZone.minTarget.y;

      const dx = x - character.position.x;
      const dy = y - character.position.z;

      character.position.setX(x);
      character.position.setZ(y);

      characterSpeed = Math.sqrt(dx * dx + dy * dy);
      tweenAnimations(animationList, characterSpeed);

      let newRotation = Math.atan2(dy, dx);

      if (characterSpeed < 0.002 && characterSpeed > -0.002)
         newRotation = PI / 2;

      if (newRotation - ($characterRotation % (2 * PI)) > PI) {
         newRotation -= 2 * PI;
      } else if (($characterRotation % (2 * PI)) - newRotation > PI) {
         newRotation += 2 * PI;
      }

      newRotation += $characterRotation - ($characterRotation % (2 * PI));

      characterRotation.set(newRotation);
      character.rotation.y = $characterRotation - PI / 2;
   }

   function tweenAnimations(animationList: AnimationList, speed: number): void {
      let blend = clamp(speed * 70, 0, 10);
      // when the character isnt moving fast, blend between the idle and walk animations,
      // effectively making the steps smaller. when the character is moving quickly,
      // use full walk animation, and change animation speed to match.
      animationList.idle.setEffectiveWeight(80 - blend * 100);
      animationList.run.setEffectiveWeight(blend * 100);
      animationList.run.setEffectiveTimeScale(25 * speed + 0.2);
   }

   async function mouseMove(e: MouseEvent) {
      // esentially the mouse position smoothed, plus the scroll position
      // since the character needs to move further down depending on how far is scrolled.
      if (window.scrollY > window.innerHeight * 1.15)
         charPositionPixels.set({ x: e.x, y: e.y + virtualPagePos });
      // also store the mouse position in case the user scrolls without moving the mouse.
      mousePos.x = e.x;
      mousePos.y = e.y;
   }
   async function scroll() {
      if (window.scrollY > window.innerHeight * 1.15)
         charPositionPixels.set({
            x: mousePos.x,
            y: mousePos.y + virtualPagePos,
         });
      else
         charPositionPixels.set({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2 - 25,
         });

      virtualPagePos = Math.max(window.scrollY - window.innerHeight, 0);
   }

   let lastResizedDim = { height: 0, width: 0 };
   function resize(camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
      if (
         window.innerWidth > 500 ||
         lastResizedDim.width != window.innerWidth ||
         Math.abs(lastResizedDim.height - window.innerHeight) > 80
      ) {
         lastResizedDim.height = window.innerHeight;
         lastResizedDim.width = window.innerWidth;
         camera.aspect = window.innerWidth / window.innerHeight;
         camera.updateProjectionMatrix();
         renderer.setSize(window.innerWidth, window.innerHeight);

         // the safezone variable stores what area in the 3d scene is visable by the camera.
         camera.getViewBounds(10, safeZone.minTarget, safeZone.maxTarget); //!!!!!!!!!!!!!!
         safeZone.height = safeZone.maxTarget.y - safeZone.minTarget.y;
         safeZone.width = safeZone.maxTarget.x - safeZone.minTarget.x;
      }
   }
</script>

<canvas use:init></canvas>

<style>
   canvas {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
      /* image-rendering: pixelated; */
      /* filter:grayscale() */
   }
</style>