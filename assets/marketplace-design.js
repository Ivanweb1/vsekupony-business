/* Лендинг для селлеров маркетплейсов — дизайн: плашки первого экрана,
   календари «1 день / 1 месяц», согласие в форме заявки.
   Иконки, лента, FAQ, бургер, cookie — business-design.js; демо мастера
   и шаги формы — marketplace.js. */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Календарь на месяц: 30 клеток, закрашено data-days
  document.querySelectorAll("[data-days]").forEach(function (el) {
    var on = +el.dataset.days, html = "";
    for (var d = 1; d <= 30; d++) html += "<i" + (d <= on ? ' class="is-on"' : "") + "></i>";
    el.innerHTML = html;
  });

  // Первый экран: покупатель забирает промокод на купон из ленты, следом —
  // переход на карточку этой площадки; купон подсвечивается, счётчик растёт
  var feed = document.querySelector("[data-hx-feed]");
  var evs = [document.querySelector('[data-mx-ev="0"]'), document.querySelector('[data-mx-ev="1"]')];
  if (feed && evs[0] && evs[1] && !reduce) {
    var P = "social-kit/photos/people/", MP = "assets/brand/mp/";
    var CARD = [
      ["−15% на полотенца", "Wildberries", "wildberries"],
      ["−20% на сыворотку", "Ozon", "ozon"],
      ["−25% на пальто", "Wildberries", "wildberries"],
      ["−10% на конструктор", "Яндекс Маркет", "yandex-market"],
      ["−15% на кружки", "Ozon", "ozon"],
      ["−30% на набор для маникюра", "Мегамаркет", "megamarket"]
    ];
    var WHO = [["anna", "Анна", 1], ["dmitry", "Дмитрий", 0], ["olga", "Ольга", 1], ["igor", "Игорь", 0],
               ["marina", "Марина", 1], ["sergey", "Сергей", 0], ["maria", "Мария", 1], ["oleg", "Олег", 0]];
    var ci = 0, wi = 0;
    var swap = function (ev, fn) {
      ev.classList.add("is-out");
      setTimeout(function () { fn(); ev.classList.remove("is-out"); }, 350);
    };
    setInterval(function () {
      ci = (ci + 1 + Math.floor(Math.random() * 2)) % CARD.length;
      wi = (wi + 1) % WHO.length;
      var c = CARD[ci], who = WHO[wi], k = ci;
      swap(evs[0], function () {
        evs[0].querySelector(".ava").style.backgroundImage = "url('" + P + who[0] + ".jpg')";
        evs[0].querySelector("b").textContent = who[1] + (who[2] ? " забрала промокод" : " забрал промокод");
        evs[0].querySelector(":scope > div > span").textContent = c[0] + " · только что";
        feed.querySelectorAll("[data-mx-card]").forEach(function (el) { el.classList.toggle("is-hot", +el.dataset.mxCard === k); });
        feed.querySelectorAll('[data-mx-count="' + k + '"]').forEach(function (u) {
          u.textContent = String(+u.textContent + 1); u.classList.add("is-up");
          setTimeout(function () { u.classList.remove("is-up"); }, 1200);
        });
      });
      setTimeout(function () {
        swap(evs[1], function () {
          evs[1].querySelector(".ava").style.backgroundImage = "url('" + MP + c[2] + ".svg')";
          evs[1].querySelector(":scope > div > span").textContent = c[1] + " · только что";
        });
      }, 1300);
    }, 3200);
  }

  // Форма: без согласия на обработку данных заявку не отправляем
  var form = document.getElementById("mpForm");
  if (form) {
    var box = form.querySelector("[data-agree]"), lbl = box && box.closest(".form__agree");
    if (box) {
      box.addEventListener("change", function () { lbl.classList.remove("is-error"); });
      form.addEventListener("submit", function (e) {
        if (!box.checked) { e.preventDefault(); e.stopImmediatePropagation(); lbl.classList.add("is-error"); }
      }, true);
    }
    form.querySelectorAll("input").forEach(function (f) {
      f.addEventListener("input", function () { if (f.value.trim()) f.classList.remove("is-error"); });
    });
    form.querySelectorAll("select").forEach(function (f) {
      f.addEventListener("change", function () { if (f.value) f.classList.remove("is-error"); });
    });

    // Поп-ап с текстом согласия
    var dlg = document.getElementById("consent");
    if (dlg && dlg.showModal) {
      form.querySelectorAll("[data-consent-open]").forEach(function (a) {
        a.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); dlg.showModal(); document.documentElement.classList.add("is-modal"); });
      });
      dlg.addEventListener("close", function () { document.documentElement.classList.remove("is-modal"); });
      dlg.querySelectorAll("[data-consent-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
      dlg.querySelector("[data-consent-accept]").addEventListener("click", function () { if (box) { box.checked = true; lbl.classList.remove("is-error"); } dlg.close(); });
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    }
  }
})();
