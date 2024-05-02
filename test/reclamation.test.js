const mongoose = require("mongoose");
const request = require("supertest");
const {app,server} = require("../index");
const config = require('../database/dbConfig.json');
server.close();
beforeEach(async () => {
    await mongoose.connect(config.mongo.uri)

  });
  
  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
    server.close();
  });


  let reclamtionId = " "
  describe("POST /Reclamtions/addreclamationtest", () => {
    test("should responds with json", async () => {
        return request(app)
            .post("/Reclamtions/addreclamationtest")
            .send({ message: 'Votre message de réclamation', typereclamtion: 'administrative' })
            .expect(201)
            .then(async ({ body }) => {
                reclamtionId = body._id;
                console.log("Réclamation ID:", reclamtionId);
                await server.close();
            });
    });
});


describe("DELETE /Reclamtions/DeleteOneReclamationtest/:id", () => {
    test("should responds with json", async () => {
        return request(app)
            .delete(`/Reclamtions/DeleteOneReclamationtest/${reclamtionId}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({ message: 'Deleted Reclamation' })
            .then(async () => {
                console.log("Réclamation supprimée avec succès");
                await server.close();
            });
    });
});


  

 
  