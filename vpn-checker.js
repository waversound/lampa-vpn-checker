(function () {
    // Функция для получения emoji-флага по коду страны
    function getFlagEmoji(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    function checkVPN() {
        fetch('https://ip-api.com/json/?fields=status,countryCode')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const country = data.countryCode || '';

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
                } else {
                    console.log('[VPN Plugin] Не удалось получить статус IP');
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
