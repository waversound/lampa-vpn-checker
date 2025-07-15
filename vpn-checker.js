(function () {
    const ruNames = {
        'Russia': 'Россия',
        'United States': 'США',
        'Finland': 'Финляндия',
        'Germany': 'Германия',
        'France': 'Франция',
        'Sweden': 'Швеция',
        'Ukraine': 'Украина',
        'Kazakhstan': 'Казахстан',
        'Belarus': 'Белоруссия',
        'Italy': 'Италия',
        'Spain': 'Испания',
        'China': 'Китай',
        'Japan': 'Япония'
        // При необходимости дополняй
    };

    function getCountryFlag(code) {
        if (!code || code.length !== 2) return '';
        return code.toUpperCase().split('').map(c =>
            String.fromCodePoint(127397 + c.charCodeAt(0))
        ).join('');
    }

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
            width: '100%',
        });

        const subText = document.createElement('div');
        subText.textContent = `Вы подключены к сети: ${countryName} ${flag}.\nОтключите VPN для стабильной работы.`;
        Object.assign(subText.style, {
            fontWeight: '400',
            fontSize: '11.2px',
            whiteSpace: 'pre-line',
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
        fetch('http://ip-api.com/json/?fields=status,country,countryCode')
            .then(r => {
                if (!r.ok) throw new Error('Сетевая ошибка');
                return r.json();
            })
            .then(data => {
                if (data.status !== 'success') throw new Error('API ошибка');
                const eng = data.country || '';
                const rus = ruNames[eng] || eng;
                const code = data.countryCode || '';
                const flag = getCountryFlag(code);
                console.log(`[VPN Plugin] Страна: ${rus} (${code})`);

                if (code !== 'RU') {
                    showStyledLampaBanner(rus, flag);
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
        document.addEventListener('DOMContentLoaded', () => {
            if (window.Lampa) checkVPN();
        });
    }
})();
