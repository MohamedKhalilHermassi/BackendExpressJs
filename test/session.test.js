const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../index");
const Session = require("../models/session");

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {

    await Session.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close(); 
});

describe("GET /sessions", () => {
    it("should return all sessions", async () => {
      
        await Session.create([
            { startDate: new Date(), duree: 60},
            { startDate: new Date(), duree: 90},
            { startDate: new Date(), duree: 120}
        ]);

     
        const res = await request(app).get("/sessions");

       
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3); 
     
    });

    it("should handle empty sessions", async () => {
      
        const res = await request(app).get("/sessions");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
    });
});
