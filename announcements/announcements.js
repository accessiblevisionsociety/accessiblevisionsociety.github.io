let announcementsBox;
let currentPage = 0;
let filteredAnnouncements = [];

document.addEventListener('DOMContentLoaded', () => {
    announcementsBox = document.getElementById('announcementsBox');
    if (!announcementsBox) return;

    // Show loader
    announcementsBox.innerHTML = `
        <div class="loader-container">
            <div class="spinner"></div>
            <p>Loading announcements...</p>
        </div>
    `;

    announcementsRef.on('value', (snapshot) => {
        const announcements = snapshot.val();
        if (announcements) {
            filteredAnnouncements = Object.entries(announcements).sort(([, a], [, b]) => {
                // Sort by createdAt timestamp if available, otherwise by date field
                const timeA = a.createdAt || new Date(a.date).getTime();
                const timeB = b.createdAt || new Date(b.date).getTime();
                return timeB - timeA;
            });
        } else {
            filteredAnnouncements = [];
        }
        displayAnnouncements();
    });

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                displayAnnouncements();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if ((currentPage + 1) * 10 < filteredAnnouncements.length) {
                currentPage++;
                displayAnnouncements();
            }
        });
    }
});

function displayAnnouncements() {
    announcementsBox.innerHTML = '';
    
   const start = currentPage * 10;
   const end = start + 10;
   const paginated = filteredAnnouncements.slice(start, end);
   
   if (paginated.length === 0) {
    announcementsBox.innerHTML = `
    <div class="no-announcements"> 
        <h3>No announcements</h3>
        <p>No announcements found!</p> 
    </div> `;
    return;
   }

   paginated.forEach(([id, announcement]) => {
    displayAnnouncement(announcement.title, announcement.date, announcement.content, id);
   });

   const prevBtn = document.getElementById('prevBtn');
   const nextBtn = document.getElementById('nextBtn');
   if (prevBtn) prevBtn.style.display = currentPage === 0 ? 'none' : 'inline';
   if (nextBtn) nextBtn.style.display = (currentPage + 1) * 10 >= filteredAnnouncements.length ? 'none' : 'inline';
}

function displayAnnouncement(title, date, content, id) {
    const div = document.createElement('div');
    div.classList.add('announcementBox');
    div.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Posted Date:</strong> ${date}</p>
        <details> 
            <summary>View Announcement</summary> 
            <div class="announcement-content">${content}</div>
        </details>
    `;
    announcementsBox.appendChild(div);
}
