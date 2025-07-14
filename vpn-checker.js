(function () {
    // Функция конвертации кода страны в эмодзи-флаг
    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(c => 127397 + c.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    // Показ уведомления с предупреждением
    function showWarning(country) {
        const flag = getFlagEmoji(country);
        const message = `${flag} Обнаружен VPN или Вы вне России (${country}). Пожалуйста, отключите VPN для корректной работы.`;

        if (!localStorage.getItem('vpnWarningShown')) {
            if (window.Lampa && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
                Lampa.Noty.show(message);
                localStorage.setItem('vpnWarningShown', 'true');
            } else {
                console.log('[VPN Plugin] Lampa.Noty.show не доступен');
            }
        }
    }

    // Проверка IP и страны
    function checkVPN() {
        fetch('https://freegeoip.app/json/')
            .then(res => res.json())
            .then(data => {
                const country = data.country_code || '';
                if (country !== 'RU') {
                    showWarning(country);
                } else {
                    console.log('[VPN Plugin] IP из РФ, всё в порядке');
                    localStorage.removeItem('vpnWarningShown');
                }
            })
            .catch(err => {
                console.log('[VPN Plugin] Ошибка получения IP:', err);
            });
    }

    // Стартуем при загрузке Lampa
    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
