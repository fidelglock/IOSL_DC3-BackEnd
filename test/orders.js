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

describe('/GET packages', () => {

  
  /*
  * /GET packages
  * Test the /GET all packages records
  */
  it('It should GET all the packages', (done) => {
    chai.request(server)
      .get('/packages')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.above(3);
        done();
      });
  });


//   /*
//   * /GET packages/id
//   * Test the single packages records from the database
//   */
  it('It should GET single packages', (done) => {
    chai.request(server)
      .get('/packages/5')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
  
//     /*
//   * /GET packagesDetails
//   * Test the single packages records from the database
//   */
 it('It should GET package details with additional joins with other relations', (done) => {
  chai.request(server)
    .get('/packagesDetails')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
});


//     /*
//   * /GET packagesaddressdetails
//   */
it('It should GET package details with additional joins with other address relations', (done) => {
  chai.request(server)
    .get('/packagesaddressdetails')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
});


//     /*
//   * /GET packages/details/:id
//   */
it('It should GET package details with additional joins based on provided id', (done) => {
  chai.request(server)
    .get('/packages/details/35')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
});


//     /*
//   * /GET packages/user/:userid
//   */
it('It should GET package for a specific user id', (done) => {
  chai.request(server)
    .get('/packages/user/57')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
});


  /*
  * GET /packages/timeline/:packageid
  * Get package timeline
  */
  it('It should GET package for a specific user id', (done) => {
    chai.request(server)
      .get('/packages/timeline/:35')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });


//   /*
//   * /GET packages/id
//   * Test the single packages records that doesn't exist
//   */
  it('It should not GET any packages and return empty array', (done) => {
    chai.request(server)
      .get('/packages/-35')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

});