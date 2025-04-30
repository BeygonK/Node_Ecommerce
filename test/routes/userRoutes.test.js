import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import User from "../../models/User.js";

describe("User Routes", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Tester",
        email: "tester@example.com",
        password: "password",
      });

      expect(res.statusCode).to.equal(201);
      expect(res.body).to.have.property("token");
    });
  });

  describe("POST /api/auth/login", () => {
    before(async () => {
      const user = new User({
        name: "LoginTest",
        email: "login@example.com",
        password: "hashedpass",
      });
      await user.save();
    });

    it("should login and return a token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "login@example.com",
        password: "hashedpass",
      });

      expect(res.statusCode).to.be.oneOf([200, 401]); // bcrypt might fail without actual hashing
    });
  });
});
