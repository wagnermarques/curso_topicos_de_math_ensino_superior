import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- CONFIGURAÇÃO DA CENA ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth * 0.66) / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.66, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(10, 20, 10);
scene.add(sunLight);

// --- OBJETOS ---
const ballGeometry = new THREE.SphereGeometry(0.5);
const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x00aaff });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Vetor Velocidade (Tangente)
const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5, 0xffff00);
scene.add(arrowHelper);

// --- LÓGICA DE FÍSICA / CÁLCULO ---
let isMoving = false;
let time = 0;
let initialVel = 20;
let angle = 45;
const gravity = -9.81;

const pathPoints = [];
const pathLineGeometry = new THREE.BufferGeometry();
const pathLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const pathLine = new THREE.Line(pathLineGeometry, pathLineMaterial);
scene.add(pathLine);

// --- GRÁFICOS (CHART.JS) ---
const posCtx = document.getElementById('posChart').getContext('2d');
const velCtx = document.getElementById('velChart').getContext('2d');

const posChart = new Chart(posCtx, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Altura y(t)', data: [], borderColor: '#0af', tension: 0.1 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { display: false }, y: { ticks: { color: '#fff' } } } }
});

const velChart = new Chart(velCtx, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Velocidade Vertical y\'(t)', data: [], borderColor: '#ff0', tension: 0.1 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { x: { display: false }, y: { ticks: { color: '#fff' } } } }
});

// --- FUNÇÕES ---
function launch() {
    isMoving = true;
    time = 0;
    pathPoints.length = 0;
    posChart.data.labels = [];
    posChart.data.datasets[0].data = [];
    velChart.data.labels = [];
    velChart.data.datasets[0].data = [];
    
    angle = document.getElementById('angle').value * (Math.PI / 180);
    initialVel = document.getElementById('power').value;
}

document.getElementById('launch').onclick = launch;
document.getElementById('angle').oninput = (e) => document.getElementById('angle-val').innerText = e.target.value;
document.getElementById('power').oninput = (e) => document.getElementById('power-val').innerText = e.target.value;

function update() {
    if (isMoving) {
        time += 0.016; // Aprox 60fps

        // Equações de Movimento (Cálculo)
        const vx0 = initialVel * Math.cos(angle);
        const vy0 = initialVel * Math.sin(angle);

        const x = vx0 * time;
        const y = vy0 * time + 0.5 * gravity * time * time;
        
        // Derivada: v_y(t) = v_y0 + g*t
        const vy = vy0 + gravity * time;

        if (y < 0) {
            isMoving = false;
            return;
        }

        ball.position.set(x, y, 0);
        
        // Atualiza Vetor Tangente
        const velocityVec = new THREE.Vector3(vx0, vy, 0).normalize();
        arrowHelper.setDirection(velocityVec);
        arrowHelper.position.copy(ball.position);
        arrowHelper.setLength(Math.sqrt(vx0*vx0 + vy*vy) * 0.5);

        // Atualiza Rastro
        pathPoints.push(new THREE.Vector3(x, y, 0));
        pathLineGeometry.setFromPoints(pathPoints);

        // Atualiza Gráficos
        if (Math.floor(time * 60) % 5 === 0) {
            posChart.data.labels.push(time.toFixed(2));
            posChart.data.datasets[0].data.push(y);
            posChart.update('none');

            velChart.data.labels.push(time.toFixed(2));
            velChart.data.datasets[0].data.push(vy);
            velChart.update('none');
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

update();

// Redimensionamento
window.addEventListener('resize', () => {
    camera.aspect = (window.innerWidth * 0.66) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.66, window.innerHeight);
});
