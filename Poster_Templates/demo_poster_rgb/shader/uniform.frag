        precision highp float;

		varying vec2 vTexCoord;

		uniform float boolF;
        uniform float balls;
		uniform float winWidth;
		uniform float winHeight;
		uniform float minF;
		uniform float maxF;

        uniform vec3 metaballs[500];


				

		float lerp (float start, float end, float amt){
			return (1.0-amt)*start+amt*end;
		}
	
		void main() {
			float x = vTexCoord.x * winWidth;
			float y = vTexCoord.y * winHeight;
			float v = 0.0;

			for (float i = 0.0; i < 500.; i++) {
				vec3 ball = metaballs[int(i)];
				float dx = ball.x - x;
				float dy = ball.y - y;
				float r = ball.z;
				v += r * r / (dx * dx + dy * dy);
			}

			if (boolF == 1.0) {

				gl_FragColor = vec4(v*0.2,v*0.2,v*0.2,1.);


			}else {



				gl_FragColor = vec4(lerp(v*0.2, v*0.8, lerpAmount += 0.1),v*0.2,v*0.2,1.);
				
				

			}
			

		}

