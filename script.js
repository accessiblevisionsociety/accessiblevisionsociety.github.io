document.addEventListener('DOMContentLoaded', function() {
    const navBtn = document.getElementById('navBtn');
    const navMenu = document.getElementById('navMenu');

    if (navBtn && navMenu) {
        navBtn.addEventListener('click', function() {
            const isVisible = navMenu.style.display === "flex";
            navMenu.style.display = isVisible ? "none" : "flex";
            navBtn.setAttribute('aria-expanded', isVisible ? "false" : "true");
            navBtn.setAttribute('aria-label', isVisible ? "Open navigation menu" : "Close navigation menu");
        });
    }

    // for greeting message and date display
    const greeting = document.getElementById('greeting');
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');

    if (greeting || dateElement || timeElement) {
        function updateDateTime() {
            let today = new Date();
            let greetingMessage = '';
            const hours = today.getHours();

            if (hours < 12) {
                greetingMessage = 'Good Morning Visitor!';
            } else if (hours < 18) {
                greetingMessage = 'Good Afternoon Visitor!';
            } else if (hours < 21) {
                greetingMessage = 'Good Evening Visitor!';
            } else {
                greetingMessage = 'Good Night Visitor!';
            }
            
            if (greeting) greeting.textContent = greetingMessage;

            if (dateElement) {
                let date = "Today is: " + today.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                });
                dateElement.textContent = date;
            }

            if (timeElement) {
                let timeString = today.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                });
                timeElement.textContent = timeString;
            }
        }
        updateDateTime();
        setInterval(updateDateTime, 60000); // Update every minute
    }
});
