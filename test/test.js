
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Beer = require('../models/beer');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Beers', () => {
    beforeEach((done) => { //Before each test we empty the database
        Beer.remove({}, (err) => { 
           done();         
        });     
    });
  describe('/GET book', () => {
      it('it should GET all the beers', (done) => {
        chai.request(server)
            .get('/api/beers')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  describe('/POST beer', () => {
    it('it should POST a beer', (done) => {
      let beer = {
          name: 'GoldStar',
          type: 'Black',
          quantity: 2
      }
      chai.request(server)
          .post('/api/beers')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send(beer)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.data.should.have.property('name').eql('GoldStar');
              res.body.data.should.have.property('type').eql('Black');
              res.body.data.should.have.property('quantity').eql(2);
            done();
          });
    });

});

describe('/GET/:id book', () => {
    it('it should GET a beer by the given id', (done) => {
      let beer = new Beer({ name: "GoldStar", type: "Black", quantity: 2 });
      beer.save((err, beer) => {
          chai.request(server)
          .get('/api/beers/' + beer.id)
          .send(beer)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('name').eql('GoldStar');
              res.body.should.have.property('type').eql('Black');
              res.body.should.have.property('quantity').eql(2);
              res.body.should.have.property('_id').eql(beer.id);
            done();
          });
      });

    });
});
});

describe('/PUT/:id beer', () => {
    it('it should UPDATE a beer given the id', (done) => {
      let beer = new Beer({ name: "GoldStar", type: "Black", quantity: 2 });
      beer.save((err, book) => {
              chai.request(server)
              .put('/api/beers/' + beer.id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .send({ name: "GoldStar", type: "White", quantity: 3 })
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('quantity').eql(3);
                done();
              });
        });
    });
});

describe('/DELETE/:id beer', () => {
    it('it should DELETE a beer given the id', (done) => {
      let beer = new Beer({ name: "GoldStar", type: "Black", quantity: 2 });
      beer.save((err, beer) => {
              chai.request(server)
              .delete('/api/beers/' + beer.id)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message');
                done();
              });
        });
    });
});

