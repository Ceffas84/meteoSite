"use strict";

var pedido = "http://api.openweathermap.org/data/2.5/weather?q=London,us&APPID=5f641b8ef2e6971af3d88024c6489ebf";

var item = null;

$(function () {
    item = $('.item').clone();

    $('.detalhes_tempo').html('');

    $.ajax({
        method: 'GET',
        url: pedido
    }).done(function (msg) {
        Object.keys(msg.main).forEach(function(key){
            console.log(key + " : " + msg.main[key]);
            var item_clone = item.clone();
            $('.param', item_clone).text(key);
            $('.valor', item_clone).text(msg.main[key]);
            $('.detalhes_tempo').append(item_clone);
        });



    })
});
