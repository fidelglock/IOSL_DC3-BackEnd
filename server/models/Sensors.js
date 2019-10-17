const { pool } = require('./db');

const getSensor = (request, response) => {
  pool.query('SELECT * FROM "Sensor" ORDER BY "Id" ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getSensorById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT * FROM "Sensor" WHERE "Id" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const createSensor = (request, response) => {
  const {
    name, description, minValue, maxValue, displayUnit
  } = request.body;

  pool.query('INSERT INTO "Sensor" ("Name", "Description", "MinValue", "MaxValue","DisplayUnit") VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, minValue, maxValue, displayUnit], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).json(result.rows[0]);
    });
};


const updateSensor = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const {
    name, description, minValue, maxValue, displayUnit
  } = request.body;

  pool.query(
    'UPDATE "Sensor" SET "Name" = $1, "Description" = $2, "MinValue"=$3, "MaxValue"=$4, "DisplayUnit"=$5 WHERE "ID" = $6 ',
    [name, description, minValue, maxValue, displayUnit, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200);
    },
  );
};


const deleteSensor = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('DELETE FROM Sensor WHERE "Id" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200);
  });
};


module.exports = {
  getSensor,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor,
};
