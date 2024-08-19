<template>
    <div v-if="data.value">
        <img :src="data.value" class=""/>
    </div>
    <div v-else class="no_image fl_center">
        请上传图片
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps(["data"]);
</script>

<style scoped>
.no_image {
    height: 200px;
    width: 100%;
}
</style>