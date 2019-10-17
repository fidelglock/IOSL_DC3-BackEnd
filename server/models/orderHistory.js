const { pool } = require('./db');

/**
 * Get /Order History
 * Select all packages for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrdersHistory = (request, response) => {
  
    var query = 'SELECT * FROM "OrderHistory" inner join "Orders" on "OrderHistory"."OrderId"="Orders"."OrderID" ';
    query = authenticate(request, response, query);

    pool.query(query, (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });  
};




/**
 * Get /PackagesDetails
 * Select all packages for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrdersHistoryDetailed = (request, response) => {
  var query = 'SELECT	"Orders".*, "Person".*,	"addrop"."StreetAddress" as dropstreetAddress, 	"addrop"."City" as dropcity,' +
  '"addrop"."Country" as dropcountry, "addrop"."PostCode" as droppostcode, 	"adpick"."StreetAddress" as pickstreetAddress,' +
  '"adpick"."City" as pickcity,	"adpick"."Country" as pickcountry,	"adpick"."PostCode" as pickpostcode FROM "Orders" inner join "Address" addrop on "Orders"."DropAddressID"="addrop"."AddressID" ' +
  'inner join "Address" adpick on "Orders"."PickAddressID"="adpick"."AddressID" inner join "Person" on "Orders"."PersonID" = "Person"."ID"'+
  '  	inner join "OrderHistory" on  "OrderHistory"."OrderId"="Orders"."OrderID"'; 


  if (request.userType == 2) {
    query += ' Where "Orders"."CompanyId"=' + request.PersonRole;
  }
  else if (request.userType == 1) {
    query += ' Where "Orders"."PersonID"=' + request.userId;
  }
  else if (request.userType == 3) {
    query += ' Where "OrderHistory"."PostmanId"=' + request.userId;
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
  query = query + ' ORDER BY "Orders"."OrderID" desc';


  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};




/**
 * Get /Order History
 * Select all packages for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrdersHistoryById = (request, response) => {

  const id = parseInt(request.params.id, 10);

  var query = 'SELECT "OrderHistory".*, "Company".*, "Person"."FullName" FROM "OrderHistory" inner join "Orders" on "OrderHistory"."OrderId"="Orders"."OrderID" '+
  'inner join "Company" on "Orders"."CompanyId"="Company"."Id" left join "Person" on "Person"."ID" = "OrderHistory"."PostmanId"'+
    'Where "OrderID"=$1  order by "OrderHistory"."Id" asc';
  //query = authenticate(request, response, query);

  pool.query(query, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};



/**
 * Post /package History
 * Create new package history or handover
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const createOrderHistory = (request, response) => {
  if (request.userType) {
    const {
      orderId, postmanId, handoverDate, status
    } = request.body;

    pool.query('INSERT INTO "OrderHistory" ("OrderId", "PostmanId", "HandoverDate", "Status") VALUES ($1, $2, current_timestamp, $3) RETURNING *',
      [orderId, postmanId, status], (error, result) => {
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


//private method to authenticate based on user type and company type
const authenticate = (request, response, query) => {

  if (request.userType == 2) {
    query += ' Where "CompanyId"=' + request.PersonRole;

  }
  else if (request.userType == 3) {
    query += ' Where "PostmanId"=' + request.userId;
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
  return query;
}

module.exports = {
  getOrdersHistory,
  createOrderHistory,
  getOrdersHistoryById,
  getOrdersHistoryDetailed
};
