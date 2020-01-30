'use strict';

// здесь и далее коменты идут либо над строкой, к которой относятся, либо сбоку от нее

var ADS_QUANTITY = 8;
// 1) константы даже в виде массивов надо писать SNAKE_UPPER_CASE
// 2) на будущее: любой комент, который я оставляю для какой-то части кода должен автоматически распространяться на весь код
// то есть в данном случае, если я оставил комент, что массив надо писать капсом, то это значит, что все массивы-константы должны быть так написаны
// потому что на работе в ревью это очень важно: тебе указали на какую-то неточность или ошибку, то ты исправляешь не только ее, но и смотришь, чтобы больше в коде она не повторялась
// ну и в будущем следишь, чтобы ее не повторять :) это покажет тебя с очень хорошей стороны
var avatars = [
    'img/avatars/user01.png',
    'img/avatars/user02.png',
    'img/avatars/user03.png',
    'img/avatars/user04.png',
    'img/avatars/user05.png',
    'img/avatars/user06.png',
    'img/avatars/user07.png',
    'img/avatars/user08.png'];
var titles = [
    'Замечательная квартира',
    'Лучшее предложение',
    'Успевайте бронировать',
    'Номер 1 в городе',
    'Бесплатные завтраки',
    'У Андрея :D',
    'Якудза',
    'Отель ХАРАКИРИ'];
var MIN_PRICE = 10000; // минимум тут больше максимума о_О
var MAX_PRICE = 1500;
var types = ['palace', 'flat', 'house', 'bungalo'];
var rooms = [1, 2, 3, 4];
var guests = [1, 2, 3, 4, 5];
var times = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var X_MIN = 0;
var X_MAX = document.body.clientWidth;
var Y_MIN = 130;
var Y_MAX = 630;
var DESCRIPTION = 'Типичное описание типичного объявления типичного вида';

// название немного вводит в заблуждение. На самом деле функция возвращает не какой-то случайный элемент, а случайное целое число
function getRandomItem(min, max) {
    // мне кажется, что округления пока избыточны, хотя это и добавляет больше гибкости в обработке прилетевших аргументов
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArray(arr) {
    var newArray = [];
    // заметь, что getRandomItem принимает максимальное значение, но возвращает всегда число меньше максимума.
    // Потому что Math.random() "возвращает псевдослучайное число с плавающей запятой из диапазона [0, 1), то есть, от 0 (включительно) до 1 (но не включая 1)"\
    // поэтому длина нового массива в максимуме всегда будет на 1 меньше, чем заданный массив
    var newArrayLength = getRandomItem(1, arr.length);
    for (var i = 0; i < newArrayLength; i++) {
        // заметь, что мы сохраняем порядок элементов в массиве. Было бы отлично вернуть потом массив со случайным порядком, но не повторяющихся элементов
        // по-сути, та же задача, что и в функции getRandomObject, в части avatar
        newArray.push(arr[i]);
    }
    return newArray;
}

var getRandomObject = function () {
    return {
        author: {
            // в условиях сказано, что адреса не должны повторяться, а getRandomItem спокойно может выдать в худшем случае одинаковые числа
            // можешь подумать, как сделать так, чтобы возвращались только уникальные числа :)
            avatar: avatars[getRandomItem(0, avatars.length)]
        },
        offer: {
            title: titles[getRandomItem(0, titles.length)],
            address: '600, 350',
            price: getRandomItem(MIN_PRICE, MAX_PRICE),
            type: types[getRandomItem(0, types.length)],
            rooms: rooms[getRandomItem(0, rooms.length)], // избыточно делать массив и дергать его случайный элемент, можно просто вернуть случайное число в заданном диапазоне
            guests: guests[getRandomItem(0, guests.length)], // избыточно делать массив и дергать его случайный элемент, можно просто вернуть случайное число в заданном диапазоне
            checkin: times[getRandomItem(0, times.length)],
            checkout: times[getRandomItem(0, times.length)],
            features: getRandomArray(features),
            // пока строка одна на всех, потом можно будет сделать так же, как и с полем avatar выше
            description: DESCRIPTION,
            photos: getRandomArray(photos)
        },
        location: {
            x: getRandomItem(X_MIN + PIN_WIDTH, X_MAX - PIN_WIDTH),
            y: getRandomItem(Y_MIN + PIN_HEIGHT, Y_MAX - PIN_HEIGHT)
        }
    };
};

var getObjectsArray = function () {
    var offers = [];
    for (var i = 0; i < ADS_QUANTITY; i++) {
        // отлично :)
        offers.push(getRandomObject());
    }
    return offers;
};

// тут аргумент уходит в функцию, но сама функция аргументы не ждет
// потом, тут ты возвращаешь результат выполнения функции, но он просто пропадает, потому что не записывается в переменную
getObjectsArray(ADS_QUANTITY);

document.querySelector('.map').classList.remove('map--faded');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinListElement = document.querySelector('.map__pins');

var renderPin = function (offers) {
    var fragment = document.createDocumentFragment();

    // тут ты пытаешься взять длину от функции, а не от массива, который должен прилететь в качестве аргумента в функции
    for (var i = 0; i < getObjectsArray.length; i++) {
        var pinElement = pinTemplate.cloneNode(true);

        pinElement.style.left = offers[i].location.x + 'px';
        pinElement.style.top = offers[i].location.y + 'px';
        pinElement.querySelector('img').src = offers[i].author.avatar;
        pinElement.querySelector('img').alt = offers[i].offer.title;

        fragment.appendChild(pinElement);
    }
    pinListElement.appendChild(fragment);
};

// ты в функцию передаешь другую функцию
renderPin(getObjectsArray);
