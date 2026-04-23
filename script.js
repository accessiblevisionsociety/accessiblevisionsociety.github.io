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

    // Latest Announcement Fetching for Home Page
    const latestAnnouncementContainer = document.getElementById('latest-announcement-container');
    const latestAnnouncementSection = document.getElementById('latest-announcement-section');

    if (latestAnnouncementContainer && latestAnnouncementSection && typeof announcementsRef !== 'undefined') {
        announcementsRef.orderByChild('createdAt').limitToLast(1).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // snapshot.val() returns an object with keys. With limitToLast(1), it should have one key.
                const keys = Object.keys(data);
                const announcement = data[keys[0]];
                
                // Truncate content for preview and handle potential HTML/newlines
                let previewContent = announcement.content;
                // Simple strip of HTML tags if any (though usually it's just text)
                previewContent = previewContent.replace(/<[^>]*>?/gm, '');
                
                if (previewContent.length > 200) {
                    previewContent = previewContent.substring(0, 200) + '...';
                }

                latestAnnouncementContainer.innerHTML = `
                    <div class="announcement-card">
                        <span class="date-badge">${announcement.date}</span>
                        <h4>${announcement.title}</h4>
                        <p>${previewContent}</p>
                        <a href="announcements/announcements.html">Read Full Announcement <i class="fas fa-arrow-right" style="margin-left: 10px;"></i></a>
                    </div>
                `;
                latestAnnouncementSection.style.display = 'block';
            } else {
                latestAnnouncementSection.style.display = 'none';
            }
        }, (error) => {
            console.error("Error fetching latest announcement:", error);
            latestAnnouncementSection.style.display = 'none';
        });
    }
});
