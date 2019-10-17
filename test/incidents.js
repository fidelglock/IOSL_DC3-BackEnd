//Require the dev-dependencies and setup chai
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);
let {createToken} = require('../server/config/token.utils');

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Mocked user token for authorization
let access_token_key = 'x-access-token';
let access_token = createToken({id:1, type:1, PersonRole:1}); 

describe('/GET incident', () => {

  /*
  * /GET incident
  * Test the /GET all incident records
  */
  it('It should GET all the incidents', (done) => {
    chai.request(server)
      .get('/incidents')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  /*
  * /GET incident/id
  * Test the single incident records from the database
  */
  // it('It should GET single incident', (done) => {
  //   chai.request(server)
  //     .get('/incidents/2')
  //     .set(access_token_key, access_token)
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       res.body.should.be.a('array');
  //       res.body.length.should.be.eql(1);
  //       done();
  //     });
  // });

  /*
  * /GET incident/id
  * Test the single incident records that doesn't exist
  */
  it('It should not GET any incident and return empty array', (done) => {
    chai.request(server)
      .get('/incidents/-35')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

});