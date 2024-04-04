mongoose = require("mongoose");
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


describe('Event Routes', () => {
    let eventId;

    test('should create a new event', async () => {
        const res = await request(app)
            .post('/events/add')
            .send({
                title: 'Test Event',
                description: 'This is a test event',
                date: '2024-12-31T00:00:00Z',
                startTime: '2024-12-31T10:00:00Z',
                endTime: '2024-12-31T12:00:00Z',
                location: 'Test Location',
                capacity: 100,
                ticketPrice: 50,
                category: 'Concert',
                status: 'Incoming', 
                image: 'test.jpg'
            });
        eventId = res.body._id;
        
    });

    test('should get all events', async () => {
        const res = await request(app).get('/events');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

});
