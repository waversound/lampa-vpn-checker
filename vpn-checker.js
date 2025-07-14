(function () {
    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    function checkVPN() {
        fetch('https://ipinfo.io/json?token=ce7ef8c0a3c947')
            .then(response => response.json())
            .then(data => {
                const country = data.country || '';

                if (country !== 'RU') {
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
                } else {
                    console.log('[VPN Plugin] IP из РФ, всё в порядке');
                    localStorage.removeItem('vpnWarningShown');
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка получения IP-информации:', error);
            });
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
