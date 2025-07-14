(function () {
    function checkVPN() {
        fetch('http://ip-api.com/json/?fields=status,country,countryCode,query')
            .then(response => response.json())
            .then(data => {
                console.log('[VPN Plugin] IP-ответ:', data);

                if (data.status === 'success') {
                    if (data.countryCode !== 'RU') {
                        showVPNBanner(data.country, data.query);
                    } else {
                        console.log('[VPN Plugin] IP из РФ, всё нормально');
                    }
                } else {
                    console.log('[VPN Plugin] Не удалось определить IP');
                }
            })
            .catch(error => {
                console.log('[VPN Plugin] Ошибка получения IP-информации:', error);
            });
    }

    function showVPNBanner(country, ip) {
        const html = `
            <div class="vpn-warning-banner" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(30,30,30,0.95);
                padding: 20px 25px;
                border-radius: 16px;
                z-index: 9999;
                text-align: center;
                color: #fff;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                max-width: 90%;
            ">
                <div style="font-size: 24px; margin-bottom: 10px;">
                    ⚠️ VPN Обнаружен
                </div>
                <div style="font-size: 16px; margin-bottom: 20px;">
                    🛡️ Ваш IP: <b>${ip}</b><br>
                    Страна: <b>${country}</b><br>
                    Отключите VPN для стабильной работы Lampa.
                </div>
                <button class="vpn-banner-close" style="
                    padding: 10px 20px;
                    background: #ff4444;
                    color: #fff;
