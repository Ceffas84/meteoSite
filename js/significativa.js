const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=London,us&";

var item_hora=null;
var linha_dia=null;


$(function(){
    item_hora=$(".hora").clone();
    $(".linha_hora").html("");
    linha_dia=$(".coluna_dia").clone();
    $(".linha_dia").html("");

    $.ajax({
        method: 'GET',
        url: API_URL+API_KEY
    }).done(function(msg){
        var item_hora_clone=item_hora.clone();
        $(".valor", item_hora_clone).text("#");
        $(".linha_hora").append(item_hora_clone);
        let i;
        for (i=0; i<8; i++) {
            var elemento=msg.list[i];
            item_hora_clone=item_hora.clone();
            console.log(item_hora_clone);
            var dataehora=elemento.dt_txt.split(" ");
            var hora=dataehora[1];
            console.log(hora);
            $(".valor", item_hora_clone).text((hora.split(":"))[0]);
            $(".linha_hora").append(item_hora_clone);
        }
        for (i=0;i<40;i+8){
            var elemento=msg.list[i];
            linha_dia_clone=linha_dia.clone();
            console.log(linha_dia_clone);
            var dataehora=elemento.dt_txt.split(" ");
            var data=dataehora[0];
            console.log(data);
            $(".data", linha_dia_clone).text(data);
            $(".linha_dia").append(linha_dia_clone);

        }
    });

});



