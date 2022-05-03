include("multiplay/script/mods/queue2.js");
var rawMap;
createRawMap();
var summMap = initMap();
var newCells = new Queue();

var structsMap = [];
queue("updateStructsMap", 100);
//setTimer("updateStructsMap", 45*1000);
//var unitsMap = [];
//var oilsMap = [];
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
	newCells.reset();
	newCells.add(obj);
	map[obj.x][obj.y]=1;
	while (!newCells.isEmpty())
	{
		let {x:x, y:y} = newCells.get();
		let v = map[x][y]+1;
		if (v > lim){break;}
		rawMap[x][y].forEach((c) =>
		{
			if (map[c.x][c.y] > v )
			{
				map[c.x][c.y] = v;
				newCells.add(c);
			}
		});
	}
	return map;
}

function getSummMap()
{
	unitsMap =  getUnitMap();
	summMap = structsMap.map((line, x) =>
	{
		const rawLine = line.map((cell, y) =>
		{
			return structsMap[x][y]+unitsMap[x][y];

		});
		return rawLine;
	});
	return summMap;
}

function getUnitMap()
{
	let units = [];
	getEnemys().forEach((playnum) =>
	{
		units = units.concat(enumDroid(playnum));
	});
	unitsMap = initMap(0);
	units = units.filter((obj) =>
	{
		return (obj.weapons[0] && gameTime - obj.weapons[0].lastFired <  15*1000);
	});
	debug(units.length);
	units.forEach((obj) =>
	{
		let map = createMap(obj, 20);
		map.forEach((line, x) =>
		{
			line.forEach((r,y) =>
			{
				unitsMap[x][y] += 1/(r**2);
			});
		});
	});
	return unitsMap;
}

function updateStructsMap()
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
			//RESEARCH_LAB,
			//REPAIR_FACILITY,
			CYBORG_FACTORY,
			VTOL_FACTORY,
			//REARM_PAD,
			//SAT_UPLINK,
			//COMMAND_CONTROL,
		];
		for (let i = 0; i < types.length; ++i)
		{
			structs = structs.concat(enumStruct(playnum, types[i]));
		}
		units = units.concat(enumDroid(playnum));
	});
	structsMap = initMap(0);
	structs.forEach((obj) =>
	{
		let map = createMap(obj);
		map.forEach((line, x) =>
		{
			line.forEach((r,y) =>
			{
				structsMap[x][y] += 1/r;
			});
		});
	});
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
