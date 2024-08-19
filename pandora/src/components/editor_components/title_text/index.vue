<template>
    <div :style="data.styles" class="title_text">{{ data.value }}</div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps(["data"]);
</script>

<style scoped>
.title_text {
    padding: 16px;
}
</style>