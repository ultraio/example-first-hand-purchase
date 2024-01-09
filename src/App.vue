<template>
    <div class="flex w-full justify-center mt-24">
        <div class="flex flex-col w-1/2">
            <div class="text-lg mb-8 text-center font-bold">Example Purchase Flow</div>
            <div class="flex flex-col gap-4 bg-neutral-800 rounded drop-shadow-md p-6">
                <WalletConnect :username="username" @update-username="updateUsername" />
            </div>
            <div class="flex flex-col gap-4 mt-12 bg-neutral-800 rounded drop-shadow-md p-6" v-if="username">
                <!-- Factory Purchase Option Selection -->
                <FactorySelect
                    v-if="factory_purchase_options.length <= 0"
                    :username="username"
                    :chain="chain"
                    @update-purchase-options="updatePurchaseOptions"
                />
                <!-- Strategy -->
                <StrategySelect
                    v-if="factory_purchase_options.length >= 1"
                    :username="username"
                    :chain="chain"
                    :factory-purchase-options="factory_purchase_options"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FactoryPurchaseReq } from './interfaces/FactoryPurchaseReq';

let username = ref<string>(undefined);
let chain = ref<string>(undefined);
let factory_purchase_options = ref<FactoryPurchaseReq[]>([]);

function updateUsername(new_username: string, chain_id: string) {
    username.value = new_username;
    chain.value = chain_id;
}

function updatePurchaseOptions(options: FactoryPurchaseReq[]) {
    factory_purchase_options.value = options;
}
</script>
