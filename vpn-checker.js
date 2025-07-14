(function () {
    function getCountryFlag(code) {
        return code.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    function showStyledLampaBanner(message) {
        const existing = document.getElementById('vpn-warning');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.id = 'vpn-warning';

        Object.assign(div.style, {
            position: 'fixed',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#202020',
            color: '#fff',
            padding: '18px 28px',
            fontSize: '18px',
            fontWeight: '400',
            borderRadius: '10px',
            zIndex: '9999',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            maxWidth: '90%',
            transition: 'opacity 0.3s ease',
            opacity: '0',
        });

        div.textContent = message;
        document.body.appendChild(div);

        requestAnimationFrame(() => {
            div.style.opacity = '1';
        });

        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
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
                    const message = `Вы находитесь в стране: ${countryName} ${flag}. Возможно включён VPN. Пожалуйста, отключите его для стабильной работы.`;
                    showStyledLampaBanner(message);
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
