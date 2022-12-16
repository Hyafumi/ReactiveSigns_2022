
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

let densityShader = [{'v1': 1, 'v2': 1, 'v3': 1, 'alpha': 1},{}];
let destiinyShader = {'v1': 1, 'v2': 1, 'v3': 1, 'alpha': 1};

let outlineBool = 1.0;

function preload() {
	//metaballShader = getShader(this._renderer);
	metaballShader = loadShader('shader/uniform.vert', 'shader/uniform.frag');
  	font = loadFont('assets/suisse.otf');
	state1 = loadImage('assets/test14.png');
	state2 = loadImage('assets/test7.png');
}

function setup() {
  createCanvas(getWindowWidth(), getWindowHeight(), WEBGL); // impartant! Don't modify this line. 
  setupOSC(true, true); // Don't remove this line. 1 argument to turn the depthstream on and off
  pixelDensity(1);
  textFont(font);
	shader(metaballShader);

  for (let i = 0; i < ballAmount; i ++) metaballs.push(new Metaball());

  gra = createGraphics(160, 40);
  gra2 = createGraphics(160	, 40);

  buffer1 = createGraphics(200, 175);
  buffer1.background(0, 0, 0);
  buffer1.image(state1, 0, 0)

  buffer2 = createGraphics(200, 175);
  buffer2.background(0, 0, 0);
  buffer2.image(state2, 0, 0)
}

function draw() {
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


	console.log(outlineBool)
	rect(0, 0, getWindowWidth(), getWindowHeight());

  if(position.x > getWindowWidth()/2){
    if (isConverted == false){
      isConverted = !isConverted;
      destiny();
    }
  } else {
    if (isConverted == true){
      isConverted = !isConverted;
      density();
    }
  }

  	for(ball of metaballs) {


		if(ball.grow == true){
			if(ball.diagonalSize < 1000){
				ball.diagonalSize += 15;
			} 
		} else if(ball.shrink == true){
			if(ball.diagonalSize > 0){
				ball.diagonalSize -= 15;
			} 
		}

		if(ball.gotoTarget == true){
			if(ball.diagonalSize > 1000){
				ball.diagonalSize -= 15;
			} 
		} else if (ball.gotoTarget == false){
			if(ball.diagonalSize < 1450){
				ball.diagonalSize += 15;
			} 
		}

	} 
  

  ///////////////
  posterTasks(); // do not remove this last line!  
}

function resizeBlob(value) {
		if(value > defaultBallSize){
			value += 10;
		} else if(targetValue > value) {
			value -= 10;
		}
		console.log(value);
		return(value)
}

function destiny(){
	outlineBool = 0,0;
	//updateGra('DESTINY',gra);
	let targetPos = getBlPxPos2(buffer1);
	setTargetPos(targetPos);
	kpFrame = frameCount;
	for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
}

function density(){
	outlineBool = 1.0;
	//updateGra2('DENSITY', gra2);
	let targetPos = getBlPxPos2(buffer2);
	setTargetPos(targetPos);
	kpFrame = frameCount;
	for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
}



function mouseMoved() {
	if (mouseY > getWindowHeight()/2) {
		for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(false);
	} 
	if(mouseX > getWindowWidth()/2){
		offset = map(mouseX, getWindowWidth()/2, getWindowWidth(), 0, 100);
	} else {
		offset = map(mouseX, 0, getWindowWidth()/2, -100, 0);
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
			if(random() > 0.5)d = random() > 0.5 ? createVector(-metaballs[i].radius*5,random(getWindowHeight())) : createVector(getWindowWidth() + metaballs[i].radius*5,random(getWindowHeight()));
			else d = random() > 0.5 ? createVector(random(getWindowWidth()),-metaballs[i].radius*5) : createVector(random(getWindowWidth()),getWindowHeight() + metaballs[i].radius*5);
			metaballs[i].setTarget(d.x,d.y);
			metaballs[i].vanish();
		}
	}
}

function setTargetPos2(pos)
{
	for(let i =0; i < metaballs.length; i++)
	{
		metaballs[i].appear();
		if(i < pos.length)metaballs[i].setTarget(pos[i].x,pos[i].y);
		else
		{
			let d;
			if(random() > 0.5)d = random() > 0.5 ? createVector(-metaballs[i].radius*5,random(getWindowHeight())) : createVector(getWindowWidth() + metaballs[i].radius*5,random(getWindowHeight()));
			else d = random() > 0.5 ? createVector(random(getWindowWidth()),-metaballs[i].radius*5) : createVector(random(getWindowWidth()),getWindowHeight() + metaballs[i].radius*5);
			metaballs[i].setTarget(d.x,d.y);
			metaballs[i].vanish();
			
		}
	}
}

function getBlPxPos(g)
{
	let ratio = 7;
	
	let pos = [];
	for(let x = 0 ; x < g.width; x += 1.2)
	{
		for(let y = 0; y < g.height; y += 1.2)
		{
			let col = g.get(x,y);
			if(brightness(col) == 0)pos.push(createVector((x-g.width/2)*ratio + width/2,((g.height-y)-g.height/2)*ratio + height/2));
		}
	}
	return pos;
}

function getBlPxPos2(g)
{
	let ratio = 7;
	
	let pos = [];

	for(let x = 0 ; x < g.width; x += 3)
	{
		for(let y = 0; y < g.height; y += 3)
		{
			let col = g.get(x,y);
			if(brightness(col) == 0)pos.push(createVector((x-g.width/2)*ratio + width/2,((g.height-y)-g.height/2)*ratio + height/2));
		}
	}
	return pos;
}


function updateGra(str,g,s = g.height)
{
	g.background(255);
	g.fill(0);
	g.textSize(30);
	g.textAlign(CENTER,CENTER);
	g.textFont(font);
	g.text(str,g.width/2,g.height/2);
}

function updateGra2(str,g,s = g.height)
{
	g.background(0);
	g.fill(255);
	g.textSize(28);
	g.textAlign(CENTER,CENTER);
	g.textFont(font);
	g.text(str,g.width/2,g.height/2.4);
}



// OpenProcessing has a bug where it always creates a scrollbar on Chromium.
function mouseWheel() { // This stops the canvas from scrolling by a few pixels.
	return false;
}






