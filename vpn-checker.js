(function () {
    function getCountryFlag(code) {
        if (!code || code.length !== 2) return '';
        return code.toUpperCase().split('').map(c =>
            String.fromCodePoint(127397 + c.charCodeAt(0))
        ).join('');
    }

    // Словарь с переводом основных стран (можно расширить)
    const countryTranslations = {
    "US": "США",
    "CN": "Китай",
    "DE": "Германия",
    "FR": "Франция",
    "NL": "Нидерланды",
    "GB": "Великобритания",
    "CA": "Канада",
    "PL": "Польша",
    "UA": "Украина",
    "KZ": "Казахстан",
    "SE": "Швеция",
    "FI": "Финляндия",
    "NO": "Норвегия",
    "JP": "Япония",
    "SG": "Сингапур",
    "IT": "Италия",
    "ES": "Испания",
    "CH": "Швейцария",
    "AT": "Австрия",
    "BE": "Бельгия",
    "DK": "Дания",
    "IE": "Ирландия",
    "PT": "Португалия",
    "CZ": "Чехия",
    "RO": "Румыния",
    "HU": "Венгрия",
    "BG": "Болгария",
    "GR": "Греция",
    "TR": "Турция",
    "IL": "Израиль",
    "MX": "Мексика",
    "BR": "Бразилия",
    "AR": "Аргентина",
    "ZA": "Южная Африка",
    "NZ": "Новая Зеландия",
    "KR": "Южная Корея",
    "HK": "Гонконг",
    "AE": "ОАЭ",
    "RU": "Россия",
    "BY": "Беларусь",
    "LT": "Литва",
    "LV": "Латвия",
    "EE": "Эстония",
    "SI": "Словения",
    "HR": "Хорватия",
    "SK": "Словакия",
    "CY": "Кипр",
    "LU": "Люксембург",
    "IS": "Исландия",
    "MD": "Молдова",
    "PH": "Филиппины",
    "TH": "Таиланд",
    "VN": "Вьетнам",
    "MY": "Малайзия",
    "ID": "Индонезия",
    "IN": "Индия",
    "EG": "Египет",
    "NG": "Нигерия",
    "KE": "Кения",
    "CO": "Колумбия",
    "CL": "Чили",
    "PE": "Перу",
    "VE": "Венесуэла",
    "SA": "Саудовская Аравия",
    "QA": "Катар",
    "KW": "Кувейт",
    "OM": "Оман",
    "BA": "Босния и Герцеговина",
    "ME": "Черногория",
    "AL": "Албания",
    "MK": "Северная Македония",
    "GE": "Грузия",
    "AM": "Армения",
    "AZ": "Азербайджан",
    "IQ": "Ирак",
    "IR": "Иран",
    "PK": "Пакистан",
    "BD": "Бангладеш",
    "LK": "Шри-Ланка",
    "NP": "Непал",
    "KH": "Камбоджа",
    "LA": "Лаос",
    "MN": "Монголия",
    "UZ": "Узбекистан",
    "TJ": "Таджикистан",
    "KG": "Киргизия",
    "AF": "Афганистан",
    "SY": "Сирия",
    "LB": "Ливан",
    "JO": "Иордания",
    "TW": "Тайвань",
    "HK": "Гонконг",
    "SG": "Сингапур"
        // Добавь остальные страны сюда...
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
        subText.textContent = `Вы подключены к сети: ${countryName} ${flag} \nОтключите VPN для стабильной работы.`;
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
            setTimeout(() => container.remove(), 7000);
        }, 7000);
    }

    function checkVPN() {
        fetch('http://ip-api.com/json/?fields=status,country,countryCode')
            .then(r => {
                if (!r.ok) throw new Error('Сетевая ошибка');
                return r.json();
            })
            .then(data => {
                if (data.status !== 'success') throw new Error('Не удалось получить Geodata');
                const countryCode = data.countryCode || '';
                // Используем перевод из словаря или подставляем исходное название из API
                const countryName = countryTranslations[countryCode] || data.country || '';
                const flag = getCountryFlag(countryCode);

                console.log(`[VPN Plugin] Страна: ${countryName} (${countryCode})`);

                if (countryCode !== 'RU') {
                    showStyledLampaBanner(countryName, flag);
                } else {
                    console.log('[VPN Plugin] IP из РФ — всё в порядке');
                }
            })
            .catch(err => {
                console.log('[VPN Plugin] Ошибка получения IP:', err);
            });
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
