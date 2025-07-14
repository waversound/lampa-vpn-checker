(function () {
    function getCountryFlag(code) {
        // Преобразуем код страны (например, "US") в 🇺🇸
        return code.toUpperCase().replace(/./g, char => 
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    function checkVPN() {
        fetch('https://ipwhois.app/json/')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка ответа от API');
                return response.json();
            })
            .then(data => {
                const countryCode = data.country_code || '';
                const countryName = data.country || '';
                const flag = getCountryFlag(countryCode);

                console.log(`[VPN Plugin] Обнаружена страна: ${countryName} (${countryCode})`);

                if (countryCode !== 'RU') {
                    const message = `${flag} Вы находитесь в стране: ${countryName}. Возможно, включён VPN. Отключите его для стабильной работы.`;

                    if (window.Lampa && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
                        // Увеличим длительность показа до 10 секунд
                        Lampa.Noty.time = 10000;
                        Lampa.Noty.show(message);
                    }
                } else {
                    console.log('[VPN Plugin] IP из РФ, всё в порядке.');
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка получения IP:', error);
            });
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
