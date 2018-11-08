var DOM = {};

var app ={};

app.setTemplates = function(){
    this.tpl8 = {};
    $.each($('script[type=handlebars-x]'), function(i,o){
        var id = o.id, idName = id.substr(4);
        if (id.length > 0){
            app.tpl8[idName] = Handlebars.compile(o.innerHTML);
        }
    });
};

app.setDOM = function(){

    this.blkAlert = $("#blk-alert");
    this.modalMantenimiento = $("#modal-mantenimiento");
    this.modalMantenimientoTitle = this.modalMantenimiento.find(".modal-title");
    this.modalMantenimientoBody = this.modalMantenimiento.find(".modal-body");

    this.frm = $("#frm-grabar");
    this.tblListado = $("#tbl-listado");
};

app.abrirModal = function(accion, objMant){
    if (!objMant){
        return;
    }
    accion = !accion ? "Registrar" : accion;

    this.modalMantenimiento.modal("show");    
    this.modalMantenimientoTitle.html(accion+" "+objMant.principal.nombre);
    this.modalMantenimientoBody.html(this.tpl8.Modal(objMant.itemsModal));
    if (accion == "Registrar"){
        $.AdminBSB.input.activate();
    }
    this.setEventosModal();
};

app.setEventosModal = function(){
    console.log($("[data-validador]"));
};


app.setEventos = function(){
    var self = this;

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href"); // activated tab
      var objeto = e.target.dataset.objeto;
      self.blkAlert.empty();
      self.activarObjetoMantenimiento(objeto, target);
    });

    

    this.frm.submit(function(e){
        e.preventDefault();
        var op = self.modalMantenimientoBody.find("#op").val();

        if (self.strActualObj.length > 0){

            var objFrm = {};
            $.each(self.frm.find("input"), function(i,o){
                objFrm[o.name] = o.value;
            });

            $.each(self.frm.find("textarea"), function(i,o){
                objFrm[o.name] = o.value;
            });


            window["obj"+self.strActualObj][op](JSON.stringify(objFrm),
                function(datos){
                    var tipo = "s";
                    if (datos.rpt != true){
                        tipo = "e";
                    }

                    Util.alert(self.blkAlert, {"tipo":tipo, "mensaje": datos.msj});
                    window["obj"+self.strActualObj].listar(app.listar);
                    self.modalMantenimiento.modal("hide");
                });
        }
    })
};


app.activarObjetoMantenimiento = function(objeto, tabContent){
    app.strActualObj = objeto;
    app.strActualTabContent = tabContent;

    //$(window[strObj].principal.bd).html(app.tpl8.TabObjeto(window[strObj].principal.itemsTabla));
    window["obj"+app.strActualObj].listar(app.listar);   

    //app.objs = {};
    //app.objs["obj"+objeto] = new window[objeto]();
};

app.listar = function(data){
    var tblBody = $(app.strActualTabContent).find("table tbody");
    tblBody.html(app.tpl8[app.strActualObj+"_Tabla"](data));
};

app.registroNuevo  = function(){
    this.abrirModal("Registrar",  window["obj"+app.strActualObj]);
};

app.editar = function(id){
    app.limpiarModal();
    app.abrirModal("Editar", window["obj"+app.strActualObj]);

    var fn = function(data){
        app.modalMantenimientoBody.find("#op").val("editar");
        
        $.each(data, function(key,o){
            app.modalMantenimientoBody.find("input[name="+key+"]").val(o);
            app.modalMantenimientoBody.find("textarea[name="+key+"]").val(o);
            $.AdminBSB.input.activate();
        });

    };

    window["obj"+app.strActualObj].leer(id, fn);
};


app.eliminar = function(id){    
    var self = this;
    var fn = function(msj){                
        Util.alert(self.blkAlert, {
            "tipo":"s", "mensaje": msj
        });
        window["obj"+app.strActualObj].listar(app.listar);  
    };

    var fnAccion = function(){
        window["obj"+app.strActualObj].eliminar(id, fn);    
    };

    Util.confirm(fnAccion);
};

app.limpiarModal = function(){
    this.modalMantenimientoBody.find("input").val("");
    this.modalMantenimientoBody.find("textarea").val("");
};

app.activarTab = function(href){
    if (href){
        $('.nav-tabs a[href="#'+href+'"]').tab('show');    
    }
};

app.init = function(){
    this.setTemplates();
    this.setDOM();
    this.setEventos();
};



$(document).ready(function () {
    app.init();
    /*
    setDOM();
    setEventos();
    listar();
    */
});
