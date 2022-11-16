const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
//app.use(express.json());

let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");

const initializerDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, async () => {
      console.log("server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializerDbAndServer();

//API 1

app.get("/players/", async (request, response) => {
  const getAllTeamsQuery = `
    select * from cricket_team ;`;
  const dbObject = await db.all(getAllTeamsQuery);

  /*const convertDbObjectToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };*/

  response.send(dbObject);
});

//API 2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, JerseyNumber, role } = playerDetails;
  const createPlayerQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES('${playerName}',${jerseyNumber},'${role}');`;
  await db.run(createPlayerQuery);
  //const playerId = dbResponse.lastID;
  response.send("Player Added To Team");
});
//API 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    select * from cricket_team where player_id = ${playerId}`;

  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
    update cricket_team set player_name = '${playerName}',jersey_number=${jerseyNumber},role='${role}';`;
  await db.run(updatePlayerQuery);
  response.send("Player deatils Updated");
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    delete from cricket_team where player_id = ${playerId}`;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
