/* ==========================================
   哩數攻略 (Mileage Exchanger) PWA
   檔案：app.js
   版本：v1.4.0
========================================== */

let routeCount = 1;

// 香港飛各地的單程飛行距離庫 (單位: 哩 Miles)
const distDB = {
    "TPE": 501, "TSA": 501, "KHH": 412, "RMQ": 446,
    "NRT": 1842, "HND": 1805, "KIX": 1540, "NGO": 1624, "FUK": 1275, "CTS": 2131, "OKA": 890,
    "ICN": 1284, "GMP": 1284, "PUS": 1258, "CJU": 1083,
    "BKK": 1049, "DMK": 1049, "HKT": 1424, "CNX": 1007, "USM": 1146,
    "SIN": 1587, "KUL": 1565, "PEN": 1475, "DPS": 2145, "MNL": 701,
    "SGN": 927, "HAN": 527, "PEK": 1234, "PVG": 775,
    "LHR": 5994, "CDG": 5979, "FRA": 5696, "AMS": 5763,
    "JFK": 8059, "LAX": 7246, "SFO": 6912, "YVR": 6386,
    "SYD": 4581, "MEL": 4615, "BNE": 4229, "AKL": 5688, "DXB": 3682
};

function openTab(tabName, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName).style.display = 'block';
    btn.classList.add('active');
}

// 綁定所有輸入框的即時計算事件
function bindInputs() {
    document.querySelectorAll('.route-input').forEach(input => {
        input.removeEventListener('input', handleInputEvent); // 避免重複綁定
        input.addEventListener('input', handleInputEvent);
    });
}

function handleInputEvent(e) {
    const blockId = e.target.getAttribute('data-block');
    calculateRealtime(blockId);
}

// 新增另一路線區塊
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

// 清除所有航線輸入 (Refresh 按鈕)
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

// 即時計算距離與哩數 (國泰 Asia Miles 基準)
function calculateRealtime(blockId) {
    const fromVal = document.getElementById(`from-${blockId}`).value.toUpperCase();
    const destVal = document.getElementById(`dest-${blockId}`).value.toUpperCase();
    const returnVal = document.getElementById(`return-${blockId}`).value.toUpperCase();
    const resultBox = document.getElementById(`realtime-result-${blockId}`);

    if (fromVal && destVal) {
        let totalDist = 0;
        let totalMiles = 0;
        
        // 計算 去程
        const outDist = getDistance(fromVal, destVal);
        totalDist += outDist;
        totalMiles += getAsiaMilesAmount(outDist);

        // 如果有填回程，計算 回程
        let returnText = "";
        if (returnVal) {
            const inDist = getDistance(destVal, returnVal);
            totalDist += inDist;
            totalMiles += getAsiaMilesAmount(inDist);
            returnText = ` + 回程`;
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

// 獲取兩地距離 (假設其中一邊必定是HKG)
function getDistance(code1, code2) {
    if (code1 === "HKG" && distDB[code2]) return distDB[code2];
    if (code2 === "HKG" && distDB[code1]) return distDB[code1];
    return 1000; // 如果找不到數據，預設畀 1000 哩防止報錯
}

// 根據距離轉換為國泰 Asia Miles 單程所需里數
function getAsiaMilesAmount(distance) {
    if (distance <= 0) return 0;
    if (distance <= 750) return 10000;
    if (distance <= 2750) return 12500;
    if (distance <= 5000) return 20000;
    if (distance <= 7500) return 27000;
    return 38000; // 7501+ (Ultra-Long)
}

function forceUpdate() {
    if ('caches' in window) {
        caches.keys().then((keyList) => Promise.all(keyList.map((k) => caches.delete(k))))
        .then(() => window.location.reload(true));
    } else {
        window.location.reload(true);
    }
}

function checkDates() {
    // 日期計算保留 (同 v1.3.0)
}

// 初始化綁定
document.addEventListener('DOMContentLoaded', bindInputs);