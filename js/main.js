'use strict';

//---------------------------------------------Página Home--------------------------------------
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
//const PLACES_API_ADDRESS_COMPONENTS_COUNTRY_SHORT_NAME = 3;
const responseOK = 200;
const PEDIR_TEMPO_ACTUAL = 1;
const PEDIR_SIGNIFICATIVA = 2;

function inicilizar_autocomplete(pedido,destino) {
    var input = document.getElementById('searchTextField');
    autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        fazer_pedido(1,"tempo_atual");
    });
}



function fazer_pedido(pedido,destinolocalstorage){
    let pedido_construido = construir_pedido(pedido);
    $.ajax({
        method: 'GET',
        url: pedido_construido
    }).done(function (msg) {
        if(parseInt(msg.cod) !== responseOK){
            console.log(msg.cod);
            alert("Erro: " + msg.cod + "\n" + msg.message);
        } else if(typeof Storage !== "undefined"){
            //código para webStorage Api
            if (pedido === PEDIR_TEMPO_ACTUAL) {
                console.log('Obj JSON: ' + typeof msg, msg);
                localStorage.setItem(destinolocalstorage, JSON.stringify(msg));
                let obj_str = localStorage.getItem('tempo_atual');
                console.log(obj_str);
            }
            if (pedido === PEDIR_SIGNIFICATIVA){
                console.log(msg);
                localStorage.setItem(destinolocalstorage, JSON.stringify(msg));
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

//---------------------------------------------Página Detalhes--------------------------------------
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

/*
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
}*/


//---------------------------------------------Página Singificativa--------------------------------------
//----Constantes
const cor_meteo_verde_claro = "#84cab2";
const cor_meteo_azul_claro = "#82befd";
const cor_meteo_verde_vivo = "#1c9f73";
const cor_meteo_azul_vivo = "#0687fc";


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

//----Função OnLoad Página Significativa
//Prenche e clona os 5 dias da previsão
function renderizar_significativa() {
    //Clone dos blocos de html
    item_coluna_hora = $('.coluna_hora').clone();
    $('.linha_hora').html('');
    item_coluna_dia_h_0 = $('.coluna_dia_h_0').clone();
    item_coluna_dia = $('.coluna_dia').clone();
    $('.linha_dia').html('');
    item_bloco_dia = $('.bloco_dia').clone();
    $('.linha_blocos').html('');

    let json_min_max = atribuir_dias();

    for (let i = 1, dados = 0; i <= 5; i++, dados = dados + 8) {

        let item_bloco_dia_clone = item_bloco_dia.clone();

        let dados_json = msg.list[dados];
        let date_time = new Date(dados_json.dt_txt),
            dia = date_time.getDate(),
            mes = date_time.getMonth(),
            ano = date_time.getFullYear(),
            dia_sem = date_time.getDay();
        let vento_vel = (dados_json.wind.speed * 3.6).toFixed(0);
        let vento_dir = dados_json.wind.deg;
        let humidade = dados_json.main.humidity;
        let temp_min = json_min_max[i].temp_min;
        let temp_max = json_min_max[i].temp_max;

        $(item_bloco_dia_clone).attr("id","dia_"+i);
        $('.btn_dia',item_bloco_dia_clone).attr("id","btn_dia_"+i);
        $('.btn_dia',item_bloco_dia_clone).attr("onclick","esconde_mostra_cont_signif("+i+")");
        $('.data',item_bloco_dia_clone).text(dia + "/" + meses_abrv[mes]);
        $('.dia', item_bloco_dia_clone).text(dias_semana[dia_sem]);
        $('.temp_min', item_bloco_dia_clone).text(temp_min+"º");
        $('.temp_max', item_bloco_dia_clone).text(temp_max+"º");
        $('.vento_vel', item_bloco_dia_clone).text(vento_vel + " km/h");
        $('.vento_dir',item_bloco_dia_clone).text(ponto_cardeal(parseInt(vento_dir)));
        $('.humidade', item_bloco_dia_clone).text(humidade+"%");

        $('.linha_blocos').append(item_bloco_dia_clone);

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
}

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
    //temp_min_max.forEach(function (elemento) {
    //    console.log("Dia -> "+elemento.data+"Min -> "+elemento.temp_min+" Max ->"+elemento.temp_max);
    //});
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
    btn_dia_select.css("background-color", "#fff");
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



//let json_string = localStorage.getItem("tempo_atual");
//let json = JSON.parse(json_string);
let item_media = null;

let array_fav = [];
let len_array_fav;
let str_cid;
let str_url;


function inicializar_autocomplete_pag_fav() {
    let input = document.getElementById('searchTextField');
    autocomplete = new google.maps.places.Autocomplete(input);
    //google.maps.event.addListener(autocomplete, 'place_changed', function () {
    //});
}

function apagar_favorito(pos) {

    let lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    array_fav = JSON.parse(lstorage_array_favoritos);
    array_fav.splice(pos,1);
    localStorage.setItem('array_favoritos',JSON.stringify(array_fav));
    window.location.href=window.location.href;

}

let obj_lstorage_array_favoritos = [];

function actualiza_home(pos) {
    console.log("Função actualiza_home")

    let x = $("#cbox_vis_home_" + (pos + 1)).is(":checked");

    if (x) {
        var new_valor_vis_home = 1;
    } else {
        new_valor_vis_home = 0;
    }
    console.log("Valor de x -> "+x);
    console.log("new_valor_vis_home -> "+new_valor_vis_home);

    let str_lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    obj_lstorage_array_favoritos = JSON.parse(str_lstorage_array_favoritos);
    obj_lstorage_array_favoritos[pos].visivel_home = new_valor_vis_home;
    console.log(obj_lstorage_array_favoritos);
    localStorage.setItem('array_favoritos', JSON.stringify(obj_lstorage_array_favoritos));
}

function adicionar_favorito() {
    console.log("Função adicionar favorito");

    place= autocomplete.getPlace();
    console.log(place);
    if (place===undefined){
        alert("Não selecionou nenhuma cidade");
        return;
    }
    str_cid = place.address_components[PLACES_API_ADDRESS_COMPONENTS_CITY_LONG_NAME].long_name + "," + place.address_components[PLACES_API_ADDRESS_COMPONENTS_COUNTRY_SHORT_NAME].short_name;

    $.ajax({
        method: 'GET',
        url: construir_pedido_por_cidade(PEDIR_TEMPO_ACTUAL, str_cid)
    }).done(function (msg) {
        if(parseInt(msg.cod) !== responseOK) {
            console.log(msg.cod);
            alert("Erro: " + msg.cod + "\n" + msg.message);
            return;
        }
        else {
            console.log(msg);
            console.log(str_cid);
            let str_lstorage_array_favoritos = localStorage.getItem('array_favoritos');
            if (str_lstorage_array_favoritos === null) {
                let len_obj_lstorage_array_favoritos = obj_lstorage_array_favoritos.push({"cidade":msg,"visivel_home":0});
                console.log(obj_lstorage_array_favoritos);
                localStorage.setItem('array_favoritos', JSON.stringify(obj_lstorage_array_favoritos));
            } else {
                obj_lstorage_array_favoritos = JSON.parse(str_lstorage_array_favoritos);
                let len_obj_lstorage_array_favoritos = obj_lstorage_array_favoritos.push({"cidade":msg,"visivel_home":0});
                localStorage.setItem('array_favoritos', JSON.stringify(obj_lstorage_array_favoritos));
            }
            window.location.href=window.location.href;
        }
    });


}


function limpar_array_favoritos() {
    localStorage.removeItem("array_favoritos");
}
function ler_array (){
    let lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    obj_lstorage_array_favoritos = JSON.parse(lstorage_array_favoritos);
    console.log("Função ler array");
    obj_lstorage_array_favoritos.forEach(function (elemento) {
        console.log(elemento.cidade);
        console.log(elemento.visivel_home);
    });

}

function construir_pedido_por_cidade(tipo_pedido,city) {

    let unidade = "&units="+localStorage.getItem('unidade');

    if (tipo_pedido === 1){
        let pedido_tempo_actual = API_WEATHER_URL+city+unidade+API_KEY;
        console.log(pedido_tempo_actual);
        return pedido_tempo_actual;
    }

    if (tipo_pedido === 2){
        let pedido_significativa = API_FORECAST_URL+city+unidade+API_KEY;
        return pedido_significativa;
    }
}

function renderizar_pag_favoritos(){

    item_media = $('.lista_filho').clone();
    $('.lista_mae').html('');

    let str_lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    let obj_lstorage_array_favoritos = JSON.parse(str_lstorage_array_favoritos);
    console.log("Conteudo local storage");
    console.log(obj_lstorage_array_favoritos);

    if (obj_lstorage_array_favoritos===null) {
        console.log("Array vazio");
    } else {

        for (let i = 0; i < obj_lstorage_array_favoritos.length; i++) {


            let json = obj_lstorage_array_favoritos[i].cidade;
            console.log(json);

            let item_media_clone = item_media.clone();
            $('.btn_rm_fav',item_media_clone).attr("id","btn_rm_fav_"+(i+1));
            $('.btn_rm_fav',item_media_clone).attr("onclick","apagar_favorito("+i+")");

            $('.cbox_input_vis_home',item_media_clone).attr("id","cbox_vis_home_"+(i+1));
            $('.cbox_input_vis_home',item_media_clone).attr("onclick","actualiza_home("+i+")");

            if (obj_lstorage_array_favoritos[i].visivel_home===0){
                var load_cbox = false;
            } else {
                load_cbox = true;
            }

            $('.cbox_input_vis_home',item_media_clone).attr('checked',load_cbox);

            $('.cbox_label_vis_home',item_media_clone).attr("for","cbox_vis_home_"+(i+1));


            $('.cidade', item_media_clone).text(json.name);
            $('.temp_max', item_media_clone).text(json.main.temp_max + 'º C');
            $('.temp_min', item_media_clone).text(json.main.temp_min + 'º C');
            $('.vento_vel', item_media_clone).text(parseInt(json.wind.speed * 3.6) + ' Km/h');
            $('.humidade', item_media_clone).text(json.main.humidity + '%');

            $('.lista_mae').append(item_media_clone);
        }
    }
    inicializar_autocomplete_pag_fav();
}

