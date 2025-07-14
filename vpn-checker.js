(function () {
    function checkVPN() {
        fetch('https://ipinfo.io/json?token=ce7ef8c0a3c947')
            .then(response => response.json())
            .then(data => {
                const country = data.country || '';

                // Если страна — не Россия, показываем предупреждение
                if (country !== 'RU') {
                    Lampa.Noty.show('⚠️ Вы находитесь за пределами РФ или используете VPN. Отключите его для стабильной работы.');
                } else {
                    console.log('[VPN Plugin] IP из РФ, всё в порядке');
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
