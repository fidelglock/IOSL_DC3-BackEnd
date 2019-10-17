const pool = require('./db').pool


const getIncidents = (request, response) => {
    
    var query = 'SELECT * FROM "Incident" ';
    if (request.userType == 1) {
        query += ' inner join "Person"  on "Person"."ID"="Incident"."PersonId" Where "PersonId"=' + request.userId;
    }
    else{
        query += ' ORDER BY "IncidentId" DESC';
    }    

    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const getIncidentById = (request, response) => {
    const id = parseInt(request.params.id);

    var query = 'SELECT * FROM "Incident" ';

    if (request.userType == 1) {
        query += ' inner join "Person"  on "Person"."ID"="Incident"."PersonId" Where "PersonId"=' + request.userId;
        query += ' and "IncidentId" = $1 ORDER BY "IncidentId" DESC';
    }
    else{
        query += ' Where "IncidentId" = $1 ORDER BY "IncidentId" DESC';
    }

    pool.query(query, [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}


const createIncident = (request, response) => {
    const { Description, OrderId, PersonId } = request.body

    pool.query('INSERT INTO "Incident" ("Description", "OrderId", "PersonId") VALUES ($1, $2, $3) RETURNING *',
        [Description, OrderId, PersonId], (error, result) => {
            if (error) {
                throw error
            }
            response.status(201).json(result.rows[0]);
        });
}


const updateIncident = (request, response) => {
    const id = parseInt(request.params.id)
    const { Description, OrderId, PersonId } = request.body

    pool.query(
        'UPDATE "Incident" SET "Description" = $1, "OrderId" = $2, "PersonId" = $3 WHERE "IncidentId" = $4',
        [Description, OrderId, PersonId, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200);
        }
    );
}


const deleteIncident = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM "Incident" WHERE "IncidentId" = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200);
    });
}

module.exports = {
    getIncidents,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident
}