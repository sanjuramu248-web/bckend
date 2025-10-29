"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All cart routes require authentication
router.use(authMiddleware_1.verifyJWT);
router.post("/", cartController_1.addToCart);
router.delete("/:id", cartController_1.removeFromCart);
router.get("/", cartController_1.getCart);
router.post("/checkout", cartController_1.checkout);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map