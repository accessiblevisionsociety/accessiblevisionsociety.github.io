document.addEventListener('DOMContentLoaded', function() {
    // --- Navigation Menu Logic ---
    const navBtn = document.getElementById('navBtn');
    const navMenu = document.getElementById('navMenu');
    
    const overlay = document.createElement('div');
    overlay.id = 'navOverlay';
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        const isVisible = window.getComputedStyle(navMenu).display === "flex";
        if (isVisible) {
            navMenu.style.display = "none";
            overlay.classList.remove('active');
            navBtn.setAttribute('aria-expanded', "false");
            // Change aria-label to indicate the button now opens the menu
            navBtn.setAttribute('aria-label', 'Open navigation drawer');
            navBtn.innerHTML = '☰';
            document.body.style.overflow = '';
        } else {
            navMenu.style.display = "flex";
            overlay.classList.add('active');
            navBtn.setAttribute('aria-expanded', "true");
            // Change aria-label to indicate the button now closes the menu
            navBtn.setAttribute('aria-label', 'Close navigation drawer');
            navBtn.innerHTML = '✕';
            document.body.style.overflow = 'hidden';
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    }

    if (navBtn && navMenu) {
        navBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.getComputedStyle(navMenu).display === "flex") toggleMenu();
        });
    }

    // Close navigation drawer when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(navMenu).display === "flex") {
                toggleMenu();
            }
        });
    });

    // --- Dark Mode Logic ---
    const themeToggle = document.getElementById('themeToggle');
    const themeAnnouncer = document.getElementById('theme-announcer');
    
    function setTheme(theme, shouldAnnounce = true) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            }
            if (shouldAnnounce && themeAnnouncer) {
                themeAnnouncer.textContent = 'Dark mode activated';
                setTimeout(() => { themeAnnouncer.textContent = ''; }, 2000);
            }
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
            if (shouldAnnounce && themeAnnouncer) {
                themeAnnouncer.textContent = 'Light mode activated';
                setTimeout(() => { themeAnnouncer.textContent = ''; }, 2000);
            }
            localStorage.setItem('theme', 'light');
        }
    }

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setTheme('dark', false);
    } else {
        setTheme('light', false);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // --- Active Link Highlighting ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#navMenu a').forEach(link => {
        if (link.getAttribute('href').split('/').pop() === currentPath) {
            link.classList.add('active-link');
            link.setAttribute('aria-current', 'page');
        }
    });

    // --- Greeting & Clock ---
    const greeting = document.getElementById('greeting');
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');

    if (greeting || dateElement || timeElement) {
        function updateDateTime() {
            const now = new Date();
            const hours = now.getHours();
            let msg = 'Good Evening Visitor!';
            if (hours < 12) msg = 'Good Morning Visitor!';
            else if (hours < 18) msg = 'Good Afternoon Visitor!';
            else if (hours >= 21) msg = 'Good Night Visitor!';
            
            if (greeting) greeting.textContent = msg;
            if (dateElement) dateElement.textContent = "Today is: " + now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
            if (timeElement) timeElement.textContent = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
        }
        updateDateTime();
        setInterval(updateDateTime, 60000);
    }

    // --- Latest Announcement ---
    const latestAnnContainer = document.getElementById('latest-announcement-container');
    const latestAnnSection = document.getElementById('latest-announcement-section');

    if (latestAnnContainer && latestAnnSection && typeof announcementsRef !== 'undefined') {
        announcementsRef.orderByChild('createdAt').limitToLast(1).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const announcement = Object.values(data)[0];
                let preview = announcement.content.replace(/<[^>]*>?/gm, '');
                if (preview.length > 200) preview = preview.substring(0, 200) + '...';

                latestAnnContainer.innerHTML = `
                    <div class="announcement-card">
                        <span class="date-badge">${announcement.date}</span>
                        <h4>${announcement.title}</h4>
                        <p>${preview}</p>
                        <a href="announcements/announcements.html">Read Full Announcement <i class="fas fa-arrow-right" style="margin-left: 10px;"></i></a>
                    </div>
                `;
                latestAnnSection.style.display = 'block';
            }
        });
    }
});
