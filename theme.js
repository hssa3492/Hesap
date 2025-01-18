function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (theme === 'light') {
        themeToggle.innerHTML = '🌙 Koyu Tema';
    } else {
        themeToggle.innerHTML = '☀️ Açık Tema';
    }
}

// Sayfa yüklendiğinde tema ayarını uygula
document.addEventListener('DOMContentLoaded', initTheme);
