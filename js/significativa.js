"use strict";

//const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
//const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=Leiria,pt&units=metric&";

let item_coluna_hora = null;
let item_coluna_dia_h_0 = null;
let item_coluna_dia_h_1 = null;
let item_coluna_dia = null;
let item_linha_dia = null;
let item_bloco_dia = null;

const cor_meteo_verde_claro = "#84cab2"
const cor_meteo_azul_claro = "#82befd"
const cor_meteo_azul_vivo = "#0687fc"
const cor_meteo_verde_vivo = "#1c9f73"

let ultimo_botao_dia_clicado=null;

let btn_dia1_select = null;
let btn_dia2_select = null;
let btn_dia3_select = null;
let btn_dia4_select = null;
let btn_dia5_select = null;
let btn_dia_select = null;

const dias_semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const meses_abrv = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

let json_str = localStorage.getItem("significativa");
let msg = JSON.parse(json_str);

var prev_dias_select = null;


function esconde_cont_prev_dias() {
    prev_dias_select.hide();
    btn_dia_select.css("background-color", "powderblue");


}

function mostra_cont_prev_dias (div_dia) {
    prev_dias_select.show();
    switch (div_dia) {
        case 1:
            btn_dia1_select.css("background-color", cor_meteo_verde_claro);
            break;
        case 2:
            btn_dia2_select.css("background-color", cor_meteo_verde_claro);
            break;
        case 3:
            btn_dia3_select.css("background-color", cor_meteo_verde_claro);
            break;
        case 4:
            btn_dia4_select.css("background-color", cor_meteo_verde_claro);
            break;
        case 5:
            btn_dia5_select.css("background-color", cor_meteo_verde_claro);
            break;
    }
}

function esconde_mostra_cont_signif(div_dia) {

    if (ultimo_botao_dia_clicado == null) {
        ultimo_botao_dia_clicado = div_dia;
        mostra_cont_prev_dias(div_dia);
        descritivo_3h(div_dia);
    } else {
        if (ultimo_botao_dia_clicado == div_dia) {
            esconde_cont_prev_dias();
            ultimo_botao_dia_clicado=null;
        } else {
            ultimo_botao_dia_clicado=div_dia;
            esconde_cont_prev_dias();
            mostra_cont_prev_dias(div_dia);
            descritivo_3h(div_dia);
        }
    }
    console.log("Botao clicado -> "+div_dia+" Estado visibilidade->");
}

function descritivo_3h (div_dia){
    $('.linha_hora').html('');
    $('.linha_dia').html('');

//Preenche o cabeçalho da tabela com as horas da API
    for (var i = -1; i < 8; i++) {
        var item_coluna_hora_clone = item_coluna_hora.clone();
        switch (i) {
            case -1:
                $('.conteudo_hora', item_coluna_hora_clone).text("Valores");
                $('.linha_hora').append(item_coluna_hora_clone);
                break;
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                var elemento = msg.list[i+(div_dia*8)-8];
                var dataehora = elemento.dt_txt.split(" ");
                var hora = dataehora[1];
                $('.conteudo_hora', item_coluna_hora_clone).text(parseInt((hora.split(":"))[0]) + "h");
                $('.linha_hora').append(item_coluna_hora_clone);
        }
    }
    var coluna_dia_h_0_clone = item_coluna_dia_h_0.clone();
    $('.linha_dia').append(coluna_dia_h_0_clone);
    for (let i = ((div_dia*8)-8), j=0; j<8; i++, j++) {
        elemento = msg.list[i];
        var coluna_dia_clone = item_coluna_dia.clone();
        var elemento1 = msg.list[i];
        var temperatura = (elemento1.main.temp).toFixed(0);
        var vento_vel = (elemento1.wind.speed * 3.6).toFixed(0);
        var vento_dir = elemento1.wind.deg;

        $('.temperatura', coluna_dia_clone).text(temperatura + "º");
        $('.vento_vel', coluna_dia_clone).text(vento_vel + " km/h");
        $('.vento_dir', coluna_dia_clone).text(vento_dir);
        $('.linha_dia').append(coluna_dia_clone);
        //console.log("i -> ", i, " j-> ", j, "Data -> ", elemento.dt_txt, "Temp. -> ", temperatura, "Vel. Vento -> ", vento_vel);
        }

}

$(function() {
    item_coluna_hora = $('.coluna_hora').clone();
    $('.linha_hora').html('');
    item_coluna_dia_h_0 = $('.coluna_dia_h_0').clone();
    item_coluna_dia = $('.coluna_dia').clone();
    $('.linha_dia').html('');

    prev_dias_select = $('.signif-conteudo');
    btn_dia1_select = $('#btn_dia_1');
    btn_dia2_select = $('#btn_dia_2');
    btn_dia3_select = $('#btn_dia_3');
    btn_dia4_select = $('#btn_dia_4');
    btn_dia5_select = $('#btn_dia_5');
    btn_dia_select = $('.btn_dia');

    for (var i = 1, dados = 0; i <= 5; i++, dados = dados + 8) {
        let dados_json = msg.list[dados];
        let date_time = new Date(dados_json.dt_txt),
            dia = date_time.getDate(),
            mes = date_time.getMonth(),
            ano = date_time.getFullYear(),
            dia_sem = date_time.getDay();
        $('.data','#dia_'+i).text(dia + "/" + meses_abrv[mes]);
        $('.dia', '#dia_'+i).text(dias_semana[dia_sem]);
        $('.temperatura', '#dia_'+i).text(parseInt(dados_json.main.temp)+"º");
        console.log("i -> ", i, "Dados -> ", dados);
    }


});
