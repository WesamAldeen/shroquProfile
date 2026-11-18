function toggleMenu() {
    const nav = document.getElementById('navMenu');
    nav.classList.toggle('active');
}

const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');
const hoverTriggers = document.querySelectorAll('.hover-trigger, a, button');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    trigger.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// تأثير الإمالة ثلاثي الأبعاد للصورة الشخصية حصرياً
const profileCard = document.getElementById('tilt-profile');
if (profileCard) {
    profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        profileCard.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateY(-5px)`;
    });

    profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
}

// خلفية الجسيمات التفاعلية
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = Math.min(window.innerWidth / 15, 60);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? 'rgba(46, 111, 64, ' : 'rgba(91, 179, 115, ';
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            this.x -= (dx / dist) * 0.6;
            this.y -= (dy / dist) * 0.6;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(46, 111, 64, ${0.12 - dist / 1200})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawLines();
    requestAnimationFrame(animateCanvas);
}
animateCanvas();
