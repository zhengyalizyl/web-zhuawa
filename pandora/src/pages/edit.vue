<template>
    <div class="editor_container flv">
        <div class="editor_header">header</div>
        <div class="editor_body fl fl_jc_sb">
            <div class="editor_body_tools">
                <EditorTools />
            </div>
            <div class="editor_body_preview">
                <iframe
                    id="js_editor_body_preview_iframe"
                    class="editor_body_preview_iframe"
                    src="/preview"
                    frameborder="0" />
            </div>
            <div class="editor_body_config">
                <EditorConfig :component_item="current_component" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import EditorTools from "../components/editor_tools/index.vue";
import EditorConfig from "../components/editor_config/index.vue";
import state from "../stores/editor_store";
import _findIndex from "lodash/findIndex";

const current_id = ref("");
const current_component = ref({});

let childIFrame = null;

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

onMounted(() => {
    childIFrame = document.getElementById("js_editor_body_preview_iframe").contentWindow;
    if (childIFrame) {
        setTimeout(() => {
            childIFrame.postMessage({ message: "init", data: null });
        }, 300);
    }

    window.addEventListener("message", event => {
        const { message, data } = event.data;
        console.log("子iframe发送的数据:---->", message, "--->>", data);

        switch (message) {
            case "selectComponent":
                current_id.value = data;
                current_component.value =
                    state.components[
                        _findIndex(state.components, function (o) {
                            return o.id == data;
                        })
                    ];
                break;
        }
    });

    _EE_.on("createComponent", item => {
        const temp = Object.assign({}, item.componentSchema);
        temp.id = s4() + s4();
        state.components.push(temp);
        // console.log('----->>', JSON.parse(JSON.stringify(state.components)));
        if (state.countComponents[item.componentName]) {
            state.countComponents[item.componentName]++;
        } else {
            state.countComponents[item.componentName] = 1;
        }
        childIFrame.postMessage({ message: "createComponent", data: temp });
    });
    _EE_.on("updateComponent", changeData => {
        state.components[
            _findIndex(state.components, function (o) {
                return o.id == changeData.id;
            })
        ][changeData.key] = changeData.value;
        childIFrame.postMessage({ message: "updateComponent", data: changeData });
    });
    _EE_.on("deleteComponent", item => {});
    
});
</script>

<style scoped>
.editor_container {
    width: 100vw;
    height: 100vh;
}

.editor_header {
    height: 55px;
    border-bottom: 1px solid #ebedf0;
}

.editor_body {
    height: calc(100vh - 56px);
    overflow: hidden;
}

.editor_body_tools {
    width: 200px;
    height: 100%;
}

.editor_body_preview {
    background: #f7f8fa;
    width: 100%;
    height: 100%;
    flex: 1;
}

.editor_body_config {
    width: 376px;
    height: 100%;
}

.editor_body_preview_iframe {
    border: none;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>
