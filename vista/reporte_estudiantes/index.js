var app = {};

$(document).ready(function () {    
    app.setDOM();
    app.setEventos();
    app.cargarEstudiantes();
});


app.setDOM = function(){
    var DOM ={};

    DOM.blkAlert = $("#blk-alert");
    DOM.frm = $("form");
    DOM.chkTodos = $("#chk-todos");
    DOM.txtFechaInicio = $("#txt-fecha-inicio");
    DOM.txtFechaFin = $("#txt-fecha-fin");
    DOM.cboEstudiante = $("#cbo-estudiante");

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
        var str = "../../controlador/reporte.pdf.estudiantes.php?";      
            str +=  "&p_son_todos="+DOM.chkTodos[0].checked+
                    "&p_fi="+DOM.txtFechaInicio.val()+
                    "&p_ff="+DOM.txtFechaFin.val()+
                    "&p_cods="+DOM.cboEstudiante.val(); 

        window.open(str,'_blank');        
    });

};

app.cargarEstudiantes = function() {
    var DOM = app.DOM;
    var funcion = function (resultado) {
        var datos = resultado.datos;
        if (resultado.estado === 200) {
            if (datos.rpt === true) {
                var html = '<option value="0">Todos los estudiantes</option>';
                $.each(datos.r, function (i, item) { 
                    html += '<option value="' + item.id + '">'+ item.descripcion + '</option>';
                });
                DOM.cboEstudiante.html(html).selectpicker('refresh');                
            }else{
                Util.alert(DOM.blkAlert, {"tipo":'e', "mensaje": datos.msj.errorInfo});
            }
        }
    };
    new Ajxur.Api({
        modelo: "Estudiante",
        metodo: "obtenerEstudiantesCB"
    },funcion);
};

//Util.notificacion("bg-green", 'Queda 1000 moscas por asignar.', "bottom", "right",null,null,1500);

