var DOM = {};

$(document).ready(function () {
    setDOM();
    setEventos();
    listar();
    cargarDatosFormulario();
});

function setDOM() {
    var _DOM = {};

    _DOM.form = $("#frm-grabar");
    _DOM.self = $("#myModal");
    _DOM.operacion = $("#txtoperacion");
    _DOM.btnAgregar = $("#btnAgregar");

    _DOM.p_cod_estudiante = $("#txtcod_estudiante");
    _DOM.p_nombres = $("#txtnombres");
    _DOM.p_apellidos =$("#txtapellidos");
    _DOM.p_codigo_universitario = $("#txtcodigo_universitario");
    _DOM.p_dni = $("#txtdni");
    _DOM.p_domicilio = $("#txtdomicilio");
    _DOM.p_celular = $("#txtcelular");
    _DOM.p_fecha_nacimiento = $("#txtfecha_nacimiento");
    _DOM.p_cod_carrera = $("#txtcod_carrera");
    _DOM.p_sexo = $("#cbosexo");

    _DOM.p_cod_ubigeo_region = $("#cboregion");
    _DOM.p_cod_ubigeo_provincia = $("#cboprovincia");
    _DOM.p_cod_ubigeo_distrito = $("#cbodistrito");

    _DOM.p_correo = $("#txtcorreo");
    _DOM.p_clave = $("#txtclave");

    _DOM.p_filtro_estado = $("#txt-filtro-estado");
    _DOM.p_filtro_apellidos = $("#txt-filtro-apellidos");
    _DOM.p_filtro_dni = $("#txt-filtro-dni");

    _DOM.blkAlert = $("#blk-alert");
    _DOM.blkAlertModal = $("#blk-alert-modal");

    _DOM.modalClave = $("#modalClave");
    _DOM.formClave = $("#frm-clave");
    _DOM.p_cod_estudiante_clave = $("#txtcod_estudiante_clave");
    _DOM.lbl_correo = $("#lbl-correo");
    _DOM.p_clave_cambio = $("#txtclave_cambio");
    _DOM.blkAlertModalClave = $("#blk-alert-modal-clave");

    DOM = _DOM;
}

function setEventos() {
    var _DOM = DOM;

    _DOM.btnAgregar.on("click",function(){
        _DOM.self.find(".modal-title").text("Agregar Nuevo Estudiante");
        $(".clave-div").removeClass("hide");
        DOM.p_clave.attr("required",true);
        limpiar();
        _DOM.operacion.val("agregar");
    });

    _DOM.p_apellidos.keypress(function(e){
        return Util.soloLetras(e);
    });

    _DOM.p_nombres.keypress(function(e){
        return Util.soloLetras(e);
    });

    _DOM.p_dni.keypress(function(e){
       return  Util.soloNumeros(e);
    });

    _DOM.p_celular.keypress(function(e){
       return  Util.soloNumeros(e);
    });

    _DOM.p_filtro_apellidos.keypress(function(e){
        return Util.soloLetras(e);
    });

    _DOM.p_filtro_dni.keyup(function(e){
        listar();
    });

    _DOM.p_filtro_apellidos.keyup(function(e){
        listar();
    });

    _DOM.p_filtro_estado.change(function(e){
        listar();
        _DOM.p_filtro_apellidos.val("");
        _DOM.p_filtro_dni.val("");
    });

    _DOM.p_cod_ubigeo_region.change(function(e){
        cargarProvincias(this.value);        
    });

    _DOM.p_cod_ubigeo_provincia.change(function(e){
        cargarDistritos(_DOM.p_cod_ubigeo_region.val(), this.value);        
    });

    _DOM.form.submit(function (evento) {
        evento.preventDefault();

        if ( _DOM.p_dni.val() === '' ) { 
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar una DNI para el Estudiante"});
            return 0;
        }

        if ( _DOM.p_correo.val() === '' ) { 
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar un correo para el Estudiante"});
            return 0;
        }

        if ( _DOM.p_nombres.val() === '' || _DOM.p_apellidos.val() === '') {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar una nombres y apellidos para el Estudiante"});
            return 0;
        }

        
        if ( _DOM.p_dni.val().length < 8 ) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"El DNI debe tener 8 digitos."});
            return 0;
        }

        if ( _DOM.p_celular.val().length < 9 ) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"El número móvil debe tener 9 digitos."});
            return 0;
        }

        if ( _DOM.p_cod_carrera.val() =="" || _DOM.p_cod_carrera.val() == null) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe seleccionar una carrera."});
            return 0;
        }

        if ( _DOM.p_fecha_nacimiento.val() =="") {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe seleccionar un fecha de nacimiento."});
            return 0;
        }
      
            var funcion = function (resultado) {
                if (resultado.estado === 200) {
                    if (resultado.datos.rpt === true) {
                        listar();
                        _DOM.self.modal("hide");
                        Util.alert(_DOM.blkAlert, {tipo:"s", mensaje:resultado.datos.msj});

                    }else{
                        Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:resultado.datos.msj});
                    }
                }
            };

            new Ajxur.Api({
                modelo: "Estudiante",
                metodo: _DOM.operacion.val(),
                data_in: {
                    p_codEstudiante : _DOM.p_cod_estudiante.val(),
                    p_dni : _DOM.p_dni.val(),
                    p_codigoUniversitario: _DOM.p_codigo_universitario.val(),
                    p_nombres : _DOM.p_nombres.val(),
                    p_apellidos : _DOM.p_apellidos.val(),
                    p_celular : _DOM.p_celular.val(),
                    p_fechaNacimiento : _DOM.p_fecha_nacimiento.val(),
                    p_codCarreraUniversitaria : _DOM.p_cod_carrera.val(),
                    p_sexo : _DOM.p_sexo.val(),
                    p_codUbigeoRegion : _DOM.p_cod_ubigeo_region.val(),
                    p_codUbigeoProvincia : _DOM.p_cod_ubigeo_provincia.val(),
                    p_codUbigeoDistrito : _DOM.p_cod_ubigeo_distrito.val(),
                    p_correo : _DOM.p_correo.val(),
                    p_password : _DOM.p_clave.val()
                }
            },funcion);
    });

    _DOM.formClave.submit(function (evento) {
        evento.preventDefault();

        if ( _DOM.p_clave_cambio.val().length < 3 ) {
            Util.alert(_DOM.blkAlertModalClave, {tipo:"e", mensaje:"La clave debe tener mínimo 3 caracteres."});
            return 0;
        }

            var funcion = function (resultado) {
                if (resultado.estado === 200) {
                    if (resultado.datos.rpt === true) {
                        _DOM.modalClave.modal("hide");
                        Util.alert(_DOM.blkAlert, {tipo:"s", mensaje:resultado.datos.msj});
                    }else{
                        Util.alert(_DOM.blkAlertModalClave, {tipo:"e", mensaje:resultado.datos.msj});
                    }
                }
            };

            new Ajxur.Api({
                modelo: "Estudiante",
                metodo: "cambiarClaveWeb",
                data_in: {
                    p_codEstudiante : _DOM.p_cod_estudiante_clave.val(),
                    p_password : _DOM.p_clave_cambio.val()
                }
            },funcion);
    });
}

function limpiar(){
    DOM.blkAlertModal.empty();

    $("input").val("");
    $("textarea").val("");

    Util.llenarCombo("Seleccionar provincia", DOM.p_cod_ubigeo_provincia, []);
    Util.llenarCombo("Seleccionar distrito", DOM.p_cod_ubigeo_distrito, []);
    DOM.self.find("select").val("").selectpicker('refresh');
}

function listar(){
    var filtro_dni = DOM.p_filtro_dni.val(), 
        filtro_apellidos = DOM.p_filtro_apellidos.val(),
        filtro_estado = DOM.p_filtro_estado.val();

    if (!filtro_dni) filtro_dni = '';
    if (!filtro_apellidos) filtro_apellidos = '';
    if (!filtro_estado) filtro_estado ='-1';

	var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = "";
                html += '<table id="tabla-listado" class="table table-bordered table-striped table-hover js-basic-example dataTable">';
                html += '<thead>';
                html += '<tr>';
                html += '<th class="text-center"><small>OPCIONES</small></th>';
                html += '<th class="text-center">DNI</th>';
                html += '<th class="text-center">COD. UNIV.</th>';
                html += '<th>Apellidos</th>';                                          
                html += '<th>Nombres</th>';                                          
                html += '<th>Carrera</th>';
                html += '<th>Celular</th>';
                html += '<th>Correo</th>';
                html += '<th>Edad</th>';
                html += '<th>Validado</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                if ( resultado.datos.data.length === 0 ) {
                    html += '<tr>';
                    html += '<td align="center" colspan="9">No se ha encontrado resultados</td>';
                    html += '</tr>';
                }else{      
                    $.each(resultado.datos.data, function (i, item) {
                        var  objValidado;
                        html += '<tr>';
                        html += '<td align="center">';
                        if (item.validado == "-1"){
                            html += '<div class="btn-group">';
                            html += '<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> VALIDAR<span class="caret"></span></button>';
                            html += '<ul class="dropdown-menu">';
                            html +=  '<li><a href="javascript:void(0);" onclick="validar(' + item.cod_estudiante + ', 1)" class=" waves-effect waves-block">ACEPTAR</a></li>';
                            html +=  '<li><a href="javascript:void(0);" onclick="validar(' + item.cod_estudiante + ', 0)" class=" waves-effect waves-block">RECHAZAR</a></li>';
                            html += '</ul>';
                            html += '</div>';

                            objValidado = {"rotulo":"NO VALIDADO", "color":"gray"};
                        } 

                        html += '&nbsp;&nbsp;';
                        html += '<button type="button" class="btn btn-primary btn-xs" title="Editar" data-toggle="modal" data-target="#myModal" onclick="editar(' + item.cod_estudiante + ')"><i class="material-icons">edit</i></button>';
                        html += '&nbsp;&nbsp;';
                        html += '<button type="button" class="btn btn-warning btn-xs" title="Cambiar clave" data-toggle="modal" data-target="#modalClave" onclick="cambiarClave(\''+item.correo+'\',' + item.cod_estudiante + ')"><i class="material-icons">vpn_key</i></button>';
                        html += '&nbsp;&nbsp;';
                        html += '<button type="button" class="btn btn-danger btn-xs" title="Eliminar" onclick="darBaja(' + item.cod_estudiante + ',0)"><i class="material-icons">delete</i></button>';    
                        html += '&nbsp;&nbsp;';
                        html += '</td>';
                        html += '<td align="center">' + item.dni + '</td>';
                        html += '<td align="center">' + item.codigo_universitario + '</td>';
                        html += '<td>' + item.apellidos + '</td>';
                        html += '<td>' + item.nombres + '</td>';
                        html += '<td>' + item.carrera + '</td>';
                        html += '<td>' + item.celular + '</td>';
                        html += '<td>' + item.correo + '</td>';
                        html += '<td>' + item.edad + '</td>';

                        if (!objValidado){
                            objValidado = (item.validado ? {"rotulo":"ACEPTADO","color":"green"} :{"rotulo":"RECHAZADO","color":"red"});
                        }
                        html += '<td><span class="badge bg-'+objValidado.color+'">'+objValidado.rotulo+'</span></td>';
                        //html += '<td><span class="badge bg-'+(item.estado == 'ACTIVO' ? 'green' : 'red')+'">'+item.estado+'</span></td>';
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
        modelo: "Estudiante",
        metodo: "listar",
        data_out: [filtro_dni, filtro_apellidos, filtro_estado]
    }, funcion);
}

function editar(codigo) {
    DOM.self.find(".modal-title").text("Editar Estudiante");
    DOM.operacion.val("editar");
    $(".clave-div").addClass("hide");
    DOM.p_clave.removeAttr("required",true);
    DOM.blkAlertModal.empty();

    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var datos = resultado.datos.r,
                    ubigeo = resultado.datos.ubigeo;
                DOM.p_cod_estudiante.val(datos.cod_estudiante);
                DOM.p_dni.val(datos.dni);  
                DOM.p_codigo_universitario.val(datos.codigo_universitario);  
                DOM.p_nombres.val(datos.nombres);  
                DOM.p_apellidos.val(datos.apellidos);  
                DOM.p_celular.val(datos.celular);
                DOM.p_fecha_nacimiento.val(datos.fecha_nacimiento);
                DOM.p_domicilio.val(datos.domicilio);
                DOM.p_sexo.val(datos.sexo);
                DOM.p_cod_carrera.val(datos.cod_carrera_uni);
                DOM.p_correo.val(datos.correo);

                DOM.p_cod_ubigeo_region.val(datos.cod_ubigeo_region);
                if (datos.cod_ubigeo_provincia){
                    Util.llenarCombo( "Seleccionar provincias", DOM.p_cod_ubigeo_provincia,ubigeo.provincias);
                    DOM.p_cod_ubigeo_provincia.val(datos.cod_ubigeo_provincia);
                }

                if (datos.cod_ubigeo_distrito){
                    Util.llenarCombo("Seleccionar provincias", DOM.p_cod_ubigeo_distrito, ubigeo.distritos);
                    DOM.p_cod_ubigeo_distrito.val(datos.cod_ubigeo_distrito);
                }

                $(".selectpicker").selectpicker("refresh");
            }else{
                Util.alert(DOM.blkAlertModal, {tipo:"e", mensaje:resultado.datos.msj});
            }
        }
    };
    new Ajxur.Api({
        modelo: "Estudiante",
        metodo: "leerDatos",
        data_in: {
            p_codEstudiante : codigo
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
                modelo: "Estudiante",
                metodo: "darBaja",
                data_in: {
                    p_codEstudiante : codigo,
                    p_codPersonalBaja : 1 
                }
            },funcion);   
    }

    Util.confirm(fnAccion);
}

function cargarDatosFormulario() {
    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var r = resultado.datos.r;
                Util.llenarCombo("Seleccionar carrera", DOM.p_cod_carrera, r.carreras);
                Util.llenarCombo("Seleccionar región", DOM.p_cod_ubigeo_region, r.regiones);

                $(".selectpicker").selectpicker('refresh');
            }else{
                alert(resultado.datos.msj.errorInfo[2]);              
            }
        }
    };

    new Ajxur.Api({
        modelo: "Estudiante",
        metodo: "cargarDatosFormulario"
    },funcion);
}

function cargarProvincias(p_region){
    var funcion = function(r){
        Util.llenarCombo("Seleccionar distrito", DOM.p_cod_ubigeo_distrito, []);
        Util.llenarCombo("Seleccionar provincia", DOM.p_cod_ubigeo_provincia, r.datos.data);

        DOM.p_cod_ubigeo_distrito.selectpicker("refresh");
        DOM.p_cod_ubigeo_provincia.selectpicker("refresh");
    };

    new Ajxur.Api({
        modelo: "Ubigeo",
        metodo: "cargarProvinciasW",
        data_in: {
            p_codUbigeoRegion: p_region
        }
    },funcion);   
}

function cargarDistritos(p_region, p_provincia){
    var funcion = function(r){
        Util.llenarCombo("Seleccionar distrito", DOM.p_cod_ubigeo_distrito, r.datos.data);
        DOM.p_cod_ubigeo_distrito.selectpicker("refresh");
    };

    new Ajxur.Api({
        modelo: "Ubigeo",
        metodo: "cargarDistritosW",
        data_in: {
            p_codUbigeoRegion: p_region,
            p_codUbigeoProvincia: p_provincia
        }
    },funcion);   
}


function cambiarClave(correo, codigo) {
    DOM.formClave.find("input").val("");
    DOM.p_cod_estudiante_clave.val(codigo);
    DOM.lbl_correo.html(correo);
}


function validar(codigo, tipo_validacion) {
    var fnAccion = function(){
        var funcion = function(r){
            Util.alert(DOM.blkAlert, {tipo:"s", mensaje:r.datos.msj, tiempo:5000});
            listar();
        };

        new Ajxur.Api({
                modelo: "Estudiante",
                metodo: "validar",
                data_in: {
                    p_codEstudiante: codigo
                },
                data_out: [tipo_validacion]
            }, funcion);  
    };

    Util.confirm(fnAccion);    
}