(function () {
    function getCountryFlag(code) {
        return code.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    function showStyledLampaBanner(countryName, flag) {
        const existing = document.getElementById('vpn-warning');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'vpn-warning';

        Object.assign(container.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#202020',
            color: '#fff',
            padding: '24px 38px',        // увеличено примерно на 35%
            fontSize: '12px',            // размер чуть увеличен (был 9px)
            fontWeight: '400',
            borderRadius: '10px',
            zIndex: '9999',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            maxWidth: '90%',
            transition: 'opacity 0.3s ease',
            opacity: '0',
            lineHeight: '1.4',
            fontFamily: 'Arial, sans-serif',
        });

        // Основной заголовок
        const mainText = document.createElement('div');
        mainText.textContent = 'Отключите VPN';
        Object.assign(mainText.style, {
            fontWeight: '700',
            fontSize: '18px',
            marginBottom: '8px',
        });

        // Подтекст с названием страны и флагом
        const subText = document.createElement('div');
        subText.textContent = `Вы находитесь в стране: ${countryName} ${flag}. Пожалуйста, отключите VPN для стабильной работы.`;
        Object.assign(subText.style, {
            fontWeight: '400',
            fontSize: '14px',
        });

        container.appendChild(mainText);
        container.appendChild(subText);
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });

        setTimeout(() => {
            container.style.opacity = '0';
            setTimeout(() => container.remove(), 300);
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
                const countryName = data.country || '';
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
