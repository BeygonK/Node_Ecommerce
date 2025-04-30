import { expect } from "chai";
import sinon from "sinon";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
} from "../../controllers/orderController.js";

describe("Order Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createOrder", () => {
    it("should create a new order", async () => {
      const req = {
        user: { _id: "user123" },
        body: {
          orderItems: [
            {
              product: "prod123",
              name: "Test Product",
              qty: 2,
              price: 10,
            },
          ],
          shippingAddress: {
            address: "123 St",
            city: "Nairobi",
            postalCode: "00100",
            country: "Kenya",
          },
          paymentMethod: "M-Pesa",
          totalPrice: 20,
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Order.prototype, "save").resolves(req.body);

      await createOrder(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("getOrderById", () => {
    it("should fetch an order by ID", async () => {
      const req = { user: { _id: "user123" }, params: { id: "order123" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Order, "findById").resolves({
        user: { _id: "user123" },
        orderItems: [],
      });

      await getOrderById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("updateOrderToPaid", () => {
    it("should mark an order as paid", async () => {
      const req = {
        params: { id: "order123" },
        body: {
          id: "txn123",
          status: "COMPLETED",
          update_time: "now",
          email_address: "buyer@example.com",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const saveStub = sinon.stub().resolvesThis();

      sinon.stub(Order, "findById").resolves({
        isPaid: false,
        paidAt: null,
        paymentResult: {},
        save: saveStub,
      });

      await updateOrderToPaid(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
