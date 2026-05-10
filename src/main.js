import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- CONFIGURAÇÃO DA CENA ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth * 0.66) / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.66, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.screenSpacePanning = true; 

// Carrega o Cenário do Blender
const loader = new GLTFLoader();
loader.load('assets/stadium.glb', (gltf) => {
    scene.add(gltf.scene);
    console.log("Cenário do Blender carregado!");
});

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

const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5, 0xffff00);
scene.add(arrowHelper);

const pathPoints = [];
const pathLineGeometry = new THREE.BufferGeometry();
const pathLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const pathLine = new THREE.Line(pathLineGeometry, pathLineMaterial);
scene.add(pathLine);

// --- LÓGICA DE FÍSICA / CÁLCULO ---
let isMoving = false;
let currentTime = 0;
let maxTime = 0;
let initialVel = 20;
let angle = 45;
const gravity = -9.81;

// Histórico para o Scrubber
const history = [];

// --- GRÁFICOS (CHART.JS) + PLUGIN SCRUBBER ---
const verticalLinePlugin = {
    id: 'verticalLine',
    afterDraw: (chart) => {
        if (chart.scrubberValue !== undefined) {
            const ctx = chart.ctx;
            const x = chart.scales.x.getPixelForValue(chart.scrubberValue);
            const top = chart.scales.y.top;
            const bottom = chart.scales.y.bottom;

            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.stroke();
            ctx.restore();
        }
    }
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: { 
        x: { ticks: { color: '#888' }, grid: { color: '#333' } }, 
        y: { ticks: { color: '#fff' }, grid: { color: '#333' } } 
    },
    plugins: { legend: { labels: { color: '#fff' } } }
};

const posChart = new Chart(document.getElementById('posChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Altura y(t)', data: [], borderColor: '#0af', pointRadius: 0 }] },
    options: chartOptions,
    plugins: [verticalLinePlugin]
});

const velChart = new Chart(document.getElementById('velChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Velocidade Vertical y\'(t)', data: [], borderColor: '#ff0', pointRadius: 0 }] },
    options: chartOptions,
    plugins: [verticalLinePlugin]
});

// --- FUNÇÕES ---
function launch() {
    isMoving = true;
    currentTime = 0;
    history.length = 0;
    pathPoints.length = 0;
    
    posChart.data.labels = [];
    posChart.data.datasets[0].data = [];
    velChart.data.labels = [];
    velChart.data.datasets[0].data = [];
    
    angle = document.getElementById('angle').value * (Math.PI / 180);
    initialVel = document.getElementById('power').value;
    
    document.getElementById('playback-container').style.display = 'none';
}

function updateState(t) {
    const vx0 = initialVel * Math.cos(angle);
    const vy0 = initialVel * Math.sin(angle);
    
    const x = vx0 * t;
    const y = vy0 * t + 0.5 * gravity * t * t;
    const vy = vy0 + gravity * t;

    ball.position.set(x, y, 0);
    const velocityVec = new THREE.Vector3(vx0, vy, 0).normalize();
    arrowHelper.setDirection(velocityVec);
    arrowHelper.position.copy(ball.position);
    arrowHelper.setLength(Math.max(1, Math.sqrt(vx0*vx0 + vy*vy) * 0.5));

    // Atualiza linha de rastro até o tempo atual
    const currentPath = history.filter(h => h.t <= t).map(h => new THREE.Vector3(h.x, h.y, 0));
    pathLineGeometry.setFromPoints(currentPath);

    // Atualiza Linha Vermelha nos Gráficos
    posChart.scrubberValue = t.toFixed(2);
    velChart.scrubberValue = t.toFixed(2);
    posChart.update('none');
    velChart.update('none');

    document.getElementById('time-val').innerText = t.toFixed(2);
}

document.getElementById('launch').onclick = launch;
document.getElementById('angle').oninput = (e) => document.getElementById('angle-val').innerText = e.target.value;
document.getElementById('power').oninput = (e) => document.getElementById('power-val').innerText = e.target.value;

document.getElementById('scrubber').oninput = (e) => {
    if (!isMoving) {
        currentTime = parseFloat(e.target.value);
        updateState(currentTime);
    }
};

function update() {
    if (isMoving) {
        currentTime += 0.016;
        
        const vx0 = initialVel * Math.cos(angle);
        const vy0 = initialVel * Math.sin(angle);
        const x = vx0 * currentTime;
        const y = vy0 * currentTime + 0.5 * gravity * currentTime * currentTime;
        const vy = vy0 + gravity * currentTime;

        if (y < 0 && currentTime > 0.1) {
            isMoving = false;
            maxTime = currentTime;
            document.getElementById('playback-container').style.display = 'block';
            document.getElementById('scrubber').max = maxTime;
            document.getElementById('scrubber').value = maxTime;
        } else {
            history.push({ t: currentTime, x, y, vy });
            updateState(currentTime);

            // Popula os dados reais do gráfico durante o voo
            if (Math.floor(currentTime * 60) % 4 === 0) {
                const label = currentTime.toFixed(2);
                posChart.data.labels.push(label);
                posChart.data.datasets[0].data.push(y);
                velChart.data.labels.push(label);
                velChart.data.datasets[0].data.push(vy);
            }
        }
    }

    controls.update(); 
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

update();

window.addEventListener('resize', () => {
    camera.aspect = (window.innerWidth * 0.66) / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.66, window.innerHeight);
});
