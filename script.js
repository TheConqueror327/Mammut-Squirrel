import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js';
import {TWEEN} from 'three/examples/jsm/libs/tween.module.min.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game').appendChild(renderer.domElement);
camera.position.set(0.015, 3, 7.5);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('backgrounds/hatter1.jpg');

var mammut, squirrel, oakLog, stone, downHill, oakBoard, coin;
const hillGroup = new THREE.Group();

function load3DModels() {
    const loader = new STLLoader();
    loader.load(
        'models/elephant.stl',
        (geometry) => {
            mammut = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x94918d}));
            let dim = new THREE.Box3().setFromObject(mammut).getSize(new THREE.Vector3());
            mammut.scale.set(1 / dim.x, 1 / dim.x, 1 / dim.x);
            mammut.rotation.y = Math.PI / 1.2;
            mammut.position.set(2, 0, /*5.3*/7);
            scene.add(mammut);
        }
    );
    loader.load(
        'models/squirrel.stl',
        (geometry) => {
            squirrel = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color : 0xba6d25}));
            let dim2 = new THREE.Box3().setFromObject(squirrel).getSize(new THREE.Vector3());
            squirrel.scale.set(1 / dim2.y, 1 / dim2.y, 1 / dim2.y);
            squirrel.rotation.set(Math.PI / 2, Math.PI, 0);
            squirrel.position.set(0, 0, 1);
            scene.add(squirrel);
        }
    );
    loader.load(
        'models/faronk.stl',
        (geometry) => {
            oakLog = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x4f3414}));
            let dim3 = new THREE.Box3().setFromObject(oakLog).getSize(new THREE.Vector3());
            oakLog.rotation.z = Math.PI / 2;
            oakLog.scale.set(1 / 7 * dim3.x, 1 / 7 * dim3.x, 1 / 7 * dim3.x);
            oakLog.position.set(Math.round(Math.random() - 1), 0.25, -50);
        }
    );
    loader.load(
        'models/stone.stl',
        (geometry) => {
            stone = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x808080}));
            let dim4 = new THREE.Box3().setFromObject(stone).getSize(new THREE.Vector3());
            stone.rotation.y = Math.PI / 2;
            stone.scale.set(1 / dim4.x, 1 / dim4.x, 1 / dim4.x);
            stone.position.set(Math.round(Math.random() * 2 - 1), 0, -50);
        }
    );
    loader.load(
        'models/lejto2.stl',
        (geometry) => {
            downHill = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x808080}));
            let dim5 = new THREE.Box3().setFromObject(downHill).getSize(new THREE.Vector3());
            downHill.scale.set(1 / dim5.x, 1 / dim5.x, 1 / dim5.x);
            downHill.position.set(0, 0.5, 3);
            hillGroup.add(downHill);
        }
    );
    loader.load(
        'models/deszka.stl',
        (geometry) => {
            oakBoard = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x4f3414}));
            let dim6 = new THREE.Box3().setFromObject(oakBoard).getSize(new THREE.Vector3());
            oakBoard.scale.set(1 / dim6.x, 1 / dim6.x, 1 / dim6.x);
            oakBoard.position.set(0, 0.5, 2.9);
            oakBoard.rotation.set(Math.PI / -2, 0, Math.PI);
            hillGroup.add(oakBoard);
        }
    )
    loader.load(
        'models/coin2.stl',
        (geometry) => {
            coin = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0xfcb125}));
            let dim7 = new THREE.Box3().setFromObject(coin).getSize(new THREE.Vector3());
            coin.scale.set(1 / (2 * dim7.x), 1 / (2 * dim7.x), 1 / (2 * dim7.x));
            coin.position.y = 0.25;
        }
    )
}

load3DModels();

var oakLogRotations = [0, Math.PI / 2];
var motionDuration = 200;
var rAF;
var points = 0;
let isStopped = false;
const menu = document.getElementById('menu');

addEventListener("keydown", event => {
    if ((event.code === 'KeyD') && (mammut.position.x <= 2)) {
        animateObjectMotion(mammut, {x: mammut.position.x + 1}, motionDuration);
        animateObjectMotion(squirrel, {x: squirrel.position.x + 1}, motionDuration);
        animateObjectMotion(camera, {x: camera.position.x + 1}, motionDuration);
    }
    if ((event.code === 'KeyA') && (mammut.position.x >= 2)) {
        animateObjectMotion(mammut, {x: mammut.position.x - 1}, motionDuration);
        animateObjectMotion(squirrel, {x: squirrel.position.x - 1}, motionDuration);
        animateObjectMotion(camera, {x: camera.position.x - 1}, motionDuration);
    }
    if (event.code === 'Space') {
        animateObjectMotion(mammut, {y: 1}, motionDuration);
        animateObjectMotion(squirrel, {y: 1}, motionDuration);
        setTimeout(() => {
            animateObjectMotion(mammut, {y: 0}, motionDuration);
            animateObjectMotion(squirrel, {y: 0}, motionDuration);
        }, 200);   
    }
    if (event.code === 'Escape') {
        if (!isStopped) {
            cancelAnimationFrame(rAF);
            menu.style.display = 'block';
            document.getElementById('game').style.opacity = 0.5;
            isStopped = true;
        } else {
            game3D();
            menu.style.display = 'none';
            document.getElementById('game').style.opacity = 1;
            isStopped = false;
        }
    }
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

var floorGeometry = new THREE.BoxGeometry(3.3, 0.1, 75);
var floorMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);
floor.position.set(0, -0.1, -24.5);

scene.add(new THREE.HemisphereLight(0xffffff, 0x000000));
renderer.render(scene, camera);

let increment = 0.2;

function animateObjectMotion(object, coordinates, duration) {
    var tween = new TWEEN.Tween(object.position).to(coordinates, duration).easing(TWEEN.Easing.Quadratic.InOut);
    tween.start();
}

hillGroup.rotation.y = Math.PI;
hillGroup.position.set(Math.round(Math.random() * 2 - 1), 0, -50);
var barrierObjects, randomBarrier, activeBarrier;

function initializeBarriers() {
    barrierObjects = [oakLog, stone, hillGroup];
    randomBarrier = Math.round(Math.random() * 2);
    activeBarrier = barrierObjects[randomBarrier];
    scene.add(activeBarrier);
}

var game3D = () => {
	rAF = requestAnimationFrame(game3D);
	renderer.render(scene, camera);
    document.getElementById('points').innerHTML = `Pontszám: ${points}`;
    points++;
    try {
        if (activeBarrier.position.z != -1) {
            activeBarrier.position.z += increment;
        }
        if ((activeBarrier.position.z > 1) && (Math.round(activeBarrier.position.x) == Math.round(squirrel.position.x)) && (randomBarrier == 2) && (squirrel.position.y < 1.1)) {
            squirrel.position.y = (1.093 * (activeBarrier.position.z / 2 - squirrel.position.z / 2)) / 2.609;
        }
        if ((activeBarrier.position.z > 2.609) && (Math.round(activeBarrier.position.x) == Math.round(squirrel.position.x)) && (randomBarrier == 2)) {
            animateObjectMotion(squirrel, {y: squirrel.position.y - 1}, 500);
        }
        if (activeBarrier.position.z > 10) {
            activeBarrier.position.z = -50;
            scene.remove(activeBarrier);
            randomBarrier = Math.round(Math.random() * 2);
            activeBarrier = barrierObjects[randomBarrier];
            scene.add(activeBarrier);
            if (randomBarrier == 0) {
                activeBarrier.position.x = Math.round(Math.random()) - 1;
                let randomRotation = Math.round(Math.random());
                activeBarrier.rotation.z = oakLogRotations[randomRotation];
                if (randomRotation == 0) {
                    activeBarrier.position.y = 1.5;
                } else {
                    activeBarrier.position.y = 0.5;
                }
            } else {
                activeBarrier.position.x = Math.round(Math.random() * 2 - 1);
            }
        }
    } catch (error) {
        console.log(error);
        initializeBarriers();
    }
    TWEEN.update();
};

game3D();