<template>
    <div class="flex w-full justify-center">
        <div class="flex flex-col gap-4 mt-24 bg-neutral-800 w-1/2 rounded drop-shadow-md p-6">
            <span class="text-lg font-bold">First Hand Purchase Flow</span>
            <p>This is an example of the first-hand purchase flow.</p>
            <p>{{ username ? 'Hello, ' + username : 'You are not logged in.' }}</p>

            <button
                @click="connect"
                class="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 p-2 font-bold rounded-lg"
                v-if="!username"
            >
                Connect
            </button>
            <button
                @click="disconnect"
                class="bg-purple-500 hover:bg-purple-400 active:bg-purple-600 p-2 font-bold rounded-lg"
                v-else
            >
                Disconnect
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let username = ref(undefined);
let failedLogin = ref(false);

async function connect() {
    try {
        // @ts-ignore
        const response = await window['ultra'].connect();
        username.value = response.data.blockchainid;
    } catch (err) {
        console.error(err);
        failedLogin.value = true;
    }
}

async function disconnect() {
    try {
        // @ts-ignore
        await window['ultra'].disconnect();
        username.value = undefined;
        failedLogin.value = false;
    } catch (err) {}
}
</script>
