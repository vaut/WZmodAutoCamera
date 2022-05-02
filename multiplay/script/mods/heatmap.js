var rawMap = [];
var summMap = [];
var structsMap = [];
//var unitsMap = [];
//var oilsMap = [];

createRawMap();
dumpMap(createMap(startPositions[1]));

function initMap(value = undefined)
{
	map = [];
	for (let x = 0; x < mapWidth; ++x)
	{
		map[x] = Array(mapHeight);
		for (let y = 0; y < mapHeight; ++y)
		{
			map[x][y] = value;
		}
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

function createMap(obj)
{
	let map = initMap(0);
	let newCells = [obj];
	map[obj.x][obj.y]=1;
	while (newCells.length > 0)
	{
		let p = newCells.shift();
		rawMap[p.x][p.y].forEach((c) =>
		{
			if (map[c.x][c.y]===0)
			{
				map[c.x][c.y] = map[p.x][p.y]+1;
				newCells.push(c);
			}
		});
	}
	return map;
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
