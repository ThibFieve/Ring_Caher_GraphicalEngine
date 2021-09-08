#version 300 es

in vec3 inPosition;
in vec3 inNormal;
out vec3 fsNormal;

uniform mat4 matrix; 
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
 // fsNormal = mat3(nMatrix) * inNormal; our Old version

   
   fsNormal=(nMatrix * vec4(inNormal, 0.0)).xyz; //Teacher version
  
  gl_Position = matrix * vec4(inPosition, 1.0);
}