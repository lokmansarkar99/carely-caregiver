import express from "express"

import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";

// import { MessageRoutes } from "../modules/message/message.route";
import { NotificationRoutes } from "../modules/notification/notification.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { CaregiverProfileRoutes } from "../modules/caregiver-profile/caregiver-profile.route";
import { ClientProfileRoutes } from "../modules/client-profile/client-profile.route";
import CareRecipientRoutes from "../modules/care-recipient/care-recipient.route";
import { AvailabilityRoutes } from "../modules/availability/availability.route";
import { DocumentRoutes } from "../modules/document/document.route";
import { BookingRoutes } from "../modules/booking/booking.route";
import { StripeRoutes } from "../modules/stripe/stripe.route";
import { EarningRoutes } from "../modules/earning/earning.route";



const router = express.Router()

// Auth Routes
router.use("/auth", AuthRoutes)

router.use("/user", UserRoutes)

// router.use("/message", MessageRoutes)

router.use("/notification", NotificationRoutes)

router.use("/categories", CategoryRoutes)

router.use("/caregiver-profiles", CaregiverProfileRoutes)

router.use("/client-profiles", ClientProfileRoutes)

router.use("/care-recipient", CareRecipientRoutes)

router.use("/availability", AvailabilityRoutes)

router.use("/document", DocumentRoutes)

router.use("/booking", BookingRoutes)

router.use("/stripe", StripeRoutes)

router.use('/earnings', EarningRoutes);

export default router;


