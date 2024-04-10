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
let bodyScrollBar;                                                                  // Скроллер на десктопах.
let scrollBar = {};                                                                 // Элемент скроллера.	
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
if (document.querySelector(".rent-hall") && window.innerWidth < 479.98) {
    getHeightElements();
}

function getHeightElements() {
    const timeBlock = document.querySelector(".times-rent");
    timeBlock.style.setProperty("--height", `${timeBlock.offsetHeight / 16}rem`);
}



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
    
    if (targetElement.closest(".dragging")) {
        e.preventDefault();
        return false;
    }

    if (document.querySelector(".open") && !targetElement.closest(".open")) {
        const openElements = document.querySelectorAll(".open");
        removeClassNames(openElements, "open");
        document.body.classList.remove("_lock");
    }
};



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



/*==========================================================================================================================================================================*/
/* Событие смены ориентации окна */
window.addEventListener("orientationchange", function() {
    // Вычисление высот элементов формы "Аренда":
    if (document.querySelector(".rent-hall") && window.innerWidth < 479.98) {
        getHeightElements();
    }
})



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
    // if (window.innerWidth < 479.98) {
    //     setTimeout(() => {
    //         document.querySelector(".footer").classList.remove("hide");
    //     }, 400);
    // }
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

            // if (window.innerWidth < 479.98) {
            //     setTimeout(() => {
            //         document.querySelector(".footer").classList.remove("hide");
            //     }, 400);
            // }
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
        // if (window.innerWidth < 479.98) {
        //     document.querySelector(".footer").classList.add("hide");
        // }
        if (!elem.classList.contains("calendar") && window.innerWidth < 479.98) {
            document.body.classList.add("_lock");
        }
    } else {
        elem.classList.remove("open");
        // setTimeout(() => {
        //     document.querySelector(".footer").classList.remove("hide");
        // }, 400);
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