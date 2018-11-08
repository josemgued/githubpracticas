var DOM = {};

$(document).ready(function () {
    setDOM();
    setEventos();
    cargarRol();
});

function setDOM() {
    DOM.p_id_rol = $("#txtid_rol");
    DOM.btnIzquierda = $("#btn-izquierda");
    DOM.btnDerecha = $("#btn-derecha");

    DOM.blkAlert = $("#blk-alert");

}

function setEventos() {

    DOM.p_id_rol.change(function(){
        listarActivos();
        listarInactivos();
        resetBotones();
    });

    $('#listar-permisos-inactivos').on('click', '.list-group-item', function(e) {
        $('.list-group-item').removeClass("active");        
        $(this).addClass("active");
        DOM.btnIzquierda.attr("disabled",false);
        DOM.btnDerecha.attr("disabled",true);
    });

    $('#listar-permisos-activos').on('click', '.list-group-item', function(e) {
        $('.list-group-item').removeClass("active");        
        $(this).addClass("active");
        DOM.btnIzquierda.attr("disabled",true);
        DOM.btnDerecha.attr("disabled",false);
    });
    
}


function listarActivos(){
	var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = "";
                html += '<div class="list-group">'; 
                $.each(resultado.datos.msj, function (i, item) {                 
                    html += '<a href="#" class="list-group-item"><small><b>'+item.superior+'</b></small><p>'+item.titulo_interfaz+'</p></a>';
                });                
                html += '</div>';                
                $("#listar-permisos-activos").html(html);
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }    
        } 
    };
    new Ajxur.Api({
        modelo: "PermisoRol",
        metodo: "listarPermisoActivos",
        data_in : {
            p_id_rol : DOM.p_id_rol.val()
        }
    }, funcion);
}

function listarInactivos(){
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = "";
                html += '<div class="list-group">';
                $.each(resultado.datos.msj, function (i, item) {                 
                    html += '<a href="#" class="list-group-item"><small><b>'+item.superior+'</b></small><p>'+item.titulo_interfaz+'</p></a>';
                });                
                html += '</div>'; 
                $("#listar-permisos-inactivos").html(html);
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }    
        } 
    };
    new Ajxur.Api({
        modelo: "PermisoRol",
        metodo: "listarPermisoInactivos",
        data_in : {
            p_id_rol : DOM.p_id_rol.val()
        }
    }, funcion);
}

function agregar(){
    if ( DOM.p_id_rol.val() === null ) {
        Util.alert(DOM.blkAlert,{tipo:"e",mensaje:"Debe seleccionar un rol para agregar el permiso"});
        return 0;
    }

    if ( validar($("#listar-permisos-inactivos .list-group")) ) {
        Util.alert(DOM.blkAlert,{tipo:"e",mensaje:"Debe seleccionar un permiso para para agregar al rol"});
        return 0;
    }

    $("#listar-permisos-inactivos .list-group").find(".list-group-item").each(function(){
        var encontro = this.classList.contains('active');
        if ( encontro ) {
            var valor = $(this)[0].children[1].innerHTML;
            
            var funcion = function (resultado) {
                if (resultado.estado === 200) {
                    if (resultado.datos.rpt === true) {  
                        listarActivos();
                        listarInactivos();
                        resetBotones();
                    }else{
                        alert(resultado.datos.msj.errorInfo[2]);              
                    }
                }
            };
            new Ajxur.Api({
                modelo: "PermisoRol",
                metodo: "agregar",
                data_out : [valor,DOM.p_id_rol.val()]
            },funcion);
        }
    });
}

function quitar(){
    if ( DOM.p_id_rol.val() === null ) {
        Util.alert(DOM.blkAlert,{tipo:"e",mensaje:"Debe seleccionar un rol para quitar el permiso"});
        return;
    }

    if ( validar($("#listar-permisos-activos .list-group")) ) {
        Util.alert(DOM.blkAlert,{tipo:"e",mensaje:"Debe seleccionar un permiso para para quitar al rol"});
        return;
    }

    $("#listar-permisos-activos .list-group").find(".list-group-item").each(function(){
        var encontro = this.classList.contains('active');
        if ( encontro ) {
            var valor = $(this)[0].children[1].innerHTML;
            
            var funcion = function (resultado) {
                if (resultado.estado === 200) {
                    if (resultado.datos.rpt === true) {                        
                        listarActivos();
                        listarInactivos();
                    }else{
                        alert(resultado.datos.msj.errorInfo[2]);              
                    }
                }
            };
            new Ajxur.Api({
                modelo: "PermisoRol",
                metodo: "quitar",
                data_out : [valor,DOM.p_id_rol.val()]
            },funcion);
        }
    });


}

function validar(parametro){
    var c = 0; 
    parametro.find(".list-group-item").each(function(){
        var encontro = this.classList.contains('active');
        if ( encontro ) {
            c++;
        }
    });
    if ( c >= 1 ) {
        return false;
    }
    return true; 
}

function cargarRol(){
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = '<option value="" disabled selected><b>Seleccionar rol<b></option>';
                $.each(resultado.datos.msj, function (i, item) { 
                    html += '<option value="' + item.id_rol + '">'+ item.descripcion + '</option>';
                });
                $(".selectpicker").html(html).selectpicker('refresh');
            }else{
                alert(resultado.datos.msj.errorInfo[2]);              
            }
        }
    };
    new Ajxur.Api({
        modelo: "Rol",
        metodo: "llenarCB"
    },funcion);
}


function resetBotones(){
    DOM.btnIzquierda.attr("disabled",true);
    DOM.btnDerecha.attr("disabled",true);
}