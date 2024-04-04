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
    server.closeAllConnections();
  });


  let userId = " "
  describe("POST /users/creattest", () => {
    test("should responds with json", async () => {
        return request(app)
            .post("/users/creattest")
            .send({ email: 'fakeemail@gmail.com', fullname: 'fakeuser', password: '123' })
            .expect(201)
            .then(async ({ body }) => {
                userId = body.email;
                console.log("user email:", userId);
                await server.close();
            });
    });
});



describe("DELETE /users/Deletefake/:email", () => {
    test("should responds with json", async () => {
        return request(app)
            .delete(`/users/Deletefake/${userId}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({ message: 'Deleted User' })
            .then(async () => {
                console.log("User supprimée avec succès");
               await server.close();
            });
    });
});