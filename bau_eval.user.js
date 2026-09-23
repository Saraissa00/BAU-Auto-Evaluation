// ==UserScript==
// @name         BAU Auto Evaluation - Dynamic Ending Fix
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  Ignores next button completely if captcha element exists to prevent loops. White interface.
// @author       You
// @match        https://app2.bau.edu.jo:7799/eval/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // هون منشيك إذا هاد السؤال الأول عشان نطلع المربع للبدء من جديد
    function isFirstQuestion() {
        const urlParams = new URLSearchParams(window.location.search);
        const qno = parseInt(urlParams.get('qno'), 10);
        return qno === 1 || !urlParams.has('qno');
    }

    // دالة مخصصة لعمل كبسة ماوس حقيقية عشان الموقع ما يعلق
    function simulateTrueClick(element) {
        if (!element) return;
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(clickEvent);
    }

    function runAutomation() {
        // 1. السؤال الأول: منطلع المربع الأبيض عشان نختار النمط
        if (isFirstQuestion()) {
            if (!sessionStorage.getItem('bau_asked_q1')) {
                sessionStorage.setItem('bau_asked_q1', 'running');
                localStorage.setItem('current_instructor_choice', '0'); // الافتراضي: أوافق دائماً

                // عمل الخلفية الشفافة للمربع
                const promptOverlay = document.createElement('div');
                promptOverlay.id = 'bau-custom-prompt';
                promptOverlay.style = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.6); z-index: 100000;
                    display: flex; justify-content: center; align-items: center;
                    font-family: Arial, sans-serif; direction: rtl;
                `;

                // المربع الأبيض يلي فيه الخيارات والعداد
                const promptBox = document.createElement('div');
                promptBox.style = `
                    background: #ffffff; padding: 30px; border-radius: 8px;
                    text-align: center; width: 360px; box-shadow: 0 4px 25px rgba(0,0,0,0.2);
                    border: 1px solid #ccc;
                `;

                const title = document.createElement('h3');
                title.style.margin = "0 0 10px 0";
                title.style.color = "#333333";
                title.innerText = "ما هو تقييم هذا الدكتور؟";
                promptBox.appendChild(title);

                const timerEl = document.createElement('p');
                timerEl.id = 'bau-timer';
                timerEl.style = 'color: #777777; font-size: 13px; margin-bottom: 25px;';
                timerEl.innerText = 'المتبقي: 10 ثوانٍ (الافتراضي: أوافق دائماً)';
                promptBox.appendChild(timerEl);

                const options = [
                    { text: "أوافق دائماً", value: "0" },
                    { text: "أوافق أحياناً", value: "2" },
                    { text: "لا أوافق إطلاقاً", value: "4" }
                ];

                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.innerText = opt.text;
                    btn.style = `
                        width: 100%; padding: 12px; margin: 8px 0;
                        background: #ffffff; color: #333333; border: 1px solid #cccccc;
                        border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 15px;
                        transition: background 0.2s;
                    `;
                    // تأثير بسيط لما الماوس يمرق فوق الزر
                    btn.onmouseover = () => { btn.style.background = "#f5f5f5"; };
                    btn.onmouseout = () => { btn.style.background = "#ffffff"; };

                    btn.onclick = function() {
                        clearInterval(countdown);
                        localStorage.setItem('current_instructor_choice', opt.value);
                        sessionStorage.setItem('bau_asked_q1', 'done');
                        promptOverlay.remove();
                    };
                    promptBox.appendChild(btn);
                });

                promptOverlay.appendChild(promptBox);
                document.body.appendChild(promptOverlay);

                // عداد الـ 10 ثواني للإغلاق التلقائي
                let timeLeft = 10;
                const countdown = setInterval(() => {
                    timeLeft--;
                    const currentTimer = document.getElementById('bau-timer');
                    if (currentTimer) currentTimer.innerText = `المتبقي: ${timeLeft} ثوانٍ (الافتراضي: أوافق دائماً)`;

                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        if (document.getElementById('bau-custom-prompt')) {
                            sessionStorage.setItem('bau_asked_q1', 'done');
                            promptOverlay.remove();
                        }
                    }
                }, 1000);
            }
        } else {
            // منشيل العلامة لما نطلع من السؤال الأول عشان نرجع نسأل للدكتور الجاي
            sessionStorage.removeItem('bau_asked_q1');
        }

        if (document.getElementById('bau-custom-prompt')) return;

        const savedChoice = localStorage.getItem('current_instructor_choice') || "0";
        const targetIndex = parseInt(savedChoice, 10);

        // 2. كود بختار كبسة الراديو الصح بالصفحة
        const radios = document.querySelectorAll('input[type="radio"]');
        if (radios.length > targetIndex) {
            const selectedRadio = radios[targetIndex];
            if (selectedRadio && !selectedRadio.checked) {
                selectedRadio.click();
                selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // 3. كود بلقط الكابتشا وبكتبها لحاله بالصندوق
        let expectedCaptcha = "";
        const inputCaptcha = document.querySelector('input[name="captcha"], #captcha');
        if (inputCaptcha) {
            const bodyText = document.body.innerText;
            const captchaMatch = bodyText.match(/(?:الرقم الآمن التالي في المربع:|المربع:)\s*(\d{4})/);

            if (captchaMatch && captchaMatch[1]) {
                expectedCaptcha = captchaMatch[1];
                if (inputCaptcha.value !== expectedCaptcha) {
                    inputCaptcha.value = expectedCaptcha;
                    inputCaptcha.dispatchEvent(new Event('input', { bubbles: true }));
                    inputCaptcha.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        // 4. هون كود التنقل والإنهاء التلقائي بدون تعليق
        setTimeout(() => {
            const nextBtn = document.querySelector('input[value*="التالي"], #btnNext');

            // تعديل مهم: إذا ظهر صندوق الكابتشا منوقف كبسة التالي تماماً عشان ما يصفر الصندوق
            if (inputCaptcha) {
                if (inputCaptcha.value === expectedCaptcha && expectedCaptcha !== "") {
                    console.log("🚀 وصلنا الصفحة الأخيرة، جاري ترحيل وإرسال الفورم فوراً.");

                    const parentForm = inputCaptcha.closest('form') || document.forms[0];
                    if (parentForm) {
                        parentForm.submit(); // منعمل سبميت مباشر للفورم
                    } else {
                        // حل احتياطي أخير إذا الفورم معلق، بنكبس زر إنهاء
                        const finishBtn = document.querySelector('input[value*="إنهاء"], input[type="submit"]');
                        simulateTrueClick(finishBtn);
                    }
                }
            } else if (nextBtn) {
                // إذا لسا ما وصلنا النهاية وزر التالي موجود، بنكبس عليه وبنمشي
                simulateTrueClick(nextBtn);
            }
        }, 300);
    }

    // الفحص شغال كل 700 ملي ثانية عشان السرعة
    setInterval(runAutomation, 700);

})();