<template>
    <div class="flex flex-row w-full justify-between items-center">
        <template v-if="props.username">
            <p>{{ username }}</p>
            <button
                @click="disconnect"
                class="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 p-2 font-bold rounded-lg"
            >
                Disconnect
            </button>
        </template>
        <template v-else>
            <span class="text-lg font-bold">Not Connected</span>
            <button
                @click="connect"
                class="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 p-2 font-bold rounded-lg"
            >
                Connect
            </button>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{ username: string | undefined }>();
const emits = defineEmits<{ (e: 'update-username', username: string | undefined, chain: string | undefined): void }>();

let failedLogin = ref(false);

async function connect() {
    try {
        // @ts-ignore
        const response = await window['ultra'].connect();
        const chainResponse = await window['ultra'].getChainId();
        emits('update-username', response.data.blockchainid.split('@')[0], chainResponse.data);
    } catch (err) {
        console.error(err);
        failedLogin.value = true;
    }
}

async function disconnect() {
    try {
        // @ts-ignore
        await window['ultra'].disconnect();
        emits('update-username', undefined, undefined);
        failedLogin.value = false;
    } catch (err) {}
}
</script>
