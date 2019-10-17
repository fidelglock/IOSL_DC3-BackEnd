//Require the dev-dependencies and setup chai
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

describe('/GET address', () => {

  /*
  * /GET address
  * Test the /GET all address records
  */
  it('It should GET all the addresses', (done) => {
    chai.request(server)
      .get('/address')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.above(3);
        done();
      });
  });

  /*
  * /GET address/id
  * Test the single address records from the database
  */
  it('It should GET single address', (done) => {
    chai.request(server)
      .get('/address/2')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  /*
  * /GET address/id
  * Test the single address records that doesn't exist
  */
  it('It should not GET any address and return empty array', (done) => {
    chai.request(server)
      .get('/address/-35')
      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

});