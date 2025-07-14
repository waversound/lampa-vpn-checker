(function () {
    function checkVPN() {
        fetch('https://ipinfo.io/json?token=ce7ef8c0a3c947')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сети');
                return response.json();
            })
            .then(data => {
                const country = data.country || '';

                if (country !== 'RU') {
                    if (window.Lampa && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
                        Lampa.Noty.show('⚠️ Вы находитесь за пределами РФ или используете VPN. Отключите его для стабильной работы.');
                    } else {
                        console.warn('[VPN Plugin] Lampa.Noty.show не доступен');
                    }
                } else {
                    console.log('[VPN Plugin] IP из РФ, всё в порядке');
                }
            })
            .catch(error => {
                console.error('[VPN Plugin] Ошибка получения IP-информации:', error);
            });
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.warn('[VPN Plugin] Lampa не загружена');
    }
})();
