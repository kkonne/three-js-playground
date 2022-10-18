import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';

// basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
	1000
);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// adding lights and camera
const pointLight = new THREE.PointLight(0xaa80ff);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xf1f1f1);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointLight, ambientLight, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// adding torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// adding stars
const starGeometry = new THREE.SphereGeometry(0.25);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xf1f1f1 });
let addStar = () => {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
};
Array(200).fill().forEach(addStar);

// background picture
const spaceTexture = new THREE.TextureLoader().load('sky-bg.jpg');
scene.background = spaceTexture;

// adding fbx model
const fbxLoader = new FBXLoader()
fbxLoader.load(
    'shirt.fbx',
    (object) => {
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

// render scene func
let render = () => {
	renderer.render(scene, camera);
};

// window resize listener
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render();
}

// render animation function
let animate = () => {
    requestAnimationFrame(animate);

    torus.rotation.y += 0.005;
    torus.rotation.z += 0.001;
    controls.update();
	render();
};

animate();
