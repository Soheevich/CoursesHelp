'use strict';

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var MAX_PRICE = 1000;
var MIN_PRICE = 100000;
var MAX_ADS_ARRAY_LENGTH = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var xMax = document.querySelector('.map__overlay').offsetWidth;

// Функция, возвращающая рандомное число в диапазоне [min и max].
var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция, возвращающая один рандомный элемент из переданного массива.
var getRandomFromArray = function (array) {
    var randomNumber = getRandomNumber(0, array.length - 1);
    return array[randomNumber];
};

var getRandomArrayFromArray = function (array) {
    var maxNumber = getRandomNumber(1, array.length + 1);
    return array.slice(0, maxNumber);
};

// Функция, для создания массива из 8 сгенерированных объявлений.
var getAdsArray = function () {
    var adsArray = [];
    for (var i = 0; i < MAX_ADS_ARRAY_LENGTH; i++) {
        var ad = createAd(i);
        adsArray.push(ad);
    }
    return adsArray;
};

var createAd = function (i) {
    var locationX = getRandomNumber(0, xMax);
    var locationY = getRandomNumber(130, 630);

    return {
        author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
            'title': 'string',
            'address': locationX + ', ' + locationY,
            'price': getRandomNumber(MIN_PRICE, MAX_PRICE),
            'type': getRandomFromArray(TYPE),
            'rooms': getRandomNumber(1, 5),
            'guests': getRandomNumber(1, 10),
            'checkin': getRandomFromArray(CHECKINS),
            'checkout': getRandomFromArray(CHECKOUTS),
            'features': getRandomArrayFromArray(FEATURES),
            'description': 'строка с описанием',
            'photos': getRandomArrayFromArray(PHOTOS)
        },
        location: {
            x: locationX,
            y: locationY
        }
    };
};

var renderPins = function () {
    var map = document.querySelector('.map');
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var pinListElement = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    var ads = getAdsArray();

    for (var i = 0; i < ads.length; i++) {
        var pinElement = template.cloneNode(true);
        var ad = ads[i];
        pinElement.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
        pinElement.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
        pinElement.querySelector('img').src = ad.author.avatar;
        pinElement.querySelector('img').alt = ad.offer.title;
        fragment.appendChild(pinElement);
    }

    pinListElement.appendChild(fragment);
    // Показывает карту
    map.classList.remove('map--faded');
};

renderPins();
