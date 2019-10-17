const { pool } = require('./db');

/**
 * Get /OrderSensors
 * Select all OrderSensorss for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrderSensors = (request, response) => {

  pool.query('SELECT * FROM "OrderSensors" ORDER BY "Id" Desc', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });

};


/**
 * Get /OrderSensorsdetails
 * Select all OrderSensorss for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrderSensorDetails = (request, response) => {
  if (request.userId) {
    var query = `SELECT * FROM "OrderSensors" inner Join "Orders" on "Orders"."OrderID"="OrderSensors"."Id" 
    inner join "Person" on "Person"."ID"="Orders"."PersonID" where "Person"."ID"=${request.userId}`;
    pool.query(query, (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      });
  }
  else {
    response.status(401);
  }
};

//


/**
 * Get /getOrderSensorsByPackageId
 * Get OrderSensors by ID
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrderSensorsByPackageId = (request, response) => {
  const id = parseInt(request.params.id, 10);

  if (request.userId) {
    pool.query('SELECT * FROM "OrderSensors" inner Join "Orders" on "Orders"."OrderID"="OrderSensors"."OrderId"' +
      ' where "Orders"."OrderID"=$1', [id], (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rowCount > 0) {
          results.rows.map(row => {

            //TODO: Fetch from BC
            if (row.SensorId == 1) {
              row.bc_MinThreshold = row.MinThreshold;
              row.bc_MaxThreshold = row.MaxThreshold;
            }
            else {
              row.bc_heavy = row.heavy;
              row.bc_light = row.light;
              row.bc_severe = row.severe;
            }
          });
          response.status(200).json(results.rows);
        }
        else {
          response.sendStatus(404);
        }

      });
  }
  else {
    response.status(401);
  }
};

//[request.userId, id],

/**
 * Get /OrderSensors/:id
 * Get OrderSensors by ID
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrderSensorsById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  var query = `SELECT * FROM "OrderSensors" inner Join "Orders" on "Orders"."OrderID"="OrderSensors"."Id" 
  inner join "Person" on "Person"."ID"="Orders"."PersonID" where "Person"."ID"=${request.userId} and "Id"=${id}`;

  if (request.userId) {
    pool.query(query, (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      });
  }
  else {
    response.sendStatus(401);
  }
};

/**
 * Post /OrderSensors
 * Create new OrderSensors
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const createOrderSensors = (request, response) => {
  const {
    orderId, sensorId, minThreshold, maxThreshold, light, heavy, severe
  } = request.body;

  pool.query('INSERT INTO "OrderSensors" ("OrderId", "SensorId", "MinThreshold", "MaxThreshold", "light","heavy", "severe") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [orderId, sensorId, minThreshold, maxThreshold, light, heavy, severe], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).json(result.rows[0]);
    });
};


/**
 * Delete /OrderSensors/:id
 * update the existing OrderSensors
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const deleteOrderSensors = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('DELETE FROM "OrderSensors" WHERE "Id" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.sendStatus(200);
  });
};

module.exports = {
  getOrderSensors,
  getOrderSensorsById,
  getOrderSensorDetails,
  createOrderSensors,
  deleteOrderSensors,
  getOrderSensorsByPackageId
};
