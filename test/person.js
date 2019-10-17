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


describe('/GET person', () => {

  /*
  * /GET person
  * Test the /GET all person records
  */
  it('It should GET all the person', (done) => {
    chai.request(server)
      .get('/persons')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.above(7);
        done();
      });
  });

  /*
  * /GET person/id
  * Test the single person records from the database
  */
  it('It should GET single person', (done) => {
    chai.request(server)
      .get('/persons/57')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  /*
  * /GET person/id
  * Test the single person records that doesn't exist
  */
  it('It should not GET any person and return empty array', (done) => {
    chai.request(server)
      .get('/persons/-35')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });


  /*
  * /GET /persons/exists/:email
  * Test the single person records that doesn't exist
  */
 it('check if person really exist in the DB', (done) => {
  chai.request(server)
    .get('/persons/exists/haseeb1431@gmail.com')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');      
      done();
    });
});

});