document.querySelectorAll('form[data-waitlist]').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button');
        btn.textContent = form.dataset.successText;
        btn.style.background = form.dataset.successColor;
        btn.disabled = true;
    });
});
