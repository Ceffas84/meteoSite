"use strict";

if(typeof Storage !== "undefined"){
    //código para webStorage Api
    localStorage.setItem('unidade', 'metric');
    console.log(localStorage.getItem("unidade"));
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
    console.log(autocomplete);
});


const API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
const API_FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast?q=";
const API_KEY = "&APPID=5f641b8ef2e6971af3d88024c6489ebf";
const ResponseOK = "200";

function pesquisar() {
    place = autocomplete.getPlace();
    console.log(typeof place, place);
    let city = place.name;
    console.log(city);
   // let city_ID = place.getId();
    //console.log(city_ID);
    let foto = place.photos;
    console.log(foto);
    let unidade = "&units="+localStorage.getItem('unidade');
    let pedido_tempo_actual = API_WEATHER_URL+city+unidade+API_KEY;
    let pedido_significativa = API_FORECAST_URL+city+unidade+API_KEY;

    /*
    $.ajax({
        method: 'GET',
        url: pedido_tempo_actual
    }).done(function (msg) {
        if(msg.cod != ResponseOK){
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
        if(msg.cod !== ResponseOK){
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
    })
    */
}