// const express = require("express");
// const router = express.Router();

// const controller = require("../controllers/controller");

// // API Routes
// router.post("/submit", controller.alignSequences);
// router.get("/show", controller.getAllAlignSequences);

// module.exports = router;

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomeView,
        }
    ]
});

export default router;