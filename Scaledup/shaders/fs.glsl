#version 300 es

precision mediump float;

in vec2 fs_uv;  // uv coordinates of the lookup
in vec3 fs_norm;
in vec3 fs_pos;

out vec4 outColor;

uniform vec3 eyePos;

uniform vec3 lightDirection;
uniform vec4 lightColor;
uniform vec4 lightType;
uniform vec3 lightPos;
uniform float ConeOut;
uniform float ConeIn;
uniform float Decay;
uniform float Target;

uniform vec4 diffuseType;
uniform vec4 diffuseColor;
uniform float DToonTh;

uniform vec4 specularType;
uniform vec4 specularColor;
uniform float SpecShine;
uniform float SToonTh;

uniform vec4 ambientType;
uniform vec4 ambientLightColor;
uniform vec4 ambientLightLowColor;
uniform vec4 SHLeftLightColor;
uniform vec4 SHRightLightColor;
uniform vec3 ADir;
uniform vec4 ambientMatColor;

uniform vec4 emissionType;
uniform vec4 emitColor;


vec3 compLightDir(vec3 LPos, vec3 LDir, vec4 lightType) {
	//lights
	// -> Point
	vec3 pointLightDir = normalize(LPos - fs_pos);
	// -> Direct
	vec3 directLightDir = LDir;
	// -> Spot
	vec3 spotLightDir = normalize(LPos - fs_pos);

	return            directLightDir * lightType.x +
					  pointLightDir * lightType.y +
					  spotLightDir * lightType.z;
}

vec4 compLightColor(vec4 lightColor, float LTarget, float LDecay, vec3 LPos, vec3 LDir,
					float LConeOut, float LConeIn, vec4 lightType) {
	float LCosOut = cos(radians(LConeOut / 2.0));
	float LCosIn = cos(radians(LConeOut * LConeIn / 2.0));

	//lights
	// -> Direct
	vec4 directLightCol = lightColor;

	// -> Point
	vec4 pointLightCol = lightColor * pow(LTarget / length(LPos - fs_pos), LDecay);

	// -> Spot
	vec3 spotLightDir = normalize(LPos - fs_pos);
	float CosAngle = dot(spotLightDir, LDir);
	vec4 spotLightCol = lightColor * pow(LTarget / length(LPos - fs_pos), LDecay) *
						clamp((CosAngle - LCosOut) / (LCosIn - LCosOut), 0.0, 1.0);

	// ----> Select final component
	return          directLightCol * lightType.x +
					pointLightCol * lightType.y +
					spotLightCol * lightType.z;
}

vec4 compDiffuse(vec3 lightDir, vec4 lightCol, vec3 normalVec, vec4 diffColor, vec3 eyedirVec) {
	// Diffuse
	float LdotN = max(0.0, dot(normalVec, lightDir));
	vec4 LDcol = lightCol * diffColor;

	// --> Lambert
	vec4 diffuseLambert = LDcol * LdotN;

	// --> Toon
	vec4 diffuseToon = max(sign(LdotN - DToonTh),0.0) * LDcol;

	// --> Oren-Nayar
	float VdotN = max(0.0, dot(normalVec, eyedirVec));
	float theta_i = acos(LdotN);
	float theta_r = acos(VdotN);
	float alpha = max(theta_i, theta_r);
	float beta = min(min(theta_i, theta_r), 1.57);
	float sigma2 = DToonTh * DToonTh * 2.46;
	float A = 1.0 - 0.5 * sigma2 / (sigma2 + 0.33);
	float B = 0.45 * sigma2 / (sigma2 + 0.09);
	vec3 v_i = normalize(lightDir - normalVec * LdotN);
	vec3 v_r = normalize(eyedirVec - normalVec * VdotN);
	float G = max(0.0, dot(v_i, v_r));
	vec4 diffuseOrenNayar = diffuseLambert * (A + B * G * sin(alpha) * tan(beta));

	// ----> Select final component
	return         diffuseLambert * diffuseType.x +
				   diffuseToon * diffuseType.y +
				   diffuseOrenNayar * diffuseType.z;
}

vec4 compSpecular(vec3 lightDir, vec4 lightCol, vec3 normalVec, vec3 eyedirVec) {
	// Specular
	float LdotN = max(0.0, dot(normalVec, lightDir));
	vec3 reflection = -reflect(lightDir, normalVec);
	float LdotR = max(dot(reflection, eyedirVec), 0.0);
	vec3 halfVec = normalize(lightDir + eyedirVec);
	float HdotN = max(dot(normalVec, halfVec), 0.0);
	vec4 LScol = lightCol * specularColor * max(sign(LdotN),0.0);

	// --> Phong
	vec4 specularPhong = LScol * pow(LdotR, SpecShine);

	// --> Blinn
	vec4 specularBlinn = LScol * pow(HdotN, SpecShine);
	// --> Toon Phong
	vec4 specularToonP = max(sign(LdotR - SToonTh), 0.0) * LScol;
	// --> Toon Blinn
	vec4 specularToonB = max(sign(HdotN - SToonTh), 0.0) * LScol;
	
	// --> Cook-Torrance
	LdotN = max(0.00001, LdotN);
	float VdotN = max(0.00001, dot(normalVec, eyedirVec));
	HdotN = max(0.00001, HdotN);
	float HdotV = max(0.00001, dot(halfVec, eyedirVec));
	float G = min(1.0, 2.0 * HdotN * min(VdotN, LdotN) / HdotV);
	float F = SToonTh + (1.0 - SToonTh) * pow(1.0 - HdotV, 5.0);
	float HtoN2 = HdotN * HdotN;
	float M = (201.0 - SpecShine) / 200.0 * 0.5;
	float M2 = M * M;
	float D = exp(- (1.0-HtoN2) / (HtoN2 * M2)) / (3.14159 * M2 * HtoN2 * HtoN2);
	
	vec4 specularCookTorrance = LScol * D * F * G / (4.0 * VdotN);

	// ----> Select final component
	return          specularPhong * specularType.x * (1.0 - specularType.z) +
					specularBlinn * specularType.y * (1.0 - specularType.z) +
					specularToonP * specularType.z * specularType.x +
					specularToonB * specularType.z * specularType.y +
					specularCookTorrance * specularType.w;
}

vec4 compAmbient(vec4 ambColor, vec3 normalVec) {
	// Ambient
	// --> Ambient
	vec4 ambientAmbient = ambientLightColor * ambColor;
	// --> Hemispheric
	float amBlend = (dot(normalVec, ADir) + 1.0) / 2.0;
	vec4 ambientHemi = (ambientLightColor * amBlend + ambientLightLowColor * (1.0 - amBlend)) * ambColor;
	// --> Spherical Harmonics
	const mat4 McInv = mat4(vec4(0.25,0.0,-0.25,0.7071),vec4(0.25,0.6124,-0.25,-0.3536),vec4(0.25,-0.6124,-0.25,-0.3536),vec4(0.25,0.0,0.75,0.0));
	mat4 InCols = transpose(mat4(ambientLightLowColor, SHRightLightColor, SHLeftLightColor, ambientLightColor));
	mat4 OutCols = McInv * InCols;
	vec4 ambientSH = vec4((vec4(1,normalVec) * OutCols).rgb, 1.0) * ambColor;

	// ----> Select final component
	return 		   ambientAmbient * ambientType.x +
				   ambientHemi    * ambientType.y +
				   ambientSH      * ambientType.z;
}



void main() {
    vec3 normalVec = normalize(fs_norm);
	vec3 eyedirVec = normalize(eyePos - fs_pos);

	//lights
	vec3 lightDir = compLightDir(lightPos, lightDirection, lightType);
	vec4 lightCol = compLightColor(lightColor, Target, Decay, lightPos, lightDirection, ConeOut, ConeIn, lightType);

	//diffuse
	vec4 diffuse = compDiffuse(lightDir, lightCol, normalVec, diffuseColor, eyedirVec);

	//specular
	vec4 specular = compSpecular(lightDir, lightCol, normalVec, eyedirVec); 
	
	//ambient
	vec4 ambient = compAmbient(ambientMatColor, normalVec);

    vec4 out_color = clamp(diffuse + specular + ambient + emitColor, 0.0, 1.0);
	outColor = vec4(out_color.rgb, 1.0);
}