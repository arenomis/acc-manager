import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import { useAccountsStore } from './stores/account';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

const accountsStore = useAccountsStore();
accountsStore.initialize();

app.mount('#app');