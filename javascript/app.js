import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1U6pqSoNDTplskFS9BqxKrz3fgjzETs4",
    authDomain: "campusone-50263.firebaseapp.com",
    projectId: "campusone-50263",
    storageBucket: "campusone-50263.firebasestorage.app",
    messagingSenderId: "582714629808",
    appId: "1:582714629808:web:ff20a5003d64c50edde575",
    measurementId: "G-WST5508HZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Open Modal
function openModal() {
    document.getElementById('modal').classList.add('active');
}

// Close Modal
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    const form = document.getElementById('itemForm');
    if (form) form.reset();
}

// Make functions global
window.openModal = openModal;
window.closeModal = closeModal;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking outside
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Handle Form Submission
    const form = document.getElementById('itemForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
            
            try {
                // Get form data
                const type = document.querySelector('input[name="type"]:checked').value;
                const itemName = document.getElementById('itemName').value.trim();
                const itemDescription = document.getElementById('itemDescription').value.trim();
                const location = document.getElementById('location').value.trim();
                const contact = document.getElementById('contact').value.trim();
                
                console.log('Form data:', { type, itemName, itemDescription, location, contact });
                
                // Add to Firebase
                const docRef = await addDoc(collection(db, 'lostAndFound'), {
                    type: type,
                    itemName: itemName,
                    itemDescription: itemDescription,
                    location: location,
                    contact: contact,
                    timestamp: serverTimestamp()
                });
                
                console.log('✅ Document written with ID:', docRef.id);
                
                // Success
                showToast('Item added successfully!', 'success');
                closeModal();
                
            } catch (error) {
                console.error('❌ Error adding item:', error);
                showToast('Error: ' + error.message, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit';
                }
            }
        });

    }
});


// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    } else {
        console.log('Toast:', message);
    }
}
































