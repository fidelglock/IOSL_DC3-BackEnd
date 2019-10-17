const { pool } = require('./db');

/**
 * Get all users from the system
 * @param {object} request Request object
 * @param {object} response response object
 */
const getPersons = (request, response) => {
  pool.query('SELECT * FROM "Person" ORDER BY "ID" ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Get users from the system using ID
 * @param {object} request Request object
 * @param {object} response response object
 */
const getPersonById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('SELECT * FROM "Person" WHERE "ID" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Verify the user login information
 * @param {object} request Request object
 * @param {object} response response object
 */
const userLogin = (request, response) => {
  const { email, password } = request.body;

  pool.query('SELECT * FROM "Person" WHERE "Email" = $1 and "Password" = $2', 
  [email, password], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Get person infomration via Email
 * @param {object} request Request object
 * @param {object} response response object
 */
const getPersonByEmail = (request, response) => {
  
  pool.query('SELECT * FROM "Person" WHERE "Email" = $1', [request.params.email], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


/**
 * Insert person into the database
 * @param {object} request Request object
 * @param {object} response response object
 */
const createPerson = (request, response) => {
  const {
    fullname, email, password, persontype,
  } = request.body;
  pool.query('INSERT INTO "Person" ("FullName", "Email", "Password", "PersonType") VALUES ($1, $2, $3, $4)',
    [fullname, email, password, persontype], (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`${result.rowCount} User added `);
    });
};

/**
 * update person infomration in the database
 * @param {object} request Request object
 * @param {object} response response object
 */
const updatePerson = (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { fullname, email, persontype } = request.body;

  pool.query(
    'UPDATE "Person" SET "FullName" = $1, "Email" = $2, "PersonType"=$3 WHERE "ID" = $4 ',
    [fullname, email, persontype, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Users updated: ${results.rowCount}`);
    },
  );
};


/**
 * update a person to specific type
 * @param {object} request Request object
 * @param {object} response response object
 */
const updateUserType = (request, response) => {

  if (request.userType == 2) {
    const { userid, persontype } = request.body;

    var query = 'update "Person" set "PersonType"=$1 where "Person"."ID"= $2';
    pool.query(query, [userid, persontype], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(results.rows);
    });
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
};


/**
 * update a person to specific type
 * @param {object} request Request object
 * @param {object} response response object
 */
const updateUserTypeByEmail = (request, response) => {

  if (request.userType == 2) {
    const { email, persontype } = request.body;

    var query = 'update "Person" set "PersonType"=$1 where "Person"."Email"= $2';
    pool.query(query, [persontype, email], (error, results) => {
      if (error) {
        throw error;
      }
      if(results.rowCount>0) response.status(200).json({"success":true});
      else response.status(200).json({"success":false});      
    });
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
};


/**
 * Delete a person
 * @param {object} request Request object
 * @param {object} response response object
 */
const deletePerson = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query('DELETE FROM "Person" WHERE "ID" = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Person deleted with ID: ${results.rows[0].ProjectId}`);
  });
};


/**c
 * Get users from the database using provideID
 * @param {object} request Request object
 * @param {object} response response object
 */
const getPersonByProviderId = (googleProviderId) => {

  return pool.query('SELECT * FROM "Person" WHERE "googleProviderId" = $1', [googleProviderId])
    .then(results => {
      if (results.rowCount > 0) return results.rows;
      else return [];
    })
    .catch(error => {
      console.log(error.stack);
    });
};



/**
 * Insert person into the database
 * @param {object} request Request object
 * @param {object} response response object
 */
const createPersonProvider = (fullname, email, password, persontype, googleProviderId, googleAccessToken) => {

  persontype = 1; //defaulting and then admin can change

  return pool.query('INSERT INTO "Person" ("FullName", "Email", "Password", "PersonType","googleProviderId","googleAccessToken") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [fullname, email, password, persontype, googleProviderId, googleAccessToken])
    .then(results => {
      if (results.rowCount > 0) return results.rows[0];
    })
    .catch(error => console.log(error.stack));
};

const upsertGoogleUser = (accessToken, refreshToken, profile, cb) =>{
  
  return getPersonByProviderId(profile.id)
      .then(function(users){        
        if(users && users.length>0){ //existing user
          return cb(null, users[0]);
        }
        else{ // no user was found, lets create a new one

          return createPersonProvider(
              profile.displayName,
              profile.emails[0].value,
              '',
              null,
              profile.id,
              accessToken
          ).then(function(savedUser){
            return cb(null, savedUser);
          });
        }

      }); 
};


module.exports = {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
  getPersonByEmail,
  updateUserType,
  userLogin,
  upsertGoogleUser,
  getPersonByProviderId,
  createPersonProvider,
  updateUserTypeByEmail
};
