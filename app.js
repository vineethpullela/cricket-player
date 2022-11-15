const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");

const initializerDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    module.exports = app.listen(3000);
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializerDBAndServer();

//API 1

app.get("/players/", async (request, response) => {
  const getAllTeamsQuery = `
    select player_id as playerId,
    player_name as playerName,
    jersey_number as jerseyNumber,
    role as role from cricket_team ;`;
  const teamArray = await db.all(getAllTeamsQuery);
  response.send(teamArray);
});

//API 2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId, playerName, JerseyNumber, role } = playerDetails;
  const createPlayerQuery = `
    insert into cricket_team (player_id,player_Name,jersey_Number,role)
    Values(${playerId},${playerName},${jerseyNumber},${role});`;

  await db.run(createPlayerQuery);
  //const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    select * from cricket_team where player_id = ${playerId};`;

  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API 4

app.put("/players/:playerId/", async (request, response) => {
  const { player_id } = request.params;
  const playerDetails = request.body;

  const { player_Name, Jersey_Number, role } = playerDetails;
  const updatePlayerQuery = `
    update cricket_team set 
    player_id= ${player_id},
    player_Name = ${player_Name},
    jersey_Number= ${jersey_Number},
    role=${role}
    where player_id= ${player_id};`;

  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//API 5

app.delete("/players/:playedId/", async (request, response) => {
  const { playedId } = request.params;
  const deletePlayerQuery = `
    delete from cricket_team where player_id=${playerId};`;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
