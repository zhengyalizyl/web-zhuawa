<template>
    <div class="preview_content">
        <template v-if="state.components.length > 0">
            <div
                v-for="item in state.components"
                :key="item.id"
                class="component_box">
                <component :is="item.componentName" :data="item"></component>
            </div>
        </template>
    </div>
</template>
<script>
// 导入要注册的组件
import TitleText from "../components/editor_config/title_text_config.vue";

export default {
    // 在这里局部注册
    components: {
        TitleText
    }
};
</script>

<script setup>

onMounted(() => {
    // ajax get config

});

</script>