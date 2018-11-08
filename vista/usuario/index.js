var DOM = {};

$(document).ready(function () {
    setDOM();
    setEventos();
    listar();
    cargarPersonal();
    cargarRol();
});

function setDOM() {
    DOM.form = $("#frm-grabar"),
    DOM.self = $("#myModal"),
    DOM.operacion = $("#txtoperacion"),
    DOM.btnAgregar = $("#btnAgregar");

    DOM.p_id_usuario = $("#txtid_usuario"),
    DOM.p_personal = $("#cbo-personal"),
    DOM.p_rotulo_personal = $("#txt-personal"),
    DOM.p_login = $("#txtlogin"),
    DOM.p_clave = $("#txtclave"),
    DOM.p_id_rol = $("#txtid_rol");
    DOM.p_id_personal = $("#cboid_personal");

    DOM.p_filtro_rol= $("#txt-filtro-rol");
    DOM.p_filtro_estado = $("#cbo-filtro-estado");
    DOM.p_filtro_apellidos = $("#txt-filtro-apellidos");
    DOM.p_filtro_usuario = $("#txt-filtro-usuario");

    DOM.blkAlert = $("#blk-alert");
    DOM.blkAlertModal = $("#blk-alert-modal");
}

function setEventos() {
    DOM.btnAgregar.on("click",function(){
        DOM.self.find(".modal-title").text("Agregar Nuevo Usuario");
        DOM.operacion.val("agregar");
        limpiar();
        DOM.p_clave.attr("required",true);
    });


    DOM.p_login.keypress(function(e){
        DOM.p_login.val(DOM.p_login.val().toUpperCase());
    });

    DOM.p_filtro_apellidos.keypress(function(e){
        return Util.soloLetras(e);
    });

    DOM.p_filtro_rol.keypress(function(e){
        return Util.soloLetras(e);
    });

    DOM.p_filtro_rol.keyup(function(e){
        listar();
    });

    DOM.p_filtro_apellidos.keyup(function(e){
        listar();
    });

    DOM.p_filtro_usuario.keyup(function(e){    
        listar();
    });

    DOM.p_filtro_estado.change(function(e){
        listar();
        DOM.p_filtro_apellidos.val("");
        DOM.p_filtro_usuario.val("");
        DOM.p_filtro_rol.val("");
    });

    DOM.form.submit(function (evento) {
        evento.preventDefault();
      
       var oper = DOM.operacion.val();
        
        var funcion = function (resultado) {
                if (resultado.estado === 200) {
                    if (resultado.datos.rpt === true) {
                        var data = JSON.parse(resultado.datos.data);
                        if (data.r == 1){
                            DOM.self.modal("hide");                        
                            Util.alert(DOM.blkAlert, {tipo:"s", mensaje:data.msj});
                            listar();
                        } else {
                            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:data.msj});
                        }
                    }
                }
            };

            new Ajxur.Api({
                modelo: "Usuario",
                metodo: oper,
                data_in: {
                    p_idUsuario : DOM.p_id_usuario.val(),
                    p_login : DOM.p_login.val(),
                    p_clave : DOM.p_clave.val(),
                    p_idPersonal : DOM.p_id_personal.val(),
                    p_idRol : DOM.p_id_rol.val()
                }
            },funcion);
    });
}

function limpiar(){
    DOM.blkAlertModal.empty();
   //  $(".selectpicker").html(html).selectpicker('refresh');
    //DOM.p_id_cargo..val("").selectpicker({val:""});
    DOM.p_login.val("");
    DOM.p_clave.val("");
    DOM.p_id_rol.val("").selectpicker('refresh');
    DOM.p_id_personal.attr("disabled",false);
    DOM.p_id_personal.val("").selectpicker('refresh');
}

function listar(){
    var filtro_rol = DOM.p_filtro_rol.val(), 
        filtro_apellidos = DOM.p_filtro_apellidos.val(),
        filtro_estado = DOM.p_filtro_estado.val(),
        filtro_usuario = DOM.p_filtro_usuario.val();

    if (!filtro_rol) filtro_rol = '';
    if (!filtro_apellidos) filtro_apellidos = '';
    if (!filtro_usuario) filtro_usuario ='';
    if (!filtro_estado) filtro_estado ='1';

	var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = "";
                html += '<table id="tabla-listado" class="table table-bordered table-striped table-hover js-basic-example dataTable">';
                html += '<thead>';
                html += '<tr>';
                html += '<th class="text-center"></th>';                
                html += '<th>Nombres</th>';                                          
                html += '<th>Apellidos</th>';                                          
                html += '<th>Usuario</th>';
                html += '<th>Rol</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                if ( resultado.datos.msj.length === 0 ) {
                    html += '<tr>';
                    html += '<td align="center" colspan="5">No se ha encontrado resultados</td>';
                    html += '</tr>';
                }else{      
                    $.each(resultado.datos.msj, function (i, item) {                 
                        html += '<tr>';
                        html += '<td align="center">';
                        html += '<button type="button" class="btn btn-primary btn-xs" title="Editar Usuario" data-toggle="modal" data-target="#myModal" onclick="editar(' + item.id_usuario + ')"><i class="material-icons">edit</i></button>';
                        html += '&nbsp;&nbsp;';
                        if (item.estado == 'A'){
                            html += '<button type="button" class="btn btn-danger btn-xs" title="Dar de baja personal" onclick="darBaja(' + item.id_usuario + ',0)"><i class="material-icons">thumb_down</i></button>';    
                        } else {
                            html += '<button type="button" class="btn btn-success btn-xs" title="Reactivar personal" onclick="darBaja(' + item.id_usuario + ',1)"><i class="material-icons">thumb_up</i></button>';
                        }
                        html += '&nbsp;&nbsp;';
                        html += '</td>';                        
                        html += '<td>' + item.nombres + '</td>';
                        html += '<td>' + item.apellidos + '</td>';
                        html += '<td>' + item.login + '</td>';
                        html += '<td>' + item.rol + '</td>';
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
        modelo: "Usuario",
        metodo: "listar",
        data_out: [filtro_rol, filtro_apellidos,filtro_usuario,filtro_estado]
    }, funcion);
}

function editar(codigo) {
    DOM.self.find(".modal-title").text("Editar Usuario");
    DOM.operacion.val("editar");
    DOM.blkAlertModal.empty();
    DOM.p_clave.val("");  
    DOM.p_clave.attr("required",false);

    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            var datos = resultado.datos.msj;
            if (resultado.datos.rpt === true) {
                DOM.p_id_usuario.val(datos.id_usuario);
                DOM.p_login.val(datos.login);  
                DOM.p_id_rol.val(datos.id_rol).selectpicker('refresh');
                DOM.p_id_personal.attr("disabled",true);
                DOM.p_id_personal.val(datos.id_personal).selectpicker('refresh');
            }else{
                Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:resultado.datos.msj});
            }
        }
    };
    new Ajxur.Api({
        modelo: "Usuario",
        metodo: "leerDatos",
        data_in: {
            p_idUsuario : codigo
        }
    },funcion);
}

function darBaja(codigo, estadoMrcb) {

    var fnAccion = function(){
        var funcion = function (resultado) {
            if (resultado.estado === 200) {
                if (resultado.datos.rpt === true) {
                    Util.alert(DOM.blkAlert, {tipo:"s", mensaje:resultado.datos.msj});
                    listar();
                    
                }else{
                    Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:resultado.datos.msj.errorInfo[2]});              
                }
            }
        };
        new Ajxur.Api({
            modelo: "Usuario",
            metodo: "darBaja",
            data_in: {
                p_idUsuario : codigo,           
                p_estado: estadoMrcb 
            }
        },funcion);
    };

    Util.confirm(fnAccion);
    
}

function cargarRol() {
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = '<option value="" selected><b>Seleccionar Rol<b></option>';
                $.each(resultado.datos.msj, function (i, item) { 
                    html += '<option value="' + item.id_rol + '">'+ item.descripcion + '</option>';
                });
                $("#txtid_rol").html(html).selectpicker('refresh');
            }else{
                alert(resultado.datos.msj.errorInfo[2]);              
            }
        }
    };
    new Ajxur.Api({
        modelo: "Rol",
        metodo: "llenarCBTodos",
        data_out : [DOM.operacion.val(),DOM.p_id_usuario.val()]
    },funcion);
}

function cargarPersonal() {
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = '<option value=""  selected><b>Seleccionar Personal<b></option>';
                $.each(resultado.datos.msj, function (i, item) { 
                    html += '<option value="' + item.id_personal + '">'+ item.descripcion + '</option>';
                });
                $("#cboid_personal").html(html).selectpicker('refresh');
            }else{
                alert(resultado.datos.msj.errorInfo[2]);              
            }
        }
    };
    new Ajxur.Api({
        modelo: "Personal",
        metodo: "llenarCB"
    },funcion);
};
