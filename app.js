import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const app = express();
const port = 3000;

const CURRENT_311_TABLE_NAME = "current_311";
const DEPRECATED_311_TABLE_NAME = "deprecated_311";
const PARCEL_TABLE_NAME = "parcel";

const client = new Client(process.env.connectionString);

await client.connect();

// TO DOS:
// limit queries to only the 311 data we care about
// combine endpoints and accept a km_threshold parameter, defaults to 0.02
// standardize the disparate 311 data types into a single, standardized response (limit props for faster loading times)
// document how the current stack works
// figure out how to use internal url credentials scheme on render env variables for faster queries

app.use(function (_req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Origin", "*"); // can limit domains here
  next();
});

app.get("/", (_req, res) => {
  res.send("Hello world");
});

app.get("/fetch-311-for-address", async (req, res) => {
  const query = { req };
  const { latitude, longitude, houseNumber } = query?.req?.query || query;

  // we search for 311 reports on two datasets, with two restrictive criteria:
  // 1 - only get reports within 0.02 KM of the longitude and latitude passed
  // 2 - only get reports that have a defined address that starts with the house number of the address we are querying for
  const distance_threshold_km = 0.02;

  if (!latitude || !longitude) {
    throw new Error("Latitude or longitude undefined");
  }

  if (!houseNumber) throw new Error("House number undefined");

  const { rows: new311Rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
            (6371 * 2 * ASIN(SQRT(
                POWER(SIN(RADIANS(latitude - $1) / 2), 2) +
                COS(RADIANS($1)) * COS(RADIANS(latitude)) *
                POWER(SIN(RADIANS(longitude - $2) / 2), 2)
            ))) AS distance
        FROM ${CURRENT_311_TABLE_NAME}
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
          AND incident_address IS NOT NULL
          AND incident_address LIKE $4 || '%'
    )
    SELECT *
    FROM calculated_distances
    WHERE distance <= $3
    ORDER BY open_date_time ASC;
    `, [latitude, longitude, distance_threshold_km, houseNumber]
  );

  const { rows: old311Rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
            (6371 * 2 * ASIN(SQRT(
                POWER(SIN(RADIANS(latitude - $1) / 2), 2) +
                COS(RADIANS($1)) * COS(RADIANS(latitude)) *
                POWER(SIN(RADIANS(longitude - $2) / 2), 2)
            ))) AS distance
        FROM ${DEPRECATED_311_TABLE_NAME}
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
          AND street_address IS NOT NULL
          AND street_address LIKE $4 || '%'
    )
    SELECT *
    FROM calculated_distances
    WHERE distance <= $3
    ORDER BY creation_date ASC;
    `, [latitude, longitude, distance_threshold_km, houseNumber]
  );

  res.send([...new311Rows, ...old311Rows]);
});

// this is currently unused
app.get("/fetch-nearby-311", async (req, res) => {
  const query = { req };
  const { latitude, longitude } = query?.req?.query || query;

  const distance_threshold_km = 0.5; // about a 10 minute walk

  if (!latitude || !longitude) {
    // TO DO: throw error
    console.log("no latitude or longitude");
    res.send("Latitude or longitude undefined");
    return;
  }

  const { rows: new311Rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
        (6371 * 2 * ASIN(SQRT(
            POWER(SIN(RADIANS(latitude - $1) / 2), 2) +
            COS(RADIANS($1)) * COS(RADIANS(latitude)) *
            POWER(SIN(RADIANS(longitude - $2) / 2), 2)
        ))) AS distance
        FROM ${CURRENT_311_TABLE_NAME}
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    )
    SELECT *
    FROM calculated_distances
    WHERE distance <= $3
    ORDER BY distance ASC;
    `, [latitude, longitude, distance_threshold_km]
  );

  const { rows: old311Rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
        (6371 * 2 * ASIN(SQRT(
            POWER(SIN(RADIANS(latitude - $1) / 2), 2) +
            COS(RADIANS($1)) * COS(RADIANS(latitude)) *
            POWER(SIN(RADIANS(longitude - $2) / 2), 2)
        ))) AS distance
        FROM ${DEPRECATED_311_TABLE_NAME}
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    )
    SELECT *
    FROM calculated_distances
    WHERE distance <= $3
    ORDER BY distance ASC;
    `, [latitude, longitude, distance_threshold_km]
  );

  res.send([...new311Rows, ...old311Rows]);
});

app.get("/search-parcel", async (req, res) => {
  const query = { req };
  const { latitude, longitude, houseNumber } = query?.req?.query || query;

  if (!latitude || !longitude) {
    throw new Error("Latitude or longitude undefined");
  }

  if (!houseNumber) throw new Error("House number undefined");

  const { rows } = await client.query(
    `
    WITH calculated_distances AS (
        SELECT *,
        (6371 * 2 * ASIN(SQRT(
            POWER(SIN(RADIANS(latitude - $1) / 2), 2) +
            COS(RADIANS($1)) * COS(RADIANS(latitude)) *
            POWER(SIN(RADIANS(longitude - $2) / 2), 2)
        ))) AS distance
        FROM ${PARCEL_TABLE_NAME}
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
          AND address IS NOT NULL
          AND address LIKE $3 || '%'
    )
    SELECT *
    FROM calculated_distances
    ORDER BY distance ASC
    LIMIT 1;
    `, [latitude, longitude, houseNumber]
  );

  res.send(rows[0]);
});

app.listen(port, () => console.log(`listening on port: ${port}`));

app.use((_req, res, _next) => {
  res.status(404).send("Sorry can't find that!");
});
