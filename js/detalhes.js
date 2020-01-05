"use strict";

var item_param = null;
var item_valor = null;
var pedido_tempo_actual = null;
var foto_url = null;
var responseOK = 200;

$(function () {
    renderizar();
});

function renderizar() {

    pedido_tempo_actual = localStorage.getItem('pedido_tempo_actual');
    console.log(pedido_tempo_actual);
    foto_url = localStorage.getItem('foto');
    console.log(foto_url);

    $.ajax({
        method: 'GET',
        url: pedido_tempo_actual
    }).done(function (msg) {
        if(parseInt(msg.cod) !== responseOK){
            alert("Erro: " + msg.cod + "\n" + msg.message);
        } else if(typeof Storage !== "undefined") {
            //código para webStorage Api
            $('#nome_cidade').text(msg.name);
            $('#detalhes_imagem_cidade').attr('alt', msg.name);
            $('#detalhes_imagem_cidade').attr('src', foto_url);
            $('#valor_1').text(msg.main.temp + '.º C');
            $('#valor_2').text(msg.main.temp_max + '.º C');
            $('#valor_3').text(msg.main.temp_min + '.º C');
            $('#valor_4').text(converter_para_kms_hora(msg.wind.speed) + ' Kms/h');
            $('#valor_5').text(msg.main.pressure + ' hPa');
            $('#valor_6').text(msg.main.humidity + '%');
            $('#valor_7').text('Lon: ' + msg.coord.lon + ', Lat: ' + msg.coord.lat);
        }
    });
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
        item_param = null;
        item_valor = null;
        $(function (){
            renderizar();
        });
    } else {
        localStorage.setItem('unidade', 'metric');
        $('#texto_btn_converter').text('Converter para Kelvin');
        item_param = null;
        item_valor = null;
        $(function (){
            renderizar();
        });
    }
}
