import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";

let token;
let productId;

describe("Order Routes", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const product = await Product.create({
      name: "Test Product",
      description: "Good product",
      price: 100,
      stock: 10,
      category: "Books",
      user: user._id,
    });

    productId = product._id;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe("POST /api/orders", () => {
    it("should create a new order", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          orderItems: [
            {
              product: productId,
              name: "Test Product",
              qty: 1,
              price: 100,
            },
          ],
          shippingAddress: {
            address: "123 St",
            city: "Nairobi",
            postalCode: "00100",
            country: "Kenya",
          },
          paymentMethod: "Cash",
          totalPrice: 100,
        });

      expect(res.statusCode).to.equal(201);
      expect(res.body).to.have.property("orderItems");
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should get order by ID", async () => {
      const order = await Order.findOne();

      const res = await request(app)
        .get(`/api/orders/${order._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property("_id");
    });
  });
});
