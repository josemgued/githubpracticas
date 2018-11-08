var DOM = {};

$(document).ready(function () {
    setDOM();
    setEventos();
    activado();
    listar();
    arbol();
});

function setDOM() {
    DOM.form = $("#frm-grabar"),
    DOM.self = $("#myModal"),
    DOM.operacion = $("#txtoperacion"),
    DOM.btnAgregar = $("#btnAgregar"),

    DOM.p_id_permiso = $("#txtid_permiso"),
    DOM.p_titulo_interfaz = $("#txttitulo_interfaz"),
    DOM.p_url_interfaz = $("#txturl_interfaz"),
    DOM.p_icono_interfaz = $("#txticono_interfaz"),
    DOM.p_seleccionar = $("#txtseleccionar"),
    DOM.opcion_menu = $("#txtopcion-menu");
}

function limpiar(){
    DOM.p_id_permiso.val("");
    DOM.p_titulo_interfaz.val("");
    DOM.p_url_interfaz.val("");
    DOM.p_icono_interfaz.val("");
    DOM.p_seleccionar.prop('checked', false);
    activado();
    DOM.opcion_menu.val("");
}

function setEventos() {
    DOM.btnAgregar.on("click",function(){
        DOM.self.find(".modal-title").text("Agregar nuevo permiso");
        DOM.operacion.val("agregar");
        limpiar();
    });

    $("#txtseleccionar").on("click",function(){
        activado();
    });

    $("#tree").on('click',"ul li.list-group-item.active span", function() {
        var valor = $(this).contents().text();
        DOM.opcion_menu.val(valor);
    });


    DOM.form.submit(function (evento) {
        evento.preventDefault();
        
        if ( (DOM.p_seleccionar.prop('checked') === true) && (DOM.opcion_menu.val() === '') ) {
            alert("Debe seleccionar una opcion");
            return 0;
        };
            

        var funcion = function (resultado) {
            if (resultado.estado === 200) {
                if (resultado.datos.rpt === true) {
                    if ( resultado.datos.estado === true ) {
                        alert(resultado.datos.msj);
                        listar();
                        arbol();
                        DOM.self.modal("hide");
                    }else{
                        alert(resultado.datos.msj);
                    }
                }else{
                    alert(resultado.datos.msj.errorInfo[2]);                
                }
            }
        };
        new Ajxur.Api({
            modelo: "Permiso",
            metodo: DOM.operacion.val(),
            data_in: {
                p_id_permiso : DOM.p_id_permiso.val(),
                p_menu : DOM.p_seleccionar.prop('checked'),
                p_titulo : DOM.p_titulo_interfaz.val(),
                p_url : DOM.p_url_interfaz.val(),
                p_icono : DOM.p_icono_interfaz.val(),
                p_padre : DOM.opcion_menu.val()      
            }
        },funcion);
    });
}

function listar(){
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = "";
                html += '<table id="tabla-listado" class="table table-bordered table-striped table-hover js-basic-example dataTable">';
                html += '<thead>';
                html += '<tr>';
                html += '<th class="text-center"></th>';
                html += '<th class="text-center">ID</th>';
                html += '<th class="text-center">Descripción</th>';                                          
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                if ( resultado.datos.msj.length === 0 ) {
                    html += '<tr>';
                    html += '<td align="center" colspan="3">No se encontrado resultados</td>';
                    html += '</tr>';
                }else{      
                    $.each(resultado.datos.msj, function (i, item) {                 
                        html += '<tr>';
                        html += '<td align="center">';
                        html += '<button type="button" class="btn btn-success btn-xs" title="Editar tipo de riesgo" data-toggle="modal" data-target="#myModal" onclick="editar(' + item.id_permiso + ')"><i class="material-icons">edit</i></button>';
                        html += '&nbsp;&nbsp;';
                        html += '<button type="button" class="btn btn-danger btn-xs" title="Dar de baja tipo de riesgo" onclick="darBaja(' + item.id_permiso + ')"><i class="material-icons">thumb_down</i></button>';
                        html += '&nbsp;&nbsp;';
                        html += '</td>';
                        html += '<td align="center">' + (i+1) + '</td>';
                        html += '<td align="center">' + item.titulo_interfaz + '</td>';
                        html += '</tr>';
                    });
                }
                html += '</tbody>';
                html += '<tfoot>';            
                html += '</tfoot>';
                html += '</table>';
                $("#listado").html(html);
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }    
        } 
    };
    new Ajxur.Api({
        modelo: "Permiso",
        metodo: "listar"
    }, funcion);
}

function editar(codigo) {
    DOM.self.find(".modal-title").text("Editar permiso");
    DOM.operacion.val("editar");

    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                DOM.p_id_permiso.val(resultado.datos.msj.id_permiso);
                DOM.p_titulo_interfaz.val(resultado.datos.msj.titulo_interfaz);
                DOM.p_url_interfaz.val(resultado.datos.msj.url === null ? "" : resultado.datos.msj.url.split("/")[1]);
                DOM.p_icono_interfaz.val(resultado.datos.msj.icono_interfaz);
                DOM.p_seleccionar.prop('checked',resultado.datos.msj.es_menu_interfaz);
                activado();  
                DOM.opcion_menu.val(resultado.datos.msj.superior);
            }else{
                alert(resultado.datos.msj.errorInfo[2]);                
            }
        }
    };
    new Ajxur.Api({
        modelo: "Permiso",
        metodo: "leerDatos",
        data_in: {
            p_id_permiso : codigo
        }
    },funcion);
}

function darBaja(codigo) {
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                alert(resultado.datos.msj);
                listar();
                
            }else{
                alert(resultado.datos.msj.errorInfo[2]);                
            }
        }
    };
    new Ajxur.Api({
        modelo: "Permiso",
        metodo: "darBaja",
        data_in: {
            p_id_permiso : codigo,           
            p_estado: 'I'
        }
    },funcion);
    
}

function arbol(){ 
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            $('#tree').tree({
                dataSource: resultado.datos,
                width: 500,
                uiLibrary: 'bootstrap'
            })
        }
    };
    new Ajxur.Api({
        modelo: "Permiso",
        metodo: "menu"
    },funcion);
}
    


function activado(){
    if( DOM.p_seleccionar.prop('checked') ) {
        $("#menu").show();
    }else{
        $("#menu").hide();        
    }
}
