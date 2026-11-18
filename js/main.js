// ─── Particle Canvas ─────────────────────────────────────────────────────
(function() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: randomBetween(0.5, 2.2),
                alpha: randomBetween(0.15, 0.55),
                vx: randomBetween(-0.18, 0.18),
                vy: randomBetween(-0.12, 0.12),
                color: Math.random() > 0.6 ? '#EDB645' : '#ffffff'
            });
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(237, 182, 69, ${0.04 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections();
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(')', `, ${p.alpha})`).replace('rgb', 'rgba').replace('#EDB645', `rgba(237,182,69,${p.alpha})`).replace('#ffffff', `rgba(255,255,255,${p.alpha})`);
            // simplified:
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); initParticles(); });
    resize();
    initParticles();
    animate();
})();

// ─── GitHub Live Repo Badges ──────────────────────────────────────────────
(async function() {
    const repoMap = {
        'Everloop.live': 'Everloop.live',
        'HottiesThatHit': 'HottiesThatHit',
        'PetPodcast': 'PetPodcast',
        'Vespara': 'Vespara',
        'TraumaBox': 'TraumaBox',
        'Stoop-Politics': 'Stoop-Politics',
        'NYCDeli': 'NYCDeli',
        'EmployeeGM-GreenDog': 'EmployeeGM-GreenDog'
    };
    const OWNER = 'MarcMercury';
    const badges = document.querySelectorAll('.product-live-badge[data-repo]');
    const repoNames = [...new Set([...badges].map(b => b.dataset.repo))];

    const results = await Promise.allSettled(
        repoNames.map(repo =>
            fetch(`https://api.github.com/repos/${OWNER}/${repoMap[repo] || repo}`)
                .then(r => {
                    if (!r.ok) throw new Error(`GitHub API ${r.status}`);
                    return r.json();
                })
                .then(d => ({ repo, data: d }))
        )
    );

    const dataByRepo = {};
    results.forEach(r => {
        if (r.status === 'fulfilled' && r.value.data && !r.value.data.message) {
            dataByRepo[r.value.repo] = r.value.data;
        }
    });

    badges.forEach(badge => {
        const repo = badge.dataset.repo;
        const data = dataByRepo[repo];
        if (data) {
            const pushed = new Date(data.pushed_at);
            const daysAgo = Math.floor((Date.now() - pushed) / 86400000);
            const label = daysAgo === 0 ? 'Updated today' : daysAgo === 1 ? 'Updated yesterday' : `Updated ${daysAgo}d ago`;
            badge.textContent = label;
            badge.classList.add('badge-live');
            if (data.language) {
                const lang = badge.closest('.product-card').querySelector('.product-info p');
                if (lang) {
                    const langEl = document.createElement('span');
                    langEl.className = 'product-lang';
                    langEl.textContent = data.language;
                    badge.parentNode.appendChild(langEl);
                }
            }
        }
    });

    // Update stat numbers
    const liveCount = Object.keys(dataByRepo).length;
    const repoEl = document.getElementById('stat-repos');
    if (repoEl) animateCount(repoEl, liveCount);
    animateCount(document.getElementById('stat-products'), 12);
})();

function animateCount(el, target) {
    if (!el) return;
    let start = 0;
    const step = () => {
        start += Math.ceil((target - start) / 6);
        el.textContent = start;
        if (start < target) requestAnimationFrame(step);
        else el.textContent = target;
    };
    requestAnimationFrame(step);
}

// ─── Category Expansion Functions ────────────────────────────────────────
function expandCategory(tile) {
    const category = tile.dataset.category;
    const overlay = document.getElementById('categoryOverlay');
    const title = document.getElementById('overlayTitle');

    // Get tile position for animation origin
    const rect = tile.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Set transform origin from clicked tile
    overlay.style.transformOrigin = `${centerX}px ${centerY}px`;

    // Set title based on category
    const titles = {
        'stories': 'Stories & Games',
        'productivity': 'Productivity & Communication',
        'media': 'Media & Creative',
        'community': 'Community & Lifestyle'
    };
    title.textContent = titles[category];

    // Hide all product grids, show the selected one
    document.querySelectorAll('.products-grid').forEach(grid => {
        grid.classList.add('hidden');
    });
    document.getElementById(category + '-products').classList.remove('hidden');

    // Animate tile to center then expand overlay
    tile.classList.add('expanding');

    setTimeout(() => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 150);

    setTimeout(() => {
        tile.classList.remove('expanding');
    }, 600);
}

function closeCategory() {
    const overlay = document.getElementById('categoryOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close overlay with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCategory();
        document.getElementById('ageModal').classList.remove('active');
        document.body.style.overflow = '';
    }
});

function showAgeVerification() {
    document.getElementById('ageModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function verifyAge(isOfAge) {
    if (isOfAge) {
        document.getElementById('ageModal').classList.remove('active');
        document.body.style.overflow = '';
        window.location.href = 'products/tag/index.html';
    } else {
        document.getElementById('ageModal').classList.remove('active');
        document.body.style.overflow = '';
        alert('You must be 21 or older to access this content.');
    }
}

// Close modal if clicking outside
document.getElementById('ageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close overlay if clicking outside content
document.getElementById('categoryOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCategory();
    }
});

document.querySelectorAll('.category-tile[data-category]').forEach(tile => {
    tile.addEventListener('click', () => expandCategory(tile));
});

document.querySelector('.close-overlay').addEventListener('click', closeCategory);

document.querySelectorAll('[data-age-gate]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showAgeVerification();
    });
});

document.querySelectorAll('[data-verify-age]').forEach(btn => {
    btn.addEventListener('click', () => verifyAge(btn.dataset.verifyAge === 'true'));
});
