(function () {
    function showWarning(country) {
        const message = `Внимание! Вы используете VPN или находитесь вне России (${country}). Отключите VPN для корректной работы.`;
        if (window.Lampa && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
            Lampa.Noty.show(message);
        } else {
            console.log('[VPN Plugin] Lampa.Noty.show не доступен');
        }
    }

    function checkVPN() {
        fetch('https://freegeoip.app/json/')
            .then(res => res.json())
            .then(data => {
                const country = data.country_code || '';
                if (country !== 'RU') {
                    showWarning(country);
                } else {
                    console.log('[VPN Plugin] IP из РФ, всё в порядке');
                }
            })
            .catch(err => {
                console.log('[VPN Plugin] Ошибка получения IP:', err);
            });
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
