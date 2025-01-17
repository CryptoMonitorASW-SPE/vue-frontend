import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

// Set the base URL for Axios
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api';

// Make Axios available globally
const app = createApp(App);
app.config.globalProperties.$axios = axios;

app.mount('#app');
