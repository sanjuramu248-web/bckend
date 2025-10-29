import { Router } from "express";
import { loginUser, logoutUser, getCurrentUser } from "../controllers/userController";
import { verifyJWT } from "../middleware/authMiddleware";

const router = Router()

// Public routes
router.post("/login", loginUser)

// Protected routes
router.post("/logout", verifyJWT, logoutUser)
router.get("/profile", verifyJWT, getCurrentUser)

export default router;