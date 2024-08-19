<template>
    <div>{{ data.name }}</div>
    <div>
        <input v-model="data.value" type="text" @input="onchange(data.id, 'value', data.value)"/>
    </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["data", "onchange"]);
</script>
