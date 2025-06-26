import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
                <td><button class="bill-btn" data-id="${docSnap.id}" data-name="${data.name}">Adisyonu Gör</button></td>
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

    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (!confirm("Bu masayı silmek istiyor musun?")) return;
            await deleteDoc(doc(db, "tables", id));
            await loadTables();
        }

        if (e.target.classList.contains('bill-btn')) {
            const tableId = e.target.getAttribute('data-id');
            const tableName = e.target.getAttribute('data-name');
            openBillPopup(tableId, tableName);
        }

        if (e.target.classList.contains('close-popup')) {
            document.getElementById('popup-overlay')?.remove();
        }

        if (e.target.classList.contains('delete-product-btn')) {
            const tableId = e.target.getAttribute('data-table-id');
            const productName = e.target.getAttribute('data-product-name');
            const ref = doc(db, 'tables', tableId);
            const docSnap = await getDoc(ref);
            const current = docSnap.data().bill || [];
            const updated = current.filter(item => item.name !== productName);
            await updateDoc(ref, { bill: updated });
            openBillPopup(tableId, docSnap.data().name);
        }
    });

    document.addEventListener('submit', async (e) => {
        if (e.target.id === 'add-product-form') {
            e.preventDefault();
            const tableId = e.target.getAttribute('data-table-id');
            const name = document.getElementById('product-name').value.trim();
            const price = parseFloat(document.getElementById('product-price').value);
            if (!name || isNaN(price)) return;

            const ref = doc(db, 'tables', tableId);
            const docSnap = await getDoc(ref);
            const current = docSnap.data().bill || [];
            current.push({ name, price });
            await updateDoc(ref, { bill: current });

            openBillPopup(tableId, docSnap.data().name);
        }
    });
});

async function openBillPopup(tableId, tableName) {
    document.getElementById('popup-overlay')?.remove();

    const popup = document.createElement('div');
    popup.id = 'popup-overlay';
    popup.innerHTML = `
        <div class="popup">
            <div class="popup-header">
                <h3>${tableName} - Adisyon</h3>
                <span class="close-popup" style="cursor:pointer;">&times;</span>
            </div>
            <div class="popup-body">
                <ul id="bill-items"></ul>
                <p id="total-amount">Toplam: 0.00 TL</p>
                <form id="add-product-form" data-table-id="${tableId}">
                    <input type="text" id="product-name" placeholder="Ürün Adı" required />
                    <input type="number" id="product-price" placeholder="Fiyat" required step="0.01" />
                    <button type="submit">Ürün Ekle</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    const ref = doc(db, 'tables', tableId);
    const docSnap = await getDoc(ref);
    const bill = docSnap.data().bill || [];

    const list = document.getElementById('bill-items');
    list.innerHTML = '';
    let total = 0;

    bill.forEach(item => {
        total += item.price;
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ${item.price.toFixed(2)} TL
            <button class="delete-product-btn" data-table-id="${tableId}" data-product-name="${item.name}">Sil</button>`;
        list.appendChild(li);
    });

    document.getElementById('total-amount').textContent = `Toplam: ${total.toFixed(2)} TL`;
}