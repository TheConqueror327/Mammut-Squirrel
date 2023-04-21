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

const models = ['models/elephant.stl', 'models/squirrel.stl', 'models/faronk.stl', 'models/stone.stl', 'models/lejto2.stl', 'models/deszka.stl', 'models/coin2.stl'];
let loaded = 0;
let toLoad = models.length;
var mammut, squirrel, oakLog, stone, downHill, oakBoard, coin;
const hillGroup = new THREE.Group();
var barrierObjects = [];

function checkModels() {
    loaded++;
    if (loaded == toLoad) {
        startEventListening();
        init();
        setSceneBackground(document.getElementById('setting1').innerHTML);
        updateBarriers();
        updateCoins();
        game3D();
        needToAnalyzeObjects = true;
    }
}

function setSceneBackground(fileName) {
    scene.background = textureLoader.load(fileName);
}

function load3DModels() {
    const loader = new STLLoader();
    loader.load(
        'models/elephant.stl',
        (geometry) => {
            mammut = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0x94918d}));
            let dim = new THREE.Box3().setFromObject(mammut).getSize(new THREE.Vector3());
            mammut.scale.set(1 / dim.x, 1 / dim.x, 1 / dim.x);
            mammut.rotation.y = Math.PI / 1.2;
            mammut.position.set(2, 0, 7);
            scene.add(mammut);
            checkModels();
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
            checkModels();
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
            barrierObjects.push(oakLog);
            checkModels();
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
            barrierObjects.push(stone);
            checkModels();
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
            checkModels();
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
            checkModels();
        }
    )
    loader.load(
        'models/coin2.stl',
        (geometry) => {
            coin = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: 0xfff947}));
            let dim7 = new THREE.Box3().setFromObject(coin).getSize(new THREE.Vector3());
            coin.scale.set(1 / (2 * dim7.x), 1 / (2 * dim7.x), 1 / (2 * dim7.x));
            coin.position.y = 0.25;
            checkModels();
        }
    )
}

load3DModels();

var rAF;
let isStopped = false;
const menu = document.getElementById('menu');

function startEventListening() {
    addEventListener("keydown", event => {
        if ((event.code === 'KeyD') && (mammut.position.x <= 2) && (needToAnalyzeObjects)) {
            animateObjectMotion(mammut, {x: mammut.position.x + 1}, motionDuration);
            animateObjectMotion(squirrel, {x: squirrel.position.x + 1}, motionDuration);
            animateObjectMotion(camera, {x: camera.position.x + 1}, motionDuration);
        }
        if ((event.code === 'KeyA') && (mammut.position.x >= 2) && (needToAnalyzeObjects)) {
            animateObjectMotion(mammut, {x: mammut.position.x - 1}, motionDuration);
            animateObjectMotion(squirrel, {x: squirrel.position.x - 1}, motionDuration);
            animateObjectMotion(camera, {x: camera.position.x - 1}, motionDuration);
        }
        if ((event.code === 'Space') && (needToAnalyzeObjects)) {
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
                clearInterval(barrierInterval);
                menu.style.display = 'block';
                document.getElementById('switch1').addEventListener('click', toggleNightMode());
                document.getElementById('game').style.opacity = 0.5;
                isStopped = true;
            } else {
                game3D();
                updateBarriers();
                menu.style.display = 'none';
                document.getElementById('switch1').removeEventListener('click', toggleNightMode());
                document.getElementById('game').style.opacity = 1;
                isStopped = false;
            }
        }
    });
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

var oakLogRotations, motionDuration;
let points, coinPoints, increment, speed;

function init() {
    oakLogRotations = [0, Math.PI / 2];
    motionDuration = 200;
    points = 0;
    coinPoints = 0;
    speed = 2000;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    var floor = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.1, 75), new THREE.MeshStandardMaterial({color: 0xffffff}));
    floor.position.set(0, -0.1, -24.5);
    scene.add(floor);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000));
    increment = 0.2;
    hillGroup.rotation.y = Math.PI;
    hillGroup.position.set(Math.round(Math.random() * 2 - 1), 0, -50);
    barrierObjects.push(hillGroup);
}

function toggleNightMode() {
    setSceneBackground(document.getElementById('setting1').innerHTML);
}

function animateObjectMotion(object, coordinates, duration) {
    var tween = new TWEEN.Tween(object.position).to(coordinates, duration).easing(TWEEN.Easing.Quadratic.InOut);
    tween.start();
}

let randomBarrier = Math.round(Math.random() * 2);
let activeBarriers = [];
let activeBarrierGroup = [];
var barrierInterval;
let activeCoins = [];
let freeSpaceForCoins = [-1, 0, 1];
let activeCoinX;
let isOakLogVertical;
let needToAnalyzeObjects;

function updateCoins() {
    setInterval(() => {
        initializeCoin(coin.clone(), activeCoinX, -50);
    }, 500);
}

function initializeCoin(object, x, z) {
    object.position.set(x, 0.25, z);
    activeCoins.push(object);
    scene.add(object);
}

function updateBarriers() {
    barrierInterval = setInterval(
    () => {
        initializeBarrier(barrierObjects[randomBarrier].clone(), randomBarrier);
        freeSpaceForCoins.splice(freeSpaceForCoins.indexOf(barrierObjects[randomBarrier].position.x), 1);
        activeCoinX = freeSpaceForCoins[Math.round(Math.random())];
        randomBarrier = Math.round(Math.random() * 2);
        freeSpaceForCoins = [-1, 0, 1];
    }, speed);
}

function initializeBarrier(object, randBarr) {
    object.position.z = -50;
    if (randBarr == 0) {
        object.position.x = Math.round(Math.random()) - 1;
        let randomRotation = Math.round(Math.random());
        object.rotation.z = oakLogRotations[randomRotation];
        if (randomRotation == 0) {
            object.position.y = 1.6;
            isOakLogVertical = true;
        } else {
            object.position.y = 0.5;
            isOakLogVertical = false;
        }
    } else {
        object.position.x = Math.round(Math.random() * 2 - 1);
    }
    activeBarrierGroup = [object, randBarr, isOakLogVertical];
    activeBarriers.push(activeBarrierGroup);
    scene.add(object);
}

function gameOver() {
    increment = 0;
    clearInterval(barrierInterval);
    animateObjectMotion(camera, {x: 5, y: 5, z: 5}, 1000);
    document.getElementById('game').style.opacity = 0.5
    setTimeout(() => {
        document.getElementById('GameOver').style.display = "block";   
    },1000)
}

function game3D() {
	rAF = requestAnimationFrame(game3D);
	renderer.render(scene, camera);
    try {
        if (needToAnalyzeObjects) {
            document.getElementById('points').innerHTML = `Pontszám: ${points}`;
            points++;
            for (let i = 0; i < activeBarriers.length; i++) {
                activeBarriers[i][0].position.z += increment;
                if ((activeBarriers[i][0].position.z > 1) && (Math.round(activeBarriers[i][0].position.x) == Math.round(squirrel.position.x)) && (activeBarriers[i][1] == 2) && (squirrel.position.y < 1.1)) {
                    squirrel.position.y = (1.093 * (activeBarriers[i][0].position.z / 2 - squirrel.position.z / 2)) / 2.609;
                }
                if ((activeBarriers[i][0].position.z > 2.609) && (Math.round(activeBarriers[i][0].position.x) == Math.round(squirrel.position.x)) && (activeBarriers[i][1] == 2)) {
                    animateObjectMotion(squirrel, {y: 0}, 500);
                }
                if (activeBarriers[i][0].position.z > 10) {
                    scene.remove(activeBarriers[i][0]);
                    activeBarriers.splice(i, 1);
                }
                if ((activeBarriers[i][0].position.z > 0) && (activeBarriers[i][0].position.z < 1) && (squirrel.position.x == activeBarriers[i][0].position.x) && (activeBarriers[i][1] != 2) && (squirrel.position.y == 0)) {
                    needToAnalyzeObjects = false;
                    gameOver();
                }
            }
            for (let z = 0; z < activeCoins.length; z++) {
                activeCoins[z].position.z += increment;
                activeCoins[z].rotation.y += 0.01;
                if (activeCoins[z].position.z > 10) {
                    scene.remove(activeCoins[z]);
                    coin.remove(activeCoins[z]);
                    activeCoins.splice(z, 1);
                }
                if ((activeCoins[z].position.z > 1) && (activeCoins[z].position.x == squirrel.position.x)) {
                    scene.remove(activeCoins[z]);
                    coin.remove(activeCoins[z]);
                    activeCoins.splice(z, 1);
                    coinPoints++;
                    document.getElementById('coins').innerHTML = `Érmék: ${coinPoints}`;
                }
            }
        } else {camera.lookAt(new THREE.Vector3(0, 0, 0));}
    }
    catch (error) {
        console.log(error);
    }
    TWEEN.update();
};