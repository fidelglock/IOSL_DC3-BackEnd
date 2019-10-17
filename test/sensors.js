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


describe('/GET sensor', () => {

  /*
  * /GET sensor
  * Test the /GET all sensor records
  */
  it('It should GET all the sensor', (done) => {
    chai.request(server)
      .get('/sensors')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        done();
      });
  });

  /*
  * /GET sensor/id
  * Test the single sensor records from the database
  */
  it('It should GET single sensor', (done) => {
    chai.request(server)
      .get('/sensors/57')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  /*
  * /GET sensor/id
  * Test the single sensor records that doesn't exist
  */
  it('It should not GET any sensor and return empty array', (done) => {
    chai.request(server)
      .get('/sensors/-35')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

});