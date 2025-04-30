import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { registerUser, loginUser } from "../../controllers/userController.js";

describe("User Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("registerUser", () => {
    it("should register a new user", async () => {
      const req = {
        body: { name: "Test", email: "test@example.com", password: "123456" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(User.prototype, "save").resolves();

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("loginUser", () => {
    it("should authenticate and return token", async () => {
      const password = "123456";
      const hashedPassword = await bcrypt.hash(password, 10);

      const req = {
        body: { email: "test@example.com", password },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockUser = {
        _id: "user123",
        name: "Test",
        email: "test@example.com",
        isAdmin: false,
        matchPassword: async () => true,
      };

      sinon.stub(User, "findOne").resolves(mockUser);
      sinon.stub(jwt, "sign").returns("mockToken");

      await loginUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });
});
