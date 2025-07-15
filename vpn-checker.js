(function () {
    /**
     * Преобразует код страны (например, "US") в emoji-флаг 🇺🇸
     */
    function countryToFlagEmoji(countryCode) {
        if (!countryCode) return '';
        return countryCode.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt(0))
        );
    }

    /**
     * Проверка страны через ipinfo.io и показ уведомления
     */
    function checkVPN() {
        fetch('https://ipinfo.io/json?token=ce7ef8c0a3c947')
            .then(response => response.json())
            .then(data => {
                const country = data.country || '';

                if (country !== 'RU') {
                    const flag = countryToFlagEmoji(country);
                    const message = `
                        <div style="
                            text-align: center;
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 6px;
                        ">Отключите VPN</div>
                        <div style="
                            text-align: center;
                            font-size: 14px;
                        ">Вы подключены из: ${flag} ${country}</div>
                    `;

                    Lampa.Noty.show(message, 7000); // 7 секунд
                } else {
                    console.log('[VPN Plugin] Подключение из РФ — всё в порядке');
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка при получении IP-данных:', error);
            });
    }

    /**
     * Запуск после загрузки Lampa
     */
    if (window.Lampa) {
        checkVPN();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.Lampa) checkVPN();
        });
    }
})();
