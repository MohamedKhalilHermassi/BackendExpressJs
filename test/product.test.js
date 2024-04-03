const mongoose = require("mongoose");
const request = require("supertest");
const {app,server} = require("../index");
const config = require('../database/dbConfig.json');

beforeEach(async () => {
    await mongoose.connect(config.mongo.uri)

  });
  
  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
    server.close();
  });

  describe("GET /market/get-products", () => {
    it("should return all products", async () => {
      const res = await request(app).get("/market/get-products");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      server.close();
    });

    
  });