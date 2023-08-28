import { connectToDB, disconnectDB } from '../config/schema.js';

beforeAll(async () => {
    await connectToDB();
});

afterAll(async () => {
    await disconnectDB();
}); 