import * as THREE from 'three';

// Sahna sozlamalari
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// 1. Kamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 6);
scene.add(camera);

// 2. Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 3. 3D Ob'ektlar (Xona simulyatsiyasi)
const group = new THREE.Group(); // Hamma narsa shu gruppaga tushadi

// Stol (Table)
const tableGeo = new THREE.BoxGeometry(4, 0.1, 2);
const tableMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -1;
group.add(table);

// Monitor
const monitorGeo = new THREE.BoxGeometry(2, 1.2, 0.05);
const monitorMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
const monitor = new THREE.Mesh(monitorGeo, monitorMat);
monitor.position.set(0, 0, -0.5);
group.add(monitor);

// Ekran (Yorug'lik taratuvchi qism)
const screenGeo = new THREE.PlaneGeometry(1.9, 1.1);
const screenMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff });
const screen = new THREE.Mesh(screenGeo, screenMat);
screen.position.set(0, 0, -0.47);
group.add(screen);

scene.add(group);

// 4. Chiroqlar
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00f2ff, 2);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

// 5. Skrol Animatsiyasi (GSAP orqali)
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const sectionHeight = window.innerHeight;

    // Kamera harakati
    if (scrollY < sectionHeight) {
        // 1-qism: Stolga yaqinlashish
        gsap.to(camera.position, { z: 6 - (scrollY/sectionHeight)*2, duration: 1 });
        gsap.to(group.rotation, { y: (scrollY/sectionHeight)*0.5, duration: 1 });
    } else {
        // 2-qism: Monitorga fokus
        gsap.to(camera.position, { z: 2, x: 0, y: 0, duration: 1 });
        gsap.to(group.rotation, { y: 0, duration: 1 });
    }
});

// 6. Animatsiya loopi
const tick = () => {
    // Monitor ekrani biroz "puls" bo'lib turishi uchun
    screenMat.opacity = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
    screenMat.transparent = true;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});