const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=London,us&";
const id_dtht = [4,12,20,28,36];

var st_dia = null;


$(function(){
    st_dia=$(".dia").clone();

    var search_url = API_URL+API_KEY;

    $.ajax({
        method: "GET",
        url: search_url
    }).done(function(msg){

        id_dtht.forEach(function(element){
        var data = msg.list[element].dt_txt;
        var temp = msg.list[element].main.temp;
        var press = msg.list[element].main.pressure;
        var hum = msg.list[element].main.humidity;
        console.log(data);
        console.log(temp);
        console.log(press);
        console.log(hum);
        })


     
     
           
        })

        
    });