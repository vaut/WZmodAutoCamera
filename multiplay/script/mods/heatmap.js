include("multiplay/script/mods/queue.js");
//var rawMap = [];
var summMap = initMap();

//var structsMap = [];
//var unitsMap = [];
//var oilsMap = [];
createRawMap();
//dumpMap(createMap(startPositions[1]));

function initMap(value = undefined)
{
	map = [];
	for (let x = 0; x < mapWidth; ++x)
	{
		map[x] = Array(mapHeight).fill(value);
	}
	return map;
}

function createRawMap()
{
	rawMap = initMap();
	rawMap = rawMap.map((line, x) =>
	{
		const rawLine = line.map((cell, y) =>
		{
			if (!isPassable(x,y)){return [];}
			let matrix = [
				{x: x-1, y: y-1},
				{x: x-1, y: y},
				{x: x-1, y: y+1},
				{x: x, y: y+1},
				{x: x+1, y: y+1},
				{x: x+1, y: y},
				{x: x+1, y: y-1},
				{x: x, y: y-1}
			];
			return matrix.filter((m) =>isPassable(m.x,m.y));

		});
		return rawLine;
	});
}

function createMap(obj, lim = Infinity)
{
	let map = initMap(Infinity);
	var newCells = new Queue();
	newCells.add(obj);
	map[obj.x][obj.y]=1;
	while (!newCells.isEmpty())
	{
		let p = newCells.get();
		if (map[p.x][p.y] > lim){break;}
		rawMap[p.x][p.y].forEach((c) =>
		{
			if (map[c.x][c.y]> map[p.x][p.y] +1 )
			{
				map[c.x][c.y] = map[p.x][p.y]+1;
				newCells.add(c);
			}
		});
	}
	return map;
}

function getSummMap()
{
	let structs = [];
	let units = [];
	getEnemys().forEach((playnum) =>
	{
		structs.push(startPositions[playnum]);
		let types = [
			HQ,
			FACTORY,
			//POWER_GEN,
			//RESOURCE_EXTRACTOR,
			LASSAT,
			RESEARCH_LAB,
			REPAIR_FACILITY,
			CYBORG_FACTORY,
			VTOL_FACTORY,
			//REARM_PAD,
			SAT_UPLINK,
			COMMAND_CONTROL,
		];
		for (let i = 0; i < types.length; ++i)
		{
			structs = structs.concat(enumStruct(playnum, types[i]));
		}
		units = units.concat(enumDroid(playnum));
	});
	let summMap = initMap(0);
	structs.forEach((obj) =>
	{
		let map = createMap(obj);
		map.forEach((line, x) =>
		{
			line.forEach((r,y) =>
			{
				summMap[x][y] += 1/r;
			});
		});
	});
	units.forEach((obj) =>
	{
		let map = createMap(obj, 16);
		map.forEach((line, x) =>
		{
			line.forEach((r,y) =>
			{
				summMap[x][y] += 1/(r);
			});
		});
	});
	return summMap;
}


function getEnemys()
{
	enemys = [];
	for (let playNum = 0; playNum < maxPlayers; ++playNum)
	{
		if (playersTeam[playNum] != playersTeam[actor])
		{
			enemys.push(playNum);
		}
	}
	return enemys;
}

function isPassable(x, y)
{
	//TODO добавить проверку есть ли тут объект
	if (x<0 || y < 0 || x >= mapWidth || y >= mapHeight){return false;}
	return (
		terrainType(x, y) !== TER_CLIFFFACE && terrainType(x, y) !== TER_WATER
	);
}

function dumpMap(map)
{
	map.forEach((line, x) =>
	{
		//line.forEach((c) => debug(JSON.stringify(c)));
		debug (line.join(""));
	});
}
