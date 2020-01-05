"use strict";

let json_string = localStorage.getItem("tempo_atual");
let json = JSON.parse(json_string);
let item_media = null;

let array_favoritos = [{}];



$(function (){
    item_media = $('.media').clone();
    $('.media-list').html('');

    console.log(json);
    let item_media_clone = item_media.clone();
    $('.cidade',item_media_clone).text(json.name);
    $('.temp_max',item_media_clone).text(json.main.temp_max + '.º C');
    $('.temp_min',item_media_clone).text(json.main.temp_min + '.º C');
    $('.vento_vel',item_media_clone).text((json.wind.speed*3.6) + ' Kms/h');
    $('.humidade',item_media_clone).text(json.main.humidity + '%');
    $('.media-list').append(item_media_clone);



});
    
