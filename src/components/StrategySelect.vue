<template>
    <div class="w-full flex flex-col gap-4">
        <template v-if="!selected_swap">
            <div>Available Swaps</div>
            <div
                v-for="(swap, index) in user_available_swaps"
                :key="index"
                class="flex flex-col w-full border p-4 border-neutral-600 rounded bg-neutral-700 gap-4"
            >
                <div class="text-sm font-bold">Swap Info</div>
                <div class="flex flex-row w-full justify-between bg-neutral-600 border border-neutral-500 rounded p-4">
                    <div>id</div>
                    <div>{{ swap.id }}</div>
                </div>
                <div v-if="uniq_factories[swap.id].length" class="text-sm font-bold">Required Uniq Factories</div>
                <div v-if="uniq_factories[swap.id].length" v-for="(factory, index) in uniq_factories[swap.id]" :key="index">
                    <div
                        class="flex flex-col w-full justify-between pl-4 bg-neutral-600 border border-neutral-500 rounded p-4"
                    >
                        <div class="flex flex-row w-full justify-between items-center">
                            <div class="text-sm font-bold">ID {{ factory.id }}</div>
                            <div>( {{ getUniqCount(factory.id) }} / {{ getCountRequired(swap, factory.id) }} )</div>
                        </div>
                        <div class="text-xs">{{ getStrategyName(getStrategy(swap, factory.id)) }}</div>
                    </div>
                </div>
                <div v-if="swap.price" class="text-sm font-bold">Swap Price</div>
                <div v-if="swap.price" class="flex flex-row w-full justify-between bg-neutral-600 border border-neutral-500 rounded p-4">
                    <div v-if="swap.price.endsWith('UOS')">{{ swap.price }}</div>
                    <div v-if="swap.price.endsWith('USD')" class="flex flex-row w-full justify-between items-center">
                        <div>{{ swap.price }}</div>
                        <div>(~{{ swap.converted_price }})</div>
                    </div>
                </div>
                <button
                    @click="selectSwap(swap)"
                    class="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 p-2 font-bold rounded"
                >
                    Swap this Uniq
                </button>
            </div>
            <button @click="emits('cancel')" class="bg-red-500 rounded p-2 mt-2 hover:bg-red-400">Go Back</button>
        </template>
        <SwapUniq
            v-else
            :username="$props.username"
            :uniqs="user_uniqs"
            :swap="selected_swap"
            :factory="props.factory"
            @cancel="selected_swap = undefined"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { FactoryPurchaseReq } from '../interfaces/FactoryPurchaseReq';
import * as FactoryHelper from '../utility/factory';
import { I, UltraAPI } from '@ultraos/ultra-api-lib';

const props = defineProps<{
    factoryPurchaseOptions: FactoryPurchaseReq[];
    username: string;
    chain: string;
    factory: number;
}>();

const emits = defineEmits<{ (e: 'cancel'): void }>();

let isRefreshing = ref<boolean>(false);
let user_uniqs = ref<I.Uniq[]>([]);
let user_available_swaps = ref<(FactoryPurchaseReq)[]>([]);
let uniq_factories = ref<{ [requirement_id: string]: I.ResponseFactory[] }>({});

let selected_swap = ref<FactoryPurchaseReq | undefined>(undefined);

function selectSwap(swap: FactoryPurchaseReq) {
    selected_swap.value = swap;
}

function getCountRequired(requirement: FactoryPurchaseReq, factory_id: number): number {
    return requirement.purchase_option_with_uniqs.factories.find((x) => x.token_factory_id == factory_id).count;
}

function getStrategy(requirement: FactoryPurchaseReq, factory_id: number): number {
    return requirement.purchase_option_with_uniqs.factories.find((x) => x.token_factory_id == factory_id).strategy;
}

function getStrategyName(id: number): string {
    switch (id) {
        case 0:
            return 'Tokens will be verified for ownership during swap process';
        case 1:
            return 'Tokens will be burnt from inventory during swap process';
        case 2:
            return 'Tokens will be transferred from inventory during swap process';
    }

    return 'check';
}

function clearData() {
    user_available_swaps.value = [];
    user_uniqs.value = [];
}

function getUniqCount(factory_id: number): number {
    let count = 0;

    for (let uniq of user_uniqs.value) {
        if (uniq.token_factory_id !== factory_id) {
            continue;
        }

        count++;
    }

    return count;
}

async function findSwappableUniqs(api: UltraAPI) {
    let index = 0;
    for (let purchaseOption of props.factoryPurchaseOptions) {
        if (!purchaseOption.purchase_option_with_uniqs) {
           index += 1;
           continue;
        }

        if (purchaseOption.purchase_option_with_uniqs.factories.length <= 0) {
            index += 1;
            continue;
        }

        let meetsRequirements = true;
        if (purchaseOption.purchase_option_with_uniqs) {
            let factories: I.ResponseFactory[] = [];
            for (let swappable of purchaseOption.purchase_option_with_uniqs.factories) {
                if (user_uniqs[swappable.token_factory_id]) {
                    meetsRequirements = false;
                    break;
                }

                if (getUniqCount(swappable.token_factory_id) < swappable.count) {
                    meetsRequirements = false;
                    break;
                }

                const response = await api.factory(swappable.token_factory_id).get();
                factories.push(response);
            }

            uniq_factories.value[purchaseOption.id] = factories;
        } else {
            uniq_factories.value[purchaseOption.id] = [];
        }

        if (!meetsRequirements) {
            index += 1;
            continue;
        }

        purchaseOption.converted_price = await FactoryHelper.getConvertedPurchasePrice(api, purchaseOption.price);

        user_available_swaps.value.push({ ...purchaseOption });
        index += 1;
    }
}

async function refresh() {
    isRefreshing.value = true;
    clearData();

    const api = await FactoryHelper.getApi(props.chain);
    if (!api) {
        isRefreshing.value = false;
        return;
    }

    try {
        user_uniqs.value = await api.account(props.username).getUniqs();
    } catch (err) {
        console.error(err);
    }

    findSwappableUniqs(api);
    isRefreshing.value = false;
}

onMounted(refresh);
</script>
