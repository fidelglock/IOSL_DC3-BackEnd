//Require the dev-dependencies and setup chai
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let {createToken} = require('../server/config/token.utils');
chai.use(chaiHttp);

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Mocked user token for authorization
let access_token_key = 'x-access-token';
let access_token = createToken({id:1, type:2, PersonRole:1}); 
let access_token_usertype1 = createToken({id:1, type:1, PersonRole:1}); 

describe('/GET orderHistory', () => {

  
  /*
  * /GET orderhistory
  * Test the /GET all orderhistory records
  */
  it('It should GET all the Order History rows', (done) => {
    chai.request(server)
      .get('/orderHistory')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.above(3);
        done();
      });
  });


//   /*
//   * /GET orderhistory/id
//   * Test the single orderhistory records from the database
//   */
  it('It should GET single orderhistory', (done) => {
    chai.request(server)
      .get('/orderHistory/5')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
  
//     /*
//   * /GET orderHistoryDetails
//   * Test the single orderhistory records from the database
//   */
 it('It should GET Order History with additional joins with other relations', (done) => {
  chai.request(server)
    .get('/orderHistoryDetails')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
});


//   /*
//   * /GET orderhistory/id
//   * Test the single orderhistory records that doesn't exist
//   */
  it('It should not GET any orderHistory and return empty array', (done) => {
    chai.request(server)
      .get('/orderHistory/-35')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

});