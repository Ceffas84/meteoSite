"use strict";

export const PONTOS_CARDEAIS =["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

export function ponto_cardeal (grau){
    for (let i=0; i<PONTOS_CARDEAIS.length; i++){
        console.log(PONTOS_CARDEAIS[i]);
    }

}