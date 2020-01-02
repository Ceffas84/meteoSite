"use strict";

const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=London,us&";

var item_hora = null;
var item_dia = null;
var item_next_day = null;

$(function () {
    item_hora = $('.coluna_hora').clone();
    item_dia = $('.coluna_dia').clone();
    item_next_day = $('.linha_dia').clone();

    $.ajax({
        method: 'GET',
        url: API_URL + API_KEY
    }).done(function (msg) {
        var item_hora_clone = item_hora.clone();
        $('.conteudo_hora').text("#");
        //$('.linha_hora').append(item_hora_clone);
        for (let i = 0; i < 8; i++) {
            var elemento = msg.list[i];
            item_hora_clone = item_hora.clone();
            var dataehora = elemento.dt_txt.split(" ");
            var hora = dataehora[1];
            //console.log(hora);
            $('.conteudo_hora', item_hora_clone).text((hora.split(":"))[0]);
            $('.linha_hora').append(item_hora_clone);
        }
        for (let i = 0; i < 5; i++) {
            $('.conteudo_dia_h').text("Proximas 24H");
            for (let j = 0; j < 8; j++) {
                    var elemento = msg.list[j];
                    item_dia_clone = item_dia.clone();
                    var dataehora = elemento.dt_txt.split(" ");
                    var data = dataehora[0];
                    console.log(data);
                    $('.conteudo_dia').text(data);
                    $('.linha_dia').append(item_dia_clone);
            }
            if (i < 4) {
                var item_next_day_clone = item_next_day.clone();
                $('.dados_dia').append(item_next_day_clone);
            }
        }
    });
});


