// 1. Tab 切換邏輯
function openTab(airlineId, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(airlineId).style.display = 'block';
    btn.classList.add('active');
}

// 2. 距離數據庫
const distances = {
    "HKG-TPE": 501, "HKG-KHH": 412, "HKG-MNL": 710, "HKG-SGN": 946,
    "HKG-BKK": 1049, "HKG-ICN": 1293, "HKG-KIX": 1540, "HKG-SIN": 1587,
    "HKG-HND": 1805, "HKG-NRT": 1842, "HKG-DPS": 2147, "HKG-SYD": 4581,
    "HKG-MEL": 4608, "HKG-FRA": 5697, "HKG-CDG": 5986, "HKG-LHR": 5994,
    "HKG-LAX": 7260, "HKG-JFK": 8072, "LHR-JFK": 3451, "NRT-LAX": 5451
};

function getDistance(origin, dest) {
    let key1 = `${origin.toUpperCase()}-${dest.toUpperCase()}`;
    let key2 = `${dest.toUpperCase()}-${origin.toUpperCase()}`;
    return distances[key1] || distances[key2] || 0;
}

// ==========================================
// 國泰 Asia Miles 邏輯 1.1
// ==========================================
function addInput() {
    let div = document.createElement("input");
    div.type = "text"; div.className = "airport-code"; div.placeholder = "下一個目的地";
    document.getElementById("route-inputs").appendChild(div);
}

function calculateRoute() {
    let inputs = document.querySelectorAll('#route-inputs .airport-code');
    let totalDist = 0;
    
    for (let i = 0; i < inputs.length - 1; i++) {
        let origin = inputs[i].value;
        let dest = inputs[i+1].value;
        if (origin && dest) totalDist += getDistance(origin, dest);
    }

    let rb = document.getElementById("result-box");
    if (totalDist === 0) {
        rb.innerHTML = "請輸入有效路線，系統需預載該航線距離。";
        rb.style.display = "block"; return;
    }

    let econ = 0, pey = 0, biz = 0, zoneMax = 0, group = "";
    if (totalDist <= 10000) { econ=77000; pey=115000; biz=135000; zoneMax=10000; group="Group 1 (0-10,000哩)"; }
    else if (totalDist <= 14000) { econ=95000; pey=145000; biz=170000; zoneMax=14000; group="Group 2 (10,001-14,000哩)"; }
    else if (totalDist <= 18000) { econ=105000; pey=160000; biz=210000; zoneMax=18000; group="Group 3 (14,001-18,000哩)"; }
    else if (totalDist <= 20000) { econ=115000; pey=175000; biz=230000; zoneMax=20000; group="Group 4 (18,001-20,000哩)"; }
    else if (totalDist <= 25000) { econ=130000; pey=200000; biz=260000; zoneMax=25000; group="Group 5 (20,001-25,000哩)"; }
    else { rb.innerHTML = "超出環球票上限！"; rb.style.display = "block"; return; }

    let remaining = zoneMax - totalDist;
    let advice = remaining > 1500 ? `💡 仲剩 ${remaining} 哩配額！夠免費加飛 東京(NRT) 或 大阪(KIX)！` : `仲有 ${remaining} 哩免費配額可以規劃。`;

    rb.innerHTML = `
        <strong>📍 總飛行距離：</strong> ${totalDist} 哩<br>
        <strong>🎯 判定級別：</strong> ${group}<br><br>
        <strong>🎫 寰宇一家所需里數：</strong><br>
        經濟：${econ.toLocaleString()} | 特選：${pey.toLocaleString()} | 商務：${biz.toLocaleString()}<br><br>
        <strong>🎯 榨乾配額分析：</strong><br>${advice}<br><br>
        🛡️ <strong>提提你：</strong>記得用 AE Explorer 或 Citi PremierMiles 畀稅，開通免費旅遊保險！
    `;
    rb.style.borderLeftColor = "#006564";
    rb.style.display = "block";
}

// ==========================================
// 英航 Avios 邏輯
// ==========================================
function addInputBA() {
    let div = document.createElement("input");
    div.type = "text"; div.className = "airport-code ba-code"; div.placeholder = "下一個目的地";
    document.getElementById("ba-route-inputs").appendChild(div);
}

function getAviosCost(distance, isPeak) {
    if (distance <= 650) return isPeak ? { econ: 5250, biz: 9750 } : { econ: 4750, biz: 8500 };
    if (distance <= 1150) return isPeak ? { econ: 8250, biz: 15750 } : { econ: 7250, biz: 13500 };
    if (distance <= 2000) return isPeak ? { econ: 10750, biz: 18350 } : { econ: 9250, biz: 17750 };
    if (distance <= 3000) return isPeak ? { econ: 12500, biz: 37500 } : { econ: 10000, biz: 31250 };
    if (distance <= 4000) return isPeak ? { econ: 20000, biz: 60000 } : { econ: 13000, biz: 50000 };
    if (distance <= 5500) return isPeak ? { econ: 25000, biz: 75000 } : { econ: 16250, biz: 62500 };
    if (distance <= 6500) return isPeak ? { econ: 30000, biz: 90000 } : { econ: 19500, biz: 75000 };
    return { econ: 50000, biz: 150000 };
}

function calculateBA() {
    let inputs = document.querySelectorAll('.ba-code');
    let isPeak = document.getElementById("ba-peak-checkbox").checked;
    let totalEcon = 0, totalBiz = 0, breakdown = "";

    for (let i = 0; i < inputs.length - 1; i++) {
        let origin = inputs[i].value;
        let dest = inputs[i+1].value;
        if (origin && dest) {
            let dist = getDistance(origin, dest);
            if (dist > 0) {
                let cost = getAviosCost(dist, isPeak);
                totalEcon += cost.econ; totalBiz += cost.biz;
                breakdown += `<li>${origin.toUpperCase()} ✈️ ${dest.toUpperCase()} : 經濟 ${cost.econ.toLocaleString()} | 商務 ${cost.biz.toLocaleString()}</li>`;
            }
        }
    }

    let rb = document.getElementById("ba-result-box");
    if (totalEcon === 0) {
        rb.innerHTML = "請輸入有效的機場代碼！"; rb.style.display = "block"; return;
    }

    rb.innerHTML = `
        <strong>${isPeak ? "🔴 旺季 (Peak)" : "🟢 淡季 (Off-Peak)"}</strong><br><br>
        <strong>🎫 總 Avios 所需哩數：</strong><br>
        經濟客艙：${totalEcon.toLocaleString()} Avios<br>
        商務客艙：${totalBiz.toLocaleString()} Avios<br><br>
        <strong>🗺️ 逐段收費明細：</strong><br><ul style="margin-top:5px; padding-left:20px;">${breakdown}</ul><br>
        🛡️ <strong>提提你：</strong>用大新 BA 卡簽帳可免手續費儲里數，或者用 Citi PremierMiles 畀稅開通旅遊保險！
    `;
    rb.style.borderLeftColor = "#012A5E";
    rb.style.display = "block";
}