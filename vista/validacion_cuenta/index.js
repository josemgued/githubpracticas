var DOM = {};

$(document).ready(function () {
    setDOM();
    setEventos();
    load();
});

function setDOM() {
   DOM.$rpta  = $("#rpta");
}

function setEventos() {
    
}

function load(){
    $.get("../../controlador/persona.confirmar.correo.php?pid="+_PID+"&tuser="+_TUSER).done(function(xhr,r){
        DOM.$rpta.html(xhr);
    });  
}
