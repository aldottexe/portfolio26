import { ShaderMaterial, Vector2 } from 'three'
export const material = new ShaderMaterial({
   uniforms: {
      screenTex: { value: null },
      resolution: { value: new Vector2(1920, 1080) },
      aspect: { value: 1 },
      refractionStrength: { value: .003 }
   },
   vertexShader: `
varying vec2 vScreenUV;
varying vec3 vNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);

    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // Convert clip space → 0–1 screen UV
    vec2 ndc = clip.xy / clip.w;
    vScreenUV = ndc * 0.5 + 0.5;

    gl_Position = clip;
}
   `,
   fragmentShader: `
uniform sampler2D screenTex;
uniform vec2 resolution;
uniform float refractionStrength; // 0.01–0.1 is typical
uniform float aspect;

varying vec2 vScreenUV;
varying vec3 vNormal;

void main() {
    vec2 uv = vScreenUV;


    vec2 normalOffset = vNormal.xy;
    normalOffset.x *= aspect;


    uv += normalOffset * refractionStrength;

    uv = clamp(uv, 0.0, 1.0);

    vec3 col = texture2D(screenTex, uv).rgb;

vec3 base = texture2D(screenTex, uv).rgb;
vec3 blur = texture2D(screenTex, uv + vec2(0.001)).rgb;
col = mix(base, blur, 0.2);

   col.r = texture2D(screenTex, uv + normalOffset * 0.005).r;
   col.g = texture2D(screenTex, uv).g;
   col.b = texture2D(screenTex, uv - normalOffset * 0.005).b;

col *= 0.9;

    gl_FragColor = vec4(col, 1.0);
}
   `
});
