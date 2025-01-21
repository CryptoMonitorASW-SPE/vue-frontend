import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./routes/routes";
import axios from "axios";
import "./assests/css/style.css";

// Set the base URL for Axios
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || "http://localhost:3000/api";

// Make Axios available globally
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.config.globalProperties.$axios = axios;

app.mount("#app");
