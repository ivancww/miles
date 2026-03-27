// 1. Tab 切換邏輯 (確保不同時顯示)
function openTab(airlineId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(airlineId).style.display = 'block';
    event.currentTarget.classList.add('active');
}

// 2. 內置距離數據庫 (移植自 Google Sheet)
const distances = {
    "HKG-LHR": 5994, "HKG-TPE": 501, "HKG-ICN": 1293, 
    "HKG-NRT": 1842, "HKG-SYD": 4581, "HKG-BKK": 1049
    // 你可以隨時在這裡加入更多全球航線
};

function getDistance(origin, dest) {
    let key1 = `${origin.toUpperCase()}-${dest.toUpperCase()}`;
    let key2 = `${dest.toUpperCase()}-${origin.toUpperCase()}`;
    return distances[key1] || distances[key2] || 0;
}

// 3. 新增航段輸入框
function addInput() {
    let div = document.createElement("input");
    div.type = "text";
    div.className = "airport-code";
    div.placeholder = "下一個目的地";
    document.getElementById("route-inputs").appendChild(div);
}

// 4. 計算總距離與環球票智能建議
function calculateRoute() {
    let inputs = document.querySelectorAll('.airport-code');
    let totalDist = 0;
    
    // 計算每一段加總
    for (let i = 0; i < inputs.length - 1; i++) {
        let origin = inputs[i].value;
        let dest = inputs[i+1].value;
        if (origin && dest) {
            totalDist += getDistance(origin, dest);
        }
    }

    if (totalDist === 0) {
        document.getElementById("result-box").innerHTML = "請輸入有效的機場代碼！";
        return;
    }

    // 分組與配額分析邏輯 (完全還原你的高階要求)
    let econ = 0, pey = 0, biz = 0, zoneMax = 0, group = "";
    
    if (totalDist <= 10000) { econ=77000; pey=115000; biz=135000; zoneMax=10000; group="Group 1 (0-10,000哩)"; }
    else if (totalDist <= 14000) { econ=95000; pey=145000; biz=170000; zoneMax=14000; group="Group 2 (10,001-14,000哩)"; }
    else if (totalDist <= 18000) { econ=105000; pey=160000; biz=210000; zoneMax=18000; group="Group 3 (14,001-18,000哩)"; }
    else if (totalDist <= 20000) { econ=115000; pey=175000; biz=230000; zoneMax=20000; group="Group 4 (18,001-20,000哩)"; }
    else { document.getElementById("result-box").innerHTML = "超出環球票上限！"; return; }

    let remaining = zoneMax - totalDist;
    let advice = remaining > 1500 ? `💡 仲剩 ${remaining} 哩免費配額！夠你加飛轉東京(NRT)或大阪(KIX)！` : `仲有 ${remaining} 哩空間。`;

    // 顯示結果
    document.getElementById("result-box").innerHTML = `
        <strong>📍 總飛行距離：</strong> ${totalDist} 哩<br>
        <strong>🎯 判定級別：</strong> ${group}<br><br>
        <strong>🎫 寰宇一家所需里數：</strong><br>
        經濟客艙：${econ.toLocaleString()} 哩<br>
        特選經濟：${pey.toLocaleString()} 哩<br>
        商務客艙：${biz.toLocaleString()} 哩<br><br>
        <strong>🎯 榨乾配額分析：</strong><br>${advice}
    `;
}