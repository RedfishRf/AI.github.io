/* ============================================
   Neural Network Background Animation
   ============================================ */
(function () {
    var canvas = document.getElementById('neural-bg');
    var ctx = canvas.getContext('2d');

    var particles = [];
    var PARTICLE_COUNT = 80;
    var CONNECTION_DIST = 150;
    var MOUSE_RADIUS = 200;

    var mouse = { x: -1000, y: -1000 };
    var width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    document.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('touchmove', function (e) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }, { passive: true });

    function Particle() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
            var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            this.vx -= (dx / dist) * force * 0.5;
            this.vy -= (dy / dist) * force * 0.5;
        }

        this.vx *= 0.999;
        this.vy *= 0.999;

        var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) {
            this.vx = (this.vx / speed) * 2;
            this.vy = (this.vy / speed) * 2;
        }
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, ' + this.opacity + ')';
        ctx.fill();
    };

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    var opacity = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(184, 75, 242, ' + opacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
})();

/* ============================================
   Scroll Reveal Observer
   ============================================ */
(function () {
    var reveals = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        for (var i = 0; i < reveals.length; i++) {
            reveals[i].classList.add('visible');
        }
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add('visible');
            }
        }
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    for (var i = 0; i < reveals.length; i++) {
        observer.observe(reveals[i]);
    }
})();

/* ============================================
   Counter Animation (number tick-up)
   ============================================ */
(function () {
    var counters = document.querySelectorAll('.counter');

    if (!('IntersectionObserver' in window)) {
        for (var i = 0; i < counters.length; i++) {
            var el = counters[i];
            el.textContent = el.dataset.target;
        }
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (!entries[i].isIntersecting) continue;

            var el = entries[i].target;
            var target = parseFloat(el.dataset.target);
            var duration = 2000;
            var start = performance.now();

            function update(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = target * eased;

                if (target >= 100) {
                    el.textContent = Math.floor(current);
                } else {
                    el.textContent = current.toFixed(1);
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target >= 100
                        ? target.toString()
                        : target.toFixed(1);
                }
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
        }
    }, { threshold: 0.5 });

    for (var i = 0; i < counters.length; i++) {
        observer.observe(counters[i]);
    }
})();

/* ============================================
   Nav background on scroll
   ============================================ */
(function () {
    var nav = document.querySelector('nav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 18, 0.85)';
        } else {
            nav.style.background = 'rgba(10, 10, 18, 0.6)';
        }
    });
})();