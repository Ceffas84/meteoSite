"use strict";

if(typeof Storage !== "undefined"){
    //código para webStorage Api
    localStorage.setItem('unidade', 'metric');
} else {
    alert("Web Storage não suportado.");
}


const API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
const API_FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast?q=";
const API_KEY = "&APPID=5f641b8ef2e6971af3d88024c6489ebf";
const ResponseOK = 200;

function pesquisar() {
    let city = $("#input_txt").val();
    let unidade = "&units="+localStorage.getItem('unidade');
    let pedido_tempo_actual = API_WEATHER_URL+city+unidade+API_KEY;

    $.ajax({
        method: 'GET',
        url: pedido_tempo_actual
    }).done(function (msg) {
        if(msg.cod !== ResponseOK){
            alert("Erro: " + msg.cod + "\n" + msg.message);
        } else {
            if(typeof Storage !== "undefined"){
                //código para webStorage Api
                sessionStorage.setItem('resposta', JSON.stringify(msg));
            } else {
                alert("Web Storage não suportado.");
            }
        }
    })
}