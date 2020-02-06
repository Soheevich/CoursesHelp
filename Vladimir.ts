'use strict';

var ADS_QUANTITY = 8;
var TITLES = [
    'Замечательная квартира',
    'Лучшее предложение',
    'Успевайте бронировать',
    'Номер 1 в городе',
    'Бесплатные завтраки',
    'У Андрея :D',
    'Якудза',
    'Отель ХАРАКИРИ'];
var MIN_PRICE = 1500;
var MAX_PRICE = 10000;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAX_ROOMS = 4;
var MAX_GUESTS = 5;
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var X_MIN = 0;
var xMax = document.body.clientWidth;
var Y_MIN = 130;
var Y_MAX = 630;
var DESCRIPTION = 'Типичное описание типичного объявления типичного вида';

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArray(arr) {
    var newArray = [];
    var newArrayLength = getRandomNumber(1, arr.length + 1);
    for (var i = 0; i < newArrayLength; i++) {
        newArray.push(arr[i]);
    }
    return newArray;
}

// вместо objectNumber лучше objectIndex, так будет понятнее
function getRandomObject(objectNumber) {
    var locationX = getRandomNumber(X_MIN, xMax);
    var locationY = getRandomNumber(Y_MIN, Y_MAX);
    return {
        author: {
            avatar: 'img/avatars/user0' + (objectNumber + 1) + '.png'
        },
        offer: {
            title: TITLES[objectNumber],
            address: locationX + ', ' + locationY,
            price: getRandomNumber(MIN_PRICE, MAX_PRICE),
            type: TYPES[getRandomNumber(0, TYPES.length)],
            rooms: getRandomNumber(0, MAX_ROOMS),
            guests: getRandomNumber(0, MAX_GUESTS),
            checkin: TIMES[getRandomNumber(0, TIMES.length)],
            checkout: TIMES[getRandomNumber(0, TIMES.length)],
            features: getRandomArray(FEATURES),
            description: DESCRIPTION,
            photos: getRandomArray(PHOTOS)
        },
        location: {
            x: locationX,
            y: locationY
        }
    };
}

// давай все же сделаем так, чтобы функция принимала аргументом число - длину массива
// тем более, что ниже ты вызываешь эту функцию с аргументом, который здесь не использовался
function getObjectsArray() {
    var offers = [];
    for (var i = 0; i < ADS_QUANTITY; i++) {
        offers.push(getRandomObject(i));
    }
    return offers;
}

// предлагаю назвать newOffers, потому что это массив
var newOffer = getObjectsArray(ADS_QUANTITY);

// эти переменные используются только в функции renderPin, поэтому лучше их перенести туда
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinListElement = document.querySelector('.map__pins');

function renderPin(offers) {
    // данный код будет вызываться каждый раз, когда будет отрисовываться булавка
    // эта функция называется renderPin, но заодно делает карту активной, что уже лишнее
    // лучше его перенести в getActiveForm, там она к месту, потому что это как раз один из шагов перевода карты в активный режим
    document.querySelector('.map').classList.remove('map--faded');

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
        var pinElement = pinTemplate.(true);
        var offer = offers[i];
        pinElement.style.left = (offer.location.x - PIN_WIDTH / 2) + 'px';
        pinElement.style.top = (offer.location.y - PIN_HEIGHT) + 'px';
        pinElement.querySelector('img').src = offer.author.avatar;
        pinElement.querySelector('img').alt = offer.offer.title;

        fragment.appendChild(pinElement);
    }
    pinListElement.appendChild(fragment);
}

var form = document.querySelector('.ad-form');
var formFieldsets = form.querySelectorAll('fieldset');

function disableForm() {
    for (var i = 0; i < formFieldsets.length; i++) {
        formFieldsets[i].setAttribute('disabled', '');
    }
}

function enableForm() {
    for (var i = 0; i < formFieldsets.length; i++) {
        // removeAttribute ждет одного атрибута, второй лишний
        formFieldsets[i].removeAttribute('disabled', '');
    }
}

// эта функция не возвращает активную форму, лучше назвать activateForm
function getActiveForm() {
    renderPin(ADS_QUANTITY);
    enableForm();
    form.classList.remove('ad-form--disabled');
}

// если querySelector ничего не нашел, то он вернет null, как в данном случае
// лучше всего имена классов копировать, тогда вероятность опечатки уйдет
var mapPinMain = document.querySelector('.map__pin—main');

disableForm();
// константу надо вынести наверх
var LEFT_BUTTON_MOUSE = 0;

// а теперь интересный спецэффект: если нажать на этот элемент несколько раз, то будут добавляться новые булавки. Расскажу голосом, как лучше сделать
mapPinMain.addEventListener('mousedown', function (evt) {
        if (evt.button === LEFT_BUTTON_MOUSE) {
            getActiveForm();
        }
    }
);
renderPin(newOffer);
