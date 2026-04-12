import express from "express"

import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

import { MessageRoutes } from "../modules/message/message.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { CategoryRoutes } from "../modules/category/category.route";



const router = express.Router()

// Auth Routes
router.use("/auth", AuthRoutes)

router.use("/user", UserRoutes)

router.use("/message", MessageRoutes)

router.use("/notification", NotificationRoutes)

router.use("/categories", CategoryRoutes)

export default router;


