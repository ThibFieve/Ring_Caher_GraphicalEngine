#version 300 es

in vec3 inPosition;
in vec2 a_uv;
in vec3 inNormal;

out vec3 fs_pos;
out vec3 fs_norm;
out vec2 fs_uv;

uniform mat4 matrix; 
uniform mat4 nMatrix;
uniform mat4 pMatrix;

void main() {
  fs_uv = a_uv;
  fs_pos = (pMatrix * vec4(inPosition, 1.0)).xyz;
  fs_norm = (nMatrix * vec4(inNormal, 0.0)).xyz;

  gl_Position = matrix * vec4(inPosition,1.0);
}