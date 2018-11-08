var app = {};

$(document).ready(function () {    
    app.setDOM();
    app.setEventos();
    app.cargarEmpresarios();
});


app.setDOM = function(){
    var DOM ={};

    DOM.blkAlert = $("#blk-alert");
    DOM.frm = $("form");
    DOM.chkTodos = $("#chk-todos");
    DOM.txtFechaInicio = $("#txt-fecha-inicio");
    DOM.txtFechaFin = $("#txt-fecha-fin");
    DOM.cboEmpresario = $("#cbo-empresario");
    DOM.tblConvocatorias = $("#tbl-convocatorias");

    app.DOM = DOM;
};

app.setEventos = function(){

    var self = this, DOM = app.DOM;

    DOM.chkTodos.on("change", function(e){
        var _checked = this.checked;
        if (_checked){
            DOM.txtFechaInicio.attr("disabled",true);
            DOM.txtFechaFin.attr("disabled",true);
        } else {
            DOM.txtFechaInicio.removeAttr("disabled");
            DOM.txtFechaFin.removeAttr("disabled");
        }
    });
    
    DOM.frm.submit(function(e){
        e.preventDefault();
        app.consultarPostulaciones();     
    });

};

app.cargarEmpresarios = function() {
    var DOM = app.DOM;
    var funcion = function (resultado) {
        var datos = resultado.datos;
        if (resultado.estado === 200) {
            if (datos.rpt === true) {
                var html = '<option value="">Todos los empresarios</option>';
                $.each(datos.r, function (i, item) { 
                    html += '<option value="' + item.id + '">'+ item.descripcion + '</option>';
                });
                DOM.cboEmpresario.html(html).selectpicker('refresh');                
            }else{
                Util.alert(DOM.blkAlert, {"tipo":'e', "mensaje": datos.msj.errorInfo});
            }
        }
    };
    new Ajxur.Api({
        modelo: "Empresario",
        metodo: "obtenerEmpresariosCB"
    },funcion);
};

app.consultarPostulaciones = function() {
    var DOM = app.DOM;

    var funcion = function (resultado) {
        var datos = resultado.datos,
            r = datos.r;
        if (resultado.estado === 200) {
            if (datos.rpt === true) {
                var html = '';
                if ( r.length === 0 ) {
                    html += '<tr>';
                    html += '<td align="center" colspan="7">No se ha encontrado resultados</td>';
                    html += '</tr>';
                }else{      
                    $.each(r, function (i, item) {
                        var  objValidado;
                        html += '<tr>';     
                        html += '<td align="center">';
                        html += '<button type="button" class="btn btn-danger btn-xs" title="Generar" onclick="app.generar(' + item.cod_aviso_laboral + ')"><i class="material-icons">assignment</i></button>';    
                        html += '&nbsp;&nbsp;';
                        html += '</td>';               
                        html += '<td>'+ (i+1) +'</td>';
                        html += '<td>' + item.titulo + '</td>';
                        html += '<td>' + item.empresario + '</td>';
                        html += '<td>' + item.fecha_lanzamiento + ' / '+ item.fecha_vencimiento + '</td>';
                        html += '<td align="center">' + item.cantidad_postulantes + '</td>';
                        html += '<td><span class="badge bg-'+(item.estado == 'ACTIVO' ? 'green' : 'red')+'">'+item.estado+'</span></td>';

                        html += '</tr>';
                    });
                }

                DOM.tblConvocatorias.html(html);                
            }else{
                Util.alert(DOM.blkAlert, {"tipo":'e', "mensaje": datos.msj});
            }
        }
    };

    new Ajxur.Api({
        modelo: "AvisoLaboral",
        metodo: "obtenerConvocatorias",
        data_out: [DOM.txtFechaInicio.val(), DOM.txtFechaFin.val(), DOM.chkTodos[0].checked, DOM.cboEmpresario.val()]
    },funcion);
};


app.generar = function(codConvocatoria){
    if (!codConvocatoria || codConvocatoria == "0"){
        alert("Código de convocatoria inválido.");
        return;
    }

    var str = "../../controlador/reporte.pdf.convocatoria.estudiantes.php?&p_cod="+codConvocatoria;

    window.open(str,'_blank');   
};

//Util.notificacion("bg-green", 'Queda 1000 moscas por asignar.', "bottom", "right",null,null,1500);


