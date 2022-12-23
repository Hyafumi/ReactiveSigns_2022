
// dataFiltered : represents an array of depth data. Only available with setupOSC(true)
// depthW: The horizontal resolution of the dataFiltered aray
// depthH: The vertical resolution of the dataFiltered aray

let metaballShader;
let ballAmount = 500.0, metaballs = [];
let gra;
let kpFrame = 0;
let isConverted = false;
let offset = 0;
let minFrag = 0.9;
let maxFrag = 1.1;
let defaultBallSize = 500;
let mouseLocation;
let mouseLocation2 = 1.0;

//Time function
let time = 0;
let duration = 1000;

let w;
let h;

let outlineBool = 1.0;

function preload() {
	//metaballShader = getShader(this._renderer);
	metaballShader = loadShader('shader/uniform.vert', 'shader/uniform.frag');
  	font = loadFont('assets/suisse.otf');
	state1 = loadImage('assets/final22.png');
}

function setup() {
  createCanvas(getWindowWidth(), getWindowHeight(), WEBGL); // impartant! Don't modify this line. 
  setupOSC(true, true); // Don't remove this line. 1 argument to turn the depthstream on and off
  pixelDensity(1);

  for (let i = 0; i < ballAmount; i ++) metaballs.push(new Metaball());

  buffer1 = createGraphics(200, 175);
  buffer1.background(0, 0, 0);
  buffer1.image(state1, 0, 0)

  noCursor();
  textFont(font);
}

function draw() {


	time += frameRate();
	if (time > duration) {
		time = 0;
	}

	w = getWindowWidth();
	h = getWindowHeight();
	
	rect(0, 0, getWindowWidth(), getWindowHeight());

	shader(metaballShader);
  	if(frameCount == kpFrame + 20 && kpFrame != 0)for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
	
	var data = [];
  
	for (const ball of metaballs) {
		ball.update();
		data.push(ball.pos.x+offset, ball.pos.y, ball.radius);
	}
	

	metaballShader.setUniform('metaballs', data);
	metaballShader.setUniform('boolF', outlineBool);
	metaballShader.setUniform('balls', ballAmount);
	metaballShader.setUniform("winWidth", getWindowWidth());
	metaballShader.setUniform("winHeight", getWindowHeight());
	metaballShader.setUniform('minF', minFrag);
	metaballShader.setUniform('maxF', maxFrag);
	metaballShader.setUniform('mouseLoc', mouseLocation);
	metaballShader.setUniform('mouseLoc2', mouseLocation2);

	rect(0, 0, w, h);


	if(position.x < vw*20){
		outlineBool = 1,0;
		for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(false);
 
		if(position.x > 15*vw) {
			mouseLocation2 = map(mouseX, 15*vw, 20*vw, 1, 0);
		}

	} else if (position.x > vw*20 && position.x < vw*80){

		outlineBool = 0,0;
		let targetPos = getBlPxPos(buffer1);
		setTargetPos(targetPos);
		kpFrame = frameCount;
		for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);

		if(position.x > 20*vw && position.x < 30*vw) {
			mouseLocation = map(position.x, 20*vw, 30*vw, 0, 1);
			console.log(mouseLocation);

		} else if (position.x > 70*vw && position.x < 80*vw) {
			mouseLocation = map(position.x, 70*vw, 80*vw, 1, 0);
			console.log(mouseLocation);
		}

	} else {

		outlineBool = 1,0;
		for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(false);

		if(position.x > 80*vw && position.x < 85*vw) {
			mouseLocation2 = map(mouseX, 80*vw, 85*vw, 0, 1);
		}
	}


	if(position.x > 50*vw && position.x < 100*vw){
		offset = lerp(offset, map(position.x, 50*vw, 100*vw, 0, 100), time / duration);
	} else if (position.x > 0 && position.x < 50*vw){
		offset = lerp(offset, map(position.x, 0*vw, 50*vw, -100, 0), time / duration);
	}

	if(position.x > 100*vw){
		offset = lerp(offset, 0, time / duration);
	} else if (position.x < 0*vw) {
		offset = lerp(offset, 0, time / duration);
	}


  	for(ball of metaballs) {
		if(ball.grow == true){
				if(ball.diagonalSize < 1200){
					ball.diagonalSize += 15;
				} 
		} else if(ball.shrink == true){
			if(ball.diagonalSize > 0){
				ball.diagonalSize -= 15;
			} 
		}
		if(ball.gotoTarget == true){
			
				if(ball.diagonalSize > 1200){
					ball.diagonalSize -= 15;
				} 
		} else if (ball.gotoTarget == false){
			if(ball.diagonalSize < 1400){
				ball.diagonalSize += 15;
			} 
		}
	} 
  

  ///////////////// do not remove this last line!  
  posterTasks(); 
  resetShader();
}



function destiny(){
	let targetPos = getBlPxPos(buffer1);
	setTargetPos(targetPos);
	kpFrame = frameCount;
	for(ball of metaballs) {
		ball.destiny();
	}
}



function setTargetPos(pos)
{
	for(let i =0; i < metaballs.length; i++)
	{
		metaballs[i].appear();
		if(i < pos.length)metaballs[i].setTarget(pos[i].x,pos[i].y);
		else
		{
			let d;
			if(random() > 0.5)d = random() > 0.5 ? createVector(-metaballs[i].radius*5,random(getWindowHeight())) : createVector(w + metaballs[i].radius*5,random(getWindowHeight()));
			else d = random() > 0.5 ? createVector(random(w),-metaballs[i].radius*5) : createVector(random(w),getWindowHeight() + metaballs[i].radius*5);
			metaballs[i].setTarget(d.x,d.y);
			metaballs[i].vanish();
		}
	}
}

function getBlPxPos(g)
{
	let ratio = 5.5;
	
	let pos = [];
	for(let x = 0 ; x < g.width; x += 4.1)
	{
		for(let y = 0; y < g.height; y += 4.1)
		{
			let col = g.get(x,y);
			if(brightness(col) == 0)pos.push(createVector((x-g.width/2)*ratio + width/2,((g.height-y)-g.height/2)*ratio + height/2));
		}
	}
	return pos;
}

function mouseWheel() { 
	return false;
}






