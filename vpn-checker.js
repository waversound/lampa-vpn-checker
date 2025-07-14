(function () {
    function checkVPN() {
        fetch('https://ipwhois.app/json/')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка ответа от API');
                return response.json();
            })
            .then(data => {
                const country = data.country_code || '';
                console.log('[VPN Plugin] Обнаружен код страны:', country);

                if (country !== 'RU') {
                    Lampa.Noty.show(`⚠️ Вы находитесь в стране: ${country}. Возможно, включён VPN. Отключите его для стабильной работы.`);
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
