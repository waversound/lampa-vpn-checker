(function () {
    function checkVPN() {
        fetch('http://ip-api.com/json/?fields=status,country,countryCode')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.countryCode !== 'RU') {
                    showVPNToast(data.countryCode);
                }
            })
            .catch(e => {
                console.log('[VPN Plugin] Ошибка получения IP:', e);
            });
    }

    function showVPNToast(countryCode) {
        if (!window.Lampa || !Lampa.Toast) {
            console.warn('[VPN Plugin] Lampa.Toast не доступен');
            return;
        }

        // Просто показать текст на 10 секунд
        Lampa.Toast.show(`⚠️ Вы не в России (${countryCode}). Пожалуйста, отключите VPN.`, 10000);
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
