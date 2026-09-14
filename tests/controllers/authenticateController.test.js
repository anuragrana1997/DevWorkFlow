import { describe, jest } from "@jest/globals";
import { login } from "../../src/controllers/authenticateController.js";

describe("Login Controller", () => {
    const req = {
        body: {
            email: "gg@gmail.com",
            password: "ggwp@123"
        }
    }

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    }
    test("Login", async () => {
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });
    
});