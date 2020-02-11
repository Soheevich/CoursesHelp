'use strict';

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var MAX_PRICE = 0;
var MIN_PRICE = 1000000;

var MIN_MAP_HIGHT = 130;
var MAX_MAP_HIGHT = 630;
var mapWidth = document.querySelector('.map__overlay').offsetWidth;

var MAX_ARRAY_LENGTH_OF_PINS = 8;

var PIN_HEIGHT = 50;
var PIN_WIDTH = 70;

var MAIN_PIN_HEIGHT = 156;
var MAIN_PIN_WIDTH = 156;


// Возвращает рандомное число в диапазоне между параметрами min и max включительно.
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Возвращает один рандомный элемент из переданного массива.
var getRandomFromArray = function (array) {
    var randomIndex = getRandomNumber(0, array.length - 1);
    return array[randomIndex];
};


// Возвращает массив случайной длинны от 1 до длинны массива включительно.
var getRandomArrayFromArray = function (array) {
    var maxLength = getRandomNumber(1, array.length + 1);
    return array.slice(0, maxLength);
};


// Создаёт массив переданной длинны из объекта объявления.
var getAdsArray = function () {
    var adsArray = [];
    for (var i = 0; i < MAX_ARRAY_LENGTH_OF_PINS; i++) {
        var ad = createAd(i);
        adsArray.push(ad);
    }
    return adsArray;
};

// Создаёт объект объявление с переданным индексом
var createAd = function (i) {
    var locationX = getRandomNumber(0, mapWidth);
    var locationY = getRandomNumber(MIN_MAP_HIGHT, MAX_MAP_HIGHT);

    return {
        author: {
            'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },

        offer: {
            'title': 'string',
            'address': locationX + ', ' + locationY,
            'price': getRandomNumber(MIN_PRICE, MAX_PRICE),
            'type': getRandomFromArray(TYPE),
            'rooms': getRandomNumber(1, 5),
            'guests': getRandomNumber(1, 5),
            'checkin': getRandomFromArray(CHECKINS),
            'checkout': getRandomFromArray(CHECKOUTS),
            'features': getRandomArrayFromArray(FEATURES),
            'description': 'строка с описанием',
            'photos': getRandomArrayFromArray(PHOTOS),
        },

        location: {
            x: locationX,
            y: locationY
        }
    };
};

// Отрисовывает во фрагменте сгенерированные DOM элементы в блок .map__pin
var renderPins = function () {
    var map = document.querySelector('.map');

    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var pinListElement = document.querySelector('.map__pins');

    // создаём фрагмент куда будем записывать объявления
    var fragment = document.createDocumentFragment();

    // копируем по ссылке массив объявлений
    var ads = getAdsArray();

    // Клонируем темплейт объявления
    for (var i = 0; i < ads.length; i++) {
        var pinElement = template.cloneNode(true);
        var ad = ads[i];
        pinElement.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
        pinElement.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
        pinElement.querySelector('img').src = ad.author.avatar;
        pinElement.querySelector('img').alt = ad.offer.title;

        // Записываем объявления во фрагмент
        fragment.appendChild(pinElement);
    }

    // Вставляем фрагмент в .map__pins
    pinListElement.appendChild(fragment);

    // Показывает карту
    map.classList.remove('map--faded');
};


// Новое задание /////////////////////////////////////////////////////////////////

// 1) Неактивное состояние.
var fieldsets = document.querySelectorAll('fieldset');
var mapFilters = document.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var map = document.querySelector('.map');

var addFormDisabled = function () {
    for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].setAttribute('disabled', 'disabled');
    }
};

var addMapDisabled = function () {
    for (var i = 0; i < mapFilters.length; i++) {
        mapFilters[i].setAttribute('disabled', 'disabled');
    }
};

var mapPinMain = document.querySelector('.map__pin--main');
var addressInput = document.querySelector('#address');

// Блокирует формы
var disactivateMap = function () {
    addFormDisabled();
    addMapDisabled();
    setInitialAddress(mapPinMain);
};

// отдельный файл///////////////////////////////////////////////////////////////
// 2) Переводит страницу в активный режим.
var removeFormDisabled = function () {
    for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].disabled = false;
    }
};

var removeMapDisabled = function () {
    for (var i = 0; i < mapFilters.length; i++) {
        mapFilters[i].disabled = false;
    }
};


var removeDisabled = function () {
    adForm.classList.remove('ad-form--disabled');
    map.classList.remove('map--faded');
    removeFormDisabled();
    removeMapDisabled();
};


var activateMap = function () {
    removeDisabled();
    renderPins(); // Метки генерируются каждый раз при нажатии на булавку!!
};

disactivateMap();

// 3) Заполнение поля адреса при mousedown на mapPinMain
// Формат значения поля адреса: {{x}}, {{y}}, где {{x}} и {{y}} это координаты,
// на которые метка указывает своим острым концом. Например, если метка .map__pin--main
// имеет CSS-координаты top: 200px; left: 300px, то в поле адрес должно быть записано
// значение 300 + расстояние до острого конца по горизонтали, 200 + расстояние до острого конца по вертикали.
//  Координаты не должны быть дробными.


function updateAddress(x, y) {
    addressInput.value = x + ', ' + y;
}

// Ловит позицию метки и передаёт в инпут адрес
function setInitialAddress(pin) {
    var x = pin.offsetLeft + PIN_WIDTH / 2;
    var y = pin.offsetTop + PIN_HEIGHT;
    updateAddress(x, y);
}

// setAdress(mapPinMain);

// Активация карты
var onMainPinMousedown = function (evt) {
    if (evt.button === 0) {
        activateMap();
        setInitialAddress(mapPinMain);
        mapPinMain.removeEventListener('click', onMainPinMousedown);
    }
};

mapPinMain.addEventListener('click', onMainPinMousedown, {once: true});


// отдельный файл///////////////////////////////////////////////////////////////

// 4) Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»:
var typeOfHouseSelector = document.querySelector('#type');
var priceInput = document.querySelector('#price');
var MIN_PRICES = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
};

var onTypeOfHouseSelectorChange = function () {
    var selected = Array.from(typeOfHouseSelector.options)
        .filter(function (option) {
            return option.selected;
        });
    var houseType = selected[0].value;
    setMinPrice(houseType);
};

var setMinPrice = function (houseType) {
    priceInput.setAttribute('min', MIN_PRICES[houseType]);
    priceInput.setAttribute('placeholder', MIN_PRICES[houseType]);
};

typeOfHouseSelector.addEventListener('change', onTypeOfHouseSelectorChange);

//  5) Установка соответствия количества гостей (спальных мест) с количеством комнат.
var roomsNumberSelector = document.querySelector('#room_number');
var capacitySelector = document.querySelector('#capacity');
var buttonSubmit = document.querySelector('.ad-form__submit');

function validateRoomNumbers() {
    console.log('it works');
    var roomsNumber = roomsNumberSelector.value;
    var capacity = capacitySelector.value;

    if (roomsNumber === '100' && capacity !== '0') {
        roomsNumberSelector.setCustomValidity("не для гостей");
    } else if (roomsNumber < capacity) {
        roomsNumberSelector.setCustomValidity("sfsdfd");
    }
}

roomsNumberSelector.addEventListener('change', validateRoomNumbers);
capacitySelector.addEventListener('change', validateRoomNumbers);

// var checkRoomNumber = function () {
//   if (roomsNumber.value === 1) {
//     if (capacity.value != 1) {
//     capacity.value.setAttribute('disabled', 'disabled');
//   }

//     // for (var i = 0; i < fieldsets.length; i++) {
//     //   fieldsets[i].setAttribute('disabled', 'disabled');
//     }
//   } else  {
//     roomNumber.setCustomValidity('')
//   }
// };

// document.querySelectorAll('option:checked');
// roomsNumber.options[roomsNumber.selectedIndex].value;

// Если  выбрано roomNumber checked value="1" === typeOfHouse checked value="1"
// || roomNumber checked value="2" === typeOfHouse checked  value="<=2"
// || roomNumber checked value="2" === typeOfHouse checked  value="<=2"
// || roomNumber checked value="3" === typeOfHouse checked  value="<=3" {
//   button.setapSabmit();
// } else {
//   roomNumber.setCustomValidity('')
// }


// 6) Валидация
// Второй подход заключается в использовании встроенного API для валидации.
// Вы пишите код проверки соответствия и если выбранное количество гостей не
// подходит под количество комнат, вызываете метод setCustomValidity.
// selectElt.setCustomValidity(string);

// {/* <label>Feeling: <input name=f type="text" oninput="check(this)"></label>
// <script>
//  function check(input) {
//    if (input.value == "good" ||
//        input.value == "fine" ||
//        input.value == "tired") {
//      input.setCustomValidity('"' + input.value + '" is not a feeling.');
//    } else {
//      // input is fine -- reset the error message
//      input.setCustomValidity('');
//    }
//  }
// </script> */}


// Метод setCustomValidity()
// function checkPasscode() {
// 	var passcode_input = document.querySelector("#passcode");

// 	if (passcode_input.value != "Ivy") {
// 		passcode_input.setCustomValidity("Wrong. It's 'Ivy'.");
// 	} else {
// 		passcode_input.setCustomValidity(""); // be sure to leave this empty!
// 		alert("Correct!");
// 	}
// }

// price.addEventListener('input', function () {
//   checkPriceValidity();
// });

// function checkPriceValidity() {
//   var validity = price.validity;
//   if (validity.rangeUnderflow) {
//     price.setCustomValidity('Цена должна быть не меньше ' + minPrice[type.options[type.selectedIndex].value] + ' руб.');
//   } else if (validity.rangeOverflow) {
//     price.setCustomValidity('Цена должна быть не больше 1 000 000 руб.');
//   } else if (validity.valueMissing) {
//     price.setCustomValidity('Обязательное поле');
//   } else {
//     price.setCustomValidity('');
//     name1. style. background=’#FFFFFF’;
//   }
// }
