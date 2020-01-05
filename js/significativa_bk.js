"use strict";

//const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
//const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=Leiria,pt&units=metric&";


let item_coluna_hora = null;
let item_coluna_dia_h_0 = null;
let item_coluna_dia_h_1 = null;
let item_coluna_dia = null;
let item_linha_dia = null;
let item_bloco_dia = null;
let item_lista_arg = null;

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

const PONTOS_CARDEAIS = [   {   "ponto":"N", "grau_ini":337, "grau_fim":22},
                            {   "ponto":"NE", "grau_ini":23, "grau_fim":67},
                            {   "ponto":"E", "grau_ini":68, "grau_fim":112},
                            {   "ponto":"SE", "grau_ini":113, "grau_fim":157},
                            {   "ponto":"S", "grau_ini":158, "grau_fim":202},
                            {   "ponto":"SO", "grau_ini":203, "grau_fim":247},
                            {   "ponto":"O", "grau_ini":248, "grau_fim":292},
                            {   "ponto":"NO", "grau_ini":293, "grau_fim":337},   ];


function ponto_cardeal (grau){
    if (grau>=0 && grau <=359){
        for (let i=0; i<PONTOS_CARDEAIS.length; i++) {
            console.log(grau, PONTOS_CARDEAIS.length);
            if (grau > PONTOS_CARDEAIS[i].grau_ini && grau <= PONTOS_CARDEAIS[i].grau_fim) {
                console.log(i + " -> " + PONTOS_CARDEAIS[i].ponto);
                return PONTOS_CARDEAIS[i].ponto;
            }
        }
        return PONTOS_CARDEAIS[0].ponto;
    } else {
        console.log("Erro - grau tem de estar entre 0 e 359");
    }
}



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

//Função que preenche a tabela discritida de 3h em 3h
function descritivo_3h (div_dia){
    $('.linha_hora').html('');
    $('.linha_dia').html('');
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
    for (let i = ((div_dia*8)-8), j=0; j<8; i++, j++){
        let coluna_dia_clone = item_coluna_dia.clone();
        let elemento1 = msg.list[i];
        let temperatura = (elemento1.main.temp).toFixed(0);
        let vento_vel = (elemento1.wind.speed * 3.6).toFixed(0);
        let vento_dir = elemento1.wind.deg;

        $('.temperatura', coluna_dia_clone).text(temperatura + "º");
        $('.vento_vel', coluna_dia_clone).text(vento_vel + " km/h");
        $('.vento_dir', coluna_dia_clone).text(ponto_cardeal(parseInt(vento_dir)));
        $('.linha_dia').append(coluna_dia_clone);
        console.log("i -> ", i, " j-> ", j, "Data -> ", elemento.dt_txt, "Temp. -> ", temperatura, "Vel. Vento -> ", vento_vel, "Direcao Vento", vento_dir);
        }

}

$(function() {
    item_coluna_hora = $('.coluna_hora').clone();
    $('.linha_hora').html('');
    item_coluna_dia_h_0 = $('.coluna_dia_h_0').clone();
    item_coluna_dia = $('.coluna_dia').clone();
    $('.linha_dia').html('');

    item_lista_arg = $('.bloco_dia').clone();
    $('.linha_blocos').html('');

    prev_dias_select = $('.previsao_3h');
    btn_dia1_select = $('#btn_dia_1');
    btn_dia2_select = $('#btn_dia_2');
    btn_dia3_select = $('#btn_dia_3');
    btn_dia4_select = $('#btn_dia_4');
    btn_dia5_select = $('#btn_dia_5');
    btn_dia_select = $('.btn_dia');

    for (let i = 1, dados = 0; i <= 5; i++, dados = dados + 8) {
        let dados_json = msg.list[dados];
        let date_time = new Date(dados_json.dt_txt),
            dia = date_time.getDate(),
            mes = date_time.getMonth(),
            ano = date_time.getFullYear(),
            dia_sem = date_time.getDay();
        let temperatura = (dados_json.main.temp).toFixed(0);
        let vento_vel = (dados_json.wind.speed * 3.6).toFixed(0);
        let vento_dir = dados_json.wind.deg;
        let humidade = dados_json.main.humidity;

        $('.data','#dia_'+i).text(dia + "/" + meses_abrv[mes]);
        $('.dia', '#dia_'+i).text(dias_semana[dia_sem]);
        $('.temperatura','#dia_'+i).text(temperatura + "º");
        $('.vento_vel', '#dia_'+i).text(vento_vel + " km/h");
        $('.vento_dir', '#dia_'+i).text(ponto_cardeal(parseInt(vento_dir)));
        $('.humidade', '#dia_'+i).text(humidade+"%");

        //console.log("i -> ", i, "Data -> ", dia,"-",ano,"-",mes, " Temp. -> ", temperatura, "Vel. Vento -> ", vento_vel, "Direcao Vento", vento_dir);
    }
    $('#cidade_nome').text(msg.city.name);
    $('#cidade_pais').text(msg.city.country);

});