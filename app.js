// Version: 4.0 - app.js (航線配對及互動邏輯)

// 地點資料庫
const locationsData = {
  "日韓台": ["東京成田 (NRT)", "東京羽田 (HND)", "大阪關西 (KIX)", "名古屋 (NGO)", "福岡 (FUK)", "札幌新千歲 (CTS)", "沖繩那霸 (OKA)", "首爾仁川 (ICN)", "首爾金浦 (GMP)", "釜山 (PUS)", "濟州 (CJU)", "台北桃園 (TPE)", "台北松山 (TSA)", "高雄 (KHH)", "台中 (RMQ)"],
  "東南亞": ["曼谷蘇凡納布 (BKK)", "曼谷廊曼 (DMK)", "布吉 (HKT)", "清邁 (CNX)", "新加坡 (SIN)", "吉隆坡 (KUL)", "檳城 (PEN)", "亞庇/沙巴 (BKI)", "胡志明市 (SGN)", "河內 (HAN)", "峴港 (DAD)", "馬尼拉 (MNL)", "宿霧 (CEB)", "峇里島 (DPS)", "雅加達 (CGK)"],
  "歐洲": ["倫敦希思路 (LHR)", "倫敦蓋特威克 (LGW)", "曼徹斯特 (MAN)", "巴黎戴高樂 (CDG)", "法蘭克福 (FRA)", "慕尼黑 (MUC)", "阿姆斯特丹 (AMS)", "馬德里 (MAD)", "巴塞隆拿 (BCN)", "羅馬 (FCO)", "米蘭 (MXP)", "蘇黎世 (ZRH)", "維也納 (VIE)", "伊斯坦堡 (IST)"],
  "美洲": ["紐約甘迺迪 (JFK)", "紐約紐華克 (EWR)", "洛杉磯 (LAX)", "三藩市 (SFO)", "芝加哥 (ORD)", "波士頓 (BOS)", "西雅圖 (SEA)", "溫哥華 (YVR)", "多倫多 (YYZ)"],
  "澳紐": ["悉尼 (SYD)", "墨爾本 (MEL)", "布里斯本 (BNE)", "珀斯 (PER)", "阿德萊德 (ADL)", "奧克蘭 (AKL)", "基督城 (CHC)"]
};

// 確保 DOM 載入完成後才執行
document.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('locationInput');
  const dropdownList = document.getElementById('dropdownList');
  const routeDisplay = document.getElementById('routeDisplay');

  function renderDropdown(filterText = '') {
    dropdownList.innerHTML = ''; 
    let hasResults = false;

    for (const [category, places] of Object.entries(locationsData)) {
      const filteredPlaces = places.filter(place => 
        place.toLowerCase().includes(filterText.toLowerCase())
      );

      if (filteredPlaces.length > 0) {
        hasResults = true;
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-title';
        categoryDiv.textContent = category;
        dropdownList.appendChild(categoryDiv);

        filteredPlaces.forEach(place => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'location-item';
          itemDiv.textContent = place;
          
          itemDiv.addEventListener('click', () => {
            inputField.value = place;
            dropdownList.style.display = 'none';
            routeDisplay.innerHTML = `
              🛫 去程: 香港 (HKG) ➔ ${place} <br>
              🛬 回程: ${place} ➔ 香港 (HKG)
            `;
            routeDisplay.style.display = 'block';
          });
          dropdownList.appendChild(itemDiv);
        });
      }
    }
    dropdownList.style.display = hasResults ? 'block' : 'none';
  }

  inputField.addEventListener('input', (e) => { 
    renderDropdown(e.target.value); 
    routeDisplay.style.display = 'none'; 
  });
  
  inputField.addEventListener('focus', () => { 
    renderDropdown(inputField.value); 
  });
  
  document.addEventListener('click', (e) => { 
    if (!e.target.closest('.autocomplete-container')) { 
      dropdownList.style.display = 'none'; 
    } 
  });
});