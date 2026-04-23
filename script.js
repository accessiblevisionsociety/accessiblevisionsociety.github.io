document.addEventListener('DOMContentLoaded', function() {
    const navBtn = document.getElementById('navBtn');
    const navMenu = document.getElementById('navMenu');
    
    // Create overlay dynamically
    const overlay = document.createElement('div');
    overlay.id = 'navOverlay';
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        // Use getComputedStyle to check actual display state
        const isVisible = window.getComputedStyle(navMenu).display === "flex";
        
        if (isVisible) {
            // Close menu
            navMenu.style.display = "none";
            overlay.classList.remove('active');
            navBtn.setAttribute('aria-expanded', "false");
            navBtn.setAttribute('aria-label', "Open navigation menu");
            navBtn.innerHTML = '☰';
            document.body.style.overflow = ''; // Restore scroll
        } else {
            // Open menu
            navMenu.style.display = "flex";
            overlay.classList.add('active');
            navBtn.setAttribute('aria-expanded', "true");
            navBtn.setAttribute('aria-label', "Close navigation menu");
            navBtn.innerHTML = '✕';
            document.body.style.overflow = 'hidden'; // Prevent scroll
            
            // Focus first link in menu for accessibility
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    }

    if (navBtn && navMenu) {
        navBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu on Esc key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && window.getComputedStyle(navMenu).display === "flex") {
                toggleMenu();
            }
        });

        // Focus trapping
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableItems = navMenu.querySelectorAll('a, button');
                const firstItem = focusableItems[0];
                const lastItem = focusableItems[focusableItems.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstItem) {
                        e.preventDefault();
                        lastItem.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastItem) {
                        e.preventDefault();
                        firstItem.focus();
                    }
                }
            }
        });
    }

    // Active Link Highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#navMenu a');
    
    // Normalize path to get filename
    let pathFilename = currentPath.split('/').pop() || 'index.html';
    if (pathFilename === '' || pathFilename === '/') pathFilename = 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Extract filename from href (handles ../path/file.html)
        const hrefFilename = href.split('/').pop();

        if (hrefFilename === pathFilename) {
            link.classList.add('active-link');
            link.setAttribute('aria-current', 'page');
        }
    });

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
