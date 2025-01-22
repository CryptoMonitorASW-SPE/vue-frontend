// const express = require("express");
// const router = express.Router();

// const controller = require("../controllers/controller");

// // API Routes
// router.post("/submit", controller.alignSequences);
// router.get("/show", controller.getAllAlignSequences);

// module.exports = router;

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomeView,
        },
        {
            path:"/Login",
            component: AuthLayout,
            children: [
                {
                    path: "",
                    name: "Login",
                    component: LoginView,

                }
            ]
        },

    ]
});

export default router;