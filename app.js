// Namaz vakitleri API fonksiyonu
async function getPrayerTimes() {
    try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Samsun&country=Turkey&method=13');
        const data = await response.json();
        if (data && data.data && data.data.timings) {
            displayPrayerTimes(data.data.timings);
        }
    } catch (error) {
        console.error('Namaz vakitleri alınamadı:', error);
        document.getElementById('prayerTimes').innerHTML = '<div class="error">Namaz vakitleri yüklenemedi. Lütfen internet bağlantınızı kontrol edin.</div>';
    }
}

// Namaz vakitlerini gösterme fonksiyonu
function displayPrayerTimes(timings) {
    const container = document.getElementById('prayerTimes');
    const prayers = {
        Fajr: 'İmsak',
        Sunrise: 'Güneş',
        Dhuhr: 'Öğle',
        Asr: 'İkindi',
        Maghrib: 'Akşam',
        Isha: 'Yatsı'
    };
    container.innerHTML = '';
    Object.entries(prayers).forEach(([key, name]) => {
        const time = timings[key];
        const prayerDiv = document.createElement('div');
        prayerDiv.className = 'prayer-item';
        prayerDiv.innerHTML = `
            <div class="prayer-name-container">
                <span>${name}</span>
                <span class="prayer-time">${time}</span>
                ${prayerDetails[key] ? `<button class="details-button" onclick="toggleDetails('${key}')">Detaylar</button>` : ''}
            </div>
            ${prayerDetails[key] ? `
            <div id="details-${key}" class="prayer-details">
                ${prayerDetails[key].description}
            </div>
            ` : ''}
        `;
        container.appendChild(prayerDiv);
    });
    // Aktif vakti işaretle
    highlightCurrentPrayer(timings);
}

// Aktif vakti işaretleme fonksiyonu
function highlightCurrentPrayer(timings) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const prayerTimes = Object.entries(timings)
        .filter(([key]) => ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(key))
        .map(([key, time]) => ({ key, time }));
    let currentPrayer = null;
    for (let i = 0; i < prayerTimes.length; i++) {
        if (currentTime < prayerTimes[i].time) {
            if (i > 0) {
                currentPrayer = prayerTimes[i - 1].key;
            } else {
                currentPrayer = prayerTimes[prayerTimes.length - 1].key;
            }
            break;
        }
    }
    if (currentPrayer) {
        const elements = document.querySelectorAll('.prayer-item');
        elements.forEach(el => {
            el.classList.remove('active');
            if (el.querySelector('.prayer-name-container').textContent.includes(currentPrayer)) {
                el.classList.add('active');
            }
        });
    }
}

// PWA kurulum önerisi
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // PWA kurulum butonunu göster
    showInstallButton();
});

function showInstallButton() {
    if (deferredPrompt) {
        // Kurulum butonu oluştur ve göster
        const installButton = document.createElement('button');
        installButton.className = 'install-button';
        installButton.textContent = 'Uygulamayı Yükle';
        installButton.addEventListener('click', installPWA);
        document.body.appendChild(installButton);
    }
}

async function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
            console.log('PWA kuruldu');
        }
        deferredPrompt = null;
        // Kurulum butonunu gizle
        document.querySelector('.install-button')?.remove();
    }
}

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    getPrayerTimes();
    // Her 5 dakikada bir namaz vakitlerini güncelle
    setInterval(getPrayerTimes, 300000);
});
