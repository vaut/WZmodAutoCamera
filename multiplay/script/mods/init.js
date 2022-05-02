setTimer("slide", 500);
queue("changeActor", 400);
cameraZoom(5000, 150);
var actor;

const lifetime = 2*60*1000;
const dispersionLifetime = 40*1000;


function slide()
{
	let lead = leadPos();
	cameraSlide(lead.x*128, lead.y*128);
}

function leadPos()
{
	let droids = enumDroid(actor);
	let lead = droids.shift();
	let minARG = dist(lead, startPositions[actor]);
	droids.forEach((droid) =>
	{
		if (dist(droid, startPositions[actor]) >= minARG)
		{
			lead = droid;
			minARG = dist(droid, startPositions[actor]);
		}
	});
	return lead;
}

function dist(a,b)
{
	if (!(a.x && b.x && a.y && b.y)) {return Infinity;}
	return ((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}

function changeActor()
{
	let time = lifetime + dispersionLifetime*(Math.random() - 0.5 );
	let newActor = Math.floor(Math.random() * (maxPlayers + 1));
	if (newActor != actor && typeof playersTeam[newActor] != "undefined" && playersTeam[newActor].isContender)
	{
		queue("changeActor", time);
		actor = newActor;
		return;
	}
	else
	{
		changeActor();
	}
}

