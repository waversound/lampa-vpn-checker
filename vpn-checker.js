(function () {
    function getCountryFlag(code) {
        return code.toUpperCase().replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    function showCustomBanner(message) {
        const existing = document.getElementById('vpn-warning');
        if (existing) existing.remove(); // Удалим предыдущее, если есть

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
        div.style.outline = 'none';

        const text = document.createElement('div');
        text.innerText = message;

        const btn = document.createElement('button');
        btn.innerText = 'ОК';
        btn.style.marginTop = '15px';
        btn.style.padding = '10px 20px';
        btn.style.background = '#ff5f5f';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '18px';
        btn.style.color = '#fff';
        btn.setAttribute('tabindex', '1');
        btn.classList.add('focus-visible'); // Поддержка стиля фокуса
        btn.onclick = () => div.remove();

        // Добавим фокус при открытии
        setTimeout(() => {
            btn.focus();
        }, 100);

        // Обработка нажатия OK с пульта (Enter)
        document.addEventListener('keydown', function onKey(e) {
            if (e.key === 'Enter' && document.activeElement === btn) {
                btn.click();
                document.removeEventListener('keydown', onKey);
            }
        });

        div.appendChild(text);
        div.appendChild(btn);
        document.body.appendChild(div);
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
