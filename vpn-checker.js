(function () {
    // Сопоставление английских названий стран с русскими
    const countryTranslations = {
        'Russia': 'Россия',
        'Finland': 'Финляндия',
        'United States': 'США',
        'Germany': 'Германия',
        'Netherlands': 'Нидерланды',
        'France': 'Франция',
        'Sweden': 'Швеция',
        'United Kingdom': 'Великобритания',
        'Canada': 'Канада',
        'Ukraine': 'Украина',
        'Singapore': 'Сингапур',
        'Norway': 'Норвегия',
        'Kazakhstan': 'Казахстан',
        // Добавляй по необходимости
    };

    function getCountryFlag(code) {
        return code.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    function showCustomBanner(message) {
        const existing = document.getElementById('vpn-warning');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.id = 'vpn-warning';
        div.style.position = 'fixed';
        div.style.bottom = '5%';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.background = 'rgba(0, 0, 0, 0.85)';
        div.style.color = '#fff';
        div.style.padding = '20px 25px';
        div.style.fontSize = '20px';
        div.style.borderRadius = '10px';
        div.style.zIndex = '9999';
        div.style.textAlign = 'center';
        div.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
        div.style.maxWidth = '90%';

        div.innerText = message;

        document.body.appendChild(div);

        setTimeout(() => {
            div.remove();
        }, 5000);
    }

    function checkVPN() {
        fetch('https://ipwhois.app/json/')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка ответа от API');
                return response.json();
            })
            .then(data => {
                const countryCode = data.country_code || '';
                const countryNameEng = data.country || '';
                const countryNameRu = countryTranslations[countryNameEng] || countryNameEng;
                const flag = getCountryFlag(countryCode);

                console.log(`[VPN Plugin] Обнаружена страна: ${countryNameEng} (${countryCode})`);

                if (countryCode !== 'RU') {
                    const message = `Вы находитесь в стране: ${countryNameRu} ${flag}. Возможно, включён VPN. Отключите его для стабильной работы.`;
                    showCustomBanner(message);
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
