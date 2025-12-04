import { ShaderMaterial, Vector2 } from 'three'
export const material = new ShaderMaterial({
   uniforms: {
      screenTex: { value: null },
      resolution: { value: new Vector2(1920, 1080) },
   },
   vertexShader: `
varying vec2 vScreenUV;

void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // convert clip space to normalized device coords
    vec2 ndc = clip.xy / clip.w;

    // convert to 0–1 UV
    vScreenUV = ndc * 0.5 + 0.5;

    gl_Position = clip;
}
   `,
   fragmentShader: `
// fragment shader
uniform sampler2D screenTex;
varying vec2 vScreenUV;

void main() {
    vec2 uv = vScreenUV;

    // Add small refraction based on normals if you want
    // uv += normal.xy * 0.02;

    vec3 col = texture2D(screenTex, uv).rgb;

col = col * 1.1;
    gl_FragColor = vec4(col, 1.0);
}
   `
});
