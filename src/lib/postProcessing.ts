import { Vector2 } from "three";
export function PostProcess() {
   return {

      uniforms: {
         "tDiffuse": { type: "t", value: null },
         "u_resolution": { type: "vec2", value: new Vector2(1920, 1080) },
         "u_time": { value: 1 }
      },

      vertexShader: /* glsl */`

	varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

      fragmentShader: `

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

      #ifdef GL_ES
      precision mediump float;
      #endif
      
      uniform vec2 u_resolution;
      uniform float u_time;
      
      float random(vec2 st) {
          return fract(sin(dot(st, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      vec2 random2(vec2 st){
          st = vec2( dot(st,vec2(127.1,311.7)),
                    dot(st,vec2(269.5,183.3)) );
          return -1.0 + 2.0*fract(sin(st)*43758.5453123);
      }
      
      float grain(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
      
          vec2 u = f*f*(3.0-2.0*f);
      
          return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                           dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                      mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                           dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
      }
      
      float noise (in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
      
          // Four corners in 2D of a tile
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
      
          vec2 u = f * f * (3.0 - 2.0 * f);
      
          return mix(a, b, u.x) +
                  (c - a)* u.y * (1.0 - u.x) +
                  (d - b) * u.x * u.y;
      }

      vec3 colorRamp(vec3 colorIn) {

         // rgb(222.,222.,222.)
         vec3 c3 = vec3(222.,222.,222.) / 255.;
         // rgb(9 121 107)
         vec3 c2 = vec3(9, 121, 107) / 255.;
         // rgb(37.,37.,37.)
         vec3 c1 = vec3(37.,37.,37.) / 255.;
         if(colorIn.r > .6) {
            return c3;
         } 
         if(colorIn.r > .3){
            return c2;
         }
         return c1;
      }
      
      void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.x *= u_resolution.x / u_resolution.y;
      
          // ── ANIMATED FBM DOMAIN ──
          vec2 q = st * 2.0;
          q += vec2(u_time * 0.569, u_time * 0.07);
      
          float n = noise(q);
          vec3 color = vec3(n);
      
          // ── ORIGINAL SCENE ──
          vec4 texel = texture2D(tDiffuse, vUv);
      
          // —— GRAIN ——
          float grn = grain(st*300.);
      
          // ── COMPOSITE ──
          texel.rgb *= 2.2;
          texel.rgb += color / 4. * abs(step(0.01, texel.r)-1.);
          texel.rgb += grn / 2.;
          gl_FragColor = vec4(colorRamp(texel.rgb), 1);
      }
`
   };
}
