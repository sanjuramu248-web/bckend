import { Router } from "express";
import { addToCart, removeFromCart, getCart, checkout } from "../controllers/cartController";
import { verifyJWT } from "../middleware/authMiddleware";

const router = Router();

// All cart routes require authentication
router.use(verifyJWT);

router.post("/", addToCart);
router.delete("/:id", removeFromCart);
router.get("/", getCart);
router.post("/checkout", checkout);

export default router;