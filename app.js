/* ==========================================
   哩數攻略 (Mileage Exchanger) PWA
   檔案：app.js
   版本：v1.3.0
========================================== */

function openTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    btn.classList.add('active');
}

function addInput() {
    const div = document.createElement('input');
    div.type = 'text';
    div.className = 'airport-code';
    div.setAttribute('list', 'airport-list');
    div.placeholder = '新增目的地 (點擊拉下選單)';
    document.getElementById('route-inputs').appendChild(div);
}

function addInputBA() {
    const div = document.createElement('input');
    div.type = 'text';
    div.className = 'airport-code ba-code';
    div.setAttribute('list', 'airport-list');
    div.placeholder = '新增目的地 (點擊拉下選單)';
    document.getElementById('ba-route-inputs').appendChild(div);
}

function calculateRoute() {
    const resultBox = document.getElementById('result-box');
    resultBox.style.display = 'block';
    const selectedDistance = document.getElementById('oneworld-distance').value;
    let distText = selectedDistance ? `你選擇咗總距離上限為 ${selectedDistance} 哩` : '請記得選擇總飛行距離';
    resultBox.innerHTML = `<strong>🟢 國泰計算結果：</strong><br>${distText}<br><em>(此處可對接你的具體計算公式)</em>`;
}

function calculateBA() {
    const resultBox = document.getElementById('ba-result-box');
    resultBox.style.display = 'block';
    resultBox.innerHTML = `<strong>🔵 英航計算結果：</strong><br><em>(此處可對接你的具體計算公式)</em>`;
}

function forceUpdate() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        });
    }
    if ('caches' in window) {
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => caches.delete(key)));
        }).then(() => {
            window.location.reload(true);
        });
    } else {
        window.location.reload(true);
    }
}

function checkDates() {
    const departStr = document.getElementById('depart-date').value;
    const returnStr = document.getElementById('return-date').value;
    const statusBox = document.getElementById('date-status');
    
    if (!departStr || !returnStr) {
        statusBox.style.display = 'none';
        return;
    }

    const dDate = new Date(departStr);
    const rDate = new Date(returnStr);
    
    const diffTime = Math.abs(rDate - dDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let cxStatus = (diffDays <= 365) ? "<span style='color: green;'>✅ 行程在一年內 (符合國泰規定)</span>" : "<span style='color: red;'>❌ 行程超過一年 (超出國泰環球票期限)</span>";

    const departPeak = isBAPeak2026(dDate);
    const returnPeak = isBAPeak2026(rDate);
    let baStatus = `出發日：<strong>${departPeak}</strong> | 回程日：<strong>${returnPeak}</strong>`;

    statusBox.style.display = 'block';
    statusBox.innerHTML = `
        <div style="margin-bottom: 8px;"><strong>🟢 國泰檢查：</strong> ${cxStatus} (共 ${diffDays} 日)</div>
        <div><strong>🔵 英航檢查：</strong> ${baStatus}</div>
    `;
}

function isBAPeak2026(dateObj) {
    if (dateObj.getFullYear() !== 2026) return "只限2026年數據";
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    const day = dateObj.getDay(); 

    if (m === 1 && d >= 1 && d <= 5) return "旺季";
    if (m === 2 && ((d >= 13 && d <= 15) || (d >= 20 && d <= 22))) return "旺季";
    if (m === 3 && d >= 27 && d <= 30) return "旺季";
    if (m === 4 && ((d >= 2 && d <= 6) || (d >= 9 && d <= 12))) return "旺季";
    if (m === 5 && ((d >= 1 && d <= 4) || (d >= 22 && d <= 31))) return "旺季";
    if (m === 6 && (day === 0 || day === 5 || day === 6)) return "旺季";
    if (m === 7 && d >= 3) return "旺季";
    if (m === 8) return "旺季";
    if (m >= 9 && m <= 11 && (day === 0 || day === 6)) return "旺季 (週末)";
    if (m === 12 && ((d >= 12 && d <= 13) || (d >= 18 && d <= 24) || (d >= 26 && d <= 31))) return "旺季";

    return "淡季";
}