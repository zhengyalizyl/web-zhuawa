<template>
    <div class="editor_tools fl fl_jc_sb fl_wrap">
        <template v-for="item in tools_list" :key="item.title">
            <div class="tools_item flv fl_ai_c fl_jc_sb" @click="createComponent(item)">
                <img :src="item.icon" class="tools_item_icon" />
                <span>{{ item.title }}</span>
                <span>{{ state.countComponents[item.componentName] || 0 }} / {{ item.limit }}</span>
            </div>
        </template>
    </div>
</template>

<script setup>
import state from "../../stores/editor_store.js";

const tools_list = [
    {
        icon: "/assets/editor_tools_title_text.svg",
        title: "标题文本",
        limit: 50,
        componentName: "TitleText",
        componentSchema: {
            name: "标题文本",
            componentName: "TitleText",
            configComponent: "TitleTextConfig",
            value: "这里是标题文本",
            styles: {
                textAlign: "left",
                fontWeight: "normal",
                color: "#333",
                backgroundColor: "#fff"
            },
            settings: {
                is_see_more: false,
                more_mode: {
                    mode: "样式一"
                }
            }
        }
    },
    {
        icon: "/assets/editor_tools_title_text.svg",
        title: "图文",
        limit: 100,
        componentName: "Image",
        componentSchema: {
            name: "图文",
            componentName: "Image",
            configComponent: "ImageConfig",
            value: "",
            styles:{
                margin: 0
            },
            settings: {
                mode: 0, // 1-文字环绕 2-文字重叠（图在上） 3-图片居中，文字上下分列
            }
        }
    }
];
const createComponent = item => {
    const count = state.countComponents[item.componentName]||0;
    if ( count === item.limit) {
        // alert('超出最大限制');
        return false;
    }
    _EE_.emit("createComponent", item);
};
</script>

<style scoped>
.editor_tools {
    padding: 0 12px;
}
.tools_item {
    width: 80px;
    height: 88px;
    padding: 5px;
    margin-top: 12px;
    cursor: pointer;
}
.tools_item:hover {
    background: #155bd4;
    color: #fff;
}
.tools_item_icon {
    width: 32px;
    height: 32px;
}
</style>
