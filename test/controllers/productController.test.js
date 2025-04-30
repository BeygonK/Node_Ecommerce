import { expect } from "chai";
import sinon from "sinon";
import Product from "../../models/Product.js";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../../controllers/productController.js";

describe("Product Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createProduct", () => {
    it("should create a product", async () => {
      const req = {
        user: { _id: "userId123" },
        body: {
          name: "Test Product",
          description: "A sample product",
          price: 99.99,
          category: "Test",
          stock: 10,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Product.prototype, "save").resolves(req.body);

      await createProduct(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("getProducts", () => {
    it("should return a list of products", async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Product, "find").resolves([{ name: "Test Product" }]);

      await getProducts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("getProductById", () => {
    it("should return product by ID", async () => {
      const req = { params: { id: "product123" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(Product, "findById").resolves({ name: "Product 1" });

      await getProductById(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
