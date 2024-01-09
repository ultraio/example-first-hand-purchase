import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import WalletConnectVue from './components/WalletConnect.vue';
import FactorySelectVue from './components/FactorySelect.vue';
import StrategySelectVue from './components/StrategySelect.vue';

const app = createApp(App);
app.component('FactorySelect', FactorySelectVue);
app.component('StrategySelect', StrategySelectVue);
app.component('WalletConnect', WalletConnectVue);
app.mount('#app');
