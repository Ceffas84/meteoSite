"use strict";

var pedido = "http://api.openweathermap.org/data/2.5/weather?q=London,us&APPID=5f641b8ef2e6971af3d88024c6489ebf";

var item_param = null;
var item_valor = null;

$(function () {
    item_param = $('.item_param').clone();
    item_valor = $('.item_valor').clone();

    $('.detalhes_tempo_param').html('');
    $('.detalhes_tempo_valor').html('');

    $.ajax({
        method: 'GET',
        url: pedido
    }).done(function (msg) {
        Object.keys(msg).forEach(function (key){
            if(key === "name"){
                $('#nome_cidade').text(msg[key]);
            }
        });
        Object.keys(msg.main).forEach(function(key){
            var item_param_clone = item_param.clone();
            var item_valor_clone = item_valor.clone();
            $('.param', item_param_clone).text(key);
            $('.valor', item_valor_clone).text(msg.main[key]);
            $('.detalhes_tempo_param').append(item_param_clone);
            $('.detalhes_tempo_valor').append(item_valor_clone);
        });
    })
});
