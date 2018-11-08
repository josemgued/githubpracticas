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

    _DOM.p_cod_empresario = $("#txtcod_empresario");    
    _DOM.p_ruc = $("#txtruc");
    _DOM.p_razon_social = $("#txtrazon_social");
    _DOM.p_descripcion_empresa = $("#txtdescripcion");
    _DOM.p_domicilio = $("#txtdomicilio");
    _DOM.p_celular = $("#txtcelular");
    _DOM.p_cod_sector_industrial = $("#txtcod_sector_industrial");
    _DOM.p_cod_tipo_empresa = $("#txtcod_tipo_empresa");
    _DOM.p_cod_ubigeo_region = $("#cboregion");
    _DOM.p_cod_ubigeo_provincia = $("#cboprovincia");
    _DOM.p_cod_ubigeo_distrito = $("#cbodistrito");

    _DOM.p_nombres = $("#txtnombres");
    _DOM.p_apellidos =$("#txtapellidos");
    _DOM.p_cod_cargo = $("#txtcod_cargo");
    
    _DOM.p_correo = $("#txtcorreo");
    _DOM.p_clave = $("#txtclave");

    _DOM.p_filtro_estado = $("#txt-filtro-estado");
    _DOM.p_filtro_razonsocial= $("#txt-filtro-razonsocial");
    _DOM.p_filtro_ruc = $("#txt-filtro-ruc");

    _DOM.blkAlert = $("#blk-alert");
    _DOM.blkAlertModal = $("#blk-alert-modal");

    _DOM.modalClave = $("#modalClave");
    _DOM.formClave = $("#frm-clave");
    _DOM.p_cod_empresario_clave = $("#txtcod_empresario_clave");
    _DOM.lbl_correo = $("#lbl-correo");
    _DOM.p_clave_cambio = $("#txtclave_cambio");
    _DOM.blkAlertModalClave = $("#blk-alert-modal-clave");

    DOM = _DOM;
}

function setEventos() {
    var _DOM = DOM;

    _DOM.btnAgregar.on("click",function(){
        _DOM.self.find(".modal-title").text("Agregar Nuevo Empresario");
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

    _DOM.p_ruc.keypress(function(e){
       return  Util.soloNumeros(e);
    });

    _DOM.p_celular.keypress(function(e){
       return  Util.soloNumeros(e);
    });

    _DOM.p_filtro_razonsocial.keypress(function(e){
        return Util.soloLetras(e);
    });

    _DOM.p_filtro_ruc.keyup(function(e){
        listar();
    });

    _DOM.p_filtro_razonsocial.keyup(function(e){
        listar();
    });

    _DOM.p_filtro_estado.change(function(e){
        listar();
        _DOM.p_filtro_razonsocial.val("");
        _DOM.p_filtro_ruc.val("");
    });

    _DOM.p_cod_ubigeo_region.change(function(e){
        cargarProvincias(this.value);        
    });

    _DOM.p_cod_ubigeo_provincia.change(function(e){
        cargarDistritos(_DOM.p_cod_ubigeo_region.val(), this.value);        
    });

    _DOM.form.submit(function (evento) {
        evento.preventDefault();

        if ( _DOM.p_ruc.val() === '' ) { 
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar una RUC para la Empresa"});
            return 0;
        }

        if ( _DOM.p_correo.val() === '' ) { 
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar un correo para la Empresa"});
            return 0;
        }

        if ( _DOM.p_razon_social.val() === '' || _DOM.p_razon_social.val() === '') {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar una razón social para la empresa"});
            return 0;
        }

        if ( _DOM.p_nombres.val() === '' || _DOM.p_apellidos.val() === '') {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe ingresar una nombres y apellidos para el Empresario"});
            return 0;
        }

        if ( _DOM.p_ruc.val().length < 8 ) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"El DNI debe tener 8 digitos."});
            return 0;
        }

        if ( _DOM.p_celular.val().length < 9 ) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"El número móvil debe tener 9 digitos."});
            return 0;
        }

        if ( _DOM.p_cod_sector_industrial.val() =="" || _DOM.p_cod_sector_industrial.val() == null) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe seleccionar un sector industrial."});
            return 0;
        }

        if ( _DOM.p_cod_tipo_empresa.val() =="" || _DOM.p_cod_tipo_empresa.val() == null) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe seleccionar un tipo de empresa."});
            return 0;
        }

        if ( _DOM.p_cod_cargo.val() =="" || _DOM.p_cod_cargo.val() == null) {
            Util.alert(_DOM.blkAlertModal, {tipo:"e", mensaje:"Debe seleccionar un cargo para el Empresario."});
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
                modelo: "Empresario",
                metodo: _DOM.operacion.val(),
                data_in: {
                    p_codEmpresario : _DOM.p_cod_empresario.val(),
                    p_ruc : _DOM.p_ruc.val(),
                    p_razonSocial: _DOM.p_razon_social.val(),
                    p_descripcionEmpresa: _DOM.p_descripcion_empresa.val(),
                    p_nombres : _DOM.p_nombres.val(),
                    p_apellidos : _DOM.p_apellidos.val(),
                    p_celular : _DOM.p_celular.val(),
                    p_cargo : _DOM.p_cod_cargo.val(),
                    p_codSectorIndustrial : _DOM.p_cod_sector_industrial.val(),
                    p_codTipoEmpresa : _DOM.p_cod_tipo_empresa.val(),
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
                modelo: "Empresario",
                metodo: "cambiarClaveWeb",
                data_in: {
                    p_codEmpresario : _DOM.p_cod_empresario_clave.val(),
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
    var filtro_ruc = DOM.p_filtro_ruc.val(), 
        filtro_apellidos = DOM.p_filtro_razonsocial.val(),
        filtro_estado = DOM.p_filtro_estado.val();

    if (!filtro_ruc) filtro_ruc = '';
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
                html += '<th class="text-center">RUC</th>';
                html += '<th>Razón Social</th>';                                          
                html += '<th>Tipo Empresa</th>';
                html += '<th>Empresario</th>';                                          
                html += '<th>Celular</th>';
                html += '<th>Correo</th>';
                html += '<th>Estado</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                if ( resultado.datos.data.length === 0 ) {
                    html += '<tr>';
                    html += '<td align="center" colspan="8">No se ha encontrado resultados</td>';
                    html += '</tr>';
                }else{      
                    $.each(resultado.datos.data, function (i, item) {
                        var  objValidado;
                        html += '<tr>';
                        html += '<td align="center">';
                        html += '<button type="button" class="btn btn-primary btn-xs" title="Editar" data-toggle="modal" data-target="#myModal" onclick="editar(' + item.cod_empresario + ')"><i class="material-icons">edit</i></button>';
                        html += '&nbsp;&nbsp;';
                        html += '<button type="button" class="btn btn-warning btn-xs" title="Cambiar clave" data-toggle="modal" data-target="#modalClave" onclick="cambiarClave(\''+item.correo+'\',' + item.cod_empresario + ')"><i class="material-icons">vpn_key</i></button>';
                        html += '&nbsp;&nbsp;';
                        html += '<button type="button" class="btn btn-danger btn-xs" title="Eliminar" onclick="darBaja(' + item.cod_empresario + ',0)"><i class="material-icons">delete</i></button>';    
                        html += '&nbsp;&nbsp;';
                        html += '</td>';
                        html += '<td align="center">' + item.ruc + '</td>';
                        html += '<td>' + item.razon_social + '</td>';
                        html += '<td>' + item.tipo_empresa + '</td>';
                        html += '<td>' + item.empresario + '</td>';
                        html += '<td>' + item.celular + '</td>';
                        html += '<td>' + item.correo + '</td>';

                        html += '<td><span class="badge bg-'+(item.estado == 'ACTIVO' ? 'green' : 'red')+'">'+item.estado+'</span></td>';
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
        modelo: "Empresario",
        metodo: "listar",
        data_out: [filtro_ruc, filtro_apellidos, filtro_estado]
    }, funcion);
}

function editar(codigo) {
    DOM.self.find(".modal-title").text("Editar Empresario");
    DOM.operacion.val("editar");
    $(".clave-div").addClass("hide");
    DOM.p_clave.removeAttr("required",true);
    DOM.blkAlertModal.empty();

    var funcion = function (resultado) {
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var datos = resultado.datos.r,
                    ubigeo = resultado.datos.ubigeo;
                DOM.p_cod_empresario.val(datos.cod_empresario);
                DOM.p_ruc.val(datos.ruc);  
                DOM.p_razon_social.val(datos.razon_social);  
                DOM.p_nombres.val(datos.nombres);  
                DOM.p_apellidos.val(datos.apellidos);  
                DOM.p_celular.val(datos.celular);
                DOM.p_domicilio.val(datos.domicilio);

                DOM.p_cod_cargo.val(datos.cod_cargo);
                DOM.p_cod_sector_industrial.val(datos.cod_sector_industrial);
                DOM.p_cod_tipo_empresa.val(datos.cod_tipo_empresa);
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
        modelo: "Empresario",
        metodo: "leerDatos",
        data_in: {
            p_codEmpresario : codigo
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
                modelo: "Empresario",
                metodo: "darBaja",
                data_in: {
                    p_codEmpresario : codigo,
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
                Util.llenarCombo("Seleccionar cargo", DOM.p_cod_cargo, r.cargos);
                Util.llenarCombo("Seleccionar sector industrial", DOM.p_cod_sector_industrial, r.sectores_industriales);
                Util.llenarCombo("Seleccionar tipo de empresa", DOM.p_cod_tipo_empresa, r.tipo_empresas);
                Util.llenarCombo("Seleccionar región", DOM.p_cod_ubigeo_region, r.regiones);

                $(".selectpicker").selectpicker('refresh');
            }else{
                alert(resultado.datos.msj.errorInfo[2]);              
            }
        }
    };

    new Ajxur.Api({
        modelo: "Empresario",
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
    DOM.p_cod_empresario_clave.val(codigo);
    DOM.lbl_correo.html(correo);
}


