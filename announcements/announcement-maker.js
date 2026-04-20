let form, titleInput, dateInput, contentInput, deleteLastBtn;

document.addEventListener('DOMContentLoaded', () => {
    form = document.getElementById('announcementForm');
    titleInput = document.getElementById('announcementTitle');
    dateInput = document.getElementById('announcementDate');
    contentInput = document.getElementById('announcementContent');
    deleteLastBtn = document.getElementById('deleteLastBtn');

    if (!form) return;

    // Check if auth is available from firebase.js
    if (typeof auth === 'undefined' || !auth) {
        console.error("Firebase Auth not initialized!");
        return;
    }

    // Redirect if not authorized
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'authorize.html';
        } else {
            addExitButton();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const Title = titleInput.value.trim();
        const Date = dateInput.value.trim();
        const Content = contentInput.value.trim();

        if (Title && Date && Content) {
            const user = auth.currentUser;
            if (user) {
                submitData(Title, Date, Content);
            } else {
                alert("Security check required!");
                window.location.href = 'authorize.html';
            }
        } else {
            alert("Please fill all fields!");
        }
    });

    if (deleteLastBtn) {
        deleteLastBtn.addEventListener('click', deleteLastAnnouncement);
    }
});

function addExitButton() {
    if (document.getElementById('exitBtn')) return;
    const header = document.querySelector('header');
    if (!header) return;
    
    const exitBtn = document.createElement('button');
    exitBtn.id = 'exitBtn';
    exitBtn.textContent = 'Exit Session';
    exitBtn.className = 'btn-secondary';
    exitBtn.style.margin = '10px';
    exitBtn.onclick = () => auth.signOut().then(() => window.location.href = 'authorize.html');
    header.appendChild(exitBtn);
}

function submitData(Title, Date, Content) {
    if (typeof announcementsRef === 'undefined' || !announcementsRef) {
        alert("Authorization server error!");
        return;
    }

    const newAnnouncementRef = announcementsRef.push();
    const id = newAnnouncementRef.key;
    const timestamp = firebase.database.ServerValue.TIMESTAMP;
    
    newAnnouncementRef.set({
        ID: id,
        title: Title,
        date: Date,
        content: Content,
        createdAt: timestamp,
        postedBy: auth.currentUser.email
    }).then(() => {
        alert("Announcement published!");
        form.reset();
    }).catch((error) => {
        console.error("Error: ", error);
        alert("Publish failed: " + error.message);
    });
}

function deleteLastAnnouncement() {
    if (!confirm("Are you sure you want to delete the most recent announcement? This cannot be undone.")) {
        return;
    }

    // Find the latest announcement based on createdAt timestamp
    announcementsRef.orderByChild('createdAt').limitToLast(1).once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const lastId = Object.keys(data)[0];
            const lastTitle = data[lastId].title;
            
            if (confirm(`Confirm deleting: "${lastTitle}"?`)) {
                announcementsRef.child(lastId).remove()
                    .then(() => {
                        alert("Announcement deleted successfully!");
                    })
                    .catch((error) => {
                        alert("Error deleting: " + error.message);
                    });
            }
        } else {
            alert("No announcements found to delete.");
        }
    }).catch((error) => {
        console.error("Fetch error:", error);
        alert("Failed to find the latest announcement.");
    });
}
