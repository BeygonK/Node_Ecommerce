import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

let token;

describe("Product Routes", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    const user = await User.create({
      name: "Test Admin",
      email: "admin@example.com",
      password: "password",
      isAdmin: true,
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Product",
          description: "Sample description",
          price: 99.99,
          category: "Electronics",
          stock: 5,
        });

      expect(res.statusCode).to.equal(201);
      expect(res.body).to.have.property("name", "Test Product");
    });
  });

  describe("GET /api/products", () => {
    it("should return list of products", async () => {
      const res = await request(app).get("/api/products");
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });
});
