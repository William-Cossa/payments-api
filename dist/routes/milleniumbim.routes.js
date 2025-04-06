import { Router } from "express";
import { createCheckoutSession, startCheckout, sucessPaymentCheck, } from "../controllers/milleniumbim.controller.js";
const millleniumBimRouter = Router();
millleniumBimRouter.post("/millenium-bim", createCheckoutSession);
millleniumBimRouter.get("/millenium-bim/checkout", startCheckout);
millleniumBimRouter.get("/millenium-bim/sucess", sucessPaymentCheck);
export default millleniumBimRouter;
