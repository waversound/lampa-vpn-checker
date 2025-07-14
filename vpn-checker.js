(function () {
    function checkVPN() {
        fetch('http://ip-api.com/json/?fields=status,status,country,countryCode')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.countryCode !== 'RU') {
                    showCustomToast(data.countryCode);
                }
            })
            .catch(e => console.log('[VPN Plugin] Ошибка IP:', e));
    }

    function showCustomToast(countryCode) {
        if(document.getElementById('vpn-toast')) return; // чтобы не дублировать

        const toast = document.createElement('div');
        toast.id = 'vpn-toast';
        toast.textContent = `⚠️ Вы не в России (${countryCode}). Отключите VPN для стабильной работы.`;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = 'rgba(0,0,0,0.8)';
        toast.style.color = '#fff';
        toast.style.padding = '15px 25px';
        toast.style.borderRadius = '10px';
        toast.style.fontSize = '16px';
        toast.style.zIndex = 99999;
        toast.style.maxWidth = '90%';
        toast.style.textAlign = 'center';
        toast.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        toast.style.fontFamily = 'Arial, sans-serif';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.5s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 10000);
    }

    if (window.Lampa) {
        checkVPN();
    } else {
        console.log('[VPN Plugin] Lampa не загружена');
    }
})();
