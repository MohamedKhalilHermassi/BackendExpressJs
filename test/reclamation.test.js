const mongoose = require("mongoose");
const request = require("supertest");
const {app,server} = require("../index");
const config = require('../database/dbConfig.json');



  let reclamtionId = " "
  describe("POST /Reclamtions/addreclamationtest", () => {
    test("should responds with json", async () => {
        return request(app)
            .post("/Reclamtions/addreclamationtest")
            .send({ message: 'Votre message de réclamation', typereclamtion: 'administrative' })
            .expect(201)
            .then(({ body }) => {
                reclamtionId = body._id;
                console.log("Réclamation ID:", reclamtionId);
                server.close();
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
            .then(() => {
                console.log("Réclamation supprimée avec succès");
                server.close();
            });
    });
});


  

 
  