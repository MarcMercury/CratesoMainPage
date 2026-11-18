document.getElementById('waitlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thanks for joining the CLO waitlist! We\'ll be in touch soon.');
    this.reset();
});
