import { ShaderMaterial, Vector2 } from "three";
export function circlesMat() {
   return new ShaderMaterial({

      uniforms: {
         "u_time": { value: 1 },
         "u_resolution": { value: new Vector2(2560, 1440) },
         "u_dy": { value: 0 },
      },

      vertexShader: /* glsl */`

	varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

      fragmentShader: `

      uniform float u_time;
      uniform float u_dy;
      uniform vec2 u_resolution;

      #ifdef GL_ES
      precision mediump float;
      #endif
      
      void main() {
         vec2 deltas = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;
         deltas.y += u_dy;
         vec2 d2 = deltas *= deltas;
         float d = sqrt(d2.x + d2.y);
         float t = d + sin(atan(deltas.x, deltas.y) * 2.) / 5.;
         float c = sin(80. * t - 3. * u_time);
         gl_FragColor = vec4(vec3(c) / 8. + .13, 1.0);
      }
`
   });
}

// distance from the center sined
// introduce distortion based on angle??
// sin(distance from center + sin(angle / 2PI))
//
// tan(t) = o / a
// t = atan(0 / a)
