window.addEventListener('DOMContentLoaded', () => {
    const tableNameEl = document.getElementById('table-name');
    const billDetailsEl = document.getElementById('bill-details');
    const totalAmountEl = document.getElementById('total-amount');
    const payButton = document.getElementById('pay-button');
    const statusMessageEl = document.getElementById('status-message');

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
});