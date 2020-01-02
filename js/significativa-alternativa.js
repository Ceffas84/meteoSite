"use strict";

const API_KEY = "APPID=5f641b8ef2e6971af3d88024c6489ebf";
const API_URL = "http://api.openweathermap.org/data/2.5/forecast?q=Leiria,pt&";




$(function(){


    $.ajax({
        method: 'GET',
        url: API_URL+API_KEY
    }).done(function(msg){
        msg.list.forEach(function (obj){

        });

    });
});
