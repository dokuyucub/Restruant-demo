// Firebase SDK ekleniyor
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

window.addEventListener('DOMContentLoaded', () => {
  // -------------------- MASA EKLEME PANELİ --------------------
  const addTableBtn = document.getElementById('add-table-btn');
  const tableNameInput = document.getElementById('table-name-input');
  const addStatus = document.getElementById('add-status');

  if (addTableBtn && tableNameInput && addStatus) {
    addTableBtn.addEventListener('click', async () => {
      const tableName = tableNameInput.value.trim();

      if (!tableName) {
        addStatus.textContent = "Lütfen masa adı girin.";
        addStatus.style.color = "red";
        return;
      }// Tablodaki verileri Firebase'den çekip göster
const tableBody = document.querySelector("#table-list tbody");
tableBody.innerHTML = "";

const querySnapshot = await getDocs(collection(db, "tables"));
querySnapshot.forEach((doc) => {
  const data = doc.data();

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.name}</td>
    <td class="status">${data.isPaid ? "Ödendi" : "Ödenmedi"}</td>
    <td><a href="${data.qrUrl}" target="_blank">${data.qrUrl}</a></td>
  `;
  tableBody.appendChild(row);
});

      try {
        await addDoc(collection(db, "tables"), {
          name: tableName,
          isPaid: false,
          qrUrl: `https://resturant-demo.vercel.app/public/table.html?id=${tableName}`
        });

        addStatus.textContent = "Masa başarıyla eklendi!";
        addStatus.style.color = "green";
        tableNameInput.value = "";
      } catch (error) {
        console.error("Hata:", error);
        addStatus.textContent = "Hata oluştu.";
        addStatus.style.color = "red";
      }
    });
  }

  // -------------------- MÜŞTERİ ÖDEME PANELİ --------------------
  const tableNameEl = document.getElementById('table-name');
  const billDetailsEl = document.getElementById('bill-details');
  const totalAmountEl = document.getElementById('total-amount');
  const payButton = document.getElementById('pay-button');
  const statusMessageEl = document.getElementById('status-message');

  if (tableNameEl && billDetailsEl && totalAmountEl && payButton && statusMessageEl) {
    const params = new URLSearchParams(window.location.search);
    const tableId = params.get('id');
    let tableData = null;

    if (!tableId) {
      tableNameEl.textContent = 'Hata: Masa ID bulunamadı!';
      return;
    }

    fetch(`/api/table/${tableId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        tableData = data;
        tableNameEl.textContent = data.tableName;
        data.items.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = 'bill-item';
          itemEl.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)} TL</span>
          `;
          billDetailsEl.appendChild(itemEl);
        });
        totalAmountEl.textContent = `${data.total.toFixed(2)} TL`;

        if (data.isPaid) {
          payButton.textContent = 'BU HESAP ÖDENDİ';
          payButton.disabled = true;
          payButton.style.backgroundColor = 'grey';
        }
      })
      .catch(error => {
        tableNameEl.textContent = 'Hesap Yüklenemedi';
        statusMessageEl.textContent = `Hata: ${error.message}`;
        statusMessageEl.style.color = 'red';
      });

    payButton.addEventListener('click', () => {
      payButton.disabled = true;
      payButton.textContent = 'İŞLEM YAPILIYOR...';

      fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: tableId,
          amount: tableData.total
        }),
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          statusMessageEl.textContent = result.message;
          statusMessageEl.style.color = 'green';
          payButton.textContent = 'ÖDEME BAŞARILI';
          payButton.style.backgroundColor = '#28a745';
        } else {
          throw new Error(result.error);
        }
      })
      .catch(error => {
        statusMessageEl.textContent = `Ödeme Hatası: ${error.message}`;
        statusMessageEl.style.color = 'red';
        payButton.disabled = false;
        payButton.textContent = 'TEKRAR DENE';
      });
    });
  }
});// ================== MASA EKLEME PANELİ ==================
const addTableBtn = document.getElementById('add-table-btn');
const tableNameInput = document.getElementById('table-name-input');
const addStatus = document.getElementById('add-status');

if (addTableBtn && tableNameInput && addStatus) {
    addTableBtn.addEventListener('click', async () => {
        const tableName = tableNameInput.value.trim();

        if (!tableName) {
            addStatus.textContent = "Lütfen masa adı girin.";
            addStatus.style.color = "red";
            return;
        }

        try {
            await addDoc(collection(db, "tables"), {
                name: tableName,
                isPaid: false,
                qrUrl: `https://qr-demo-project.vercel.app/public/table.html?id=${tableName}`
            });

            addStatus.textContent = "Masa başarıyla eklendi.";
            addStatus.style.color = "green";
            tableNameInput.value = '';
        } catch (error) {
            addStatus.textContent = `Hata: ${error.message}`;
            addStatus.style.color = "red";
        }
    });// ================== MASA EKLEME PANELİ ==================
const addTableBtn = document.getElementById('add-table-btn');
const tableNameInput = document.getElementById('table-name-input');
const addStatus = document.getElementById('add-status');

if (addTableBtn && tableNameInput && addStatus) {
    addTableBtn.addEventListener('click', async () => {
        const tableName = tableNameInput.value.trim();

        if (!tableName) {
            addStatus.textContent = "Lütfen masa adı girin.";
            addStatus.style.color = "red";
            return;
        }

        try {
            await addDoc(collection(db, "tables"), {
                name: tableName,
                isPaid: false,
                qrUrl: `https://qr-demo-project.vercel.app/public/table.html?id=${tableName}`
            });

            addStatus.textContent = "Masa başarıyla eklendi.";
            addStatus.style.color = "green";
            tableNameInput.value = '';
        } catch (error) {
            addStatus.textContent = `Hata: ${error.message}`;
            addStatus.style.color = "red";
        }
    });
}