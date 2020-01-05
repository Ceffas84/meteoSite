"use strict";

import {ponto_cardeal} from "./significativa";


var item_param = null;
var item_valor = null;
var msg = JSON.parse(localStorage.getItem('tempo_actual'));

console.log(typeof msg, msg);




/*$(function () {
    item_param = $('.item_param').clone();
    item_valor = $('.item_valor').clone();

    $('.detalhes_tempo_param').html('');
    $('.detalhes_tempo_valor').html('');



    if(typeof Storage !== "undefined"){

            $('#nome_cidade').text(msg.name);

            Object.keys(msg.main).forEach(function(key){
                var item_param_clone = item_param.clone();
                var item_valor_clone = item_valor.clone();
                $('.param', item_param_clone).text(key);
                if (key === "temp" || key === "feels_like" || key === "temp_min" || key === "temp_max"){
                    var celcius = parseInt(converter_Kelvin_to_Celcius(msg.main[key]));
                    $('.valor', item_valor_clone).text(celcius + " C.");
                } else {
                    $('.valor', item_valor_clone).text(msg.main[key]);
                }
                $('.detalhes_tempo_param').append(item_param_clone);
                $('.detalhes_tempo_valor').append(item_valor_clone);
            });
        } else {
            alert("O browser que esta a utilizar nao suporta Web Storage.");
        }
    });
});

function converter_Kelvin_to_Celcius(kelvin_temp) {
    var celcius = kelvin_temp - diferenca_kelvin;
    return celcius;
}

function converter_Celcius_to_Kelvin(celcius_temp) {
    var kelvin = celcius_temp + diferenca_kelvin;
    return kelvin;
}*/


