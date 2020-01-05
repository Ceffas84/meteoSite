"use strict";
//----Constantes
const cor_meteo_verde_claro = "#84cab2"
const cor_meteo_azul_claro = "#82befd"
const cor_meteo_verde_vivo = "#1c9f73"
const cor_meteo_azul_vivo = "#0687fc"


const PONTOS_CARDEAIS = [   {   "ponto":"N", "grau_ini":337, "grau_fim":22},
    {   "ponto":"NE", "grau_ini":23, "grau_fim":67},
    {   "ponto":"E", "grau_ini":68, "grau_fim":112},
    {   "ponto":"SE", "grau_ini":113, "grau_fim":157},
    {   "ponto":"S", "grau_ini":158, "grau_fim":202},
    {   "ponto":"SO", "grau_ini":203, "grau_fim":247},
    {   "ponto":"O", "grau_ini":248, "grau_fim":292},
    {   "ponto":"NO", "grau_ini":293, "grau_fim":337},   ];
const dias_semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const meses_abrv = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

//----Variáveis globais
let item_coluna_hora = null;
let item_coluna_dia_h_0 = null;
let item_coluna_dia = null;
let item_bloco_dia = null;
let ultimo_botao_dia_clicado=null;
let btn_dia1_select = null;
let btn_dia2_select = null;
let btn_dia3_select = null;
let btn_dia4_select = null;
let btn_dia5_select = null;
let btn_dia_select = null;
let json_str = localStorage.getItem("significativa");

let msg = JSON.parse(json_str);
let prev_dias_select = null;

//----Função On document loaded
//Prenche e clona os 5 dias da previsão
$(function() {
    item_coluna_hora = $('.coluna_hora').clone();
    $('.linha_hora').html('');
    item_coluna_dia_h_0 = $('.coluna_dia_h_0').clone();
    item_coluna_dia = $('.coluna_dia').clone();
    $('.linha_dia').html('');

    item_bloco_dia = $('.bloco_dia').clone();
    $('.linha_blocos').html('');

    let json_min_max = atribuir_dias();


    for (let i = 1, dados = 0; i <= 5; i++, dados = dados + 8) {
        let item_bloco_dia_clone = item_bloco_dia.clone()
        $(item_bloco_dia_clone).attr("id","dia_"+i);
        $('.btn_dia',item_bloco_dia_clone).addClass("btn_dia");
        $('.btn_dia',item_bloco_dia_clone).attr("id","btn_dia_"+i);
        $('.btn_dia',item_bloco_dia_clone).attr("onclick","esconde_mostra_cont_signif("+i+")");
        $('.linha_blocos').append(item_bloco_dia_clone);

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

        let temp_min = json_min_max[i].temp_min;
        let temp_max = json_min_max[i].temp_max;

        $('.data','#dia_'+i).text(dia + "/" + meses_abrv[mes]);
        $('.dia', '#dia_'+i).text(dias_semana[dia_sem]);
        $('.temperatura','#dia_'+i).text(temperatura + "º");

        $('.temp_min','#dia_'+i).text(temp_min+"º");
        $('.temp_max','#dia_'+i).text(temp_max+"º");

        $('.vento_vel', '#dia_'+i).text(vento_vel + " km/h");
        $('.vento_dir', '#dia_'+i).text(ponto_cardeal(parseInt(vento_dir)));
        $('.humidade', '#dia_'+i).text(humidade+"%");

        //console.log("i -> ", i, "Data -> ", dia,"-",ano,"-",mes, " Temp. -> ", temperatura, "Vel. Vento -> ", vento_vel, "Direcao Vento", vento_dir);
    }
    $('#cidade_nome').text(msg.city.name);
    $('#cidade_pais').text(msg.city.country);

    prev_dias_select = $('.previsao_3h');
    btn_dia1_select = $('#btn_dia_1');
    btn_dia2_select = $('#btn_dia_2');
    btn_dia3_select = $('#btn_dia_3');
    btn_dia4_select = $('#btn_dia_4');
    btn_dia5_select = $('#btn_dia_5');
    btn_dia_select = $('.btn_dia');
});

function atribuir_dias() {

    let dados_json = msg.list;
    let temp_min_max = [];
    let temp_min = 999;
    let temp_max = -999;
    let len_temp_min_max = 0;

    for (let i = 0; i < 40; i++) {
        let array_data_hora = dados_json[i].dt_txt.split(" ");
        let json_data = array_data_hora[0];

        let json_temp_min = dados_json[i].main.temp_min;
        let json_temp_max = dados_json[i].main.temp_max;

        if (len_temp_min_max === 0) {
            len_temp_min_max = temp_min_max.push({"data": json_data, "temp_min": json_temp_min, "temp_max": json_temp_max});
            console.log (temp_min_max[i].data+" "+temp_min_max[i].temp_min+" "+temp_min_max[i].temp_max);
        }

        console.log(json_data);

        if (json_data > temp_min_max[len_temp_min_max - 1].data) {
            len_temp_min_max = temp_min_max.push({"data": json_data, "temp_min": temp_min, "temp_max": temp_max});

            temp_min = 999;
            temp_max = -999;
        } else {
            if (json_temp_min < temp_min) {
                temp_min = json_temp_min;
            }
            if (json_temp_max > temp_max) {
                temp_max = json_temp_max;
            }
        }
    }

    temp_min_max.forEach(function (elemento) {
        console.log("Dia -> "+elemento.data+"Min -> "+elemento.temp_min+" Max ->"+elemento.temp_max);
    });

    return temp_min_max;


}




//----Função que retorna o ponto cardeal segundo o grau que é dado
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

//---->Função que esconde o Container Previsão 3h
//-------->Limpa também a formatação verde do botão do dia anteriormente selecionado
function esconde_cont_prev_dias() {
    prev_dias_select.hide();
    btn_dia_select.css("background-color", "powderblue");
}

//---->Função que mostra o Container Previsão 3h
//-------->Coloca também a formatação verde do botão do dia selecionado
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

//---->Função que controla mostrar/esconder o Container Previsão
function esconde_mostra_cont_signif(div_dia) {

    if (ultimo_botao_dia_clicado === null) {
        ultimo_botao_dia_clicado = div_dia;
        mostra_cont_prev_dias(div_dia);
        descritivo_3h(div_dia);
    } else {
        if (ultimo_botao_dia_clicado === div_dia) {
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

//Função que preenche a tabela discrivida de 3h em 3h para o dia selecionado
//Preenche o cabeçalho da tabela com as horas de forma dinâmica
//Preenche o conteudo da tabela de forma dinamica
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

