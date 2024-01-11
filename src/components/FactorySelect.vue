<template>
    <div class="w-full flex flex-col gap-4" v-if="props.username">
        <template v-if="isRefreshing">
            <p>Refreshing...</p>
        </template>
        <template v-else>
            <div class="flex flex-row w-full items-center">
                <label>Factory ID</label>
                <input
                    v-model="factory_id"
                    class="ml-4 p-2 flex-grow rounded bg-neutral-950 text-neutral-200 pl-4 border border-neutral-700 focus:outline-none pr-4"
                    placeholder="Example: 4030"
                    type="number"
                />
            </div>
            <button
                @click="refresh"
                class="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 p-2 font-bold rounded-lg"
            >
                Set Factory ID
            </button>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import * as FactoryHelper from '../utility/factory';
import { FactoryPurchaseReq } from '../interfaces/FactoryPurchaseReq';

const props = defineProps<{ username: string; chain: string }>();
const emits = defineEmits<{ (e: 'update-purchase-options', options: FactoryPurchaseReq[], factory: number): void }>();

let factory_id = ref<string>();
let isRefreshing = ref<boolean>(false);

async function refresh() {
    isRefreshing.value = true;

    const api = await FactoryHelper.getApi(props.chain);
    if (!api) {
        isRefreshing.value = false;
        return;
    }

    const options = await FactoryHelper.getFactoryPurchase(api, factory_id.value);
    emits('update-purchase-options', options, parseInt(factory_id.value));
    isRefreshing.value = false;
}
</script>
