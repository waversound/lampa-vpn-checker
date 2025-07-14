(function () {
    function checkVPN() {
        fetch('https://ipinfo.io/json?token=ce7ef8c0a3c947')
            .then(response => response.json())
            .then(data => {
                const country = data.country || '';

                if (country !== 'RU') {
                    if (!localStorage.getItem('vpnWarningShown')) {
                        Lampa.Noty.show('⚠️ Вы находитесь за пределами РФ или используете VPN. Отключите его для стабильной работы.');
                        localStorage.setItem('vpnWarningShown', 'true');
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

    if (window.Lampa && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa.Noty.show не доступен');
    }
})();
