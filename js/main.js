'use strict';

let autocomplete, place, foto_url; //variaveis auxiliares à função de autocomplete

if (localStorage.getItem('unidade') == undefined) {
    localStorage.setItem('unidade', 'metric');
}

//---------------------------------------------CONSTANTES--------------------------------------
const API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?q=";
const API_FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast?q=";
const API_KEY = "&APPID=5f641b8ef2e6971af3d88024c6489ebf";
const responseOK = 200;
const API_TEMPO_ATUAL = 1;
const API_SIGNIFICATIVA = 2;
const SUCESSO = 1;
const INSUCESSO = 0;

const PONTOS_CARDEAIS = [{"ponto": "N", "grau_ini": 337, "grau_fim": 22},
    {"ponto": "NE", "grau_ini": 23, "grau_fim": 67},
    {"ponto": "E", "grau_ini": 68, "grau_fim": 112},
    {"ponto": "SE", "grau_ini": 113, "grau_fim": 157},
    {"ponto": "S", "grau_ini": 158, "grau_fim": 202},
    {"ponto": "SO", "grau_ini": 203, "grau_fim": 247},
    {"ponto": "O", "grau_ini": 248, "grau_fim": 292},
    {"ponto": "NO", "grau_ini": 293, "grau_fim": 337},];
const DIAS_SEMANA = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const MESES_ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

//---------------------------------------------VARIAVEIS GLOBAIS--------------------------------------
let item_coluna_hora = null;
let item_coluna_dia_h_0 = null;
let item_coluna_dia = null;
let item_bloco_dia = null;
let ultimo_botao_dia_clicado = null;
let btn_dia1_select = null;
let btn_dia2_select = null;
let btn_dia3_select = null;
let btn_dia4_select = null;
let btn_dia5_select = null;
let btn_dia_select = null;
let prev_dias_select = null;

let item_media = null;
let obj_lstorage_array_favoritos = [];


function inicializar_autocomplete() {
    let input = document.getElementById('searchTextField');
    autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
    });
}

function btn_submeter() {

    place = autocomplete.getPlace();
    let cidade_pais = autocomplete_cidade_pais(place);

    let foto_url = place.photos[0].getUrl();
    localStorage.setItem('foto_url', foto_url);

    let cidade = JSON.stringify(get_obj_api_opewheather(cidade_pais, API_TEMPO_ATUAL));
    localStorage.setItem('tempo_atual', cidade);


    alert("a submeter");
}

/*function fazer_pedido(pedido, destinolocalstorage) {
    let pedido_construido = construir_pedido(pedido);
    $.ajax({
        method: 'GET',
        async: false,
        url: pedido_construido,
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    }).done(function (msg) {
        console.log('Entrou: ' + msg.cod);
        if (parseInt(msg.cod) !== responseOK) {
            console.log(msg.cod);
            alert("Erro: " + msg.cod + "\n" + msg.message);
        } else if (typeof Storage !== "undefined") {
            //código para webStorage Api
            localStorage.setItem(destinolocalstorage, JSON.stringify(msg));
        } else {
            alert("Web Storage não suportado.");
        }
    });
}


function construir_pedido(tipo_pedido) {
    let cidade, pais, cidadePais;

    if (autocomplete !== undefined) {
        let sitio = autocomplete.getPlace();

        cidade = sitio.address_components[LOCALITY].long_name;

        if (sitio.address_components.length <= ADDRESS_COMPONENT_SIZE) {
            pais = sitio.address_components[ADMINISTRATIVE_LEVEL_2].short_name;
        } else {
            pais = sitio.address_components[ADMINISTRATIVE_LEVEL_3].short_name;
        }

        cidadePais = cidade + ',' + pais;
        foto_url = sitio.photos[0].getUrl();
    } else {
        cidadePais = $("#nome_cidade").text();
    }
    localStorage.setItem('foto_url', foto_url);

    let unidade = "&units=" + localStorage.getItem('unidade');

    if (tipo_pedido === PEDIR_TEMPO_ACTUAL) {
        let pedido_tempo_actual = API_WEATHER_URL + cidadePais + unidade + API_KEY;
        return pedido_tempo_actual;
    }

    if (tipo_pedido === PEDIR_SIGNIFICATIVA) {
        let pedido_significativa = API_FORECAST_URL + cidadePais + unidade + API_KEY;
        return pedido_significativa;
    }
}*/

//---------------------------------------------Página Home---------------------------------------
function renderizar_fav_pag_home() {

    $('.linha_blocos').html('');

    let response_str = localStorage.getItem('array_favoritos');
    let msg = JSON.parse(response_str);
    if (msg != null) {
        let unidade = localStorage.getItem('unidade') == "metric" ? "C" : "F";
        let unidade_vel = localStorage.getItem('unidade') === 'metric' ? 'km/h' : 'mph/h';
        console.log(unidade);
        for (let i = 0; i < msg.length; i++) {
            if (msg[i].visivel_home === 1) {
                let item_bloco_dia_clone = item_bloco_dia.clone();
                console.log(msg[i].str_cidade_api);
                let dados_json = get_obj_api_opewheather(msg[i].str_cidade_api, API_TEMPO_ATUAL);
                console.log(dados_json);
                let nome_cidade = dados_json.name + ', ' + dados_json.sys.country;
                let vento_vel = (dados_json.wind.speed * 3.6).toFixed(0);
                let vento_dir = dados_json.wind.deg;
                let humidade = dados_json.main.humidity;
                let temp_min = dados_json.main.temp_min.toFixed(0);
                let temp_max = dados_json.main.temp_max.toFixed(0);
                $('.nome-cidade', item_bloco_dia_clone).text(nome_cidade);
                $('.temp_min', item_bloco_dia_clone).text(temp_min + "º" + unidade);
                $('.temp_max', item_bloco_dia_clone).text(temp_max + "º" + unidade);
                $('.vento_vel', item_bloco_dia_clone).text(vento_vel + " km/h");
                $('.vento_dir', item_bloco_dia_clone).text(ponto_cardeal(parseInt(vento_dir)));
                $('.humidade', item_bloco_dia_clone).text(humidade + "%");
                $('.linha_blocos').append(item_bloco_dia_clone);
            }
        }
    }

}

function renderizar_pag_home() {
    item_bloco_dia = $('.bloco_dia').clone();
    $('.linha_blocos').html('');
    let unidade = localStorage.getItem('unidade');
    if (unidade === "metric") {
        $('#rbtn_metric').prop("checked",true);
    } else {
        $('#rbtn_imperial').prop("checked",true);
    }
    renderizar_fav_pag_home();
    inicializar_autocomplete();
}


function GuardarUnidade() {
    let un = $("input[name='options']:checked").val();
    if (un === 'metric') {
        localStorage.setItem('unidade', 'metric');
    } else {
        localStorage.setItem('unidade', 'imperial');
    }
    console.log(localStorage.getItem('unidade'));

    renderizar_fav_pag_home();
}

//---------------------------------------------Página Detalhes--------------------------------------
function renderizar_pag_detalhes() {
    let response_str = localStorage.getItem('tempo_atual');
    //console.log(typeof response_str, response_str);
    let response_json = JSON.parse(response_str);
    //console.log(typeof response_json, response_json);
    foto_url = localStorage.getItem('foto_url');
    //console.log(typeof foto_url, foto_url);
    let unidade = localStorage.getItem('unidade') === 'metric' ? '.º C' : '.º F';
    let unidade_vel = localStorage.getItem('unidade') === 'metric' ? 'km/h' : 'mph/h';
    $('#nome_cidade').text(response_json.name);
    $('#detalhes_imagem_cidade').attr('alt', response_json.name);
    $('#detalhes_imagem_cidade').attr('src', foto_url);
    $('#valor_1').text(response_json.main.temp + unidade);
    $('#valor_2').text(response_json.main.temp_max + unidade);
    $('#valor_3').text(response_json.main.temp_min + unidade);
    $('#valor_4').text(converter_para_kms_hora(response_json.wind.speed) + ' Kms/h');
    $('#valor_5').text(response_json.main.pressure + ' hPa');
    $('#valor_6').text(response_json.main.humidity + '%');
    $('#valor_7').text('Lon: ' + response_json.coord.lon + ', Lat: ' + response_json.coord.lat);
}

function converter_para_kms_hora(n) {
    n = (n * 60 * 60) / 1000;
    return Math.round(n);
}

function btn_adc_fav_pag_det() {
    let response_str = localStorage.getItem('tempo_atual');
    //console.log(typeof response_str, response_str);
    let response_json = JSON.parse(response_str);
    let str_cidade_pais = response_json.name + ',' + response_json.sys.country;
    //Informa o utilizador do sucesso ou não da introdução da cidade nos favoritos
    if (adicionar_favorito(str_cidade_pais) === INSUCESSO) {
        alert("A cidade já existe nos favoritos.");
    } else {
        alert('A cidade foi adicionada com sucesso aos favoritos.');
    }
}

function btn_go_signif_pag_det() {
    let obj_tempo_atual = JSON.parse(localStorage.getItem('tempo_atual'));
    let cidade_pais = obj_tempo_atual.name + "," + obj_tempo_atual.sys.country;
    let obj_significativa = get_obj_api_opewheather(cidade_pais, API_SIGNIFICATIVA)
    let str_significativa = JSON.stringify(obj_significativa);
    localStorage.setItem('significativa', str_significativa);
}

//----Função OnLoad Página Significativa
//Prenche e clona os 5 dias da previsão
function renderizar_significativa() {
    let response_str = localStorage.getItem('significativa');
    let msg = JSON.parse(response_str);
    console.log(msg);
    let unidade_temp = localStorage.getItem('unidade') === 'metric' ? 'C' : 'F';
    let unidade_vel = localStorage.getItem('unidade') === 'metric' ? 'km/h' : 'mph/h';
    //Clone dos blocos de html
    item_coluna_hora = $('.coluna_hora').clone();
    $('.linha_hora').html('');
    item_coluna_dia_h_0 = $('.coluna_dia_h_0').clone();
    item_coluna_dia = $('.coluna_dia').clone();
    $('.linha_dia').html('');
    item_bloco_dia = $('.bloco_dia').clone();
    $('.linha_blocos').html('');
    let json_min_max = atribuir_dias(msg.list);
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
        let temp_min = json_min_max[i - 1].temp_min;
        let temp_max = json_min_max[i - 1].temp_max;
        $(item_bloco_dia_clone).attr("id", "dia_" + i);
        $('.btn_dia', item_bloco_dia_clone).attr("id", "btn_dia_" + i);
        $('.btn_dia', item_bloco_dia_clone).attr("onclick", "esconde_mostra_cont_signif(" + i + ")");
        $('.data', item_bloco_dia_clone).text(dia + "/" + MESES_ABREV[mes]);
        $('.dia', item_bloco_dia_clone).text(DIAS_SEMANA[dia_sem]);
        $('.temp_min', item_bloco_dia_clone).text(temp_min + "º" + unidade_temp);
        $('.temp_max', item_bloco_dia_clone).text(temp_max + "º" + unidade_temp);
        $('.vento_vel', item_bloco_dia_clone).text(vento_vel + " km/h");
        $('.vento_dir', item_bloco_dia_clone).text(ponto_cardeal(parseInt(vento_dir)));
        $('.humidade', item_bloco_dia_clone).text(humidade + "%");
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

function atribuir_dias(json) {
    let temp_min_max = [];
    let len_temp_min_max = 0;
    console.log(json);
    for (var i = 0; i < 40; i++) {
        var data_hora = json[i].dt_txt.split(" ");
        var json_data = data_hora[0];
        var json_data_dia = new Date(json[i].dt_txt).getDate();
        var json_temp_min = json[i].main.temp_min;
        var json_temp_max = json[i].main.temp_max;

        if (i === 0) {
            len_temp_min_max = temp_min_max.push({
                "data": json_data,
                "temp_min": json_temp_min,
                "temp_max": json_temp_max
            });
        } else {
            var array_data = new Date(temp_min_max[len_temp_min_max - 1].data).getDate();
            if (json_data_dia > array_data) {
                len_temp_min_max = temp_min_max.push({
                    "data": json_data,
                    "temp_min": json_temp_min,
                    "temp_max": json_temp_max
                });
            } else {
                if (json_temp_min < temp_min_max[len_temp_min_max - 1].temp_min) {
                    temp_min_max[len_temp_min_max - 1].temp_min = json_temp_min;
                }
                if (json_temp_max > temp_min_max[len_temp_min_max - 1].temp_max) {
                    temp_min_max[len_temp_min_max - 1].temp_max = json_temp_max;
                }
            }
        }
    }
    console.log(temp_min_max);
    return temp_min_max;
}

//----Função que retorna o ponto cardeal segundo o grau que é dado
function ponto_cardeal(grau) {
    if (grau >= 0 && grau <= 359) {
        for (let i = 0; i < PONTOS_CARDEAIS.length; i++) {
            //console.log(grau, PONTOS_CARDEAIS.length);
            if (grau > PONTOS_CARDEAIS[i].grau_ini && grau <= PONTOS_CARDEAIS[i].grau_fim) {
                //console.log(i + " -> " + PONTOS_CARDEAIS[i].ponto);
                return PONTOS_CARDEAIS[i].ponto;
            }
        }
        return PONTOS_CARDEAIS[0].ponto;
    } else {
        return;
        console.log("Erro - grau tem de estar entre 0 e 359");
    }
}

function esconde_cont_prev_dias() { //---->Função que esconde o Container Previsão 3h
    prev_dias_select.hide();
    btn_dia_select.css("background-color", "unset");
}

//---->Função que mostra o Container Previsão 3h
//-------->Coloca também a formatação verde do botão do dia selecionado
function mostra_cont_prev_dias(div_dia) {
    prev_dias_select.show();
    switch (div_dia) {
        case 1:
            btn_dia1_select.css("background-color", "#84cab2");
            break;
        case 2:
            btn_dia2_select.css("background-color", "#84cab2");
            break;
        case 3:
            btn_dia3_select.css("background-color", "#84cab2");
            break;
        case 4:
            btn_dia4_select.css("background-color", "#84cab2");
            break;
        case 5:
            btn_dia5_select.css("background-color", "#84cab2");
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
            ultimo_botao_dia_clicado = null;
        } else {
            ultimo_botao_dia_clicado = div_dia;
            esconde_cont_prev_dias();
            mostra_cont_prev_dias(div_dia);
            descritivo_3h(div_dia);
        }
    }
    console.log("Botao clicado -> " + div_dia + " Estado visibilidade->");
}

//Função que preenche a tabela discrivida de 3h em 3h para o dia selecionado
//Preenche o cabeçalho da tabela com as horas de forma dinâmica
//Preenche o conteudo da tabela de forma dinamica
function descritivo_3h(div_dia) {
    let response_str = localStorage.getItem('significativa');
    let msg = JSON.parse(response_str);
    let unidade_temp = localStorage.getItem('unidade') == "metric" ? "C" : "F";
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
                var elemento = msg.list[i + (div_dia * 8) - 8];
                var dataehora = elemento.dt_txt.split(" ");
                var hora = dataehora[1];
                $('.conteudo_hora', item_coluna_hora_clone).text(parseInt((hora.split(":"))[0]) + "h");
                $('.linha_hora').append(item_coluna_hora_clone);
        }
    }
    /*alterei 8/1 22:16* de var para let*/
    let coluna_dia_h_0_clone = item_coluna_dia_h_0.clone();
    $('.linha_dia').append(coluna_dia_h_0_clone);
    for (let i = ((div_dia * 8) - 8), j = 0; j < 8; i++, j++) {
        let coluna_dia_clone = item_coluna_dia.clone();
        let elemento1 = msg.list[i];
        let temperatura = (elemento1.main.temp).toFixed(0);
        let vento_vel = (elemento1.wind.speed * 3.6).toFixed(0);
        let vento_dir = elemento1.wind.deg;
        let humidade = elemento1.main.humidity;
        let press_atmosferica = elemento1.main.pressure + " hPa";


        $('.temperatura', coluna_dia_clone).text(temperatura + "º" + unidade_temp);
        $('.vento_vel', coluna_dia_clone).text(vento_vel + " km/h");
        $('.vento_dir', coluna_dia_clone).text(ponto_cardeal(parseInt(vento_dir)));
        $('.humidade', coluna_dia_clone).text(humidade);
        $('.press_atmos', coluna_dia_clone).text(press_atmosferica);


        $('.linha_dia').append(coluna_dia_clone);
        //console.log("i -> ", i, " j-> ", j, "Data -> ", elemento.dt_txt, "Temp. -> ", temperatura, "Vel. Vento -> ", vento_vel, "Direcao Vento", vento_dir);
    }
}

function autocomplete_cidade_pais(place) { //retorna  a cidade e pais no formato colocar no url do pedido a API (ex. Lisboa,PT)
    let api_adcomp_type_country;
    for (let i = 0; i < place.address_components.length; i++) {
        if (place.address_components[i].types[0] === "country") {
            api_adcomp_type_country = i;
            return place.address_components[0].long_name + "," + place.address_components[api_adcomp_type_country].short_name;
        }
    }
}

function renderizar_pag_favoritos() {
    item_media = $('.lista_filho').clone();
    $('.lista_mae').html('');
    render_lista_favoritos();
    inicializar_autocomplete();
}

function render_lista_favoritos() {
    $('.lista_mae').html('');
    let str_lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    let lstorage_array_favoritos = JSON.parse(str_lstorage_array_favoritos);
    let unidade = localStorage.getItem('unidade');
    let unidade_temp = unidade == "metric" ? "C" : "F";
    let unidade_vel = unidade == 'metric' ? ' km/h' : ' m/h';
    if (lstorage_array_favoritos === null) {
    } else {
        for (let i = 0; i < lstorage_array_favoritos.length; i++) {
            let json = get_obj_api_opewheather(lstorage_array_favoritos[i].str_cidade_api, API_TEMPO_ATUAL);
            let item_media_clone = item_media.clone();
            $('.btn_rm_fav', item_media_clone).attr("id", "btn_rm_fav_" + (i + 1));
            $('.btn_rm_fav', item_media_clone).attr("onclick", "apagar_favorito(" + i + ")");
            $('.cbox_input_vis_home', item_media_clone).attr("id", "cbox_vis_home_" + (i + 1));
            $('.cbox_input_vis_home', item_media_clone).attr("onclick", "atualiza_fav_vis_home(" + i + ")");
            if (lstorage_array_favoritos[i].visivel_home === 0) {
                var load_cbox = false;
            } else {
                load_cbox = true;
            }
            $('.cbox_input_vis_home', item_media_clone).attr('checked', load_cbox);
            $('.cbox_label_vis_home', item_media_clone).attr("for", "cbox_vis_home_" + (i + 1));
            $('.cidade', item_media_clone).text(json.name);
            $('.temp_max', item_media_clone).text(json.main.temp_max + 'º' + unidade_temp);
            $('.temp_min', item_media_clone).text(json.main.temp_min + 'º' + unidade_temp);
            let speed = unidade == "metric" ? converter_para_kms_hora(json.wind.speed) : json.wind.speed;
            $('.vento_vel', item_media_clone).text(speed + unidade_vel);
            $('.vento_dir', item_media_clone).text(ponto_cardeal(parseInt(json.wind.deg)));
            $('.humidade', item_media_clone).text(json.main.humidity + '%');
            $('.lista_mae').append(item_media_clone);
        }
    }
}

function adicionar_favorito(str_cidade) {
    let str_lstorage_array_favoritos = localStorage.getItem('array_favoritos');

    //Verificamos se o array dos favoritos no array no localstorage tem cidades
    if (str_lstorage_array_favoritos === null) {   //Se não tem, introduzimos a cidade selecionada
        obj_lstorage_array_favoritos.push({
            "str_cidade_api": str_cidade,
            "visivel_home": 0
        });
        localStorage.setItem('array_favoritos', JSON.stringify(obj_lstorage_array_favoritos));
        return SUCESSO;
    } else {   //Se o array já tem cidades, verificamos se a cidade selecionada não existe
        if (existe_cidade(str_cidade) === 0) {
            obj_lstorage_array_favoritos = JSON.parse(str_lstorage_array_favoritos);
            obj_lstorage_array_favoritos.push({
                "str_cidade_api": str_cidade,
                "visivel_home": 0
            });
            localStorage.setItem('array_favoritos', JSON.stringify(obj_lstorage_array_favoritos));

            return SUCESSO;
        } else {
            //alert("A cidade selecionada já existe nos favoritos");
            return INSUCESSO;
        }
    }
}

function btn_adc_fav_pag_fav() {
    //Verificamos se foi introduzida uma cidade no autocomplete da Google
    //Se está undefinded, alertamos o utilizador que não selecionou cidade
    place = autocomplete.getPlace();
    if (place === undefined) {
        alert("Não selecionou nenhuma cidade");
        return;
    }
    //Se sim fazemos a string da cidade para fazer o pedido à API
    //Verificamos se existe a a cidade na API OPENWHEATHER
    let str_cidade_pais = autocomplete_cidade_pais(place);

    if (get_obj_api_opewheather(str_cidade_pais, API_TEMPO_ATUAL) === INSUCESSO) {
        alert("Cidade não existe na API.");
        return;
    }
    //Informa o utilizador do sucesso ou não da introdução da cidade nos favoritos
    if (adicionar_favorito(str_cidade_pais) === INSUCESSO) {
        alert("A cidade já existe nos favoritos.");
    } else {
        render_lista_favoritos();
    }
}


function existe_cidade(str_cidade_pais) {
    var str_lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    var obj_lstorage_array_favoritos = JSON.parse(str_lstorage_array_favoritos);
    console.log(obj_lstorage_array_favoritos);
    if (obj_lstorage_array_favoritos === null) {
        return 0;
    }
    let contar = 0;
    for (let i = 0; i < obj_lstorage_array_favoritos.length; i++) {
        if (obj_lstorage_array_favoritos[i].str_cidade_api === str_cidade_pais) {
            return 1;
        }
    }
    return 0;
}

function get_obj_api_opewheather(cidade, api) {
    let unidade = "&units=" + localStorage.getItem('unidade');
    let pedido_construido;
    let resultado;
    if (api === API_TEMPO_ATUAL) {
        pedido_construido = API_WEATHER_URL + cidade + unidade + API_KEY;
    }
    if (api === API_SIGNIFICATIVA) {
        pedido_construido = API_FORECAST_URL + cidade + unidade + API_KEY;
    }
    console.log(pedido_construido);

    $.ajax({
        method: 'GET',
        async: false,
        url: pedido_construido,
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            resultado = INSUCESSO;
        }
    }).done(function (msg) {
        if (parseInt(msg.cod) !== responseOK) {
            console.log("Erro 200 -> " + msg.cod);
            alert("Erro: " + msg.cod + "\n" + msg.message);
            resultado = INSUCESSO;
        } else {
            resultado = msg;
        }
    });
    return resultado;
}

function qtd_cidades_visiveis() {
    let str_obj_lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    let obj_lstorage_array_favoritos = JSON.parse(str_obj_lstorage_array_favoritos);
    let contar = 0;
    for (let i = 0; i < obj_lstorage_array_favoritos.length; i++) {
        if (obj_lstorage_array_favoritos[i].visivel_home === 1) {
            contar++;
        }
    }
    return contar;
}

function apagar_favorito(pos) {     //Apaga um regito do array dos favoritos
    let lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    let obj_lstorage_array_favoritos = JSON.parse(lstorage_array_favoritos);
    obj_lstorage_array_favoritos.splice(pos, 1);
    localStorage.setItem('array_favoritos', JSON.stringify(obj_lstorage_array_favoritos));
    render_lista_favoritos();
}

function atualiza_fav_vis_home(pos) {      //Actualiza as cidades visiveis no array dos favoritos
    let x = $("#cbox_vis_home_" + (pos + 1)).is(":checked");
    if (x) {
        if (qtd_cidades_visiveis() >= 6) {
            alert("Numero de cidades visiveis máximo já antingido");
            var new_valor_vis_home = 0;
            $('#cbox_vis_home_' + (pos + 1)).prop("checked", false);
        } else {
            var new_valor_vis_home = 1;
        }
    } else {
        new_valor_vis_home = 0;
    }
    let str_lstorage_array_favoritos = localStorage.getItem('array_favoritos');
    let obj_lstorage_array_favoritos = JSON.parse(str_lstorage_array_favoritos);
    obj_lstorage_array_favoritos[pos].visivel_home = new_valor_vis_home;
    localStorage.setItem('array_favoritos', JSON.stringify(obj_lstorage_array_favoritos));
}


/*--------------------Funções de debug-----------------------

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

let len_array_fav;
let str_cid;
let str_cid_pais;
let str_url;



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







*/