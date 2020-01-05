"use strict";

if(typeof Storage !== "undefined"){
    //código para webStorage Api
    localStorage.setItem('unidade', 'metric');
} else {
    alert("Web Storage não suportado.");
}

var autocomplete;
var place;


$(function inicilizar_autocomplete() {
    var input = document.getElementById('searchTextField');
    autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        pesquisar();
    });
});


const API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
const API_FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast?q=";
const API_KEY = "&APPID=5f641b8ef2e6971af3d88024c6489ebf";
const PLACES_API_ADDRESS_COMPONENTS_CITY_LONG_NAME = 0;
const PLACES_API_ADDRESS_COMPONENTS_COUNTRY_SHORT_NAME = 2;

function pesquisar() {
    place = autocomplete.getPlace();
    //console.log(typeof place, place);
    let city = place.address_components[PLACES_API_ADDRESS_COMPONENTS_CITY_LONG_NAME].long_name + "," +
               place.address_components[PLACES_API_ADDRESS_COMPONENTS_COUNTRY_SHORT_NAME].short_name;
    //console.log(city);
    let foto = place.photos[0].getUrl();
    localStorage.setItem('foto', foto);
    let unidade = "&units="+localStorage.getItem('unidade');
    let pedido_tempo_actual = API_WEATHER_URL+city+unidade+API_KEY;
    localStorage.setItem('pedido_tempo_actual', pedido_tempo_actual);
    let pedido_significativa = API_FORECAST_URL+city+unidade+API_KEY;
    localStorage.setItem('pedido_significativa', pedido_significativa);

    $.ajax({
        method: 'GET',
        url: pedido_tempo_actual
    }).done(function (msg) {
        if(parseInt(msg.cod) != ResponseOK){
            alert("Erro: " + msg.cod + "\n" + msg.message);
        } else {
            if(typeof Storage !== "undefined"){
                //código para webStorage Api
                localStorage.setItem('tempo_atual', JSON.stringify(msg));
                console.log("Tempo atual -> ", localStorage.getItem('tempo_atual'));
            } else {
                alert("Web Storage não suportado.");
            }
        }
    });

    $.ajax({
        method: 'GET',
        url: pedido_significativa
    }).done(function (msg) {
        console.log(msg.cod);
        console.log(typeof msg.cod);
        if(parseInt(msg.cod) !== ResponseOK){
            alert("Erro: " + msg.cod + "\n" + msg.message);
        } else {
            if(typeof Storage != "undefined"){
                //código para webStorage Api
                localStorage.setItem('significativa', JSON.stringify(msg));
                console.log("Significativa -> ", localStorage.getItem('significativa'));
            } else {
                alert("Web Storage não suportado.");
            }
        }
    });
}