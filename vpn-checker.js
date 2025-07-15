(function () {
    function getCountryFlag(code) {
        return code.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    const countries = {
        "RU": "Россия",
        "US": "США",
        "CN": "Китай",
        "DE": "Германия",
        "FR": "Франция",
        "GB": "Великобритания",
        "NL": "Нидерланды",
        "CA": "Канада",
        "JP": "Япония",
        "KR": "Южная Корея",
        "SG": "Сингапур",
        "UA": "Украина",
        "PL": "Польша",
        "IT": "Италия",
        "ES": "Испания",
        "SE": "Швеция",
        "NO": "Норвегия",
        "FI": "Финляндия",
        "CH": "Швейцария",
        "BE": "Бельгия",
        "AT": "Австрия",
        "BR": "Бразилия",
        "MX": "Мексика",
        "IN": "Индия",
        "ZA": "ЮАР",
        "TR": "Турция",
        "IL": "Израиль",
        "AE": "ОАЭ",
        "HK": "Гонконг",
        "NZ": "Новая Зеландия",
        "CZ": "Чехия",
        "DK": "Дания",
        "IE": "Ирландия",
        "PT": "Португалия",
        "GR": "Греция",
        "HU": "Венгрия",
        "RO": "Румыния",
        "BG": "Болгария"
        // можно добавить ещё по желанию
    };

    function showStyledLampaBanner(countryName, flag) {
        const existing = document.getElementById('vpn-warning');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'vpn-warning';

        Object.assign(container.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: '#202020',
            color: '#fff',
            padding: '15px 22px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '320px',
            borderRadius: '6.4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            textAlign: 'center',
            zIndex: '9999',
            lineHeight: '1.4',
            opacity: '0',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            userSelect: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        });

        const mainText = document.createElement('div');
        mainText.textContent = 'Отключите VPN';
        Object.assign(mainText.style, {
            fontWeight: '700',
            fontSize: '12.8px',
            marginBottom: '6.4px',
            display: 'block',
            width: '100%',
        });

        const subText = document.createElement('div');
        subText.textContent = `Вы подключены к сети ${countryName} ${flag}.\nОтключите VPN для стабильной работы.`;
        Object.assign(subText.style, {
            fontWeight: '400',
            fontSize: '11.2px',
            whiteSpace: 'pre-line',
            display: 'block',
            width: '100%',
        });

        container.appendChild(mainText);
        container.appendChild(subText);
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            container.style.opacity = '0';
            container.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => container.remove(), 400);
        }, 7000);
    }

    function checkVPN() {
        fetch('https://ip-api.com/json/?fields=status,country,countryCode')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка ответа от API');
                return response.json();
            })
            .then(data => {
                if(data.status !== 'success') {
                    throw new Error('Не удалось определить IP данные');
                }
                const countryCode = data.countryCode || '';
                const countryName = countries[countryCode] || data.country || 'Неизвестно';
                const flag = getCountryFlag(countryCode);

                console.log(`[VPN Plugin] Обнаружена страна: ${countryName} (${countryCode})`);

                if (countryCode !== 'RU') {
                    showStyledLampaBanner(countryName, flag);
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
