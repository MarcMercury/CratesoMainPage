// Forms with data-product are sent to /api/waitlist; forms without it stay client-side only.
document.querySelectorAll('form[data-waitlist]').forEach(form => {
    const btn = form.querySelector('button[type="submit"], button');
    const originalText = btn.textContent;
    let status = form.parentNode.querySelector('.waitlist-status');
    if (!status) {
        status = document.createElement('p');
        status.className = 'waitlist-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.insertAdjacentElement('afterend', status);
    }

    function succeed() {
        btn.textContent = form.dataset.successText;
        btn.style.background = form.dataset.successColor;
        btn.disabled = true;
        status.textContent = '';
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.dataset.product) return succeed();

        btn.disabled = true;
        btn.textContent = 'Sending…';
        status.textContent = '';
        try {
            const r = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.querySelector('input[type="email"]').value,
                    product: form.dataset.product,
                    website: form.querySelector('input[name="website"]')?.value || ''
                })
            });
            if (!r.ok) throw new Error(String(r.status));
            succeed();
            form.reset();
        } catch {
            btn.disabled = false;
            btn.textContent = originalText;
            status.textContent = 'Sorry, we couldn\u2019t save your signup. Please try again later.';
        }
    });
});
