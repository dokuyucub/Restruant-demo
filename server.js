const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const mockDatabase = {
  tables: {
    "1": {
      tableName: "Masa 1 - Pencere Kenarı",
      isPaid: false,
      items: [
        { name: "Türk Kahvesi", price: 50, quantity: 2 },
        { name: "Su", price: 15, quantity: 2 },
        { name: "Cheesecake", price: 120, quantity: 1 }
      ],
      total: 250
    },
    "2": {
      tableName: "Masa 2 - Bahçe",
      isPaid: true,
      items: [
        { name: "Filtre Kahve", price: 70, quantity: 1 },
        { name: "Kruvasan", price: 85, quantity: 1 }
      ],
      total: 155
    },
    "3": {
      tableName: "Masa 3",
      isPaid: false,
      items: [
        { name: "Çay", price: 30, quantity: 4 },
        { name: "Simit", price: 25, quantity: 2 }
      ],
      total: 170
    }
  }
};

app.get('/api/table/:tableId', (req, res) => {
  const { tableId } = req.params;
  const tableData = mockDatabase.tables[tableId];
  if (tableData) res.json(tableData);
  else res.status(404).json({ error: 'Masa bulunamadı' });
});

app.post('/api/payment/initiate', (req, res) => {
  const { tableId, amount } = req.body;
  const table = mockDatabase.tables[tableId];

  if (!table) return res.status(404).json({ error: 'Masa bulunamadı' });
  if (table.isPaid) return res.status(400).json({ error: 'Bu hesap zaten ödenmiş' });
  if (table.total !== amount) return res.status(400).json({ error: 'Tutar eşleşmiyor' });

  table.isPaid = true;
  res.json({ success: true, message: `Masa ${tableId} için ödeme başarılı!` });
});

app.get('/api/admin/tables', (req, res) => {
  const tableInfo = Object.keys(mockDatabase.tables).map(id => {
    const table = mockDatabase.tables[id];
    return {
      id: id,
      name: table.tableName,
      isPaid: table.isPaid,
      qrUrl: `http://localhost:${PORT}/table.html?id=${id}`
    };
  });
  res.json(tableInfo);
});

app.listen(PORT, () => {
  console.log(`QR Demo sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
  console.log('Admin Paneli: http://localhost:3000/admin.html');
});