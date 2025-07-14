(function () {
    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

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

    function checkVPN(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const country = data.countryCode || '';
                    if (country !== 'RU') {
                        showWarning(country);
                    } else {
                        console.log('[VPN Plugin] IP из РФ, всё в порядке');
                        localStorage.removeItem('vpnWarningShown');
                    }
                } else {
                    // Если запрос не успешен и был HTTPS — пробуем HTTP
                    if (url.startsWith('https')) {
                        checkVPN('http://ip-api.com/json/?fields=status,countryCode');
                    } else {
                        console.log('[VPN Plugin] Не удалось получить статус IP');
                    }
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка получения IP-информации:', error);
                // Если ошибка и был HTTPS — пробуем HTTP
                if (url.startsWith('https')) {
                    checkVPN('http://ip-api.com/json/?fields=status,countryCode');
                }
            });
    }

    if (window.Lampa) {
        checkVPN('https://ip-api.com/json/?fields=status,countryCode');
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
