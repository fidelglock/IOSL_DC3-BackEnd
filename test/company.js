//Require the dev-dependencies and setup chai
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

describe('/GET company', () => {

  /*
  * /GET company
  * Test the /GET all company records
  */
  it('It should GET all the companies', (done) => {
    chai.request(server)
      .get('/company')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(3);
        done();
      });
  });

  /*
  * /GET company/id
  * Test the single company records from the database
  */
  it('It should GET single company', (done) => {
    chai.request(server)
      .get('/company/2')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  /*
  * /GET company/id
  * Test the single company records that doesn't exist
  */
  it('It should not GET any company and return 404', (done) => {
    chai.request(server)
      .get('/company/-35')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

});