const { pool } = require('./db');

const getAddress = (request, response) => {
  pool.query('SELECT * FROM "Address" ORDER BY "AddressID" ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getAddressById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT * FROM "Address" WHERE "AddressID" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const createAddress = (request, response) => {
  const {
    street, city, country, postcode,
  } = request.body;

  pool.query('INSERT INTO "Address" ("StreetAddress", "City", "Country", "PostCode") VALUES ($1, $2, $3, $4) RETURNING *',
    [street, city, country, postcode], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).json(result.rows[0]);
    });
};


const updateAddress = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const {
    street, city, country, postcode,
  } = request.body;

  pool.query(
    'UPDATE "Address" SET "StreetAddress" = $1, "City" = $2, "Country"=$3, "PostCode"=$4 WHERE "AddressID" = $5 ',
    [street, city, country, postcode, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Address updated: ${results.rowCount}`);
    },
  );
};


const deleteAddress = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('DELETE FROM Address WHERE "AddressID" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Address deleted with ID: ${results.rows[0].ProjectId}`);
  });
};


module.exports = {
  getAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
