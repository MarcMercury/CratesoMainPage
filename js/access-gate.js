// Gates age-restricted content behind a 21+ confirmation. Only a boolean flag is
// kept in localStorage; personal details entered in the form are never persisted.
document.addEventListener('DOMContentLoaded', function() {
    const accessForm = document.getElementById('access-form');
    if (!accessForm) return;

    const storageKey = accessForm.dataset.storageKey;
    const accessGate = document.getElementById('access-gate');
    const gatedContent = document.getElementById(accessForm.dataset.content);

    // Purge PII saved by earlier versions of this page.
    localStorage.removeItem(storageKey.replace(/-verified$/, '-data'));

    if (localStorage.getItem(storageKey)) {
        accessGate.classList.add('hidden');
        gatedContent.classList.remove('hidden');
    }

    accessForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('access-name').value.trim();
        const email = document.getElementById('access-email').value.trim();
        const phone = document.getElementById('access-phone').value.trim();
        const ageVerified = document.getElementById('age-verify').checked;

        if (name && email && phone && ageVerified) {
            localStorage.setItem(storageKey, 'true');
            accessForm.reset();

            accessGate.style.opacity = '0';
            accessGate.style.transform = 'translateY(-20px)';

            setTimeout(() => {
                accessGate.classList.add('hidden');
                gatedContent.classList.remove('hidden');
                gatedContent.style.opacity = '0';
                gatedContent.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    gatedContent.style.opacity = '1';
                    gatedContent.style.transform = 'translateY(0)';
                }, 50);
            }, 300);
        }
    });
});
