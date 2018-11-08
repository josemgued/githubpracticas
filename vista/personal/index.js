var DOM = {};

$(document).ready(function () {
    setDOM();
    setEventos();
    listar();
    cargarCargo();
});

function setDOM() {
    DOM.form = $("#frm-grabar"),
    DOM.self = $("#myModal"),
    DOM.operacion = $("#txtoperacion"),
    DOM.btnAgregar = $("#btnAgregar");

    DOM.p_id_personal = $("#txtid_personal"),
    DOM.p_nombres = $("#txtnombres");
    DOM.p_apellidos =$("#txtapellidos");
    DOM.p_dni = $("#txtdni");
    DOM.p_numero_celular = $("#txtnumero_celular");
    DOM.p_fecha_ingreso = $("#txtfecha_ingreso");
    DOM.p_id_cargo = $("#txtid_cargo");

    DOM.p_filtro_cargo = $("#txt-filtro-cargo");
    DOM.p_filtro_estado = $("#cbo-filtro-estado");
    DOM.p_filtro_apellidos = $("#txt-filtro-apellidos");

    DOM.blkAlert = $("#blk-alert");
    DOM.blkAlertModal = $("#blk-alert-modal");
}

function setEventos() {
    DOM.btnAgregar.on("click",function(){
        DOM.self.find(".modal-title").text("Agregar nuevo personal");
        DOM.operacion.val("agregar");
        limpiar();
    });

    DOM.p_apellidos.keypress(function(e){
        return Util.soloLetras(e);
    });

    DOM.p_nombres.keypress(function(e){
        return Util.soloLetras(e);
    });

    DOM.p_dni.keypress(function(e){
       return  Util.soloNumeros(e);
    });

    DOM.p_numero_celular.keypress(function(e){
       return  Util.soloNumeros(e);
    });

    DOM.p_filtro_apellidos.keypress(function(e){
        return Util.soloLetras(e);
    });

    DOM.p_filtro_cargo.keypress(function(e){
        return Util.soloLetras(e);
    });

    DOM.p_filtro_cargo.keyup(function(e){
        listar();
    });

    DOM.p_filtro_apellidos.keyup(function(e){
        listar();
    });

    DOM.p_filtro_estado.change(function(e){
        listar();
        DOM.p_filtro_apellidos.val("");
        DOM.p_filtro_cargo.val("");
    });

    DOM.form.submit(function (evento) {
        evento.preventDefault();

        if ( DOM.p_dni.val() === '' ) { 
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar una DNI para el Personal"});
            return 0;
        }

        if ( DOM.p_dni.val().length != 8 ) { 
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar un DNI con 8 digitos."});
            return 0;
        }

        if ( DOM.p_nombres.val() === '' || DOM.p_apellidos.val() === '') {
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar una nombres y apellidos para el Personal"});
            return 0;
        }

        if ( DOM.p_id_cargo.val() === '' ) {
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"Seleccionar un cargo para el Personal"});
            return 0;
        }
        
        if ( DOM.p_dni.val().length < 8 ) {
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"El DNI debe tener 8 digitos"});
            return 0;
        }

        if ( DOM.p_numero_celular.val().length < 9 ) {
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"El número móvil debe tener 9 digitos"});
            return 0;
        }

        if ( DOM.p_id_cargo.val() =="" || DOM.p_id_cargo.val() == null) {
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"Debe seleccionar un cargo"});
            return 0;
        }

        if ( DOM.p_fecha_ingreso.val() =="") {
            Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:"Debe seleccionar un fecha de ingreso."});
            return 0;
        }
      
            var funcion = function (resultado) {
                if (resultado.estado === 200) {
                    if (resultado.datos.rpt === true) {
                        listar();
                        DOM.self.modal("hide");
                        Util.alert(DOM.blkAlert, {tipo:"s", mensaje:resultado.datos.msj});

                    }else{
                        Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:resultado.datos.msj});
                    }
                }
            };
            new Ajxur.Api({
                modelo: "Personal",
                metodo: DOM.operacion.val(),
                data_in: {
                    p_id_personal : DOM.p_id_personal.val(),
                    p_nombres : DOM.p_nombres.val(),
                    p_apellidos : DOM.p_apellidos.val(),
                    p_dni : DOM.p_dni.val(),
                    p_numero_celular : DOM.p_numero_celular.val(),
                    p_fecha_ingreso : DOM.p_fecha_ingreso.val(),
                    p_id_cargo : DOM.p_id_cargo.val()
                }
            },funcion);
    });
}

function limpiar(){
    DOM.blkAlertModal.empty();
    DOM.p_id_personal.val("");
    DOM.p_nombres.val("");
    DOM.p_apellidos.val("");
    DOM.p_dni.val("");
    DOM.p_numero_celular.val("");
    DOM.p_fecha_ingreso.val("");
    DOM.p_fecha_ingreso.attr("disabled",false);
   //  $(".selectpicker").html(html).selectpicker('refresh');
    //DOM.p_id_cargo..val("").selectpicker({val:""});
    DOM.p_id_cargo.val("").selectpicker('refresh');
}

function listar(){
    var filtro_cargo = DOM.p_filtro_cargo.val(), 
        filtro_apellidos = DOM.p_filtro_apellidos.val(),
        filtro_estado = DOM.p_filtro_estado.val();

    if (!filtro_cargo) filtro_cargo = '';
    if (!filtro_apellidos) filtro_apellidos = '';
    if (!filtro_estado) filtro_estado ='1';

	var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = "";
                html += '<table id="tabla-listado" class="table table-bordered table-striped table-hover js-basic-example dataTable">';
                html += '<thead>';
                html += '<tr>';
                html += '<th class="text-center"></th>';
                html += '<th class="text-center">DNI</th>';
                html += '<th>Apellidos</th>';                                          
                html += '<th>Nombres</th>';                                          
                html += '<th>Cargo</th>';
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
                        html += '<button type="button" class="btn btn-primary btn-xs" title="Editar personal" data-toggle="modal" data-target="#myModal" onclick="editar(' + item.id_personal + ')"><i class="material-icons">edit</i></button>';
                        html += '&nbsp;&nbsp;';
                        if (item.estado_mrcb == true){
                            html += '<button type="button" class="btn btn-danger btn-xs" title="Dar de baja personal" onclick="darBaja(' + item.id_personal + ',0)"><i class="material-icons">thumb_down</i></button>';    
                        } else {
                            html += '<button type="button" class="btn btn-success btn-xs" title="Reactivar personal" onclick="darBaja(' + item.id_personal + ',1)"><i class="material-icons">thumb_up</i></button>';
                        }
                        
                        html += '&nbsp;&nbsp;';
                        html += '</td>';
                        html += '<td align="center">' + item.dni + '</td>';
                        html += '<td>' + item.apellidos + '</td>';
                        html += '<td>' + item.nombres + '</td>';
                        html += '<td>' + item.cargo + '</td>';
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
        modelo: "Personal",
        metodo: "listar",
        data_out: [filtro_cargo, filtro_apellidos, filtro_estado]
    }, funcion);
}

function editar(codigo) {
    DOM.self.find(".modal-title").text("Editar personal");
    DOM.operacion.val("editar");
    DOM.blkAlertModal.empty();

    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                DOM.p_id_personal.val(resultado.datos.msj.id_personal);
                DOM.p_dni.val(resultado.datos.msj.dni);  
                DOM.p_nombres.val(resultado.datos.msj.nombres);  
                DOM.p_apellidos.val(resultado.datos.msj.apellidos);  
                DOM.p_numero_celular.val(resultado.datos.msj.numero_celular);
                DOM.p_fecha_ingreso.val(resultado.datos.msj.fecha_ingreso);
                DOM.p_fecha_ingreso.attr("disabled",true);
                $(".selectpicker").val(resultado.datos.msj.id_cargo).selectpicker('refresh');
            }else{
                Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:resultado.datos.msj});
            }
        }
    };
    new Ajxur.Api({
        modelo: "Personal",
        metodo: "leerDatos",
        data_in: {
            p_id_personal : codigo
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
                modelo: "Personal",
                metodo: "darBaja",
                data_in: {
                    p_id_personal : codigo,           
                    p_estado_mrcb: estadoMrcb 
                }
            },funcion);   
    }

    Util.confirm(fnAccion);
   
}

function cargarCargo() {
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = '<option value="" disabled selected><b>Seleccionar cargo<b></option>';
                $.each(resultado.datos.msj, function (i, item) { 
                    html += '<option value="' + item.id_cargo + '">'+ item.descripcion + '</option>';
                });
                $(".selectpicker").html(html).selectpicker('refresh');
            }else{
                alert(resultado.datos.msj.errorInfo[2]);              
            }
        }
    };
    new Ajxur.Api({
        modelo: "Cargo",
        metodo: "llenarCB",
        data_out : [DOM.operacion.val(),DOM.p_id_personal.val()]
    },funcion);
}