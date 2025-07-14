(function () {
    // Название плагина в списке установленных
    const PLUGIN_NAME = 'VPN Warning';

    // Добавляем плагин в глобальный список
    if (typeof Plugin === 'undefined') window.Plugin = [];
    Plugin.push({
        type: 'component',
        name: PLUGIN_NAME,
        component: PLUGIN_NAME,
        onCreate: checkVPN,
        onDestroy: function () {}
    });

    // Функция проверки VPN
    function checkVPN() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const isVPN = data.security && (data.security.vpn || data.security.proxy || data.security.tor);

                if (isVPN) {
                    showVPNWarning();
                }
            })
            .catch(error => {
                console.log('VPN Warning Plugin: Не удалось получить информацию об IP', error);
            });
    }

    // Отображение предупреждения
    function showVPNWarning() {
        Lampa.Noty.show('⚠️ Обнаружен VPN. Отключите его для стабильной работы приложения.');
    }
})();
