"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/login", userController_1.loginUser);
// Protected routes
router.post("/logout", authMiddleware_1.verifyJWT, userController_1.logoutUser);
router.get("/profile", authMiddleware_1.verifyJWT, userController_1.getCurrentUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map