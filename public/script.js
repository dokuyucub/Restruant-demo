import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD2kCpWN6wJ-qaf-6U5WdqiK5cBSSvuFbM",
    authDomain: "qrdemo-4de36.firebaseapp.com",
    projectId: "qrdemo-4de36",
    storageBucket: "qrdemo-4de36.appspot.com",
    messagingSenderId: "305123706543",
    appId: "1:305123706543:web:eb3517d73ad8f3b478f65a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#tables-list tbody');
    const addBtn = document.getElementById('add-table-btn');
    const input = document.getElementById('table-name-input');
    const status = document.getElementById('add-status');

    async function loadTables() {
        tableBody.innerHTML = '';
        const snapshot = await getDocs(collection(db, 'tables'));
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name}</td>
                <td style="color: ${data.isPaid ? 'green' : 'red'};">
                    ${data.isPaid ? 'Ödendi' : 'Ödenmedi'}
                </td>
                <td><a href="${data.qrUrl}" target="_blank">${data.qrUrl}</a></td>
                <td><button class="delete-btn" data-id="${docSnap.id}">Sil</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    await loadTables();

    addBtn.addEventListener('click', async () => {
        const name = input.value.trim();
        if (!name) {
            status.textContent = 'Lütfen masa adı girin.';
            status.style.color = 'red';
            return;
        }

        try {
            await addDoc(collection(db, 'tables'), {
                name,
                isPaid: false,
                qrUrl: `https://resturant-demo.vercel.app/public/table.html?id=${name}`
            });
            status.textContent = 'Masa başarıyla eklendi!';
            status.style.color = 'green';
            input.value = '';
            await loadTables();
        } catch (err) {
            console.error(err);
            status.textContent = 'Bir hata oluştu.';
            status.style.color = 'red';
        }
    });

    // Silme işlemi
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            const onay = confirm("Bu masayı silmek istiyor musun?");
            if (!onay) return;

            try {
                await deleteDoc(doc(db, "tables", id));
                alert("Masa silindi.");
                await loadTables();
            } catch (err) {
                alert("Silme hatası: " + err.message);
            }
        }
    });
});