function showAgeVerification() {
    document.getElementById('ageModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function verifyAge(isOfAge) {
    if (isOfAge) {
        document.getElementById('ageModal').classList.remove('active');
        document.body.style.overflow = '';
        window.location.href = '../products/vespara/index.html';
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

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('ageModal').classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.querySelectorAll('[data-verify-age]').forEach(btn => {
    btn.addEventListener('click', () => verifyAge(btn.dataset.verifyAge === 'true'));
});
