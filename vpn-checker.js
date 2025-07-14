(function() {
    // 1. Проверка VPN через самый надежный метод
    function checkVPN() {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country && data.country !== 'RU') {
                    showIronBanner(data.country, data.ip);
                }
            })
            .catch(e => console.error('VPN check error:', e));
    }

    // 2. Баннер с ядерной защитой
    function showIronBanner(country, ip) {
        // Создаем железный контейнер
        const ironContainer = document.createElement('div');
        ironContainer.id = 'iron-vpn-container';
        ironContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 2147483647; /* Максимальный возможный */
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        `;

        // Содержимое баннера
        ironContainer.innerHTML = `
            <div style="
                background: #222;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                max-width: 80%;
            ">
                <h2 style="color: #ff4444; margin-top: 0;">⚠️ VPN Обнаружен</h2>
                <p style="font-size: 16px;">Ваш IP: <b>${ip}</b><br>Страна: <b>${country}</b></p>
                <p>Для продолжения работы отключите VPN</p>
                <button id="iron-vpn-button" 
                    tabindex="0"
                    style="
                        background: #ff3333;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        font-size: 18px;
                        border-radius: 6px;
                        margin-top: 20px;
                    ">ПОНЯТНО</button>
            </div>
        `;

        // Добавляем в самое начало body
        document.body.insertAdjacentElement('afterbegin', ironContainer);
        const button = document.getElementById('iron-vpn-button');

        // 3. Атомарный контроль фокуса
        function enforceFocus() {
            button.focus();
            button.style.boxShadow = '0 0 0 3px white, 0 0 20px red';
        }

        // Первый фокус с задержкой
        setTimeout(enforceFocus, 350);

        // Постоянная защита фокуса
        const focusGuard = setInterval(enforceFocus, 250);

        // 4. Абсолютная блокировка событий
        function handleButtonAction() {
            clearInterval(focusGuard);
            ironContainer.remove();
        }

        // Все возможные способы взаимодействия
        button.addEventListener('click', handleButtonAction);
        button.addEventListener('keydown', (e) => {
            if ([13, 415].includes(e.keyCode)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                handleButtonAction();
            }
        });

        // 5. Железная защита от любых других действий
        ironContainer.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            enforceFocus();
        });

        ironContainer.addEventListener('click', (e) => {
            if (!e.target.closest('#iron-vpn-button')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                enforceFocus();
            }
        });

        // 6. Защита от попыток Lampa перехватить управление
        document.addEventListener('keydown', globalKeyHandler);
        function globalKeyHandler(e) {
            if (document.getElementById('iron-vpn-container')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                enforceFocus();
            }
        }
    }

    // Запуск с защитой от дурака
    function safeInit() {
        try {
            if (window.Lampa) {
                setTimeout(checkVPN, 2000);
            } else {
                document.addEventListener('DOMContentLoaded', checkVPN);
            }
        } catch (e) {
            console.error('VPN plugin error:', e);
        }
    }

    safeInit();
})();
