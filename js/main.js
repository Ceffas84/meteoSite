'use strict';

if(typeof Storage !== "undefined"){
    //código para webStorage Api
    localStorage.setItem('unidade', 'metric');
} else {
    alert("Web Storage não suportado.");
}

var autocomplete, place, foto_url;

const API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
const API_FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast?q=";
const API_KEY = "&APPID=5f641b8ef2e6971af3d88024c6489ebf";
const PLACES_API_ADDRESS_COMPONENTS_CITY_LONG_NAME = 0;
const PLACES_API_ADDRESS_COMPONENTS_COUNTRY_SHORT_NAME = 2;
const responseOK = 200;
const PEDIR_TEMPO_ACTUAL = 1;
const PEDIR_SIGNIFICATIVA = 2;

function inicilizar_autocomplete() {
    var input = document.getElementById('searchTextField');
    autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        fazer_pedido(PEDIR_TEMPO_ACTUAL);
    });
}

function fazer_pedido(pedido){
    let pedido_construido = construir_pedido(pedido);
    $.ajax({
        method: 'GET',
        url: pedido_construido
    }).done(function (msg) {
        if(parseInt(msg.cod) !== responseOK){
            alert("Erro: " + msg.cod + "\n" + msg.message);
        } else if(typeof Storage !== "undefined"){
            //código para webStorage Api
            if (pedido === PEDIR_TEMPO_ACTUAL) {
                console.log('Obj JSON: ' + typeof msg, msg);
                localStorage.setItem('tempo_atual', JSON.stringify(msg));
                let obj_str = localStorage.getItem('tempo_atual');
                console.log(obj_str);
            }
            if (pedido === PEDIR_SIGNIFICATIVA){
                console.log(msg);
                localStorage.setItem('significativa', JSON.stringify(msg));
                console.log(localStorage.getItem('significativa'));
            }
        } else {
            alert("Web Storage não suportado.");
        }
    });
}

function construir_pedido(pedido) {
    place = autocomplete.getPlace();
    let city = place.address_components[PLACES_API_ADDRESS_COMPONENTS_CITY_LONG_NAME].long_name + "," +
        place.address_components[PLACES_API_ADDRESS_COMPONENTS_COUNTRY_SHORT_NAME].short_name;
    foto_url = place.photos[0].getUrl();
    localStorage.setItem('foto_url', foto_url);
    console.log(typeof foto_url, foto_url);
    let unidade = "&units="+localStorage.getItem('unidade');

    if (pedido === PEDIR_TEMPO_ACTUAL){
        let pedido_tempo_actual = API_WEATHER_URL+city+unidade+API_KEY;
        return pedido_tempo_actual;
    }

    if (pedido === PEDIR_SIGNIFICATIVA){
        let pedido_significativa = API_FORECAST_URL+city+unidade+API_KEY;
        return pedido_significativa;
    }
}

function renderizar_pag_detalhes() {
    let response_str = localStorage.getItem('tempo_atual');
    console.log(typeof response_str, response_str);
    let response_json = JSON.parse(response_str);
    console.log(typeof response_json, response_json);
    foto_url = localStorage.getItem('foto_url');
    console.log(typeof foto_url, foto_url);

    $('#nome_cidade').text(response_json.name);
    $('#detalhes_imagem_cidade').attr('alt', response_json.name);
    $('#detalhes_imagem_cidade').attr('src', foto_url);
    $('#valor_1').text(response_json.main.temp + '.º C');
    $('#valor_2').text(response_json.main.temp_max + '.º C');
    $('#valor_3').text(response_json.main.temp_min + '.º C');
    $('#valor_4').text(converter_para_kms_hora(response_json.wind.speed) + ' Kms/h');
    $('#valor_5').text(response_json.main.pressure + ' hPa');
    $('#valor_6').text(response_json.main.humidity + '%');
    $('#valor_7').text('Lon: ' + response_json.coord.lon + ', Lat: ' + response_json.coord.lat);
}

function converter_para_kms_hora(n) {
    n = (n*60*60)/1000;
    return n;
}

function converter(){
    let unidade = localStorage.getItem('unidade');
    if (unidade === 'metric'){
        localStorage.setItem('unidade', 'kelvin');
        $('#texto_btn_converter').text('Converter para Celcius');
        $(function (){
            renderizar();
        });
    } else {
        localStorage.setItem('unidade', 'metric');
        $('#texto_btn_converter').text('Converter para Kelvin');
        $(function (){
            renderizar();
        });
    }
}