const { pool } = require('./db');

/**
 * Get /Company
 * Select all Company for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getCompany = (request, response) => {
  pool.query('SELECT * FROM "Company" ORDER BY "Id" Desc', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Get /company/:id
 * Get company by ID
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getCompanyById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT * FROM "Company" WHERE "Company"."Id" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    if(results.rowCount > 0) response.status(200).json(results.rows);
    else response.sendStatus(404);
  });
};


/**
 * Post /company
 * Create new company
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const createCompany = (request, response) => {

  if (request.userType == 2) {


    const { name, description } = request.body;

    pool.query('INSERT INTO "Company" ("Name", "Description") VALUES ($1, $2) RETURNING *',
      [name, description], (error, result) => {
        if (error) {
          throw error;
        }
        response.status(201).json(result.rows[0]);
      });
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
};

/**
 * Delete /company/:id
 * update the existing company
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const deleteCompany = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('DELETE FROM "Company" WHERE "Id" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.sendStatus(200);
  });
};


module.exports = {
  getCompany,
  getCompanyById,
  createCompany,
  deleteCompany
};
