document.addEventListener("DOMContentLoaded", function () {
    const startDate = new Date('June 25, 2023 00:19:45').getTime();
    const yearsSpan = document.getElementById('years');
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    function updateCounter() {
        const now = new Date().getTime();
        const elapsed = now - startDate;

        const totalSeconds = Math.floor(elapsed / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalYears = Math.floor(totalDays / 365);

        yearsSpan.textContent = totalYears.toLocaleString();
        daysSpan.textContent = totalDays.toLocaleString();
        hoursSpan.textContent = totalHours.toLocaleString();
        minutesSpan.textContent = totalMinutes.toLocaleString();
        secondsSpan.textContent = totalSeconds.toLocaleString();
    }

    setInterval(updateCounter, 1000);
    updateCounter();
});



document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

