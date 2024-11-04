import express from "express";
import pg from 'pg'
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// establish git repository
// figure out how to get on render

const app = express()
const port = 3000

const CURRENT_311_TABLE_NAME = "current_311";
const DEPRECATED_311_TABLE_NAME = "deprecated_311"

const client = new Client({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
})

await client.connect()

app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Origin", "*"); // can limit domains here
  next();
});

app.get("/", (_req, res) => {
  res.send("Hello world");
})

app.get('/fetch-311', async (req, res) => {
  const query = { req };
  const { latitude, longitude } = (query?.req?.query || query);

  // longitude and latitude can vary a bit for the same address in the data
  // so we apply a strict distance threshold to get as close as possible
  // to only returning results from the same address
  const distance_threshold_km = 0.02;

  if (!latitude || !longitude ) {
    throw new Error("Latitude or longitude undefined")
  }

  const { rows: new311Rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
        (6371 * 2 * ASIN(SQRT(
            POWER(SIN(RADIANS(latitude - ${latitude}) / 2), 2) +
            COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) *
            POWER(SIN(RADIANS(longitude - ${longitude}) / 2), 2)
        ))) AS distance
        FROM ${CURRENT_311_TABLE_NAME}
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    )
    SELECT *
    FROM calculated_distances
    WHERE distance <= ${distance_threshold_km}
    ORDER BY distance ASC;
    `
  );

  const { rows: old311Rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
        (6371 * 2 * ASIN(SQRT(
            POWER(SIN(RADIANS(latitude - ${latitude}) / 2), 2) +
            COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) *
            POWER(SIN(RADIANS(longitude - ${longitude}) / 2), 2)
        ))) AS distance
        FROM ${DEPRECATED_311_TABLE_NAME}
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    )
    SELECT *
    FROM calculated_distances
    WHERE distance <= ${distance_threshold_km}
    ORDER BY distance ASC;
    `
  );
  
  res.send([...new311Rows, ...old311Rows])
});


app.get('/fetch-nearby-311', async (req, res) => {
  const query = { req };
  const { latitude, longitude } = (query?.req?.query || query);

  const distance_threshold_km = 0.5; // about a 10 minute walk

  if (!latitude || !longitude ) {
    // TO DO: throw error
    console.log("no latitude or longitude");
    res.send("Latitude or longitude undefined")
    return;
  }

  const { rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
        (6371 * 2 * ASIN(SQRT(
            POWER(SIN(RADIANS(latitude - ${latitude}) / 2), 2) +
            COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) *
            POWER(SIN(RADIANS(longitude - ${longitude}) / 2), 2)
        ))) AS distance
        FROM ${CURRENT_311_TABLE_NAME}
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    )
    SELECT *
    FROM calculated_distances
    WHERE distance <= ${distance_threshold_km}
    ORDER BY distance ASC;
    `
  );
  
  res.send(rows)
});

app.get("/parcel/search", (req, res) => {
  res.send([])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use((_req, res, _next) => {
  res.status(404).send("Sorry can't find that!")
})