const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;

const dbPath = path.join(__dirname, "cricketTeam.db");

const initializerDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    /* module.exports = */ app.listen(3000, async () => {
      console.log("server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
/*module.exports = */ initializerDbAndServer();

//API 1

app.get("/players/", async (request, response) => {
  const getAllTeamsQuery = `
    select * from cricket_team ;`;
  let dbObject = await db.all(getAllTeamsQuery);

  const convertDbObjectToResponseObject = dbObject.map((object) => {
    return {
      playerId: object.player_id,
      playerName: object.player_name,
      jerseyNumber: object.jersey_number,
      role: object.role,
    };
  });

  response.send(convertDbObjectToResponseObject);
});

//API 2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const createPlayerQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES ('${playerName}',${jerseyNumber},'${role}');`;
  await db.run(createPlayerQuery);
  //const playerId = dbResponse.lastID;
  response.send("Player Added To Team");
});
//API 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    select * from cricket_team where player_id = ${playerId}`;
  const playerObject = await db.get(getPlayerQuery);
  const responseObject = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: playerObject.role,
    };
  };
  const resultObject = responseObject(playerObject);

  response.send(resultObject);
});

//API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    update cricket_team set player_name = '${playerName}',jersey_number=${jerseyNumber},role='${role}';`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    delete from cricket_team where player_id = ${playerId}`;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
