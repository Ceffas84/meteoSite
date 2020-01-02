"use strict";

const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=Leiria,pt&units=metric&";

let item_coluna_hora = null;
let item_coluna_dia_h_0 = null;
let item_coluna_dia_h_1 = null;
let item_coluna_dia = null;
let item_linha_dia = null;

const dias_semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

$(function () {
    item_coluna_hora = $('.coluna_hora').clone();
    $('.linha_hora').html('');
    item_coluna_dia_h_0 = $('.coluna_dia_h_0').clone();
    item_coluna_dia_h_1 = $('.coluna_dia_h_1').clone();
    item_coluna_dia = $('.coluna_dia').clone();
    $('.linha_dia').html('');
    item_linha_dia = $('.linha_dia').clone();

    $('.dados_dia').html('');
    let msg = JSON.parse(sessionStorage.getItem("resposta"));
    console.log(msg);
    console.log(typeof msg);

    $.ajax({
        method: "GET",
        url: API_URL + API_KEY
    }).done(function (msg) {
//Preenche o cabeçalho da tabela com as horas da API
    for (var i = -2; i < 8; i++) {
        var item_coluna_hora_clone = item_coluna_hora.clone();
        switch (i) {
            case -2:
                $('.conteudo_hora', item_coluna_hora_clone).text("Dia");
                $('.linha_hora').append(item_coluna_hora_clone);
                break;
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
                var elemento = msg.list[i];
                var dataehora = elemento.dt_txt.split(" ");
                var hora = dataehora[1];
                $('.conteudo_hora', item_coluna_hora_clone).text(parseInt((hora.split(":"))[0]) + "h");
                $('.linha_hora').append(item_coluna_hora_clone);
        }
    }

    for (var i = 0, a = 0; i < 40; i = i + 8, a++) {
        var linha_dia_clone = item_linha_dia.clone();
        var coluna_dia_h_0_clone = item_coluna_dia_h_0.clone();
        var coluna_dia_h_1_clone = item_coluna_dia_h_1.clone();
        var elemento = msg.list[i];
        var date_time = new Date(elemento.dt_txt),
            dia = date_time.getDate(),
            mes = date_time.getMonth(),
            ano = date_time.getFullYear(),
            dia_sem = date_time.getDay();


        $('.dia_sem', coluna_dia_h_0_clone).text(dias_semana[dia_sem]);
        $('.dia_mes', coluna_dia_h_0_clone).text(dia + " de " + meses[mes] + " de " + ano);
        $(linha_dia_clone).append(coluna_dia_h_0_clone);
        $(linha_dia_clone).append(coluna_dia_h_1_clone);


        for (var j = i; j < i + 8; j++) {
            var coluna_dia_clone = item_coluna_dia.clone();

            var elemento1 = msg.list[j];
            var temperatura = (elemento1.main.temp).toFixed(0);
            var vento_vel = (elemento1.wind.speed * 3.6).toFixed(0);
            var vento_dir = elemento1.wind.deg;

            $('.temperatura', coluna_dia_clone).text(temperatura + "º");
            $('.vento_vel', coluna_dia_clone).text(vento_vel + " km/h");
            $('.vento_dir', coluna_dia_clone).text(vento_dir);
            $(linha_dia_clone).append(coluna_dia_clone);
            console.log("i -> ", i, " j-> ", j, "Data -> ", elemento.dt_txt, "Temp. -> ", temperatura, "Vel. Vento -> ", vento_vel);
        }

        $('.dados_dia').append(linha_dia_clone);

    }

});


