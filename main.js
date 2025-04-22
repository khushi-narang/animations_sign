import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

// Animation engine
const ref = {
  animations: [],
  pending: false,
  animate: function () {
    if (!this.animations.length) return;
    const frames = this.animations.shift();
    frames.forEach(([boneName, prop, axis, value, sign]) => {
      const bone = scene.getObjectByName(boneName);
      if (bone) {
        const delta = (sign === "+") ? value : -value;
        bone[prop][axis] = delta;
      }
    });
    setTimeout(() => {
      this.pending = false;
      if (this.animations.length) this.animate();
    }, 800);
  }
};

// Load model
let xbot;
const loader = new GLTFLoader();
loader.load('xbot.glb', gltf => {
  xbot = gltf.scene;
  scene.add(xbot);
}, undefined, err => console.error(err));

// Animation loader
async function loadAnimation(letter) {
  if (!xbot) return alert("Model not loaded yet");
  const module = await import(`./animations/${letter}.js`);
  module[letter](ref); // call A(ref), B(ref), etc.
}

// Create UI buttons
const ui = document.getElementById('ui');
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
  const btn = document.createElement('button');
  btn.textContent = letter;
  btn.onclick = () => loadAnimation(letter);
  ui.appendChild(btn);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
