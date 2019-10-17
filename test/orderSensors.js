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


describe('/GET orderSensor', () => {

  /*
  * /GET orderSensor
  * Test the /GET all orderSensor records
  */
  it('It should GET all the orderSensor', (done) => {
    chai.request(server)
      .get('/orderSensors')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        done();
      });
  });

  /*
  * /GET orderSensor/id
  * Test the single orderSensor records from the database
  */
  it('It should GET single orderSensor', (done) => {
    chai.request(server)
      .get('/OrderSensors/57')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });


  /*
  * /GET OrderSensorsDetails
  * Test the orderSensorDetail records from the database
  */
 it('It should GET orderSensorDetails', (done) => {
  chai.request(server)
    .get('/OrderSensorsDetails')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
});

  
  /*
  * /GET getOrderSensorsByPackageId
  * Test the orderSensorDetail records from the database
  */
 it('It should GET orderSensor by package id', (done) => {
  chai.request(server)
    .get('/OrderSensors/package/3')
    .set(access_token_key, access_token)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      done();
    });
});

  /*
  * /GET orderSensor/id
  * Test the single orderSensor records that doesn't exist
  */
  it('It should not GET any orderSensor and return empty array', (done) => {
    chai.request(server)
      .get('/orderSensors/-35')
      .set(access_token_key, access_token)
      .end((err, res) => {
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

});