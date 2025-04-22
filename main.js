import * as THREE from 'three';

let scene, camera, renderer, xbot, ref;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    camera.position.z = 5;

    loadModel();
    createButtons();
    animate();
}

async function loadModel() {
    const loader = new THREE.GLTFLoader();
    loader.load('models/xbot.glb', (gltf) => {
        xbot = gltf.scene;
        scene.add(xbot);
    }, undefined, (error) => {
        console.error(error);
    });
}

function createButtons() {
    const ui = document.getElementById('ui');
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.onclick = () => loadAnimation(letter);
        ui.appendChild(btn);
    });
}

async function loadAnimation(letter) {
    if (!xbot) return alert("Model not loaded yet");
    try {
        const module = await import(`./animations/${letter}.js`);
        module[letter](ref); // call A(ref), B(ref), etc.
    } catch (error) {
        console.error(`Error loading animation for ${letter}:`, error);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

init();
