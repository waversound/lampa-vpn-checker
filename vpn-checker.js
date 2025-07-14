(function () {
    function isDesktop() {
        // Простая проверка: если устройство — ПК/браузер, вернём true
        // Можно улучшить проверку по userAgent или другим параметрам
        return !('tv' in window) && !('cordova' in window) && !('webOS' in window);
    }

    function checkVPN() {
        fetch('https://ipinfo.io/json?token=ce7ef8c0a3c947')
            .then(response => response.json())
            .then(data => {
                const country = data.country || '';
                const flag = data.country ? countryToFlagEmoji(country) : '';

                if (country !== 'RU') {
                    if (isDesktop()) {
                        // Для ПК — упрощённый текст
                        Lampa.Noty.show(`Отключите VPN\nВы подключены из страны: ${country}`, 7000);
                    } else {
                        // Для ТВ/мобил — с флагом и стилизацией
                        const message = `
                            <div style="text-align:center;font-weight:bold;font-size:18px;">Отключите VPN</div>
                            <div style="text-align:center;font-size:14px;margin-top:5px;">
                                Вы подключены из страны: ${flag} ${country}
                            </div>
                        `;
                        Lampa.Noty.show(message, 7000);
                    }
                } else {
                    console.log('[VPN Plugin] IP из РФ, всё в порядке');
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка получения IP-информации:', error);
            });
    }

    // Функция преобразования кода страны в emoji-флаг
    function countryToFlagEmoji(countryCode) {
        return countryCode.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
