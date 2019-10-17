const { pool } = require('./db');

/**
 * Get /Packages
 * Select all packages for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrders = (request, response) => {
  var query = 'SELECT * FROM "Orders" inner join "Person" on "Person"."ID"="Orders"."PersonID"';
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
const getOrdersDetailed = (request, response) => {
  var query = 'SELECT 	"Orders".*, "Person".*,	"addrop"."StreetAddress" as dropstreetAddress, 	"addrop"."City" as dropcity,' +
  '"addrop"."Country" as dropcountry, "addrop"."PostCode" as droppostcode, 	"adpick"."StreetAddress" as pickstreetAddress,' +
  '"adpick"."City" as pickcity,	"adpick"."Country" as pickcountry,	"adpick"."PostCode" as pickpostcode FROM "Orders" inner join "Address" addrop on "Orders"."DropAddressID"="addrop"."AddressID" ' +
  'inner join "Address" adpick on "Orders"."PickAddressID"="adpick"."AddressID" inner join "Person" on "Orders"."PersonID" = "Person"."ID"'; 
  


  if (request.userType == 2) {
    query += ' Where "Orders"."CompanyId"=' + request.PersonRole;

  }
  else if (request.userType == 1) {
    query += ' Where "Orders"."PersonID"=' + request.userId;
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
 * Get /Packagesdetails
 * Select all packages for the database
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrdersDetails = (request, response) => {

  var query = 'SELECT * FROM "Orders" inner join "Address" on "Orders"."DropAddressID"="Address"."AddressID"';
  query = authenticate(request, response, query);
  query += 'ORDER BY "OrderID" ASC';

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Get /package/:id
 * Get package by ID
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrderById = (request, response) => {

  const id = parseInt(request.params.orderId, 10);

  var query = 'SELECT	"Orders".*,	"addrop"."StreetAddress" as dropstreetAddress, 	"addrop"."City" as dropcity,' +
    '"addrop"."Country" as dropcountry, "addrop"."PostCode" as droppostcode, 	"adpick"."StreetAddress" as pickstreetAddress,' +
    '"adpick"."City" as pickcity,	"adpick"."Country" as pickcountry,	"adpick"."PostCode" as pickpostcode FROM "Orders" inner join "Address" addrop on "Orders"."DropAddressID"="addrop"."AddressID" ' +
    'inner join "Address" adpick on "Orders"."PickAddressID"="adpick"."AddressID"';
  authenticate(request, response, query); //TODO: return type
  query += 'and "Orders"."OrderID" = $1'

  pool.query(query, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

/**
 * Get /package/details/:id
 * Get package by ID
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrderDetailsById = (request, response) => {

  const id = parseInt(request.params.id, 10);

  var query = 'SELECT	"Orders".*, "Company".*,"OrderSensors".*, "addrop"."StreetAddress" as dropstreetAddress, 	"addrop"."City" as dropcity,' +
    '"addrop"."Country" as dropcountry, "addrop"."PostCode" as droppostcode, 	"adpick"."StreetAddress" as pickstreetAddress,' +
    '"adpick"."City" as pickcity,	"adpick"."Country" as pickcountry,	"adpick"."PostCode" as pickpostcode FROM "Orders" inner join "Address" addrop on "Orders"."DropAddressID"="addrop"."AddressID" ' +
    'inner join "Address" adpick on "Orders"."PickAddressID"="adpick"."AddressID" inner join "Company" on "Company"."Id"="Orders"."CompanyId"'+
    'left join "OrderSensors" on "OrderSensors"."OrderId"= "Orders"."OrderID" ';
  query = authenticate(request, response, query);
  query += ' and "Orders"."OrderID" = $1'

  pool.query(query, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


/**
 * Get /userpackagetimeline/:pkgid
 * Get package timeline from the blockchain back-end
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */

//TODO: hardcoded for dummy implementation
const getPackageTimeline = (request, response) => {
  // const id = parseInt(request.params.pkgid);

  const results = [{
    // give sorted data; fake it for now, date, time, location, company, postman, status
    date: '2018-05-01',
    location: 'Berlin',
    company: 'DHL',
    postman: 'ps1',
    status: 'Registered',
  },
  {
    // give sorted data; fake it for now, date, time, location, company, postman, status
    date: '2018-05-03',
    location: 'Hamburg',
    company: 'DHL',
    postman: 'ps2',
    status: 'Dispatched',
  },
  ];
  response.status(200).json(results);
};


/**
 * Post /package
 * Create new package
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const createOrder = (request, response) => {
  if (request.userType == 2 || request.userType == 1) {
    const {
      pickaddressid, dropaddressid, pickdate, arrivaldate, personid, receieverid, status,companyId
    } = request.body;

    pool.query('INSERT INTO "Orders" ("PickAddressID", "DropAddressID", "PickDate", "ArrivalDate", "PersonID","ReceiverPersonID", "Status","CompanyId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [pickaddressid, dropaddressid, pickdate, arrivaldate, personid, receieverid, status, companyId], (error, result) => {
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
 * PUT /package/:id
 * update the existing package
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const updateOrder = (request, response) => {
  if (request.userType == 2 || request.userType == 1) {
    const id = parseInt(request.params.id, 10);
    const {
      PickAddressID, DropAddressID, PickDate, ArrivalDate, PersonID, ReceiverPersonID, Status
    } = request.body;

    pool.query(
      'UPDATE "Orders" SET "PickAddressID" = $1, "DropAddressID" = $2, "PickDate" = $3, "ArrivalDate" = $4, "PersonID"=$5,' +
      ' "ReceiverPersonID"=$6, "Status"=$7 WHERE "OrderID" = $8',
      [PickAddressID, DropAddressID, PickDate, ArrivalDate, PersonID, ReceiverPersonID, Status, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.sendStatus(200);
      },
    );
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
};



/**
 * PUT /package/:id
 * update the existing package
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const putOrder = (request, response) => {
  if (request.userType) {
    const id = parseInt(request.params.id, 10);
    const {
      PickAddressID, DropAddressID, PickDate, ArrivalDate, PersonID, ReceiverPersonID, Status
    } = request.body;
    
    var params = [];
    var query = 'UPDATE "Orders" SET ';

    if(PickAddressID)
    {
      params.push(PickAddressID);
      query+= ' "PickAddressID" = '+PickAddressID;
    }

    if(DropAddressID)
    {
      params.push(DropAddressID);
      query+= ' "DropAddressID" = '+DropAddressID;
    }

    if(Status){
      params.push(Status);
      query += '"Status"= \''+ Status +'\' '
    }

    query +=  ' WHERE "OrderID" = '+id;

    //',  $2, "PickDate" = $3, "ArrivalDate" = $4, "PersonID"=$5,' +     ' "ReceiverPersonID"=$6, ,
    //[, , PickDate, ArrivalDate, PersonID, ReceiverPersonID, , id],
    

    pool.query(query, (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json([]);
      },
    );
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
};




/**
 * Delete /package/:id
 * update the existing package
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const deleteOrder = (request, response) => {
  if (request.userType == 2 || request.userType == 1) {
    const id = parseInt(request.params.id, 10);

    pool.query('DELETE FROM "Orders" WHERE "OrderID" = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.sendStatus(200);
    });
  } else {
    response.status(401).send("You cannnot perform this operation");
  }
};


/**
 * GET /packages/user/:userid
 * GET all packages for a specific user
 * @param {obj} request request object from node framework
 * @param {obj} response response object * 
 */
const getOrdersByUser = (request, response) => {
  const userId = parseInt(request.params.userid, 10);

  pool.query('SELECT 	"Orders".*, "Person".*,	"addrop"."StreetAddress" as dropstreetAddress, 	"addrop"."City" as dropcity,' +
    '"addrop"."Country" as dropcountry, "addrop"."PostCode" as droppostcode, 	"adpick"."StreetAddress" as pickstreetAddress,' +
    '"adpick"."City" as pickcity,	"adpick"."Country" as pickcountry,	"adpick"."PostCode" as pickpostcode FROM "Orders" inner join "Address" addrop on "Orders"."DropAddressID"="addrop"."AddressID" ' +
    'inner join "Address" adpick on "Orders"."PickAddressID"="adpick"."AddressID" inner join "Person" on "Orders"."PersonID" = "Person"."ID"' +
    'where "Orders"."PersonID"= $1 ORDER BY "Orders"."OrderID" desc', [userId], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
};


//private method to authenticate based on user type and company type
const authenticate = (request, response, query) => {

  if (request.userType == 2) {
    query += ' Where "CompanyId"=' + request.PersonRole;

  }
  else if (request.userType == 1) {
    query += ' Where "PersonID"=' + request.userId;
  }
  else {
    response.status(401).send("You cannnot perform this operation");
  }
  return query;
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
  getPackageTimeline,
  getOrdersDetails,
  getOrderDetailsById,
  putOrder,
  getOrdersDetailed
};
