import { ShaderMaterial } from "three";
export function stripeMat() {
   return new ShaderMaterial({

      uniforms: {
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
      uniform float u_time;

      #ifdef GL_ES
      precision mediump float;
      #endif
      
      void main() {
          float sx = gl_FragCoord.y + sin(gl_FragCoord.x / 30.) * 30.;
          float sy = gl_FragCoord.y + sin(gl_FragCoord.x / 30.) * 30.;
          vec4 texel = texture2D(tDiffuse, vUv);
      
          gl_FragColor = vec4(vec3(sin((sx + sy) / 50. + u_time) / 10. + .15), 1.);
      }
`
   });
}
