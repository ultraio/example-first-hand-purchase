import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import WalletConnectVue from './components/WalletConnect.vue';
import FactorySelectVue from './components/FactorySelect.vue';
import StrategySelectVue from './components/StrategySelect.vue';
import SwapUniqVue from './components/SwapUniq.vue';

const app = createApp(App);
app.component('FactorySelect', FactorySelectVue);
app.component('StrategySelect', StrategySelectVue);
app.component('SwapUniq', SwapUniqVue);
app.component('WalletConnect', WalletConnectVue);
app.mount('#app');
