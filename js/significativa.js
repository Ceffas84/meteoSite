const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=London,us&";

var item_hora=null;


$(function(){
    item_hora=$(".hora").clone();
    $(".linha_hora").html("");

    $.ajax({
        method: 'GET',
        url: API_URL+API_KEY
    }).done(function(msg){

        count=0;
        msg.list.forEach(function (elemento) {
            if (count<=9) {
                var item_hora_clone=item_hora.clone();
                console.log(count);
                var dataehora=elemento.dt_txt.split(" ");
                var hora=dataehora[1];
                console.log(hora);
                count++;
            }
            $(".hora").text(hora);
            $(".linha_hora").append(item_hora_clone);
        })

    })

});



