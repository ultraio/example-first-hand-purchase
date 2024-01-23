<template>
    <div class="flex flex-col gap-2">
        <template v-if="uniqsProvided.length === 0">
            <div class="font-bold">Swap {{ props.swap.id }}</div>
            <div v-for="(uniq, requiredUniqIndex) in getRequiredUniqs()" :key="requiredUniqIndex">
                <div class="text-sm">
                    Select {{ getCountLeft(uniq.token_factory_id, uniq.count) }} <strong>Uniq Token</strong> to
                    {{ getStrategyName(uniq.strategy) }}
                </div>
                <div class="flex flex-row gap-2 flex-wrap mt-2" v-if="updateIndex">
                    <button
                        v-for="user_uniq in getSelectableUniqs(uniq.token_factory_id)"
                        :key="updateIndex"
                        class="p-2 rounded hover:bg-neutral-600"
                        :class="getUniqClasses(user_uniq)"
                        @click="toggleUniq(user_uniq)"
                    >
                        {{ user_uniq.token_factory_id }}#{{ user_uniq.serial_number }}
                    </button>
                </div>
            </div>
            <button @click="emits('cancel')" class="bg-red-500 rounded p-2 mt-2 hover:bg-red-400">Cancel</button>
            <button
                v-if="meetsAllRequirements()"
                @click="finalizeRequirements"
                class="bg-purple-500 rounded p-2 mt-2 hover:bg-purple-400"
            >
                Finish Swap
            </button>
        </template>
        <template v-else>
            <!-- Finalize -->
            <div>Waiting to sign transaction...</div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { I } from '@ultraos/ultra-api-lib';
import { FactoryPurchaseReq } from '../interfaces/FactoryPurchaseReq';

type SwapRequirement = { token_factory_id: number; strategy: number; count: number };
type UniqProvided = { token_id: number; strategy: number };

const emits = defineEmits<{ (e: 'cancel'): void }>();
const props = defineProps<{
    username: string;
    uniqs: I.Uniq[];
    swap: FactoryPurchaseReq;
    factory: number;
}>();

let uniqsProvided = ref<UniqProvided[]>([]);
let updateIndex = ref(1);
let selection = ref<{ [token_factory_id: string]: Array<number> }>({});

async function finalizeRequirements() {
    const tokens: UniqProvided[] = [];

    for (let requirement of getRequiredUniqs()) {
        for (let uniq of selection[requirement.token_factory_id]) {
            tokens.push({ token_id: uniq, strategy: requirement.strategy });
        }
    }

    uniqsProvided.value = tokens;

    const trx = [
        {
            action: 'purchase.a',
            contract: 'eosio.nft.ft',
            data: {
                purchase: {
                    token_factory_id: props.factory, // 4030
                    index: props.swap.id,
                    max_price: props.swap.converted_price,
                    buyer: props.username,
                    receiver: props.username,
                    promoter_id: null,
                    user_uniqs: {
                        tokens,
                    },
                    memo: '',
                },
            },
        },
    ];

    try {
        const result = await window['ultra'].signTransaction(trx);
        console.log(result);
        alert("Transaction successfully signed: " + result.data.transactionHash);
    } catch (err) {
        console.log(err);
        alert("Failed to sign transaction: " + err.message + ((err.data && err.data.error && err.data.error.what) ? ` (${err.data.error.what})` : ""));
    }

    emits('cancel');
}

function meetsAllRequirements() {
    const requirements = getRequiredUniqs();

    for (let requirement of requirements) {
        if (!selection[requirement.token_factory_id]) {
            return false;
        }

        if (selection[requirement.token_factory_id].length !== requirement.count) {
            return false;
        }
    }

    return true;
}

function getCountLeft(token_factory_id: number, max_count: number) {
    if (!selection[token_factory_id]) {
        return max_count;
    }

    return max_count - selection[token_factory_id].length;
}

function toggleUniq(uniq: I.Uniq) {
    if (!selection[uniq.token_factory_id]) {
        selection[uniq.token_factory_id] = [];
    }

    const index = selection[uniq.token_factory_id].findIndex((x) => x == uniq.id);
    if (index <= -1) {
        selection[uniq.token_factory_id].push(uniq.id);
    } else {
        selection[uniq.token_factory_id].splice(index, 1);
    }

    updateIndex.value += 1;
}

function getUniqClasses(uniq: I.Uniq) {
    if (!selection[uniq.token_factory_id]) {
        return ['bg-neutral-700'];
    }

    if (selection[uniq.token_factory_id].find((x) => x == uniq.id)) {
        return ['bg-neutral-500', 'hover:bg-neutral-400'];
    } else {
        return ['bg-neutral-700'];
    }
}

function getStrategyName(id: number): string {
    switch (id) {
        case 0:
            return 'check ownership';
        case 1:
            return 'to burn';
        case 2:
            return 'to transfer';
    }

    return 'check';
}

function getRequiredUniqs(): SwapRequirement[] {
    return props.swap.purchase_option_with_uniqs.factories.map((x) => {
        return { strategy: x.strategy, token_factory_id: x.token_factory_id, count: x.count };
    });
}

function getSelectableUniqs(id: number): I.Uniq[] {
    const usableUniqs = [];
    for (let i = 0; i < props.uniqs.length; i++) {
        const token_factory_id = props.uniqs[i].token_factory_id;
        if (token_factory_id != id) {
            continue;
        }

        usableUniqs.push(props.uniqs[i]);
    }

    return usableUniqs;
}
</script>
