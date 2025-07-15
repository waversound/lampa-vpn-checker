(function () {
    function getCountryFlag(code) {
        return code.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    const ruNames = {
        'Russia': 'Россия',
        'Germany': 'Германия',
        'Netherlands': 'Нидерланды',
        'United States': 'США',
        'United Kingdom': 'Великобритания',
        'France': 'Франция',
        'Canada': 'Канада',
        'Sweden': 'Швеция',
        'Finland': 'Финляндия',
        'Norway': 'Норвегия',
        'Poland': 'Польша',
        'Czechia': 'Чехия',
        'Switzerland': 'Швейцария',
        'Estonia': 'Эстония',
        'Latvia': 'Латвия',
        'Lithuania': 'Литва',
        'Ukraine': 'Украина',
        'Georgia': 'Грузия',
        'Moldova': 'Молдова',
        'Kazakhstan': 'Казахстан',
        'Armenia': 'Армения',
        'Belarus': 'Беларусь',
        'Azerbaijan': 'Азербайджан',
        'Turkey': 'Турция',
        'Spain': 'Испания',
        'Italy': 'Италия',
        'Israel': 'Израиль',
        'China': 'Китай',
        'Japan': 'Япония',
        'Singapore': 'Сингапур',
        'Austria': 'Австрия',
        'Belgium': 'Бельгия',
        'Denmark': 'Дания',
        'Romania': 'Румыния',
        'Hungary': 'Венгрия',
        'Bulgaria': 'Болгария',
        'Slovakia': 'Словакия',
        'Slovenia': 'Словения',
        'Croatia': 'Хорватия',
        'Serbia': 'Сербия',
        'North Macedonia': 'Северная Македония',
        'Greece': 'Греция',
        'Portugal': 'Португалия',
        'Ireland': 'Ирландия',
        'Iceland': 'Исландия',
        'Luxembourg': 'Люксембург',
        'Liechtenstein': 'Лихтенштейн',
        'Australia': 'Австралия',
        'New Zealand': 'Новая Зеландия',
        'South Korea': 'Южная Корея',
        'Thailand': 'Таиланд',
        'Malaysia': 'Малайзия',
        'Philippines': 'Филиппины',
        'Mexico': 'Мексика',
        'Argentina': 'Аргентина',
        'Chile': 'Чили',
        'Colombia': 'Колумбия',
        'South Africa': 'ЮАР',
        'Vietnam': 'Вьетнам',
        'Indonesia': 'Индонезия'
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
            padding: '14px 20px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '300px',
            borderRadius: '6px',
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
            fontSize: '14px',
            marginBottom: '6px',
            display: 'block',
            width: '100%',
        });

        const subText = document.createElement('div');
        subText.textContent = `Вы подключены к сети: ${countryName} ${flag}\nДля стабильной работы отключите VPN.`;
        Object.assign(subText.style, {
            fontWeight: '400',
            fontSize: '12px',
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
        fetch('https://ipwhois.app/json/')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка ответа от API');
                return response.json();
            })
            .then(data => {
                const code = data.country_code || '';
                const name = data.country || '';
                const flag = getCountryFlag(code);
                const translatedName = ruNames[name] || name;

                console.log(`[VPN Plugin] Обнаружена страна: ${name} (${code})`);

                if (code !== 'RU') {
                    showStyledLampaBanner(translatedName, flag);
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
