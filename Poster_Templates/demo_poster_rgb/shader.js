function getShader(_renderer) {
	const vert = `
		attribute vec3 aPosition;
		attribute vec2 aTexCoord;

		varying vec2 vTexCoord;

		void main() {
			vTexCoord = aTexCoord;

			vec4 positionVec4 = vec4(aPosition, 1.0);
			positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

			gl_Position = positionVec4;
		}
	`;

	const frag = `
		precision highp float;

		varying vec2 vTexCoord;

		uniform vec3 metaballs[${N_balls}];

		const float WIDTH = ${getWindowWidth()}.0;
		const float HEIGHT = ${getWindowHeight()}.0;
		uniform float boolF;


	
		void main() {
			float x = vTexCoord.x * WIDTH;
			float y = vTexCoord.y * HEIGHT;
			float v = 0.0;

		
			  

			for (int i = 0; i < ${N_balls}; i++) {
				vec3 ball = metaballs[i];
				float dx = ball.x - x;
				float dy = ball.y - y;
				float r = ball.z;
				v += r * r / (dx * dx + dy * dy);
			}

			if (boolF == 1.0) {

				gl_FragColor = vec4(v*10.2,v*0.2,v*0.2, 1.);
				if (${minFrag} < v && v < ${maxFrag}) {
					float a = (v - 0.9) * 4.;
				
					gl_FragColor = vec4(vec3(255,255,255),1.);
			
				} else gl_FragColor = vec4(0, 0, 0, 1.0);

			}else {
				
				gl_FragColor = vec4(v*0.2,v*0.2,v*0.2, 1.);

			}
			

		}


	`;
	return new p5.Shader(_renderer, vert, frag);
}

// gl_FragColor = vec4(v*0.2,v*0.2,v*0.2,1.);

// gl_FragColor = vec4(v*0.2,v*0.2,v*0.2,1.);
//bool outlines =  ${outlineBool};
/* if (${outlineBool}) {

			
}else{
	if (${minFrag} < v && v < ${maxFrag}) {
		float a = (v - 0.9) * 4.;
		gl_FragColor = vec4(vec3(255.,255. ,255. ),1.);

	} else gl_FragColor = vec4(0, 0, 0, 1.0);

} */