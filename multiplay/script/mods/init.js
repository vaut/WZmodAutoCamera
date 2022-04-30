//namespace("af_");
setTimer("slide", 500);
const ACTOR = 1;

function slide()
{
//	let claster = get_claster_pos();
//	cameraTrack(lead());
	let lead = leadPos();
	cameraSlide(lead.x*128, lead.y*128);
}



function leadPos()
{
	let droids = enumDroid(ACTOR);
	let lead = droids.shift();
	let minARG = dist(lead, startPositions[ACTOR]);
	droids.forEach((droid) =>
	{
		if (dist(droid, startPositions[ACTOR]) >= minARG)
		{
			lead = droid;
			minARG = dist(droid, startPositions[ACTOR]);
		}
	});
	return lead;
}

function sortByDist (list, pos)
{
	const sorter = (a, b) => dist (a, pos) -  dist (b, pos);
	return list.sort(sorter);
}

function dist(a,b)
{
	if (!(a.x && b.x && a.y && b.y)) {return Infinity;}
	return ((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
