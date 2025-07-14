(function () {
    function checkVPN() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const isVPN =
                    data.security && (data.security.vpn || data.security.proxy || data.security.tor);

                if (isVPN) {
                    Lampa.Noty.show('⚠️ Обнаружен VPN. Отключите его для стабильной работы приложения.');
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Не удалось получить IP-информацию:', error);
            });
    }

    // Ждём загрузки интерфейса Lampa
    if (window.Lampa) {
        // Проверим сразу после загрузки
        checkVPN();

        // Или можно подписаться на событие — если хочешь показать не при запуске, а позже:
        // Lampa.Listener.follow('app', function (e) {
        //     if (e.type === 'ready') checkVPN();
        // });
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
