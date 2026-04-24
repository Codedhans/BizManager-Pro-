let bizData = JSON.parse(localStorage.getItem('codedhans_os_data')) || { inventory: [], sales: [] };

function toggleSection(id) {
    const section = document.getElementById(id);
    section.style.display = (section.style.display === "none") ? "block" : "none";
}

function addStock() {
    // We use document.getElementById('...')?.value to prevent the "null" error
    const name = document.getElementById('prodName')?.value;
    const qty = parseInt(document.getElementById('qty')?.value);
    const cost = parseFloat(document.getElementById('costPrice')?.value);

    // Validation: Stop if the critical fields are empty
    if (!name || isNaN(qty) || isNaN(cost)) {
        alert("❌ Error: Product Name, Quantity, and Unit Cost are required!");
        return;
    }

    const item = {
        id: "INV-" + Date.now(),
        name: name,
        // Fallback to "General" if bizType is missing or empty
        type: document.getElementById('bizType')?.value || "General",
        qty: qty,
        damage: parseInt(document.getElementById('damage')?.value) || 0,
        cost: cost,
        logistics: parseFloat(document.getElementById('logistics')?.value) || 0,
        sell: parseFloat(document.getElementById('sellPrice')?.value) || 0,
        maturity: document.getElementById('maturityDate')?.value || null,
        date: new Date().toLocaleDateString()
    };

    bizData.inventory.push(item);
    saveAndRender();
    
    // Clear inputs after saving
    ['prodName', 'bizType', 'qty', 'damage', 'costPrice', 'logistics', 'sellPrice', 'maturityDate'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = '';
    });

    alert("✅ Stock Recorded Successfully!");
}


/*

function addStock() {
    const name = document.getElementById('prodName').value;
    const qty = parseInt(document.getElementById('qty').value);
    const cost = parseFloat(document.getElementById('costPrice').value);

    if (!name || isNaN(qty) || isNaN(cost)) return alert("Fill Name, Qty, and Cost!");

    const item = {
        id: "INV-" + Date.now(),
        name,
        type: document.getElementById('bizType').value || "General",
        qty,
        damage: parseInt(document.getElementById('damage').value) || 0,
        cost,
        logistics: parseFloat(document.getElementById('logistics').value) || 0,
        sell: parseFloat(document.getElementById('sellPrice').value) || 0,
        maturity: document.getElementById('maturityDate').value,
        date: new Date().toLocaleDateString()
    };

    bizData.inventory.push(item);
    saveAndRender();
}

*/



function addSale() {
    const customer = document.getElementById('custName').value;
    const total = parseFloat(document.getElementById('totalBill').value);
    const paid = parseFloat(document.getElementById('amtPaid').value);

    if (!customer || isNaN(total)) return alert("Enter Customer and Total Bill!");

    const sale = {
        id: "SALE-" + Date.now(),
        customer,
        item: document.getElementById('soldItem').value,
        total,
        paid,
        debt: total - paid,
        date: new Date().toLocaleString()
    };

    bizData.sales.push(sale);
    saveAndRender();
    alert("Receipt Saved!");
}
/*
function saveAndRender() {
    localStorage.setItem('codedhans_os_data', JSON.stringify(bizData));
    renderInventory();
    renderSales();
}

function renderInventory() {
    const container = document.getElementById('inventoryList');
    container.innerHTML = bizData.inventory.map(i => {
        const netQty = i.qty - i.damage;
        const totalInvestment = (i.cost * i.qty) + i.logistics;
        const profit = (i.sell * netQty) - totalInvestment;
        
        let maturityInfo = "";
        if (i.maturity) {
            const today = new Date();
            const target = new Date(i.maturity);
            const diffTime = target - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const color = diffDays <= 3 ? "#ef4444" : "#f59e0b";
            maturityInfo = `<p style="color:${color}; font-weight:bold;">⏳ ${diffDays <= 0 ? 'Matured/Expired!' : diffDays + ' days remaining'}</p>`;
        }

        return `
            <div class="card" style="border-left: 5px solid var(--forest)">
                <h3 class="forest-text">${i.name}</h3>
                ${maturityInfo}
                <p>Stock: ${netQty} | Profit: <b>₦${profit.toLocaleString()}</b></p>
            </div>
        `;
    }).reverse().join('');
}

function renderSales() {
    const container = document.getElementById('salesList');
    container.innerHTML = bizData.sales.map(s => `
        <div class="card" style="border-left: 5px solid ${s.debt > 0 ? '#ef4444' : '#10b981'}">
            <div class="flex-between">
                <b>${s.customer}</b>
                <small>${s.date}</small>
            </div>
            <p>${s.item || 'Purchase'}: ₦${s.total.toLocaleString()}</p>
            <p>Paid: ₦${s.paid} | <span style="color:${s.debt > 0 ? '#ef4444' : '#10b981'}">Debt: ₦${s.debt}</span></p>
            
            <div style="display:flex; gap:10px; margin-top:10px;">
                <button onclick="shareReceipt('${s.id}')" class="btn-wa" style="background:#0077b5; flex:1;">📤 Share Receipt</button>
                ${s.debt > 0 ? `<button onclick="sendReminder('${s.customer}', ${s.debt})" class="btn-wa" style="flex:1;">🔔 Remind</button>` : ''}
            </div>
        </div>
    `).reverse().join('');
}
function sendReminder(name, amount) {
    const msg = `Hello ${name}, this is a reminder regarding your balance of ₦${amount.toLocaleString()}. Thanks!`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.location.href = waUrl;
}

window.onload = saveAndRender;
*/

// --- SAFETY FIRST RENDER LOGIC ---

function saveAndRender() {
    localStorage.setItem('codedhans_os_data', JSON.stringify(bizData));
    
    // Only render if we are on the page that has these containers
    if (document.getElementById('inventoryList')) {
        renderInventory();
    }
    if (document.getElementById('salesList')) {
        renderSales();
    }
}
/*
function renderInventory() {
    const container = document.getElementById('inventoryList');
    if (!container) return; // Stop if the element isn't on this page

    container.innerHTML = bizData.inventory.map(i => {
        const netQty = i.qty - i.damage;
        const totalInvestment = (i.cost * i.qty) + i.logistics;
        const profit = (i.sell * netQty) - totalInvestment;
        
        let maturityInfo = "";
        if (i.maturity) {
            const today = new Date();
            const target = new Date(i.maturity);
            const diffTime = target - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const color = diffDays <= 3 ? "#ef4444" : "#f59e0b";
            maturityInfo = `<p style="color:${color}; font-weight:bold; font-size:12px;">⏳ ${diffDays <= 0 ? 'Matured!' : diffDays + ' days left'}</p>`;
        }

        return `
            <div class="card" style="border-left: 5px solid var(--forest)">
                <div class="flex-between">
                    <h3 class="forest-text">${i.name}</h3>
                    <button onclick="broadcastProduct('${i.name}', '${i.sell}')" class="btn-wa" style="margin-top:0; background:#25d366; padding:5px 10px; font-size:10px;">📣 Broadcast</button>
                </div>
                ${maturityInfo}
                <p>Stock: ${netQty} | Price: <b>₦${i.sell.toLocaleString()}</b></p>
                <p style="font-size:11px; opacity:0.6;">Profit: ₦${profit.toLocaleString()}</p>
            </div>
        `;
    }).reverse().join('');
}


function renderSales() {
    const container = document.getElementById('salesList');
    if (!container) return; // Exit if the container doesn't exist on this page

    container.innerHTML = bizData.sales.map(s => {
        // This return is inside the .map() function, which is correct
        return `
            <div class="card" style="border-left: 5px solid ${s.debt > 0 ? '#ef4444' : '#10b981'}">
                <div class="flex-between">
                    <b>${s.customer}</b>
                    <small>${s.date}</small>
                </div>
                <p>${s.item || 'Purchase'}: ₦${s.total.toLocaleString()}</p>
                <p>Paid: ₦${s.paid.toLocaleString()} | <span style="color:${s.debt > 0 ? '#ef4444' : '#10b981'}">Debt: ₦${s.debt.toLocaleString()}</span></p>
                
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button onclick="viewVisualReceipt('${s.id}')" class="btn-wa" style="background:var(--forest); flex:1; font-size:11px;">📄 View Receipt</button>
                    <button onclick="shareReceipt('${s.id}')" class="btn-wa" style="background:#0077b5; flex:1; font-size:11px;">📤 WhatsApp</button>
                </div>
            </div>
        `;
    }).reverse().join('');
}

*/

function renderInventory() {
    const container = document.getElementById('inventoryList');
    if (!container) return;

    if (bizData.inventory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state-icon">📦</span>
                <h3>Welcome to BizManager OS!</h3>
                <p>Your inventory is empty. Click the button below to add your first batch of products or livestock.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bizData.inventory.map(i => {
        const netQty = i.qty - i.damage;
        return `
            <div class="card" style="border-left: 5px solid var(--forest)">
                <div class="flex-between">
                    <h3 class="forest-text">${i.name}</h3>
                    <button onclick="broadcastProduct('${i.name}', '${i.sell}')" class="btn-wa" style="margin-top:0; background:#25d366; padding:5px 10px; font-size:10px;">📣 Broadcast</button>
                </div>
                <p>Stock: ${netQty} | Price: <b>₦${i.sell.toLocaleString()}</b></p>
            </div>
        `;
    }).reverse().join('');
}

function renderSales() {
    const container = document.getElementById('salesList');
    if (!container) return;

    if (bizData.sales.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-state-icon">💰</span>
                <h3>No Sales Yet</h3>
                <p>Record your first sale to start tracking your profits and customer receipts.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = bizData.sales.map(s => `
        <div class="card" style="border-left: 5px solid ${s.debt > 0 ? '#ef4444' : '#10b981'}">
            <div class="flex-between">
                <b>${s.customer}</b>
                <small>${s.date}</small>
            </div>
            <p>${s.item || 'Purchase'}: ₦${s.total.toLocaleString()}</p>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <button onclick="viewVisualReceipt('${s.id}')" class="btn-wa" style="background:var(--forest); flex:1; font-size:11px;">📄 View Receipt</button>
                <button onclick="shareReceipt('${s.id}')" class="btn-wa" style="background:#0077b5; flex:1; font-size:11px;">📤 WhatsApp</button>
            </div>
        </div>
    `).reverse().join('');
    
  // Add this check into your saveAndRender function in script.js
function checkFirstRun() {
    const bizName = localStorage.getItem('bizName');
    const welcomeArea = document.getElementById('welcomeArea');
    
    if (!bizName && welcomeArea) {
        welcomeArea.innerHTML = `
            <div class="welcome-card">
                <h3>🚀 Hello, Boss!</h3>
                <p>Set your business name in settings to start branding your receipts.</p>
                <a href="settings.html" style="color:white; font-weight:bold;">Go to Settings →</a>
            </div>
        `;
    } else if (welcomeArea) {
        welcomeArea.innerHTML = ""; // Hide if name is already set
    }
}
}

// This ensures that as soon as the page opens, the lists are built
window.addEventListener('DOMContentLoaded', () => {
    saveAndRender();
    
    // Also, let's make sure the side menu is closed by default
    const menu = document.getElementById("sideMenu");
    if(menu) menu.style.width = "0";
});

// Update saveAndRender to be even more robust
function saveAndRender() {
    // 1. Always sync the latest data to storage
    localStorage.setItem('codedhans_os_data', JSON.stringify(bizData));
    
    // 2. Only attempt to render if the containers exist on the current page
    const invContainer = document.getElementById('inventoryList');
    const salesContainer = document.getElementById('salesList');
    
    if (invContainer) {
        renderInventory();
    }
    
    if (salesContainer) {
        renderSales();
    }
}



function viewVisualReceipt(saleId) {
    const sale = bizData.sales.find(s => s.id === saleId);
    if (!sale) return;

    // Fill data
    document.getElementById('r-bizName').innerText = localStorage.getItem('bizName') || "codedhans Biz";
    document.getElementById('r-date').innerText = sale.date;
    document.getElementById('r-cust').innerText = sale.customer;
    document.getElementById('r-item').innerText = sale.item || "General Purchase";
    document.getElementById('r-total').innerText = sale.total.toLocaleString();
    document.getElementById('r-paid').innerText = sale.paid.toLocaleString();
    
    const debtEl = document.getElementById('r-debt');
    debtEl.innerText = "₦" + sale.debt.toLocaleString();
    debtEl.style.color = sale.debt > 0 ? "red" : "green";

    // Show Modal
    document.getElementById('receiptModal').style.display = "block";
}

function closeReceipt() {
    document.getElementById('receiptModal').style.display = "none";
}




function startListening(inputId) {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("Your browser does not support Voice Entry.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-NG'; // Optimized for Nigerian accents
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const targetInput = document.getElementById(inputId);
    const originalPlaceholder = targetInput.placeholder;

    recognition.onstart = () => {
        targetInput.placeholder = "Listening... Speak now";
        targetInput.style.borderColor = "var(--forest-light)";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Strip the period often added at the end of speech
        targetInput.value = transcript.replace(/\.$/, "");
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error: ", event.error);
        targetInput.placeholder = "Error: " + event.error;
    };

    recognition.onend = () => {
        targetInput.placeholder = originalPlaceholder;
        targetInput.style.borderColor = "var(--border)";
    };

    recognition.start();
}

function openGlobalBroadcast() {
    // 1. Check if there are products to mention
    const activeProducts = bizData.inventory.slice(-3); // Get the 3 most recent items
    let productList = "";
    
    if (activeProducts.length > 0) {
        productList = "\n\nCheck out our latest stock:\n" + 
            activeProducts.map(p => `✅ ${p.name} - ₦${p.sell.toLocaleString()}`).join("\n");
    }

    // 2. Draft the professional message
    const bizName = "Us"; // You can also pull this from a 'settings' variable
    const message = `🌟 *NEW STOCK ALERT from ${bizName.toUpperCase()}* 🌟\n\nHello! We have just updated our inventory with fresh batches. Everything is ready for pickup or delivery! shop now while stocks last!*\n\nClick below to chat with us and place your order:`;

    // 3. Launch WhatsApp
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    
    // Using location.href for better mobile compatibility
    window.location.href = waUrl;
}
// --- SETTINGS & BACKUP LOGIC ---

// 1. Save Business Name
function saveSettings() {
    const name = document.getElementById('bizNameInput').value;
    if (name) {
        localStorage.setItem('bizName', name);
        alert("Business Name Updated!");
        location.reload(); // Refresh to apply name everywhere
    }
}

// 2. Export Data (Backup)
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bizData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bizmanager_backup_" + Date.now() + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// 3. Import Data (Restore)
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (confirm("This will overwrite current data. Continue?")) {
                bizData = importedData;
                saveAndRender();
                alert("Data Restored Successfully!");
            }
        } catch (err) {
            alert("Invalid Backup File!");
        }
    };
    reader.readAsText(file);
}

// 4. Share Receipt Function
function shareReceipt(saleId) {
    const sale = bizData.sales.find(s => s.id === saleId);
    const bizName = localStorage.getItem('bizName') || "codedhans Biz";
    
    const receiptMsg = `🧾 *OFFICIAL RECEIPT* 🧾\n---\n*${bizName.toUpperCase()}*\n---\n👤 *Customer:* ${sale.customer}\n📦 *Item:* ${sale.item || 'General Goods'}\n📅 *Date:* ${sale.date}\n\n💰 *Total:* ₦${sale.total.toLocaleString()}\n✅ *Paid:* ₦${sale.paid.toLocaleString()}\n${sale.debt > 0 ? `⚠️ *Balance:* ₦${sale.debt.toLocaleString()}` : '🎊 *Status:* Fully Paid'}\n\nThank you for your patronage! ✨`;

    window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(receiptMsg)}`;
}


// --- GLOBAL DARK MODE LOGIC ---

function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    // Save the preference: 'enabled' or 'disabled'
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

// This function runs automatically on EVERY page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'enabled') {
        document.body.classList.add('dark-mode');
    }
}

// Add this to your existing DOMContentLoaded listener
window.addEventListener('DOMContentLoaded', () => {
    applySavedTheme(); // Check theme first
    saveAndRender();   // Then render data
});





















      
