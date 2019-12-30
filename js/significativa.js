const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=London,us&";
//const id_dtht = [4, 12, 20, 28, 36];

var st_dia = null;

$(function () {
    st_dia = $('.dia').clone();

    var search_url = API_URL + API_KEY;
    $('.lista_dias').html('');


    $.ajax({
        method: "GET",
        url: search_url

    }).done(function (msg) {
        msg.list.forEach(function (element) {
            var data = element.dt_txt;
            var temp = element.main.temp;
            var press = element.main.pressure;
            var hum = element.main.humidity;

            var div_dia = st_dia.clone;

            $('.temperatura', div_dia).text(element.main.temp);

            $('.lista_dias').append(div_dia);

            console.log(element.main);
            console.log(temp);
            console.log(press);
            console.log(hum);
        })
    })
});