/*==========================================================================================================================================================================*/
/* Проверка устройства, на котором открыта страница */
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


function isIE() {
    let ua = navigator.userAgent;
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
}


if (isIE()) {
    document.querySelector("body").classList.add("ie");
}
if (isMobile.any()) {
    document.querySelector("body").classList.add("_touch");
}


function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}


testWebP(function (support) {
    if (support == true) {
        document.querySelector("body").classList.add("_webp");
    } else {
        document.querySelector("body").classList.add("_no-webp");
    }
});



/*==========================================================================================================================================================================*/
/* Глобальные константы и переменные */
const delay = 500;                                                                  // Задержка при блокировке/разблокировке скролла.
const fixedElements = document.querySelectorAll("[data-fixed]");                    // Объекты с "position: fixed".
const menu = document.querySelector(".menu-header");                                // Навигационное меню.
const iconMenu = document.querySelector("[aria-controls='menu']");                  // Кнопка открытия/закрытия меню на мобильных устройствах (бургер).
const searchIcon = document.querySelector(".main-header__search");
let bodyScrollBar;                                                                  // Скроллер на десктопах.
let scrollBar = {};                                                                 // Элемент скроллера.	
const langList = document.querySelector(".lang-header__body");	                    // Список языков.
const langButton = document.querySelector(".lang-header__button");	                // Кнопка выбора языков.
const mediaQuery = 61.99875;
const mediaQueries = `(max-width: 61.99875em)`;
const matchMedia = window.matchMedia(mediaQueries);
let lockStatus = false;                                                             // Статус блокировки действий пользователя в body.
let tabsIndex = 0;                                                                  // "Активная" вкладка табов.
let error = 0;
let showmore;

// Валидация:
let lockForm = false;                                                               // Статус блокировки формы.
let formError, validateFormState;
if (document.querySelector(".page-vacancies")) {
    formError = 5;                                                                  // Количество неверно заполненных полей ввода формы.
    lockForm = true; 
    validateFormState = {                                                           // Объект валидации формы "Вакансия".
        name: false,
        mail: false,
        phone: false,
        document: false,
        agreement: false,
    }
} else {
    formError = 8;                                                                  // Количество неверно заполненных полей ввода формы.
    validateFormState = {                                                           // Объект валидации формы "Аренда Зала".
        date: false,
        persons: false,
        time: false,
        duration: false,
        name: false,
        mail: false,
        phone: false,
        agreement: false,
    }
}
let promocodes = ["PIONER_LOVE", "CINEMA_MOSCOW", "EXT_1", "PROMO"];                // Массив промокодов.
let popupMessage, popupCloseButton;



/*==========================================================================================================================================================================*/
/* Вычисление высот элементов форм */
// if (document.querySelector(".rent-hall") && window.innerWidth < 479.98) {
//     getHeightElements();
// }

// function getHeightElements() {
//     const timeBlock = document.querySelector(".times-rent");
//     const durationVariantsBlock = document.querySelector(".duration-rent");
//     const promocodeFormElem = document.querySelector(".promocode-rent");
//     timeBlock.style.setProperty("--height", `${timeBlock.offsetHeight / 16}rem`);
//     durationVariantsBlock.style.setProperty("--height", `${durationVariantsBlock.offsetHeight / 16}rem`);
//     promocodeFormElem.style.setProperty("--height", `${promocodeFormElem.offsetHeight / 16}rem`);
// }



/*==================================================================================================================================================================*/
/* Функции Анимации */
let _slideUp = (target, duration = 500, visibleHeight = 0, showmore = false) => {
    if (!target.classList.contains("_slide")) {
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = target.offsetHeight + "px";
        target.offsetHeight;
        target.style.overflow = "hidden";

        if (showmore) {
            target.style.height = visibleHeight ? `${visibleHeight}px` : `0px`;
        }

        if (!showmore) target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;

        window.setTimeout(() => {
            if (!showmore) {
                target.style.display = "none";
            } else {
                target.hidden = !visibleHeight ? true : false;
            }

            !visibleHeight ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !visibleHeight ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
        }, duration);
    }
}


let _slideDown = (target, duration = 500, visibleHeight = 0, addHeight = 0, showmore = false) => {
    if (!target.classList.contains("_slide")) {
        let height;
        target.classList.add("_slide");

        if (!showmore) {
            target.style.removeProperty("display");
            let display = window.getComputedStyle(target).display;
            if (display === "none")
                display = "block";
            height = target.offsetHeight;
            target.style.display = display;
            target.style.height = 0;
        } else {
            target.hidden = target.hidden ? false : null;
            visibleHeight ? target.style.removeProperty("height") : null;
            addHeight ? height = visibleHeight + addHeight : height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = visibleHeight ? `${visibleHeight}px` : `0px`;
        }

        target.style.overflow = "hidden";
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");

        window.setTimeout(() => {
            if (!addHeight) {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
            }
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
        }, duration);
    }
}


let _slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === "none") {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}



/*==========================================================================================================================================================================*/
/* Обработка события "клик" на документе */
document.addEventListener("click", documentActions);									

function documentActions(e) {																	
    const targetElement = e.target;
    e.preventDefault();

    if (targetElement.closest(".dragging")) {
        return false;
    }

    if (document.querySelector(".open") && !targetElement.closest(".open")) {
        const openElements = document.querySelectorAll(".open");
        removeClassNames(openElements, "open");
        document.body.classList.remove("_lock");

        if (window.innerWidth < 479.98 && document.querySelector(".footer").classList.contains("hide")) {
            setTimeout(() => {
                document.querySelector(".footer").classList.remove("hide");
            }, 400);
        }
    }

    if (document.querySelector(".popup-message.popup-open") && !e.target.closest("[data-popup] [class*='__content']")) {
        closePopup(popupMessage);
    }
};



/*==========================================================================================================================================================================*/
/* Плавная прокрутка к блоку */
const menuLinks = document.querySelectorAll("[data-goto]");
if (menuLinks) {
    menuLinks.forEach(elem => {
        elem.addEventListener("click", gotoBlock);
    });
} 


function gotoBlock(e) {
    const targetBlock = e.currentTarget.getAttribute("data-goto");
    const targetBlockElement = document.querySelector(targetBlock);
    // removeActiveClasses(menuLinks, "_active");
    // e.target.classList.add("_active");
    if (targetBlockElement) {
        // Закрытие открытого меню:
        document.documentElement.classList.contains("_menu-open") ? menuClose() : null;
        
        
        // Прокрутка:
        let headerBlockHeight = document.querySelector(".header").offsetHeight;
        window.scrollTo({
            top: headerBlockHeight 
                ? (targetBlockElement.getBoundingClientRect().top + window.scrollY - headerBlockHeight)
                : (targetBlockElement.getBoundingClientRect().top + window.scrollY),
            behavior: "smooth",
        });
        e.preventDefault();  
    } else {
        console.log(`[gotoBlock]: Такого блока нет на странице: ${targetBlock}`);
    }
};



/*==========================================================================================================================================================================*/
/* Scroll Header */
const header = document.querySelector(".header");
const headerHeight = Number(header.offsetHeight);
const isShow = header.hasAttribute("data-scroll-show") ? true : false;
let scrollTop = window.scrollY;
let scrollPoint = 32;
let scrollValue, scrollDirection, showPoint, showTimer, timer;


function scrollHeader() {
    if (isShow) {
        showPoint = header.dataset.scrollShow ? header.dataset.scrollShow : 1;
        showPoint === "header" ? showPoint = headerHeight * 4 : null;
        if (header.hasAttribute("data-show-timer")) {
            showTimer = header.dataset.showTimer ? header.dataset.showTimer : 500;
        }
    }
    animateHeaderOnScroll(); 
}
scrollHeader();


// Функция анимации header при скролле:
function animateHeaderOnScroll() {
    if (scrollTop > scrollPoint) {
        !header.classList.contains("scroll") ? header.classList.add("scroll") : null;
    } else {
        header.classList.contains("scroll") ? header.classList.remove("scroll") : null;
    }

    
    // Если имеется атрибут "data-scroll-show":
    if (isShow) {
        // Если срабатывает триггер показа header или прокрутка документа больше этой точки срабатывания:
        if (scrollTop >= showPoint) {
            // Скролл вниз:
            if (scrollDirection === "down") {
                header.classList.contains("show") ? header.classList.remove("show") : null;

            // Скролл вверх:
            } else {
                !header.classList.contains("show") ? header.classList.add("show") : null;
            }

            // Если имеется атрибут "data-show-timer" ==> по истечении времени таймера скрываем header:
            if (showTimer) {
                timer = setTimeout(() => {
                    header.classList.contains("show") ? header.classList.remove("show") : null;
                }, showTimer);
            }

        // Если срабатывает триггер скрытия header или прокрутка документа меньше этой точки срабатывания:
        } else {
            !header.classList.contains("show") ? header.classList.add("show") : null;
        }
    }
}


// Общий обработчик "скролла":
window.addEventListener("scroll", function (e) {
    scrollTop = window.scrollY;
    clearTimeout(timer);
    scrollDirection = scrollTop < scrollValue ? "up" : "down";
    scrollValue = scrollTop;
    animateHeaderOnScroll();
});



/*==================================================================================================================================================================*/
/* Функции блокировки/разблокировки скролла */
const scrollWidth = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
document.querySelector("body").style.setProperty("--scroll-width", scrollWidth);


function toggleLockBody(lock, fixedElements, delay = 500, scroller) {
    lock ? unlockBody(fixedElements, delay, scroller) : lockBody(fixedElements, delay, scroller);
}


// Функция блокировки скролла при открытии элемента:
function lockBody(fixedElements, delay, scroller) {
    let body = document.querySelector("body");
    if (!lockStatus) {
        if (fixedElements) {
            fixedElements.forEach(fixedElement => {
                fixedElement.style.paddingRight = scrollWidth;
            });
        }
        body.style.paddingRight = scrollWidth;
        body.classList.add("_lock");
        lockStatus = true;
        (!document.querySelector("._touch") && scroller) ? scrollBarLockToggle() : null;
        setTimeout(function () {
            lockStatus = false;
        }, delay);
    }
}


// Функция разблокировки скролла при закрытии элемента:
function unlockBody(fixedElements, delay, scroller) {
    let body = document.querySelector("body");
    if (!lockStatus) {
        lockStatus = true;
        setTimeout(() => {
            if (fixedElements) {
                fixedElements.forEach(fixedElement => {
                    fixedElement.style.paddingRight = "0px";
                });
            }
            body.style.paddingRight = "0px";
            body.classList.remove("_lock");
            lockStatus = false;
            (!document.querySelector("._touch") && scroller) ? scrollBarLockToggle(true) : null;
        }, delay);
    }
}



/*==================================================================================================================================================================*/
/* Удаление класса у всех элементов переданного массива */
function removeClassNames(array, className) {
    for (let i = 0; i < array.length; i++) {
        array[i].classList.remove(className);
    }
}



/*==================================================================================================================================================================*/
/* Изменение значения атрибута у всех элементов переданного массива */
function changeAttributeValues(array, attributeName, value) {
    for (let i = 0; i < array.length; i++) {
        array[i].setAttribute(attributeName, value);
    }
}



/*==================================================================================================================================================================*/
/* Infinite Line */
window.addEventListener("load", function () {
    if (document.querySelector("[data-line]")) {
        let indexGalleryLine, indexAddLine, lineGallery, newInnerLine;

        // Функция инициализации линий:
        function initLines() {  
            let lines = Array.from(document.querySelectorAll("[data-line]:not([data-line-media])"));
            const linesMedia = document.querySelectorAll("[data-line-media]");
            linesMedia.forEach(lineMedia => {
                const mediaValue = lineMedia.getAttribute("data-line-media");
                const mediaValuesArray = mediaValue.split(",");
                const mediaQuery = `(${mediaValuesArray[0]}-width: ${mediaValuesArray[1]}em)`;
                const matchMedia = window.matchMedia(mediaQuery);
                if (matchMedia.matches) lines.push(lineMedia);
            });
            lines ? expandLines(lines) : null;
        }
        initLines();
    

        // Функция наращивания длины/высоты линии (если меньше длины/высоты блока-родителя):
        function expandLines(lines) {
            for (let item = 0; item < lines.length; item++) {
                const line = lines[item];
                indexAddLine = 0;
                indexGalleryLine = 0;
                if (line.querySelector("[data-fslightbox]")) lineGallery = line.cloneNode(true);
                const parentBlock = line.closest("[data-line-parent]");
                if (line.innerHTML != "") {
                    const innerLine = line.innerHTML;
                    
                    // Если линия горизонтальной ориентации:
                    if (line.getAttribute("data-line") === "horizontal" && (line.clientWidth < parentBlock.clientWidth)) {
                        for (let i = 0; line.clientWidth < parentBlock.clientWidth; i++) {
                            indexAddLine++;
                            
                            // Если лента содержит элементы галереи:
                            if (line.querySelector("[data-fslightbox]")) {
                                newInnerLine = setGalleryLine(lineGallery);
                                line.insertAdjacentHTML("beforeend", newInnerLine);
                            } else {
                                line.insertAdjacentHTML("beforeend", innerLine);
                            }
                        }
                    }
    
                    // Если линия вертикальной ориентации:
                    if (line.getAttribute("data-line") === "vertical" && (line.clientHeight < parentBlock.offsetHeight)) {
                        for (let i = 0; line.clientHeight < parentBlock.offsetHeight; i++) {
                            indexAddLine++;
                            
                            // Если лента содержит элементы галереи:
                            if (line.querySelector("[data-fslightbox]")) {
                                newInnerLine = setGalleryLine(lineGallery);
                                line.insertAdjacentHTML("beforeend", newInnerLine);
                            } else {
                                line.insertAdjacentHTML("beforeend", innerLine);
                            }
                        }
                    }
    
                    movingLine(line, innerLine, indexAddLine++);
                    if (document.querySelector("[data-fslightbox]")) refreshFsLightbox();
                }
            }
        }
    
    
        // Функция анимации движения линии:
        function movingLine(line, innerLine, index) {
            // Если лента содержит элементы галереи:
            if (line.querySelector("[data-fslightbox]")) {
                newInnerLine = setGalleryLine(lineGallery);
                line.insertAdjacentHTML("afterbegin", newInnerLine);
                newInnerLine = setGalleryLine(lineGallery);
                line.insertAdjacentHTML("beforeend", newInnerLine);
            } else {
                line.insertAdjacentHTML("afterbegin", innerLine);
                line.insertAdjacentHTML("beforeend", innerLine);
            }

            if (index) line.setAttribute("data-line-index", index);
            let animationDuration = line.getAttribute("data-line-speed");
            line.style.animationDuration = `${animationDuration}s`;
        }
    

        // Функция установки галереи в "ленте":
        function setGalleryLine(line) {
            indexGalleryLine++;
            const lineCopy = line.cloneNode(true);
            const galleryItems = lineCopy.querySelectorAll("[data-fslightbox]");
            galleryItems.forEach(galleryItem => {
                let galleryItemName = galleryItem.getAttribute("data-fslightbox");
                galleryItem.setAttribute("data-fslightbox", 
                    `${indexGalleryLine > 1 ? galleryItemName.replace(/-[0-9]/, "") : galleryItemName}-${indexGalleryLine}`);
            });
            return lineCopy.innerHTML;
        }
    }
})



/*==========================================================================================================================================================================*/
/* Spollers */
class Spollers {
    constructor(props, options) {
        this._actionSpoller = (e) => {
            this.onActionSpoller(e);
        };

        // Опции:
        this.startOptions = {
            typeMedia: "max",                                                           // Тип медиа-запроса.
            mediaValue: 0,                                                              // Значение для медиа-запроса.
            unitValue: "em",                                                            // Значение единицы измерения для медиа-запроса.
            speed: 500,                                                                 // Скорость анимации раскрытия/скрытия споллеров.
        }
        options ? this.options = {...this.startOptions, ...options} : this.options = this.startOptions;

        // Запуск инициализации споллеров, в зависимости от их типа (обычные или с медиа-запросами):
        !this.options.mediaValue ? this.initSpollers(props) : this.initSpollersMedia(props);
    }


    /*=================================================================================*/
    /* Инициализация споллеров */
    initSpollers(spollersItem) {
        this.spollersItem = spollersItem;
        this.spollersOne = this.spollersItem.hasAttribute("data-one-spoller") ? true : false;
        this.spollersItem.classList.add("spollers-init");
        this.hideSpollerBody = true;
        this.initSpollerBody();
        this.spollersItem.addEventListener("click", this._actionSpoller);
    }


    /*=================================================================================*/
    /* Инициализация споллеров с медиа-запросами */
    initSpollersMedia(spollersItem) {
        this.spollersItem = spollersItem;
        this.spollersOne = this.spollersItem.hasAttribute("data-one-spoller") ? true : false;
        this.mediaQuery = `(${this.options.typeMedia}-width: ${this.options.mediaValue / 16}${this.options.unitValue})`;
        this.matchMedia = window.matchMedia(this.mediaQuery);
        this.matchMedia.matches ? this.initSpollers(spollersItem) : null;

        // Обработка срабатывания брэйкпоинтов:
        this.matchMedia.addListener(function () {
            this.spollersItem.classList.toggle("spollers-init");
            if (this.matchMedia.matches) {
                this.hideSpollerBody = true;
                this.spollersItem.addEventListener("click", this._actionSpoller);
            } else {
                this.hideSpollerBody = false;
                this.spollersItem.removeEventListener("click", this._actionSpoller);
            }
            this.initSpollerBody();
        }.bind(this));
    }


    /*=================================================================================*/
    /* Работа с кнопками споллера */
    initSpollerBody() {
        this.spollerTitles = this.spollersItem.querySelectorAll("[data-spoller]");
        this.spollerID = this.spollersItem.getAttribute("id") ? this.spollersItem.getAttribute("id") : "spollers";
        if (this.spollerTitles) {
            this.spollerTitles.forEach((spollerTitle, index) => {
                this.spollerTitle = spollerTitle;
                this.spollerTitle.setAttribute("id", `${this.spollerID}-${index + 1}`);
                this.controlPanelID = this.spollerTitle.nextElementSibling.getAttribute("id");

                // Если "активация" споллеров:
                if (this.hideSpollerBody) {
                    this.spollerTitle.removeAttribute("tabindex");
                    this.spollerTitle.setAttribute("aria-expanded", "false");
                    this.spollerTitle.setAttribute("aria-controls", `${this.controlPanelID}`);
                    this.spollerTitle.nextElementSibling.style.display = "none";
                    this.spollerTitle.nextElementSibling.setAttribute("aria-labelledby", `${this.spollerID}-${index + 1}`);
                    this.spollerTitle.nextElementSibling.hidden = true;

                // Если "деактивация" споллеров:
                } else {
                    this.spollerTitle.setAttribute("tabindex", "-1");
                    this.spollerTitle.nextElementSibling.style.display = "block";
                    this.spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }


    /*=================================================================================*/
    /* Обработка "клика" по кнопке споллера */
    onActionSpoller(e) {
        if (e.target.hasAttribute("data-spoller") || e.target.closest("[data-spoller]")) {
            this.activeTitle = e.target.hasAttribute("data-spoller") ? e.target : e.target.closest("[data-spoller]");

            if (!this.spollersItem.querySelectorAll("._slide").length) {
                // Вызов метода скрытия контента "неактивных" споллеров, если споллерам задан атрибут data-one-spoller:
                this.spollersOne && this.activeTitle.getAttribute("aria-expanded") === "false"
                    ? this.hideSpollersBody() 
                    : null;

                if (this.activeTitle.getAttribute("aria-expanded") === "true") {
                    this.activeTitle.setAttribute("aria-expanded", "false");
                    this.activeTitle.nextElementSibling.setAttribute("hidden", "");
                } else {
                    this.activeTitle.setAttribute("aria-expanded", "true");
                    this.activeTitle.nextElementSibling.removeAttribute("hidden");
                }
                _slideToggle(this.activeTitle.nextElementSibling, this.options.speed);
            }
            e.preventDefault();
        }
    }


    /*=================================================================================*/
    /* Скрытие контента "неактивных" споллеров (если споллерам задан атрибут data-one-spoller) */
    hideSpollersBody() {
        this.currentTitle = this.spollersItem.querySelector("[aria-expanded='true']");
        if (this.currentTitle) {
            this.currentTitle.setAttribute("aria-expanded", "false");
            this.currentTitle.nextElementSibling.setAttribute("hidden", "");
            _slideUp(this.currentTitle.nextElementSibling, this.options.speed);
        }
    }
}



/*==========================================================================================================================================================================*/
/* Запуск конструктора Spollers */
if (document.querySelector("#spollers-nav")) {
    const spollersNav = document.querySelector("#spollers-nav");
    new Spollers(spollersNav, {
        mediaValue: 767.98,
        speed: 400,
    });
}



/*==================================================================================================================================================================*/
/* Popup Message */
if (document.querySelector(".popup-message")) {
    popupMessage = document.querySelector(".popup-message");
    popupCloseButton = popupMessage.querySelector("[data-popup-close]");
    popupCloseButton.addEventListener("click", function() {
        closePopup(popupMessage);
    });
} 


function closePopup(popup) {
    popup.classList.remove("popup-open");
    popup.setAttribute("aria-hidden", "true");
    toggleLockBody(true, fixedElements, 500);
    document.body.classList.remove("open-popup");
}



/*==================================================================================================================================================================*/
/* Класс Popup */
class Popup {
    constructor(options) {
        // Options:
        this.startOptions = {
            logging: true,                                                      // Вывод информационных сообщений в консоль.
            init: true,                                                         // Инициализация попапов.
            bodyLock: true,                                                     // Блокировка скролла.
            closeEsc: true,                                                     // Закрытие по нажатии на клавишу "Esc".
            delay: 500,
            focusCatch: true,                                                   // Фокус внутри попапа зациклен.
            // Events:
            on: { 
                beforeOpen: function () {},
                afterOpen: function () {},
                beforeClose: function () {},
                afterClose: function () {},
            },
        }

        options ? this.options = {...this.startOptions, ...options} : this.options = this.startOptions;

        // Состояния:
        this.bodyLock = false;                                                  // Состояние блокировки скролла.
        this.isOpen = false;                                                    // Состояние попапа: открыт/закрыт.                                                   
        this.nextOpen = false;                                                  // Открытие следующего попапа и закрытие текущего.                                                   

        // Элементы фокуса:
        this.focusElements = [
            'a[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'area[href]',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ];
        this.lastFocusElement = false;

        this.fixedElements = document.querySelectorAll("[data-fixed]");

        this.options.init ? this.initPopup() : null;
    }


    /*=========================================================================*/
    /* Инициализация popup */
    initPopup() {
        // Работа с попапами:
        const popupArray = document.querySelectorAll("[data-popup]");
        popupArray.forEach(popup => {
            const popupLabel = popup.querySelector("[data-popup-label]").innerHTML 
                ? popup.querySelector("[data-popup-label]").innerHTML 
                : "модальное окно";
            const popupCloseButtons = popup.querySelectorAll("[data-popup-close]");
            if (popupCloseButtons) {
                popupCloseButtons.forEach(popupCloseButton => {
                    popupCloseButton.setAttribute("aria-label", `закрыть ${popupLabel}`);
                });
            }
            popup.setAttribute("role", "dialog");
            popup.setAttribute("aria-modal", "true");
            popup.setAttribute("aria-hidden", "true");
            popup.setAttribute("aria-labelledby", `${popupLabel}`);
        });


        // Навешивание обработчика "клик" на кнопки вызова попапов:
        const popupOpenButtons = document.querySelectorAll("[data-popup-open]")
        if (popupOpenButtons) {
            popupOpenButtons.forEach(popupButton => {
                popupButton.addEventListener("click", function (e) {
                    if (!e.target.closest("[data-form]")) {
                        e.preventDefault();
                        this.getOpenPopup(e.target);
                    }
                }.bind(this));
            });
        }
    }


    /*=========================================================================*/
    /* Обработчик событий, вызывающих открытие popup */
    getOpenPopup(targetElement) {
        this.popupButton = targetElement;
        this.popupOpen = document.querySelector(this.popupButton.getAttribute("data-popup-open"));

        // "Клик" на кнопку внутри формы: 
        if (targetElement.closest("[data-form]")) {
            const form = targetElement.closest("[data-form]");
            formValidate(form);
            if (!form.querySelector(".input-error")) {
                this.popupOpen ? this.openPopup() : null;
            }
        } else {
            this.popupOpen ? this.openPopup() : null;
        }
    }


    /*=========================================================================*/
    /* Открытие popup */
    openPopup() {
        if (!lockStatus) {
            // Присвоение значения состоянию "bodyLock" в зависимости от наличия класса "lock" у body: 
            this.bodyLock = document.body.classList.contains("lock") ? true : false;

            // Если уже имеется открытый попап => ставим состояние "открытие следующего попапа" и закрываем текущий:
            if (this.isOpen) {
                this.nextOpen = true;
                this.closePopup();
            }
            
            // Если необходимо формировать контент попапа до его открытия: 
            // if (document.querySelector(".page-doctor")) formationPopupContent(); 

            // Если контент попапа формируется в зависимости от нажатого элемента:
            // popupName === "doctor-popup" ? createPopupContent(this.popupOpen, this.popupOpen) : null;

            // Работа с открываемым попапом:
            this.popupOpen.classList.add("popup-open");
            this.popupOpen.setAttribute("aria-hidden", "false");

            // Присвоение текущего попапа объекту последнего открытого popup:
            this.previousOpenPopup = this.popupOpen;
            
            // Вызов функции обработки блокировки/разблокировки скролла, указание значения попапу "открыт" и присвоение body значения "блокирован":
            !this.nextOpen ? toggleLockBody(this.bodyLock, this.fixedElements, this.options.delay) : null;
            document.body.classList.add("open-popup");
            this.isOpen = true;
            this.bodyLock = true;

            // Установить фокус:
            setTimeout(() => {
                this.focusTrap();
            }, 50);

            // Если на странице имеются формы с обязательными полями => снимаем у всех полей класс "ошибка ввода": 
            const inputsError = document.querySelectorAll(".input-error");      // Поля формы с ошибкой валидации. 
            const errorElements = document.querySelectorAll(".error");          // Элементы вывода информации об ошибке валидации.
            inputsError ? removeClassNames(inputsError, "input-error") : null;		
            errorElements ? changeAttributeValues(errorElements, "hidden", "true") : null;						

            // Запуск обработчика событий:
            this.popupEvents();
        }
    }


    /*=========================================================================*/
    /* Обработчик событий popup */
    popupEvents() {
        // "Клик" на области открытого попапа:
        this.popupOpen.addEventListener("click", function (e) {
            // Если событие "клик" вызывается на области вне контента попапа или на кнопке "закрыть":
            if (e.target.hasAttribute("data-popup-close") 
                || !e.target.closest("[data-popup] [class*='__content']")) {
                e.preventDefault();
                this.nextOpen = false;					
                this.isOpen && !lockStatus ? this.closePopup() : null; 
                if (!this.isOpen) this.lastFocusElement = e.target;
            }
        }.bind(this));

        // Закрытие по "клику" на клавишу "Esc":
        document.addEventListener("keydown", function (e) {
            if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                e.preventDefault();
                this.nextOpen = false;
                this.closePopup();
            }
            // Зацикливание фокуса в открытом попапе (при наличии настройки focusCatch: true):
            if (this.startOptions.focusCatch && e.which == 9 && this.isOpen) {
                this.focusCatch(e);
                return;
            }
        }.bind(this));
    }


    /*=========================================================================*/
    /* Закрытие popup */
    closePopup() {
        // Работа c закрываемым попапом:
        this.previousOpenPopup.classList.remove("popup-open");
        this.previousOpenPopup.setAttribute("aria-hidden", "true");

        // Вызов функции обработки блокировки/разблокировки скролла:
        !this.nextOpen ? toggleLockBody(this.bodyLock, this.fixedElements, this.options.delay) : null;

        // Присвоение body класса "open-popup" и состояниям "попап открыт" и блокировки скролла значения false:
        document.body.classList.remove("open-popup");
        this.isOpen = false;
        this.bodyLock = false;

        // Установить фокус:
        setTimeout(() => {
            this.focusTrap();
        }, 50);

        // Если на странице имеются формы с обязательными полями => снимаем у всех полей класс "ошибка ввода": 
        const inputsError = document.querySelectorAll(".input-error");          // Поля формы с ошибкой валидации. 
        const errorElements = document.querySelectorAll(".error");              // Элементы вывода информации об ошибке валидации. 
        inputsError ? removeClassNames(inputsError, "input-error") : null;		
        errorElements ? changeAttributeValues(errorElements, "hidden", "true") : null;
    }


    /*=========================================================================*/
    /* Зацикливание фокуса в открытом попапе */
    focusCatch(e) {
        const focusable = this.popupOpen.querySelectorAll(this.focusElements);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if (e.shiftKey && focusedIndex === 0) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }


    /*=========================================================================*/
    /* Установка фокуса принудительно */
    focusTrap() {
        const focusable = this.previousOpenPopup.querySelectorAll(this.focusElements);
        if (!this.isOpen && this.lastFocusElement) {
            this.lastFocusElement.focus();
        } else {
            focusable[0].focus();
        }
    }
}
new Popup({});



/*==========================================================================================================================================================================*/
/* Schedule Navigation */

// Задание атрибута навигации расписания фильма на страницах "Карточка фильма":
if (document.querySelector(".page-film")) {
    const filmTitle = document.querySelector("[data-film-title]").innerText.replaceAll(" ", "");
    setAttributeNameButton(filmTitle);
}
if (document.querySelector(".page-event-some")) {
    const eventTitle = document.querySelector("[data-event-title]").getAttribute("data-event-title");
    setAttributeNameButton(eventTitle);
}
if (document.querySelector(".page-main")) {
    setAttributeNameButton("all");
}


function setAttributeNameButton(attributeName) {
    const scheduleButtons = document.querySelectorAll(".nav-schedule__date");
    scheduleButtons.forEach(scheduleButton => {
        scheduleButton.setAttribute("data-nav", attributeName);
    });
}


// Расстановка месяцев и расчет положения линии "активной" даты:
if (document.querySelector(".nav-schedule")) {
    const scheduleBody = document.querySelector(".nav-schedule__body");
    const dateButtons = document.querySelectorAll(".nav-schedule__date");
    const lineActive = document.querySelector(".nav-schedule__line");
    let currentButton = document.querySelector(".nav-schedule__date.current-date");
    let activeButton = document.querySelector(".nav-schedule__date.active");
    const firstDate = document.querySelector(".first-date");
    let months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    let currentMonth = new Date().getMonth();
    let firstDatePosition = firstDate.offsetLeft;
    let leftPosition;

    dateButtons.forEach(dateButton => {
        dateButton.addEventListener("click", function(e) {
            if (e.target.closest(".dragging")) {
                e.preventDefault();
                return false;
            } else {
                toggleActiveButton(e);
            }
        });
    });

    window.innerWidth > 1200 ? getShadowOnMovieList() : null;
    setPositionLine(activeButton);
    setMonths();
    setPositionMonths();

    // Функция переключения состояния кнопки выбора даты:
    function toggleActiveButton(e) {
        const targetElement = e.currentTarget;
        if (!targetElement.classList.contains("active")) {
            activeButton = document.querySelector(".nav-schedule__date.active");
            activeButton.classList.remove("active");
            targetElement.classList.add("active");
            // if (!targetElement.classList.contains("current-date")) {
            //     lineActive.classList.add("no-active");
            // } else {
            //     lineActive.classList.remove("no-active");
            // }
            // setPositionLine(targetElement, false);
        }
    }

    scheduleBody.addEventListener("scroll", function(e) {
        setPositionLine(currentButton, true);
    });


    // Функция расчета позиции линии "активной" даты:
    function setPositionLine(activeButton, scroll = false) {
        leftPosition = activeButton.offsetLeft;
        let addValue = window.innerWidth > 1023.98 ? 6 : 7;
        scroll ? lineActive.style.transitionDuration = "0s" : lineActive.style.transitionDuration = "0.3s";
        lineActive.style.left = `${(leftPosition + addValue) / 16}rem`;
    }


    // Функция построения разметки HTML элементов месяцев:
    function setMonths() {
        const scheduleBody = document.querySelector(".nav-schedule__body");
        let monthsInnerHTML = [];
        months.forEach((month, index) => {
            if (index == currentMonth || index - 1 == currentMonth) {
                const scheduleItem = `
                    <div class="nav-schedule__month">
                        <span>${month}</span>
                    </div>
                `;
                monthsInnerHTML.push(scheduleItem);
            }
        });
        scheduleBody.insertAdjacentHTML("afterbegin", monthsInnerHTML.join(""));
    }


    // Функция расчета положения элементов месяцев:
    function setPositionMonths() {
        const monthBlock = document.querySelector(".nav-schedule__month");
        const monthElements = document.querySelectorAll(".nav-schedule__month span");
        monthBlock.style.width = `${(firstDatePosition - 20) / 16}rem`;

        monthElements.forEach(monthElement => {
            monthElement.style.left = `${leftPosition / 16}rem`;
        });
    }


    window.addEventListener("orientationchange", function() {
        // Расчет позиции "активной" линии при смене ориентации экрана на window:
        setPositionLine(currentButton, false);

        // Расчет положения элементов месяцев:
        setPositionMonths();
    })
}



/*==========================================================================================================================================================================*/
/* Событие смены ориентации окна */
window.addEventListener("orientationchange", function() {
    // Управление состоянием "тени" в списках расписания сеансов:
    window.innerWidth > 1200 ? getShadowOnMovieList() : getShadowOnMovieList(false);

    // Вычисление высот элементов формы "Аренда":
    if (document.querySelector(".rent-hall") && window.innerWidth < 479.98) {
        getHeightElements();
    }
})



/*==========================================================================================================================================================================*/
/* Shadow Toggle On Times Movie */

// Функция управления состоянием "тени" в списках расписания сеансов:
function getShadowOnMovieList(shadowOn = true) {
    if (shadowOn) {
        const timesMovieLists = document.querySelectorAll(".times-movie__list");
        timesMovieLists.forEach(timesMovieList => {
            if (timesMovieList.children.length > 5) {
                timesMovieList.closest(".movie").classList.add("shadow-on");
            }
        });
    } else {
        const shadowBlocks = document.querySelectorAll(".shadow-on");
        shadowBlocks?.forEach(shadowBlock => {
            shadowBlock.classList.remove("shadow-on");
        });
    }
}



/*==========================================================================================================================================================================*/
/* Slider Swiper */
function bildSliders() {
    let sliders = document.querySelectorAll("[class*='__swiper-wrapper']:not(.swiper-wrapper)");
    if (sliders) {
        sliders.forEach(slider => {
            slider.parentElement.classList.add("swiper");
            slider.classList.add("swiper-wrapper");
            for (const slide of slider.children) {
                slide.classList.add("swiper-slide");
            }
        });
    }
    initSliders();
}
bildSliders();


function initSliders() {
    const options = {
        root: null,
        rootMargin: "0px",
    }

    // Slider Main:
    if (document.querySelector(".slider-main")) {
        const timeout = 1200;
        let slides;
        let sliderMain = new Swiper(".slider-main", {
            autoplay: { 
                delay: 5000,		
                disableOnInteraction: true,                                         // Отключить автопрокрутку после ручного переключения слайдов.
                pauseOnMouseEnter: false,                                           // Остановить автопрокрутку при движении указателя мыши над контейнером swiper.	
            }, 
            observer: true,
            observeParents: true,
            watchOverflow: true,
            slidesPerView: 1,
            initialSlide: 0,
            spaceBetween: 20,
            speed: timeout,
            loop: true,
            loopAdditionalSlides: 1,
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },	
            pagination: {
                el: ".main [data-bullets]",
                type: "bullets",
                clickable: true,

                // Обычные буллеты:
                renderBullet: function (index, className) {
                    return `
                        <button class=${className} aria-label="перейти к слайду ${index + 1}">
                            <span></span>
                        </button>
                    `;
                },
            },
            breakpoints: {
                1200: {
                    spaceBetween: 20,
                },
                768: {
                    spaceBetween: 14,
                },
                478: {
                    spaceBetween: 20,
                },
                320: {
                    spaceBetween: 8,
                }
            },
            on: {
                /* Отключение автопрокрутки в не области наблюдения */
                init: function (swiper) {
                    slides = document.querySelectorAll(".slider-main__slide:not(.swiper-slide-duplicate)");
                    const prevSlides = Array.from(swiper.slides).slice(0, swiper.activeIndex);
                    prevSlides.forEach(prevSlide => {
                        prevSlide.classList.add("slide-prev");
                    });
                    const nextSlides = Array.from(swiper.slides).slice(swiper.activeIndex + 1);
                    nextSlides.forEach(nextSlide => {
                        nextSlide.classList.add("slide-next");
                    });
                    let observerMain = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                sliderMain.autoplay.start();
                            } else {
                                sliderMain.autoplay.stop();
                            }
                        })
                    }, options);
                    observerMain.observe(swiper.el);
                },
                slideNextTransitionStart: function (swiper) {
                    if (this.previousIndex === 1) {
                        swiper.slides[swiper.slides.length - 3].classList.remove("slide-forward-prev");
                    }
                    if (swiper.activeIndex + 1 === swiper.slides.length - 1) {
                        swiper.slides[2].classList.add("slide-forward-prev");
                    }
                    if (swiper.activeIndex === 3) {
                        swiper.slides[2].classList.remove("slide-forward-prev");
                    }
                    if ((this.previousIndex === swiper.slides.length - 3) && (swiper.activeIndex + 1 === swiper.slides.length - 1)) {
                        swiper.slides[swiper.slides.length - 3].classList.remove("slide-forward-prev");
                    }
                },
                slidePrevTransitionStart: function (swiper) {
                    if (this.previousIndex + 1 === swiper.slides.length - 1) {
                        swiper.slides[2].classList.remove("slide-forward-prev");
                    }
                    if ((this.previousIndex === 2) && (swiper.activeIndex === 1)) {
                        swiper.slides[swiper.slides.length - 3].classList.add("slide-forward-prev");
                        swiper.slides[2].classList.remove("slide-forward-prev");
                    }
                    if ((this.previousIndex === swiper.slides.length - 3) && (swiper.activeIndex === this.previousIndex - 1)) {
                        swiper.slides[swiper.slides.length - 3].classList.remove("slide-forward-prev");
                    }
                },	
            },
        });
    }

    
    // Slider Cafe:
    if (document.querySelector(".slider-cafe")) {
        let sliderCafe = new Swiper(".slider-cafe", {
            autoplay: { 
                delay: 4000,		
                disableOnInteraction: true,                                         // Отключить автопрокрутку после ручного переключения слайдов.
                pauseOnMouseEnter: false,                                           // Остановить автопрокрутку при движении указателя мыши над контейнером swiper.	
            }, 
            observer: true,
            observeParents: true,
            watchOverflow: true,
            slidesPerView: 1,
            speed: 600,
            parallax: true,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },	
            pagination: {
                el: ".slider-cafe [data-bullets]",
                type: "bullets",
                clickable: true,

                // Обычные буллеты:
                renderBullet: function (index, className) {
                    return `
                        <button class=${className} aria-label="перейти к слайду ${index + 1}">
                            <span></span>
                        </button>
                    `;
                },
            },
            on: {
                /* Отключение автопрокрутки в не области наблюдения */
                init: function (swiper) {
                    let observerCafe = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                sliderCafe.autoplay.start();
                            } else {
                                sliderCafe.autoplay.stop();
                            }
                        })
                    }, options);
                    observerCafe.observe(swiper.el);
                },
            }
        });
    }

    
    // Slider About:
    if (document.querySelector(".slider-about")) {
        let sliderAbout = new Swiper(".slider-about", {
            autoplay: { 
                delay: 4000,		
                disableOnInteraction: true,                                         // Отключить автопрокрутку после ручного переключения слайдов.
                pauseOnMouseEnter: false,                                           // Остановить автопрокрутку при движении указателя мыши над контейнером swiper.	
            }, 
            observer: true,
            observeParents: true,
            watchOverflow: true,
            slidesPerView: 1,
            speed: 600,
            parallax: true,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },	
            pagination: {
                el: ".slider-about [data-bullets]",
                type: "bullets",
                clickable: true,

                // Обычные буллеты:
                renderBullet: function (index, className) {
                    return `
                        <button class=${className} aria-label="перейти к слайду ${index + 1}">
                            <span></span>
                        </button>
                    `;
                },
            },
            on: {
                /* Отключение автопрокрутки в не области наблюдения */
                init: function (swiper) {
                    let observerAbout = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                sliderAbout.autoplay.start();
                            } else {
                                sliderAbout.autoplay.stop();
                            }
                        })
                    }, options);
                    observerAbout.observe(swiper.el);
                },
            }
        });
    }


    // Slider Gallery:
    if (document.querySelector(".slider-gallery")) {
        new Swiper(".slider-gallery", {
            observer: true,
            observeParents: true,
            watchOverflow: true,
            slidesPerView: "auto",
            spaceBetween: 20,
            speed: 800,
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },	
            breakpoints: {
                1200: {
                    spaceBetween: 20,
                },
                479: {
                    spaceBetween: 14,
                },
                320: {
                    spaceBetween: 8,
                }
            },
        });
    }


    // Slider Recommendations:
    if (document.querySelector(".slider-recommendations")) {
        new Swiper(".slider-recommendations", {
            observer: true,
            observeParents: true,
            watchOverflow: true,
            slidesPerView: "auto",
            spaceBetween: 20,
            speed: 800,
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },	
            breakpoints: {
                1200: {
                    spaceBetween: 20,
                },
                320: {
                    spaceBetween: 14,
                }
            },
        });
    }
}



/*==========================================================================================================================================================================*/
/* Динамический Адаптив */
function dynamicAdapt(type) {
    this.type = type;
}


// Функция адаптива:
dynamicAdapt.prototype.init = function () {
    const _this = this;		
    this.оbjects = [];																				// Массив объектов.
    this.daClassname = "_dynamic_adapt_";	
    this.nodes = document.querySelectorAll("[data-da]");											// Массив DOM-элементов.
    for (let i = 0; i < this.nodes.length; i++) {													// Наполнение оbjects объектами.
        const node = this.nodes[i];
        const data = node.dataset.da.trim();
        const dataArray = data.split(",");
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(dataArray[0].trim());
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
        оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
    }
    this.arraySort(this.оbjects);
    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {					// Массив уникальных медиа-запросов.
        return '(' + this.type + "-width: " + item.breakpoint + "em)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
        return Array.prototype.indexOf.call(self, item) === index;
    });
    for (let i = 0; i < this.mediaQueries.length; i++) {											// Навешивание слушателя на медиа-запрос и вызов обработчика 
        const media = this.mediaQueries[i];															// при первом запуске.
        const mediaSplit = String.prototype.split.call(media, ',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];			
        const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {			// Массив объектов с подходящим брейкпоинтом.
            return item.breakpoint === mediaBreakpoint;
        });
        matchMedia.addListener(function () {
            _this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
    }
};


// Функция перемещения:
dynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        }
    } else {
        for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) {
                this.moveBack(оbject.parent, оbject.element, оbject.index);
            }
        }
    }
};


// Функция перемещения:
dynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === "last" || place >= destination.children.length) {
        destination.insertAdjacentElement("beforeend", element);
        return;
    }
    if (place === "first") {
        destination.insertAdjacentElement("afterbegin", element);
        return;
    }
    destination.children[place].insertAdjacentElement("beforebegin", element);
}


// Функция возврата:
dynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement("beforebegin", element);
    } else {
        parent.insertAdjacentElement("beforeend", element);
    }
}


// Функция получения индекса внутри родителя:
dynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
};


// Функция сортировки массива по breakpoint и place по возрастанию для this.type = min по убыванию для this.type = max:
dynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }
                if (a.place === "first" || b.place === "last") {
                    return -1;
                }	
                if (a.place === "last" || b.place === "first") {
                    return 1;
                }
                return a.place - b.place;
            }	
            return a.breakpoint - b.breakpoint;
        });
    } else {
        Array.prototype.sort.call(arr, function (a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) {
                    return 0;
                }	
                if (a.place === "first" || b.place === "last") {
                    return 1;
                }
                if (a.place === "last" || b.place === "first") {
                    return -1;
                }
                return b.place - a.place;
            }	
            return b.breakpoint - a.breakpoint;
        });
        return;
    }
};
const da = new dynamicAdapt("max");
da.init();



/*==========================================================================================================================================================================*/
/* Tabs */
class Tabs {
    constructor(props, options) {
        // Опции:
        this.startOptions = {
            mediaValue: "",                                                             // Значение для медиа-запроса.
            unitValue: "em",                                                            // Значение единицы измерения для медиа-запроса.
            speed: 500,                                                                 // Скорость переключения табов.
            animate: false,                                                             // Анимация переключения табов.
        }
        options ? this.options = {...this.startOptions, ...options} : this.options = this.startOptions;

        // Проверка props на NodeList:
        if (props instanceof NodeList) {
            props.forEach((tabsItem, index) => { 
                tabsItem.setAttribute("data-tabs-index", tabsIndex);
                this.initTabs(tabsItem);
            });
        } else {
            props.setAttribute("data-tabs-index", tabsIndex);
            this.initTabs(props);
        }
        tabsIndex++;
    }


    /*=================================================================================*/
    /* Функция инициализации */
    initTabs(tabsItem) {
        this.tabsItem = tabsItem;
        this.activeHash = this.setHash();
        this.activeIndex = null;
        this.tabsItem.classList.add("tab-init");
        this.titlesBlock = this.tabsItem.querySelector("[data-tabs-titles]");
        this.titles = Array.from(this.titlesBlock.children);
        this.panels = Array.from(this.tabsItem.querySelector("[data-tabs-body]").children);
        this.mediaQueryValue = this.options.mediaValue;
        this.titlesBlock.setAttribute("role", "tablist");

        // Функционал сохранения активных вкладок табов при перезагрузке страницы:
        this.itemIndex = this.tabsItem.dataset.tabsIndex;
        if (this.activeHash && !this.tabsItem.querySelector("[data-line]")) {
            this.tabsItemActive = Number(this.activeHash[0]);
            tabsIndex === this.tabsItemActive ? this.activeIndex = Number(this.activeHash[1]) : this.activeIndex = 0; 
        } else {
            this.tabsItemActive = 0;
            this.activeIndex = 0;
        }

        // Обрабатываем заголовки и контент табов:
        this.panels.forEach((panel, index) => {
            this.panel = panel;
            this.panelID = this.panel.getAttribute("id");
            this.panel.setAttribute("role", "tabpanel");
            this.panel.setAttribute("tabindex", "0");

            // Для корректной работы анимации:
            if (this.options.animate) {
                index === this.activeIndex ? this.panel.style.display = "block" : this.panel.style.display = "none";
            }

            // Если для элемента контента табов есть соответствующая вкладка:
            if (this.titles[index]) {
                this.title = this.titles[index];
                this.titleID = this.title.getAttribute("id");
                this.title.setAttribute("role", "tab");
                this.title.setAttribute("aria-selected", "false");
                this.title.setAttribute("aria-controls", `${this.panelID}`);
                this.panel.setAttribute("aria-labelledby", `${this.titleID}`);

                // Если индекс вкладки равен "активному" индексу:
                if (index === this.activeIndex) {
                    this.title.setAttribute("aria-selected", "true")
                } else {
                    this.title.setAttribute("tabindex", "-1");
                    this.panel.setAttribute("hidden", "");
                }
                this.currentTitle = this.tabsItem.querySelector("[aria-selected='true']");

                // Если событие "клик" срабатывает на вкладке табов и НЕ в момент переключения табов => вызываем обработчик события "клик":
                this.title.addEventListener("click", function(e) {
                    e.preventDefault();
                    this.activeTitle = e.currentTarget;

                    if (e.currentTarget.getAttribute("aria-selected") === "false") {
                        if (!this.options.animate) {
                            this.handlerTabsAction();
                        } else {
                            !this.tabsItem.classList.contains("tab-change") ? this.handlerTabsAction() : null;
                        }
                    }
                }.bind(this));

                // Событие нажатия клавиш на клавиатуре:
                this.title.addEventListener("keydown", (e) => {
                    this.onKeyDown(e);
                });
            }
        });

        // Если атрибут data-tabs не пустой (табы-споллеры) => обрабатываем данный блок табов:
        Number(this.mediaQueryValue) ? this.initTabsMedia(): null;
    }


    /*=================================================================================*/
    /* Обработчик медиа-запроса для табов-споллеров */
    initTabsMedia() {
        this.mediaQuery = `(max-width: ${this.options.mediaValue / 16}${this.options.unitValue})`;
        this.matchMedia = window.matchMedia(this.mediaQuery);
        
        // Изменение состояния медиа-запроса (брейкпоинт):
        this.matchMedia.addEventListener("change", function() {
            this.changeTabSpoller();
        }.bind(this));
        this.changeTabSpoller();
    }


    /*=================================================================================*/
    /* Переключение табов в споллеры и обратно */
    changeTabSpoller() {
        if (this.matchMedia.matches) {
            this.tabsItem.classList.add("tab-spoller");
            this.tabsItem.querySelector("[data-tabs-titles]").removeAttribute("role");
        } else {
            this.tabsItem.classList.remove("tab-spoller");
            this.tabsItem.querySelector("[data-tabs-titles]").setAttribute("role", "tablist");
        }

        this.panels.forEach((panel, index) => {
            const title = this.titles[index];
            if (this.matchMedia.matches) {
                panel.parentElement.append(title);
                panel.parentElement.append(panel);
                panel.removeAttribute("role");
                title.removeAttribute("role");
            } else {
                this.tabsItem.querySelector("[data-tabs-titles]").append(title);
                panel.setAttribute("role", "tabpanel");
                title.setAttribute("role", "tab");
            }
        });
    }


    /*=================================================================================*/
    /* Обработка события "клик" на кнопке табов */
    handlerTabsAction() {
        if (!this.tabsItem.classList.contains("tab-spoller")) {
            this.titles = Array.from(this.tabsItem.querySelector("[data-tabs-titles]").children);
            this.panels = Array.from(this.tabsItem.querySelector("[data-tabs-body]").children);
        } else {
            this.titles = Array.from(this.tabsItem.querySelectorAll("button"));
            this.panels = Array.from(this.tabsItem.querySelectorAll("[class*='__panel']"));
        }

        // Если "клик" не по "активной" вкладке:
        if (!this.activeTitle.getAttribute("tab-index")) {
            // Блокировка нажатия на вкладку при переключении табов:
            this.tabsItem.classList.add("tab-change");
                setTimeout(() => {
                    this.tabsItem.classList.remove("tab-change");
            }, this.options.speed);

            // Работа с текущими вкладкой табов и блоком контента табов:
            this.currentTitle.setAttribute("aria-selected", "false");
            this.currentTitle.setAttribute("tabindex", "-1");
            !this.tabsItem.classList.contains("tab-spoller") 
                ? this.panels[this.titles.indexOf(this.currentTitle)].setAttribute("hidden", "") 
                : this.currentTitle.nextElementSibling.setAttribute("hidden", "");

            // Работа с "активными" вкладкой табов и блоком контента табов:
            this.activeTitle.setAttribute("aria-selected", "true");
            this.activeTitle.setAttribute("tabindex", "0");
            this.activeTitle.focus();
            !this.tabsItem.classList.contains("tab-spoller")
                ? this.panels[this.titles.indexOf(this.activeTitle)].removeAttribute("hidden") 
                : this.activeTitle.nextElementSibling.removeAttribute("hidden");

            this.currentTitle = this.activeTitle;
            this.switchTabs();
        }
    }


    /*=================================================================================*/
    /* Переключение табов */
    switchTabs() {
        if (this.panels.length > 0) {
            this.panels.forEach((panel, index) => {
                if (this.titles[index]) {
                    if (this.titles[index].getAttribute("aria-selected") === "true") {
                        if (this.options.animate) {
                            !this.tabsItem.classList.contains("tab-spoller") 
                                ? _slideDown(panel, this.options.speed) 
                                : _slideDown(this.titles[index].nextElementSibling, this.options.speed);
                        }
                        location.hash = `tab-${this.itemIndex}-${index}`;
                    } else {
                        if (this.options.animate) {
                            !this.tabsItem.classList.contains("tab-spoller") 
                                ? _slideUp(panel, this.options.speed) 
                                : _slideUp(this.titles[index].nextElementSibling, this.options.speed);
                        }
                    };
                }
            })

            if (document.querySelector(".page-about") && window.innerWidth < 479.98) {
            }
        }
    }



    /*=================================================================================*/
    /* Обработчик нажатия стрелок "влево", "вправо", клавиш "Home" и "End" на клавиатуре */
    onKeyDown(e) {
        if (!this.tabsItem.classList.contains("tab-change") && !this.tabsItem.classList.contains("tab-spoller")) {
            this.currentTab = document.activeElement;
            switch (e.key) {
                case "ArrowLeft":
                    this.moveLeft();
                    break;
                case "ArrowRight":
                    this.moveRight();
                    break;
                case "Home":
                    e.preventDefault();
                    if (this.titles[0].getAttribute("aria-selected") === "false") {
                        this.activeTitle = this.titles[0];
                        this.handlerTabsAction();
                    }
                break;
                    case "End":
                    e.preventDefault();
                    if (this.titles[this.titles.length - 1].getAttribute("aria-selected") === "false") {
                        this.activeTitle = this.titles[this.titles.length - 1];
                        this.handlerTabsAction();
                    }
                break;
            }
        }
    }


    /*=================================================================================*/
    /* Функция переключения табов стрелкой "вперед" на клавиатуре */
    moveLeft() {
        !this.currentTab.previousElementSibling 
            ? this.activeTitle = this.titles[this.titles.length - 1]
            : this.activeTitle = this.currentTab.previousElementSibling;
        this.handlerTabsAction();
    }


    /*=================================================================================*/
    /* Функция переключения табов стрелкой "назад" на клавиатуре */
    moveRight() {
        !this.currentTab.nextElementSibling 
            ? this.activeTitle = this.titles[0]
            : this.activeTitle = this.currentTab.nextElementSibling;
        this.handlerTabsAction();
    }


    /*=================================================================================*/
    /* Получение номера активного таба в строке хэш-адреса и запись его в массив */
    setHash() {
        if (!this.tabsItem.querySelector("[data-line]")) {
            this.hash = location.hash.replace("#", "");
        } else {
            location.hash = "tab-0-0";
            this.hash = location.hash;
        }
        this.activeHashArray = [];
        if (this.hash.startsWith("tab-")) {
            this.activeHashArray = this.hash.replace("tab-", "").split("-");
            return this.activeHashArray;
        }
    }
}



/*==========================================================================================================================================================================*/
/* Запуск конструктора Tabs */
function initTabs() {
    if (document.querySelector(".tabs-premieres")) {
        const tabsPremieres = document.querySelector(".tabs-premieres");
        new Tabs(tabsPremieres, {});
    }
    if (document.querySelector(".tabs-cafe")) {
        const tabsCafe = document.querySelector(".tabs-cafe");
        new Tabs(tabsCafe, {});
    }
    if (document.querySelector(".tabs-about")) {
        const tabsAbout = document.querySelector(".tabs-about");
        new Tabs(tabsAbout, {});
    }
    if (document.querySelector(".tabs-events")) {
        const tabsEvents = document.querySelector(".tabs-events");
        new Tabs(tabsEvents, {});
    }
    if (document.querySelector(".tabs-promotions")) {
        const tabsPromotions = document.querySelector(".tabs-promotions");
        new Tabs(tabsPromotions, {});
    }
    if (document.querySelector(".tabs-about-event")) {
        const tabsAboutEvent = document.querySelector(".tabs-about-event");
        new Tabs(tabsAboutEvent, {});
    }
}
initTabs();



/*==========================================================================================================================================================================*/
/* Quantity */
class Quantity {
    constructor(quantityElement) {
        this.quantity = quantityElement;
        this.quantityForm = this.quantity.closest("[data-form]");
        this.quantityHour = this.quantity.hasAttribute("data-quantity-hour") ? true : null;
        this.quantityMinutes = this.quantity.hasAttribute("data-quantity-minutes") ? true : null;
        this.quantityInput = this.quantity.querySelector("input");
        this.quantityButtonPlus = this.quantity.querySelector("[data-quantity-plus]");
        this.quantityButtonMinus = this.quantity.querySelector("[data-quantity-minus]");
        this.value = this.quantityInput.getAttribute("value");
        this.step = this.quantityInput.getAttribute("data-step") ? this.quantityInput.getAttribute("data-step") : 1;
        this.values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        if (this.quantity.closest(".form--quantity")) {
            this.inputForm = this.quantity.closest(".form--quantity").querySelector("input");
            this.personsStr = "2 взрослых";
        }
        if (!this.quantityHour && !this.quantityMinutes) {
            this.toggleLockButtonMinus();
        }
        this.quantityEvents();
    }


    /*=================================================================================*/
    /* Обработчик событий на элементе quantity */
    quantityEvents() {
        this.quantity.addEventListener("click", function(e) {
            if (e.target.closest(".quantity__button")) {
                e.preventDefault();
                this.changeInputValue(e);
                this.quantity.querySelector("[data-unit]") ? this.changeInputWidth() : null;
            }
        }.bind(this));
        this.quantityInput.addEventListener("input", function(e) {
            if (!this.quantityInput.value && (!this.quantityHour && !this.quantityMinutes)) {
                this.quantityInput.value = 0;
            }

            if (this.quantityInput.value.charAt(0) === "0" && this.quantityInput.value.length > 1) {
                this.quantityInput.value = this.quantityInput.value.replace(/^./, "");
            }

            if (!this.quantityHour && !this.quantityMinutes) {
                this.toggleLockButtonMinus();
            }

            if (lockForm && this.quantity.classList.contains("form__quantity")) {
                if (this.quantityInput.value === "0") {
                    if (validateFormState.persons) {
                        lockForm ? toggleInputError(this.quantity, "persons", true) : validateFormState.persons = false;
                    }
                } else {
                    if (!validateFormState.persons) {
                        lockForm ? toggleInputError(this.quantity, "persons", false) : validateFormState.persons = true;
                    }
                }
            }
            this.quantity.querySelector("[data-unit]") ? this.changeInputWidth() : null;
        }.bind(this));
        this.quantityInput.addEventListener("keypress", function(e) {
            allowNumbersOnly(e);
        }.bind(this));
    }


    /*=================================================================================*/
    /* Функция изменения значения в input */
    changeInputValue(e) {
        if (e.target.closest("[data-quantity-plus]")) {
            if ((this.quantityHour && this.quantityInput.value === "23") 
                || (this.quantityMinutes && this.quantityInput.value === "55")) {
                this.quantityInput.value = "00";
            } else {
                this.quantityInput.value = Number(this.quantityInput.value) + Number(this.step);
            }

            if (this.quantity.classList.contains("form__quantity") && this.quantityInput.classList.contains("null")) {
                lockForm ? toggleInputError(this.quantity, "persons", false) : validateFormState.persons = true;
            }

        } else {
            if ((this.quantityHour || this.quantityMinutes) && this.quantityInput.value === "00") {
                this.quantityHour ? this.quantityInput.value = "23" : this.quantityInput.value = "55";
            } else {
                this.quantityInput.value = Number(this.quantityInput.value) - Number(this.step);
            }

            if (this.quantity.classList.contains("quantity--parent")) {
                if (this.quantityInput.value < 2) this.quantityInput.value = 1;  
            } else {
                if ((this.quantityInput.value < 1) && (!this.quantityHour && !this.quantityMinutes)) {
                    this.quantityInput.value = 0;  
                }   
            }

            if (this.quantity.classList.contains("form__quantity") && this.quantityInput.value === "0") {
                lockForm ? toggleInputError(this.quantity, "persons", true) : validateFormState.persons = false;
            }
        }


        if (this.quantity.closest(".times-rent") && this.values.indexOf(this.quantityInput.value) !== -1) {
            this.quantityInput.value = `0${this.quantityInput.value}`;
        }

        if (!this.quantityHour && !this.quantityMinutes) {
            this.toggleLockButtonMinus();
        }
    }


    /*=================================================================================*/
    /* Функция изменения ширины input */
    changeInputWidth() {
        if (isNotApple) {
            this.quantityInput.style.width = `${this.quantityInput.value.length + 0.5}ex`;
        } else {
            this.quantityInput.style.width = `${this.quantityInput.value.length + 1.5}ex`;
        }
    }


    /*=================================================================================*/
    /* Функция блокировки/разблокировки кнопки "минус" */
    toggleLockButtonMinus() {
        if (this.quantityInput.value === "0") {
            this.quantityInput.classList.add("null");
            this.quantityButtonMinus.classList.add("disabled");
            this.quantityButtonMinus.setAttribute("tabindex", "-1");
        } else {
            this.quantityInput.classList.remove("null");
            this.quantityButtonMinus.classList.remove("disabled");
            this.quantityButtonMinus.setAttribute("tabindex", "0");
        }
    }
}



/*==================================================================================================================================================================*/
/* Функция запрета ввода НЕ числа */
function allowNumbersOnly(e) {
    const code = (e.which) ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
        e.preventDefault();
    }
}



/*=====================================================================================*/
/* Запуск конструктора Quantity */
if (document.querySelector("[data-quantity]")) {
    const quantityElements = document.querySelectorAll("[data-quantity]");
    quantityElements.forEach(quantityElement => {
        const quantity = new Quantity(quantityElement);
    });
}



/*==========================================================================================================================================================================*/
/* Switch */
class CheckboxSwitch {
    constructor(domNode) {
        this.switchNode = domNode;
        this.switchElement = this.switchNode.closest(".switch");
        this.timeout = 600;
        this.switchNode.addEventListener("change", () => this.onChange());
        this.switchNode.addEventListener("focus", () => this.onFocus(event));
        this.switchNode.addEventListener("blur", () => this.onBlur(event));
    }

    onChange() {
        // Блокировка "клика" на элемент во время анимации переключения switch:
        this.switchNode.value === "off" ? this.switchNode.value = "on" : this.switchNode.value = "off";
        this.switchElement.classList.add("lock");
        setTimeout(() => {
            this.switchElement.classList.remove("lock");
        }, this.timeout);
    }

    onFocus(event) {
        event.currentTarget.parentNode.classList.add("focus");
    }

    onBlur(event) {
        event.currentTarget.parentNode.classList.remove("focus");
    }
}


/*=====================================================================================*/
/* Запуск конструктора CheckboxSwitch */
if (document.querySelector("input[type=checkbox][role^=switch]")) {
    Array.from(document.querySelectorAll("input[type=checkbox][role^=switch]")).forEach((element) => new CheckboxSwitch(element));
}



/*==================================================================================================================================================================*/
/* Класс Showmore */
class ShowMore {
    constructor(props, options) {
        // Классы:
        this.showmoreClasses = {
            classShowMoreOpen: "_showmore-open"                                 // Объект "showMore" полностью раскрыт.
        }

        // Аттрибуты:
        this.showmoreAttributes = {
            attributeShowMore: "data-showmore",                                 /* Атрибут объекта "showMore" */
            attributeShowMoreSpeed: "data-showmore-speed",                      // Скорость анимации открытия/скрытия контента "showMore" (мс).
            attributeShowMoreMedia: "data-showmore-media",                      /* Атрибут для медиа-запроса срабатывания функционала "showMore". Имеет три значения:
                                                                                    1. Тип медиа-запроса ("max" - max-width, "min" - min-width).
                                                                                    2. Величина брэйкпоинта медиа-запроса (любое число).
                                                                                    3. Единица измерения брэйкпоинта медиа-запроса (px, rem, em, vw). */
            attributeShowMoreСontent: "data-showmore-content",                  // Атрибут контента объекта "showMore".
            attributeShowMoreButton: "data-showmore-button"                     /* Атрибут кнопки показа/скрытия контента "showMore". Текст внутри атрибута 
                                                                                    присваивается кнопке в "активном" состоянии (открыт весь контент).
                                                                                    Если атрибут пуст, то при открытии всего контента кнопка удаляется. */
        }

        // Опции:
        this.startOptions = {
            type: "items",                                                      // Тип контента: "items" - карточки/элементы; "size" - сплошной контент (текст). 
            visibleContent: 1,                                                  // Начальная видимая высота (для "items" - количество рядов колонок/элементов).
            addHeight: "all",                                                   /* Величина высоты раскрытия контента. Возможные значения:
                                                                                    "all" - контент раскрывается на 100% высоты;
                                                                                    число - количество рядов колонок/элементов. */ 
            columns: 3,                                                         // Количество колонок в рядах (для правильного расчета высот).                                             
            gap: 20,                                                            // Отступ между рядами колонок (для type: "items").
        }
        options ? this.showMoreOptions = {...this.startOptions, ...options} : this.showMoreOptions = this.startOptions; 

        // Проверка props на NodeList:
        if (props instanceof NodeList) {
            props.forEach(showMoreItem => { 
                this.initShowMoreItem(showMoreItem);
            });
        } else {
            this.initShowMoreItem(props);
        }
    }


    /*=========================================================================*/
    /* Инициализация объектов "showMore" */
    initShowMoreItem(showMoreItem) {
        this.showMoreItem = showMoreItem;
        this.showMoreContent = Array.from(this.showMoreItem.querySelectorAll(`[${this.showmoreAttributes.attributeShowMoreСontent}]`)).filter(item => 
            item.closest(`[${this.showmoreAttributes.attributeShowMore}]`) === showMoreItem)[0];
        this.showMoreButton = Array.from(this.showMoreItem.querySelectorAll(`[${this.showmoreAttributes.attributeShowMoreButton}]`)).filter(item => 
            item.closest(`[${this.showmoreAttributes.attributeShowMore}]`) === showMoreItem)[0];
        this.showMoreButtonText = this.showMoreButton.innerHTML;
        this.showMoreSpeed = this.showMoreItem.dataset.showmoreSpeed ? this.showMoreItem.dataset.showmoreSpeed : "500";
        this.heightsArray = this.getArrayHeights();                             // Получение общей высоты контента и начальной видимой высоты.
        this.generalHeight = this.heightsArray.generalHeight;                   // Общая высота контента.
        this.initialHeight = this.heightsArray.initialHeight;                   // Начальная видимая высота.
        this.visibleRows = this.showMoreOptions.visibleContent;                 // Количество рядов открытых колонок/элементов.

        // Если объект "showMore" содержит атрибут "data-showmore-media", то формируем медиа-запрос и ставим слушатель изменения состояния:
        if (this.showMoreItem.dataset.showmoreMedia) {
            const mediaQuery = this.getMediaQuery();
            this.matchMedia = window.matchMedia(mediaQuery);
        }

        // Скрытие/показ объектов "showMore" в зависимости от медиа-условий:
        if (!this.matchMedia || this.matchMedia.matches) {
            if (this.initialHeight < this.generalHeight) {
                _slideUp(this.showMoreContent, 0, this.initialHeight, true);
                this.showMoreButton.hidden = false;
            } else {
                _slideDown(this.showMoreContent, 0, this.initialHeight, 0, true);
                this.showMoreButton.hidden = true;
            }
        } else {
            _slideDown(this.showMoreContent, 0, this.initialHeight, 0, true);
            this.showMoreButton.hidden = true;
        }

        // Обработчик "клика" на кнопке:
        this.showMoreButton.addEventListener("click", this.showMoreActions.bind(this));
    }      
                    

    /*=========================================================================*/
    /* Формирование строки медиа-запроса объекта "showMore" с атрибутом data-showmore-media: */
    getMediaQuery() {
        const breakpoint = {};
        const params = this.showMoreItem.dataset.showmoreMedia;
        const paramsArray = params.split(",");
        breakpoint.type = paramsArray[0] ? paramsArray[0].trim() : "max";
        breakpoint.value = paramsArray[1];
        breakpoint.unit = paramsArray[2];
        let mediaQuery = "(" + breakpoint.type + "-width: " + breakpoint.value + breakpoint.unit + ")";      // Получаем брейкпоинт.
        return mediaQuery;
    }


    /*=========================================================================*/
    /* Обработчик события "клик" на кнопке "Показать еще" */
    showMoreActions() {
        if (!this.showMoreContent.classList.contains("_slide")) {

            // Скрытие контента:
            if (this.showMoreItem.classList.contains("_showmore-open")) {
                _slideUp(this.showMoreContent, this.showMoreSpeed, this.initialHeight, true);
                this.visibleRows = this.showMoreOptions.visibleContent;
                this.showMoreItem.classList.remove("_showmore-open");
                this.showMoreButton.dataset.showmoreButton ? this.showMoreButton.innerHTML = this.showMoreButtonText : null;

            // Раскрытие контента: 
            } else {
                // Если раскрытие на 100% высоты:
                if (this.showMoreOptions.addHeight === "all") {
                    this.showMoreButton.dataset.showmoreButton 
                        ? this.showMoreButton.innerHTML = this.showMoreButton.dataset.showmoreButton 
                        : this.showMoreButton.parentElement.style.display = "none";
                    _slideDown(this.showMoreContent, this.showMoreSpeed, this.initialHeight, 0, true);
                    this.showMoreItem.classList.add("_showmore-open");

                // Если раскрытие неполное: 
                } else {
                    this.visibleHeight = this.showMoreContent.offsetHeight;
                    this.visibleRows += this.showMoreOptions.addHeight;
                    this.addHeight = this.getHeight("add");
                    if ((this.visibleHeight + this.addHeight) >= this.generalHeight) {
                        this.showMoreButton.dataset.showmoreButton 
                            ? this.showMoreButton.innerHTML = this.showMoreButton.dataset.showmoreButton 
                            : this.showMoreButton.parentElement.style.display = "none";
                        _slideDown(this.showMoreContent, this.showMoreSpeed, this.visibleHeight, 0, true) 
                        this.showMoreItem.classList.add("_showmore-open");
                    } else {
                        _slideDown(this.showMoreContent, this.showMoreSpeed, this.visibleHeight, this.addHeight, true);
                    }
                }
            }
        }
    }


    /*=========================================================================*/
    /* Получение высот */
    getArrayHeights() {
        let heightsArray = {};
        heightsArray.generalHeight = this.showMoreContent.offsetHeight;
        this.showMoreType = this.showMoreOptions.type;
        if (this.showMoreType === "size") {
            heightsArray.initialHeight = Number(this.showMoreOptions.visibleContent);
        }
        if (this.showMoreType === "items") {
            const initialHeight = this.getHeight("initial");
            this.showMoreOptions.visibleContent === 1
                ? heightsArray.initialHeight = initialHeight
                : heightsArray.initialHeight = initialHeight + (this.showMoreOptions.gap * (this.showMoreOptions.visibleContent - 1));
        }
        return heightsArray;
    }


    /*=========================================================================*/
    /* Получение передавемого типа высоты */
    getHeight(typeValue) {
        let valueHeight = 0;
        const showMoreColumns = this.showMoreContent.querySelectorAll(".showmore__column");

        if (showMoreColumns) {
            // Получение начальной видимой высоты:
            if (typeValue === "initial") {
                if (this.showMoreOptions.visibleContent === 1) {
                    valueHeight = this.showMoreContent.children[0] ? this.showMoreContent.children[0].offsetHeight : null;
                } else {
                    for (let index = 0; index < showMoreColumns.length; index++) {
                        let columnIndex = (index + this.showMoreOptions.columns) / this.showMoreOptions.columns;
                        if (Number.isInteger(columnIndex) && columnIndex <= this.showMoreOptions.visibleContent) {
                            const showMoreColumn = showMoreColumns[index];
                            valueHeight += showMoreColumn.offsetHeight;
                        }
                    }
                }
            }

            // Получение начальной видимой высоты:
            if (typeValue === "add") {
                if (this.showMoreOptions.addHeight === 1) {
                    valueHeight = this.showMoreContent.children[(this.visibleRows - 1) * this.showMoreOptions.columns] 
                        ? this.showMoreContent.children[(this.visibleRows - 1) * this.showMoreOptions.columns].offsetHeight + this.showMoreOptions.gap
                        : null;
                } else {
                    for (let index = 0; index < showMoreColumns.length; index++) {
                        if (index >= ((this.visibleRows - this.showMoreOptions.addHeight) * this.showMoreOptions.columns)
                                && index < (this.visibleRows * this.showMoreOptions.columns)) {
                            let columnIndex = (index + this.showMoreOptions.columns) / this.showMoreOptions.columns;
                            if (Number.isInteger(columnIndex) && columnIndex <= this.visibleRows) {
                                const showMoreColumn = showMoreColumns[index];
                                valueHeight += (showMoreColumn.offsetHeight + this.showMoreOptions.gap);
                            }
                        }
                    }
                }
            }
        }
        return valueHeight;
    }
}



/*==================================================================================================================================================================*/
// Запуск конструктора Showmore */
function initShowmore() {
    // Showmore. Info Film:
    if (document.querySelector(".page-film .info-film") && window.innerWidth < 580) {
        new ShowMore(document.querySelector(".info-film"), {
            type: "size",
            visibleContent: 158,
        });
    }
    // Showmore. Text:
    if (document.querySelector(".info-event") && window.innerWidth < 580) {
        new ShowMore(document.querySelector(".info-event"), {
            type: "size",
            visibleContent: 140,
        });
    }
}
document.addEventListener("DOMContentLoaded", function() {
    initShowmore();
})


// Переинициализация объектов при изменении ориентации экрана:
window.addEventListener("orientationchange", initShowmore);



/*==================================================================================================================================================================*/
/* Vanilla Calendar */
if (document.querySelector("#vanilla-calendar")) {
    calendarInit();
}

function calendarInit() {
    const calendarBlock = document.querySelector(".calendar");
    const calendarElem = document.querySelector("#vanilla-calendar");
    const inputCalendar = calendarBlock.querySelector("input");
    const inputCalendarLabel = calendarBlock.querySelector(".input-label-text");
    const inputCalendarTextElem = calendarBlock.querySelector(".input-text");
    const inputCalendarText = inputCalendarTextElem.querySelector("span");
    const inputCalendarError = calendarBlock.querySelector("span.error");
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    inputCalendar.addEventListener("click", function(e) {
        toggleFormElem(calendarBlock);
    })

    const calendarDate = new VanillaCalendar(calendarElem, {
        settings: {
            lang: "ru",
            range: {
                disablePast: true,
            },
        },
        actions: {
            clickDay(event, self) {
                let numsArray = self.selectedDates[0].split("-");
                let selectedMonth = months[Number(numsArray[1]) - 1];
                let dateStr = `${numsArray[2]} ${selectedMonth}`;
                setValueInput(inputCalendar, inputCalendarText, dateStr);
                !validateFormState.date ? toggleInputError(calendarBlock, "date", false) : null;
                closeElement(calendarBlock, inputCalendarLabel, inputCalendarTextElem, inputCalendarError);
            },
        },
    });
    calendarDate.init();
}



/*==================================================================================================================================================================*/
/* Rent Time Quantity */
if (document.querySelector(".time-quantity")) {
    const timeQuantity = document.querySelector(".time-quantity");
    const timeInput = timeQuantity.querySelector("input");
    const timeLabel = timeQuantity.querySelector(".input-label-text");
    const timeBlock = timeQuantity.querySelector(".times-rent");
    const timeButton = timeQuantity.querySelector(".times-rent__button");
    const timeTextElem = timeQuantity.querySelector(".input-text");
    const timeText = timeTextElem.querySelector("span");
    const timeErrorElem = timeQuantity.querySelector("span.error");
    let timesArray = [];

    timeInput.addEventListener("click", function(e) {
        toggleFormElem(timeQuantity);
    })

    timeButton.addEventListener("click", function(e) {
        timesArray = [];
        const timeQuantityInputs = timeBlock.querySelectorAll("input");
        timeQuantityInputs.forEach(timeQuantityInput => {
            const timeValue = timeQuantityInput.value;
            timesArray.push(timeValue);
        });
        let timeStr = `${timesArray[0]}:${timesArray[1]}`;
        setValueInput(timeInput, timeText, timeStr);
        !validateFormState.time ? toggleInputError(timeQuantity, "time", false) : null;
        closeElement(timeQuantity, timeLabel, timeTextElem, timeErrorElem);
        if (window.innerWidth < 479.98) document.body.classList.remove("_lock");
    });
}



/*==================================================================================================================================================================*/
/* Rent Duration */
if (document.querySelector(".duration")) {
    const durationBlock = document.querySelector(".duration");
    const durationInput = durationBlock.querySelector("input");
    const durationVariantsBlock = durationBlock.querySelector(".duration-rent");
    const durationVariants = durationVariantsBlock.querySelectorAll("input");
    const durationLabel = durationBlock.querySelector(".input-label-text");
    const durationButton = durationBlock.querySelector(".duration-rent__button");
    const durationTextElem = durationBlock.querySelector(".input-text");
    const durationText = durationTextElem.querySelector("span");
    const durationErrorElem = durationBlock.querySelector("span.error");
    let activeRadioDuration;

    durationInput.addEventListener("click", function(e) {
        toggleFormElem(durationBlock);
    });

    if (window.innerWidth > 479.98) {
        durationVariants.forEach(durationVariant => {
            durationVariant.addEventListener("change", function(e) {
                if (e.target !== activeRadioDuration) {
                    const durationArray = durationVariant.value.split(" ");
                    let durationStr = `${durationArray[0]} ч.`;
                    setValueInput(durationInput, durationText, durationStr);
                    !validateFormState.duration ? toggleInputError(durationBlock, "duration", false) : null;
                    closeElement(durationBlock, durationLabel, durationTextElem, durationErrorElem);
                }
                activeRadioDuration = e.target;
            });
        });
    } else {
        durationButton.addEventListener("click", function(e) {
            activeRadioDuration = durationVariantsBlock.querySelector("input:checked");
            if (activeRadioDuration) {
                const durationArray = activeRadioDuration.value.split(" ");
                let durationStr = `${durationArray[0]} ч.`;
                setValueInput(durationInput, durationText, durationStr);
                !validateFormState.duration ? toggleInputError(durationBlock, "duration", false) : null;
                closeElement(durationBlock, durationLabel, durationTextElem, durationErrorElem);
                document.body.classList.remove("_lock");
            }
        });
    }
}



/*==================================================================================================================================================================*/
/* Rent Promocode */
if (document.querySelector(".form__promocode")) {
    const promocodeBlock = document.querySelector(".form__promocode");
    const promocodeInput = promocodeBlock.querySelector("input");
    const promocodeClearButton = promocodeBlock.querySelector("[data-clear-promocode]");
    const promocodeFormElem = promocodeBlock.querySelector(".promocode-rent");
    const promocodeFormInput = promocodeFormElem.querySelector("input");
    const promocodeFormButton = promocodeFormElem.querySelector(".button");
    const promocodeErrorElem = promocodeFormElem.querySelector("span.error");

    if (window.innerWidth < 479.98) {
        promocodeInput.setAttribute("readonly", "");
        promocodeInput.addEventListener("click", function(e) {
            toggleFormElem(promocodeBlock);
        });

        promocodeFormButton.addEventListener("click", function(e) {
            const promocodeValue = promocodeFormInput.value;
            if (promocodes.indexOf(promocodeValue) === -1) {
                promocodeFormInput.closest(".form__input").classList.add("input-error");
                promocodeErrorElem.removeAttribute("hidden");
            } else {
                const formInputElem = promocodeFormInput.closest(".form__input");
                promocodeInput.value = promocodeValue;
                promocodeBlock.classList.add("active");
                formInputElem.classList.remove("input-error");
                promocodeErrorElem.setAttribute("hidden", "");
                promocodeBlock.classList.remove("open");
                document.body.classList.remove("_lock");
            }
        });

        promocodeClearButton.addEventListener("click", function(e) {
            promocodeBlock.classList.remove("active");
            promocodeInput.value = "";
            promocodeFormInput.value = "";
        });
    } 
}



/*==================================================================================================================================================================*/
/* Функции открытия/закрытия элементов формы "Аренда" */
function handleClickInput(element) {
    const openElements = document.querySelectorAll(".form .open");
    closeElements(openElements);
    openElement(element);
}


function openElement(element) {
    element.classList.contains("open") 
        ? element.classList.remove("open") 
        : element.classList.add("open");
}


function closeElements(openElements) {
    openElements.forEach(element => {
        element.classList.remove("open");
    });
}


function closeElement(block, inputLabel, textElem, errorElem) {
    block.classList.remove("open");
    block.classList.remove("input-error");
    inputLabel.classList.add("hide");
    textElem.removeAttribute("hidden");
    errorElem.setAttribute("hidden", "");
    if (window.innerWidth < 479.98) {
        setTimeout(() => {
            document.querySelector(".footer").classList.remove("hide");
        }, 400);
    }
}


function setValueInput(input, inputText, str) {
    console.log(validateFormState);
    console.log("formError:" + formError);
    input.value = str;
    inputText.innerText = str;
}



/*==========================================================================================================================================================================*/
/* Переключение состояния чекбокса Agreement */
if (document.querySelector("[data-agreement]")) {
    const checkboxAgreement = document.querySelector("[data-agreement]");
    checkboxAgreement.addEventListener("click", function() {
        if (checkboxAgreement.checked) {
            if (document.querySelector(".page-vacancies")) {
                toggleInputError(checkboxAgreement, "agreement", false);
            } else {
                lockForm ? toggleInputError(checkboxAgreement, "agreement", false) : validateFormState.agreement = true;
            }
        } else {
            if (document.querySelector(".page-vacancies")) {
                toggleInputError(checkboxAgreement, "agreement", true);
            } else {
                lockForm ? toggleInputError(checkboxAgreement, "agreement", true) : validateFormState.agreement = false;
            }
        }
        // console.log(validateFormState);
        // console.log("formError:" + formError);
    });
}



/*==========================================================================================================================================================================*/
/* Фокус на input */
function focusInput() {
    if (document.querySelector(".form__inputs input") 
        || document.querySelector(".form__promocode input")
        || document.querySelector(".input-subscribe input")) {
        let inputs = document.querySelectorAll(".form__inputs input, .form__promocode input, .input-subscribe input");
        inputs.forEach(input => {
            input.addEventListener("focus", function() {
                input.parentElement.classList.add("input-focus");
            });
            input.addEventListener("blur", function(e) {
                setTimeout(() => {
                    if (!e.target.value) {
                        input.parentElement.classList.remove("input-focus");
                    }
                }, 100);
            });
        });
    }
}
focusInput();



/*==========================================================================================================================================================================*/
/* Закрытие окна "ошибки" */
if (document.querySelector("[data-close]")) {
    const closeButtons = document.querySelectorAll("[data-close]");
    closeButtons.forEach(closeButton => {
        closeButton.addEventListener("click", function(e) {
            closeButton.parentElement.setAttribute("hidden", "");
        });
    });
}



/*==========================================================================================================================================================================*/
/* Очистка input даты, времени и продолжительности */
if (document.querySelector("[data-clear]")) {
    const clearButtons = document.querySelectorAll("[data-clear]");
    clearButtons.forEach(clearButton => {
        clearButton.addEventListener("click", function(e) {
            const formElem = clearButton.closest("[data-error]");
            const currentInput = formElem.querySelector("input");
            currentInput.value = "";

            if (!clearButton.closest(".input-subscribe")) {
                const inputLabel = formElem.querySelector(".input-label-text");
                const inputName = currentInput.getAttribute("name").replace("form-halls-", "");
                inputLabel.classList.remove("hide");
                toggleInputError(formElem, inputName, true);
                if (lockForm && clearButton.closest(".form__quantity")) {
                    calcError(clearButton.closest(".form__quantity"));
                }
            }
            
            clearButton.parentElement.setAttribute("hidden", "");

            if (clearButton.closest(".calendar")) {
                const selectedDateButton = document.querySelector(".vanilla-calendar .vanilla-calendar-day__btn_selected");
                selectedDateButton.classList.remove("vanilla-calendar-day__btn_selected");
            }

            if (clearButton.closest(".duration")) {
                const activeRadioButton = document.querySelector(".duration-rent input:checked");
                activeRadioButton.checked = false;
            }
        });
    });
}


/*==========================================================================================================================================================================*/
/* Закрытие всплывающих окон формы */
if (document.querySelector("[data-close-elem]") && window.innerWidth < 479.98) {
    const closeButtons = document.querySelectorAll("[data-close-elem]");
    closeButtons.forEach(closeButton => {
        const formElem = closeButton.closest("[data-error]");
        closeButton.addEventListener("click", function(e) {
            formElem.classList.remove("open");
            document.body.classList.remove("_lock");

            if (window.innerWidth < 479.98) {
                setTimeout(() => {
                    document.querySelector(".footer").classList.remove("hide");
                }, 400);
            }
        });
    });
}



/*==========================================================================================================================================================================*/
/* Маска для телефона */
if (document.querySelector("input[type='tel']")) {
    let phoneInputs = document.querySelectorAll("input[type='tel']");

    let getInputNumbersValue = function (input) {
        return input.value.replace(/\D/g, "");
    }

    function onPhonePaste(e) {
        let input = e.target;
        let inputNumbersValue = getInputNumbersValue(input);
        let pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            let pastedText = pasted.getData("Text");
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    function onPhoneInput(e) {
        let input = e.target;
        let inputNumbersValue = getInputNumbersValue(input);
        let selectionStart = input.selectionStart;
        let formattedInputValue = "";
        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8"].indexOf(inputNumbersValue[0]) > -1) {
            let firstSymbols = (inputNumbersValue[0] == "8") ? "+8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = "";
        }
        input.value = formattedInputValue;
    }

    function onPhoneKeyDown(e) {
        let inputValue = e.target.value.replace(/\D/g, "");
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }

    for (let phoneInput of phoneInputs) {
        phoneInput.addEventListener("keydown", function(e) {
            onPhoneKeyDown(e);
        });
        phoneInput.addEventListener("input", function(e) {
            onPhoneInput(e);
        });
        phoneInput.addEventListener("paste", function(e) {
            onPhonePaste(e);
        });
    }
}



/*==========================================================================================================================================================================*/
/* Обработка ввода текста в textarea */
if (document.querySelector("textarea")) {
    const textareaElements = document.querySelectorAll("textarea");
    textareaElements.forEach(textarea => {
        const textareaMaxLength = textarea.getAttribute("maxlength");
        const textareaRemainder = textarea.closest(".form__item").querySelector(".form__remainder span");
        textarea.addEventListener("input", function() {
            textareaRemainder.innerHTML = `${textareaMaxLength - textarea.value.length}`;
        })
    });
}



/*==========================================================================================================================================================================*/
/* Обработка ввода текста в input */
if (document.querySelector("[data-inputs]")) {
    const formInputs = document.querySelector("[data-inputs]");

    // Input Name:
    const inputName = formInputs.querySelector("[data-name]");
    inputName.addEventListener("input", function() {
        if ((!inputName.value || inputName.value.trim().length < 2))  {
            if (lockForm) {
                if (document.querySelector(".page-vacancies")) {
                    if (validateFormState.name && (validateFormState.name !== null)) {
                        addError(inputName);
                        toggleInputError(formInputs, "name", true);
                    }
                } else {
                    if (validateFormState.name) {
                        addError(inputName);
                        toggleInputError(formInputs, "name", true);
                    }
                }
            } else {
                validateFormState.name = false;
            }
            
        } else {
            if (lockForm) {
                removeError(inputName);
                !validateFormState.name ? toggleInputError(formInputs, "name", false) : null;
            } else {
                validateFormState.name = true;
            }
        }
    })

    // Input Mail:
    const inputMail = formInputs.querySelector("[data-mail]");
    inputMail.addEventListener("input", function() {
        if (testEmail(inputMail)) {
            if (lockForm) {
                if (document.querySelector(".page-vacancies")) {
                    if (validateFormState.mail && (validateFormState.mail !== null)) {
                        addError(inputMail);
                        toggleInputError(formInputs, "mail", true);
                    }
                } else {
                    if (validateFormState.mail) {
                        addError(inputMail);
                        toggleInputError(formInputs, "mail", true);
                    } 
                }
            } else {
                validateFormState.mail = false;
            }
        } else {
            if (lockForm) {
                removeError(inputMail);
                !validateFormState.mail ? toggleInputError(formInputs, "mail", false) : null;
            } else {
                validateFormState.mail = true;
            }
        }
    })

    // Input Phone:
    const inputPhone = formInputs.querySelector("[type='tel']");
    inputPhone.addEventListener("input", function() {
        if (inputPhone.value.trim().length !== 18) {
            if (lockForm) {
                if (document.querySelector(".page-vacancies")) {
                    if (validateFormState.phone && (validateFormState.phone !== null)) {
                        addError(inputPhone);
                        toggleInputError(formInputs, "phone", true);
                    }
                } else {
                    if (validateFormState.phone) {
                        addError(inputPhone);
                        toggleInputError(formInputs, "phone", true);
                    }
                }
            } else {
                validateFormState.phone = false;
            }

        } else {
            if (lockForm) {
                removeError(inputPhone);
                !validateFormState.phone ? toggleInputError(formInputs, "phone", false) : null;
            } else {
                validateFormState.phone = true;
            }
        }
    })
}



/*==========================================================================================================================================================================*/
/* Функция открытия/закрытия элементов формы */
function toggleFormElem(elem) {
    if (!elem.classList.contains("open")) {
        const openElements = document.querySelectorAll(".open");
        removeClassNames(openElements, "open");
        elem.classList.add("open");
        if (window.innerWidth < 479.98) {
            document.querySelector(".footer").classList.add("hide");
        }
        if (!elem.classList.contains("calendar") && window.innerWidth < 479.98) {
            document.body.classList.add("_lock");
        }
    } else {
        elem.classList.remove("open");
        setTimeout(() => {
            document.querySelector(".footer").classList.remove("hide");
        }, 400);
        if (!elem.classList.contains("calendar") && window.innerWidth < 479.98) {
            document.body.classList.remove("_lock");
        }
    }
}



/*==========================================================================================================================================================================*/
/* Функция переключения состояния ошибки */
function toggleInputError(formElem, property, addError = true) {
    const form = formElem.closest("[data-form]");
    if (addError) {
        formError++;            
        validateFormState[property] = false;

        if (!formElem.hasAttribute("data-inputs") && !document.querySelector(".page-vacancies")) {
            formElem.classList.add("input-error");
            !formElem.hasAttribute("type") ? formElem.querySelector(".error").removeAttribute("hidden", "") : null;
        }

    } else {
        formError--;
        validateFormState[property] = true;

        if (!formElem.hasAttribute("data-inputs") && !document.querySelector(".page-vacancies")) {
            formElem.classList.remove("input-error");
            !formElem.hasAttribute("type") ? formElem.querySelector(".error").setAttribute("hidden", "") : null;
        }

        if (lockForm) {
            formError === 0 ? form.classList.remove("lock") : form.classList.add("lock");
        }
    }
    console.log(validateFormState);
    console.log(form);
    console.log("formError:" + formError);
}



/*==========================================================================================================================================================================*/
/* "Активная" валидация формы подписки */
function validateSubscribeForm(form) {
    const inputSubscribeBlock = form.querySelector(".input-subscribe");
    const inputSubscribe = inputSubscribeBlock.querySelector("input");
    inputSubscribe.addEventListener("input", function(e) {
        if (!testEmail(inputSubscribe)) {
            form.classList.remove("lock");
            inputSubscribeBlock.classList.remove("input-error");
        } else {
            form.classList.add("lock");
            inputSubscribeBlock.classList.add("input-error");
        }
    });
}



/*==========================================================================================================================================================================*/
/* Отправка формы */
function handleForm() {
    const forms = document.querySelectorAll("[data-form]");
    for (let i = 0; i < forms.length; i++) {
        let form = forms[i];
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            e.submitter.hasAttribute("data-popup-open") ? sendForm(form, true) : sendForm(form);
        });
    } 
    
    
    // Функция проверки и обработки результатов валидации формы:
    async function sendForm(form, popup = false) {
        validateForm(form);
        let formData = new FormData(form);

        // Работа с формой:
        if (form.classList.contains("rent-hall__form")) {
            formData.delete("form-halls-hour");
            formData.delete("form-halls-minute"); 
            formData.delete("form-halls-promocode-input"); 
        }

        // Если форма заполнена правильно:
        if (error === 0) {
            
            // Перебор объекта формы:
            for (const data of formData) {
                console.log(data);
            }

            let response = await fetch("form.php", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                let result = await response.json();

                const validElements = form.querySelectorAll(".input-valid, .active");
                validElements.forEach(validElement => {
                    validElement.classList.remove("input-valid");
                    validElement.classList.remove("active");
                });
    
                if (form.querySelector("[name='form-halls-quantity']")) {
                    const formQuantityInput = form.querySelector("[name='form-halls-quantity']");
                    const buttonMinus = formQuantityInput.closest(".quantity").querySelector("[data-quantity-minus]");
                    formQuantityInput.classList.add("null");
                    buttonMinus.classList.add("disabled");
                }
    
                if (form.querySelector(".input-label-text")) {
                    const textLabels = form.querySelectorAll(".input-label-text");
                    textLabels.forEach(textLabel => {
                        textLabel.classList.remove("hide");
                    });
                }
    
                if (form.querySelector(".input-text")) {
                    const inputTexts = form.querySelectorAll(".input-text");
                    inputTexts.forEach(inputText => {
                        inputText.setAttribute("hidden", "");
                    });
                }
    
                form.reset();
                form.classList.add("lock");
                lockForm = true;
                document.querySelector(".page-vacancies") ? formError = 5 : formError = 8;
    
                for (const key in validateFormState) {
                    validateFormState[key] = false;
                }
    
                // Открытие попапа сообщения:
                if (popup) {
                    popupMessage.classList.add("popup-open");
                    popupMessage.setAttribute("aria-hidden", "false");
                    toggleLockBody(false, fixedElements, 500);
                    document.body.classList.add("open-popup");
                }    
                
                // Показ уведомления об успешной подписке:
                if (form.querySelector(".success")) {
                    let messageElem = form.querySelector(".success");
                    messageElem.removeAttribute("hidden");
                }


            } else {
                alert("Ошибка отправки");
            }
        } else {
            if (form.classList.contains("rent-hall__form") && !lockForm) {
                formError = error;
                lockForm = true;
                form.classList.add("lock");
            }
            if (form.classList.contains("subscribe-form")) {
                form.classList.add("lock");
                validateSubscribeForm(form);
            }
        }
    }                
}
handleForm();



/*==========================================================================================================================================================================*/
/* Валидация формы */
// Функция валидации формы:
function validateForm(form) {
    error = 0;
    const inputsRequired = form.querySelectorAll("[data-required]");
    const errorItems = form.querySelectorAll(".input-error");
    const errorElements = form.querySelectorAll(".error");
    removeErrors(errorItems);
    errorElements && hideErrorElements(errorElements);
    for (let index = 0; index < inputsRequired.length; index++) {
        const input = inputsRequired[index];
        if (input.hasAttribute("data-mail") && testEmail(input)) {
            addError(input);
        } else if (input.getAttribute("type") === "tel" && input.value.trim().length !== 18) {
            addError(input);
        } else if (input.getAttribute("type") === "number" && (input.value.trim() === "" || input.value.trim() === "0")) {
            addError(input);
        } else if (input.getAttribute("type") === "text" && !input.closest(".form__promocode")) {
            if (input.hasAttribute("data-name")) {
                input.value.trim().length < 2 ? addError(input) : null;
            } else {
                (!input.value || input.value === "0") ? addError(input) : null;
            }
        } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
            addError(input);
        } else if (input.closest(".form__promocode")) {
            if (input.value) {
                promocodes.indexOf(input.value) === -1 ? addError(input) : input.closest(".form__promocode").classList.add("active");
            }
        } else if (input.getAttribute("type") === "file" && input.value === "") {
            addError(input);
        } else if (input.hasAttribute("data-date") && testDate(input)) {
            addError(input);
        }
    }
}
            
            
// Функция добавления полю ввода и его родителю класса "input-error" (ошибка):
function addError(input) {
    error++;
    if (input.closest("[data-inputs]") || input.closest(".input-file")) {
        let inputParent = input.closest(".form__input");
        inputParent.classList.remove("input-valid");
        inputParent.classList.add("input-error");
    }

    if (input.closest("[data-error]")) {
        if (!input.closest(".vacancies-main__form")) {
            let inputElem = input.closest("[data-error]");
            inputElem.classList.remove("input-valid");
            inputElem.classList.add("input-error");
            input.hasAttribute("data-error-message") ? showErrorElement(input) : null;
        }
    } else {
        input.classList.remove("input-valid");
        input.classList.add("input-error");
    }
}


// Функция удаления у поля ввода и его родителя класса "input-error" (ошибка):
function removeError(input) {
    let inputParent = input.closest(".form__input");
    inputParent.classList.remove("input-error");
    inputParent.classList.add("input-valid");

    if (!input.closest(".vacancies-main__form")) {
        let inputBlock = input.closest(".form__inputs");
        if (!inputBlock.querySelector(".input-error")) {
            inputBlock.classList.remove("input-error");
            inputBlock.querySelector(".error").setAttribute("hidden", "");
        }
    }
}
        
            
// Функция удаления у поля ввода и его родителя класса "input-error" (ошибка):
function removeErrors(errorItems) {
    errorItems.forEach(errorItem => {
        errorItem.classList.remove("input-error");
    });
}


function showErrorElement(input) {
    const inputParent = input.closest("[data-error]");
    if (inputParent) inputParent.querySelector(".error").removeAttribute("hidden");
}


// Функция скрытия сообщений об ошибке валидации:
function hideErrorElements(errorElements) {
    errorElements.forEach(errorElement => {
        errorElement.setAttribute("hidden", "");
    });
}


// Функция проверки email-адреса:
function testEmail(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}


// Функция проверки даты:
function testDate(input) {
    return !/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(input.value);
}



/*==================================================================================================================================================================*/
/* Прикрепление к форме фотографии */	
if (document.querySelector(".input-file")) {
    const inputFileElements = document.querySelectorAll(".input-file");
    inputFileElements.forEach(inputFileElement => {
        const inputFile = inputFileElement.querySelector("input");
        const inputText = inputFileElement.querySelector("label");
        inputFile.addEventListener("change", () => {
            uploadFile(inputFile, inputText);
            removeError(inputFile);
            !validateFormState.document ? toggleInputError(inputFileElement, "document", false) : null;
        });

        // "Клик" по кнопке "удалить файл" в форме-резюме:
        if (inputFileElement.querySelector(".input-cart")) {
            const inputCart = inputFileElement.querySelector(".input-cart");
            inputCart.addEventListener("click", function(e) {
                inputFile.value = "";
                inputText.innerText = "Прикрепите свое резюме";
                addError(inputFile);
                validateFormState.document ? toggleInputError(inputFileElement, "document", true) : null;
            });
        }
    });
}


// Функция проверки выбранного пользователем файла:
function uploadFile(inputFile, inputText) {
    const file = inputFile.files[0];
    if (!["application/msword", "application/rtf", "application/pdf", "text/plain"].includes(file.type)) {
        alert("Недопустимый формат файла");
        inputFile.value = "";
        return;																				
    }
    if (file.size > 5 * 1024 * 1024) {
        alert("Файл должен быть менее 5 МБ");
        inputFile.value = "";
        return;																				
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        inputText.innerHTML = file.name;
        const inputFileElem = inputText.closest(".input-file");
        inputFileElem.classList.add("active");
    };
    reader.onerror = function (e) {
        alert("Ошибка загрузки файла");
    };
    reader.readAsDataURL(file);
};



/*==========================================================================================================================================================================*/
/* Полифилы */
(function () {
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (css) {
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();


(function () {
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;
    }
})();
