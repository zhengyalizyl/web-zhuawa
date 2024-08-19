import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
const RADIUS = 300;
const Options = {
    RADIUS,
    SEGMENTS: 100,
    CAMERA_FAR: 300 * 1000,
    CAMERA_FOV: 45,
    CAMERA_NEAR: 1,
    sunLightPosition: new THREE.Vector3(
        RADIUS * 2,
        RADIUS * 3,
        RADIUS * 3
    ),
    sunLightAutoRotateSpeed: Math.PI / 360 / 24,
    MODES: {
        mod1: {
            globeRotateSpeed: Math.PI / 360 / 6,
            cameraPosition: {
                x: RADIUS * 6,
                y: 0,
                z: 0,
            },
            cameraLookAt: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        mod2: {
            globeRotateSpeed: Math.PI / 360 / 24,
            cameraPosition: {
                x: RADIUS * 2.5,
                y: RADIUS / 8,
                z: RADIUS / 2,
            },
            cameraLookAt: {
                x: (RADIUS * 2.5) / 2,
                y: RADIUS / 8,
                z: RADIUS / 2,
            },
        },
        mod3: {
            globeRotateSpeed: Math.PI / 360 / 36,
            cameraPosition: {
                x: RADIUS * 2,
                y: RADIUS / 8,
                z: RADIUS / 2,
            },
            cameraLookAt: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
    }
};

let mode = 'mod1'

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera();

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('MarsCanvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 建立白光光源
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
const sunOrbit = new THREE.Group();
sunOrbit.add(sunLight);
scene.add(sunOrbit);

// 创建一个球体
const geometry = new THREE.SphereGeometry(RADIUS, 100, 100);
// 创建材料，并添加地球纹理
const textureLoader = new THREE.TextureLoader();
const marsTexture = textureLoader.load("assets/Mars8K_web_low.jpg");
const material = new THREE.MeshLambertMaterial({ map: marsTexture });
// 创建球体网格
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 0, 0);
sphere.receiveShadow = true;
scene.add(sphere);

// 设置相机位置
setCamera()
setSunLight()

function setSunLight() {
    // 相对轨道的位置
    sunLight.position.copy(Options.sunLightPosition);
    // 设置光源目标
    sunLight.target = sphere;
}

function setCamera() {
    // 设置默认值
    const _mode = Options.MODES[mode];
    const cameraPos = { ..._mode.cameraPosition };
    const cameraLookAt = { ..._mode.cameraLookAt };
    camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    camera.lookAt(cameraLookAt.x, cameraLookAt.y, cameraLookAt.z);
    camera.far = Options.CAMERA_FAR;
    camera.fov = Options.CAMERA_FOV;
    camera.near = Options.CAMERA_NEAR;
}

// 渲染循环
function animate(time) {
    requestAnimationFrame(animate);
    render()
    TWEEN.update(time);
}

function render() {

    const _mode = Options.MODES[mode];
    // 旋转
    sphere.rotateY(_mode.globeRotateSpeed);
    sunOrbit.rotateX(Options.sunLightAutoRotateSpeed);
    renderer.sortObjects = false;
    // 渲染场景
    renderer.render(scene, camera);

}

animate();

function changeMode() {
    const duration = 1200;
    const modeBefore = Options.MODES[mode];
    mode = mode === 'mod1' ? 'mod2' : mode === 'mod2' ? 'mod3' : 'mod1';
    console.log(mode)
    const modeNow = Options.MODES[mode];
    const cameraPosAtTween = new TWEEN.Tween({ ...modeBefore.cameraPosition });
    const cameraLookAtTween = new TWEEN.Tween({ ...modeBefore.cameraLookAt });
    console.log(modeNow.cameraPosition)
    cameraPosAtTween
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate((o) => {
            camera.position.set(o.x, o.y, o.z);
        })

    cameraLookAtTween.easing(TWEEN.Easing.Cubic.InOut).onUpdate((o) => {
        camera.lookAt(o.x, o.y, o.z);
    });

    cameraPosAtTween.to({ ...modeNow.cameraPosition }, duration).start();
    cameraLookAtTween.to({ ...modeNow.cameraLookAt }, duration).start();

}

document.addEventListener('click', (e) => {
    changeMode()
})

