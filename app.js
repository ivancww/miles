/* ==========================================
   哩數攻略 (Mileage Exchanger) PWA
   檔案：app.js
   版本：v1.6.0 (Clean Version - No Google Sheet)
========================================== */

let routeCount = 1;

// 香港飛各地的單程飛行距離庫 (單位: 哩 Miles)
const distDB = {
    "TPE": 501, "TSA": 501, "KHH": 412, "RMQ": 446,
    "NRT": 1842, "HND": 1805, "KIX": 1540, "NGO": 1624, "FUK": 1275, "CTS": 2131, "OKA": 890,
    "KOJ": 1050, "TAK": 1200, "KMJ": 1210,
    "ICN": 1284, "GMP": 1284, "PUS": 1258, "CJU": 1083,
    "BKK": 1049, "DMK": 1049, "HKT": 1424, "CNX": 1007, "USM": 1146,
    "SIN": 1587, "KUL": 1565, "PEN": 1475, "BKI": 1137, "DPS": 2145, "CGK": 2029, "SUB": 2043,
    "MNL": 701, "CEB": 1058,
    "SGN": 927, "HAN": 527, "DAD": 574, "PNH": 956, "RGN": 1184, "BWN": 1181,
    "PEK": 1234, "PKX": 1210, "PVG": 775, "SHA": 765, "CAN": 84, "CTU": 842, "TFU": 820, "CKG": 686, "XIY": 883,
    "HGH": 681, "NKG": 732, "XMN": 315, "FOC": 444, "WUH": 571, "TAO": 1039, "DLC": 1195, "HAK": 314, "SYX": 401,
    "LHR": 5994, "LGW": 5985, "MAN": 5971, "CDG": 5979, "FRA": 5696, "MUC": 5578, "AMS": 5763,
    "MAD": 6554, "BCN": 6265, "MXP": 5832, "FCO": 5762, "ZRH": 5768, "HEL": 4855, "IST": 4976,
    "JFK": 8059, "EWR": 8057, "LAX": 7246, "SFO": 6912, "ORD": 7780, "BOS": 7954, "YVR": 6386, "YYZ": 7785,
    "SYD": 4581, "MEL": 4615, "BNE": 4229, "PER": 3740, "AKL": 5688, "CHC": 5880, "POM": 3148, "NAN": 5110,
    "DXB": 3682, "DOH": 3915, "RUH": 4225,
    "DEL": 2337, "BOM": 2661, "BLR": 2486, "DAC": 1500, "KTM": 1826, "CMB": 2496,
    "JNB": 6625, "ADD": 4983
};

function openTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    btn.classList.add('active');
}

function bindInputs() {
    document.querySelectorAll('.route-input').forEach(input => {
        input.removeEventListener('input', handleInputEvent);
        input.addEventListener('input', handleInputEvent);
    });
}

function handleInputEvent(e) {
    const blockId = e.target.getAttribute('data-block');
    calculateRealtime(blockId);
}

function addRouteBlock() {
    routeCount++;
    const container = document.getElementById('route-container');
    const div = document.createElement('div');
    div.className = 'route-block';
    div.id = `route-block-${routeCount}`;
    
    div.innerHTML = `
        <div class="route-header">📍 路線 ${routeCount}</div>
        <input type="text" class="airport-code route-input" data-block="${routeCount}" id="from-${routeCount}" list="airport-list" placeholder="出發地 (例如: HKG)">
        <input type="text" class="airport-code route-input" data-block="${routeCount}" id="dest-${routeCount}" list="airport-list" placeholder="目的地 (例如: NRT)">
        <input type="text" class="airport-code route-input" data-block="${routeCount}" id="return-${routeCount}" list="airport-list" placeholder="回程地 (例如: HKG)">
        <div id="realtime-result-${routeCount}" class="realtime-box">請輸入完整出發及目的地...</div>
    `;
    container.appendChild(div);
    bindInputs();
}

function refreshRoutes() {
    const container = document.getElementById('route-container');
    container.innerHTML = `
        <div class="route-block" id="route-block-1">
            <div class="route-header">📍 路線 1</div>
            <input type="text" class="airport-code route-input" data-block="1" id="from-1" list="airport-list" placeholder="出發地 (例如: HKG)">
            <input type="text" class="airport-code route-input" data-block="1" id="dest-1" list="airport-list" placeholder="目的地 (例如: NRT)">
            <input type="text" class="airport-code route-input" data-block="1" id="return-1" list="airport-list" placeholder="回程地 (例如: HKG)">
            <div id="realtime-result-1" class="realtime-box">請輸入完整出發及目的地...</div>
        </div>
    `;
    routeCount = 1;
    bindInputs();
}

function calculateRealtime(blockId) {
    const fromVal = document.getElementById(`from-${blockId}`).value.toUpperCase();
    const destVal = document.getElementById(`dest-${blockId}`).value.toUpperCase();
    const returnVal = document.getElementById(`return-${blockId}`).value.toUpperCase();
    const resultBox = document.getElementById(`realtime-result-${blockId}`);

    if (fromVal && destVal) {
        let totalDist = 0;
        let totalMiles = 0;
        
        const outDist = getDistance(fromVal, destVal);
        totalDist += outDist;
        totalMiles += getAsiaMilesAmount(outDist);

        if (returnVal) {
            const inDist = getDistance(destVal, returnVal);
            totalDist += inDist;
            totalMiles += getAsiaMilesAmount(inDist);
        }

        resultBox.style.display = 'block';
        resultBox.style.backgroundColor = '#e8f5e9';
        resultBox.style.borderLeftColor = '#4caf50';
        resultBox.innerHTML = `
            <strong>✈️ 預計需要：${totalMiles.toLocaleString()} 里 (經濟艙)</strong><br>
            <span style="font-size:13px; color:#555;">📊 參考總距離：${totalDist.toLocaleString()} 哩 (不影響計算)</span>
        `;
    } else {
        resultBox.innerHTML = "請輸入完整出發及目的地...";
        resultBox.style.backgroundColor = "#f0f7f6";
        resultBox.style.borderLeftColor = "#006564";
    }
}

function getDistance(code1, code2) {
    if (code1 === "HKG" && distDB[code2]) return distDB[code2];
    if (code2 === "HKG" && distDB[code1]) return distDB[code1];
    return 1000; 
}

function getAsiaMilesAmount(distance) {
    if (distance <= 0) return 0;
    if (distance <= 750) return 10000;
    if (distance <= 2750) return 12500;
    if (distance <= 5000) return 20000;
    if (distance <= 7500) return 27000;
    return 38000;
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
        caches.keys().then((keyList) => Promise.all(keyList.map((k) => caches.delete(k))))
        .then(() => window.location.reload(true));
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

document.addEventListener('DOMContentLoaded', bindInputs);