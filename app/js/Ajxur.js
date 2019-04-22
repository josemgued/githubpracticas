var Ajxur = {
   // var self = this;
   URL : "../../appJoseServer/controlador/index.php" ,
    $Ld : null,
    Loader : {  
        numAPIs: 0,     
        c  : 0, // contador de peticiones activas.        
        timer : 1300,
        esMostrado :function(){
          return !(!$$(".preloader-indicator-modal"));
        },
        quitar : function(){
          app.hideIndicator();
        },
        mostrar : function(){
          app.showIndicator();
        }
    },
    Api : function (params, callbackFunction, callbackFunctionError){    
            var self = this, data_frm;
            this.tracer = false;
            this.needParseJSON = 1; 
            
            this.url = data.ip+"/controlador/index.php";
            if (params.data_files){ 
               data_frm  = new FormData();
               data_frm.append("modelo",params.modelo);
               data_frm.append("metodo",params.metodo);
               if (params.formulario){
                 data_frm.append("formulario",params.formulario);
               }
               if (params.data_in){
                 data_frm.append("data_in",params.data_in);
               }
               if (params.data_out){
                 data_frm.append("data_out",params.data_out);
               }

               if (params.data_files && params.data_files != undefined){
                $.each(params.data_files, function(key,value){
                  if (value)
                    data_frm.append(key,value);   
                })
               }
               
               this.ajax = $$.ajax({                
                url: self.url,
                cache: false,
                contentType: false,
                processData: false,
                data: data_frm,
                type: "post"
              });
            } else{
              this.ajax = $$.ajax({
                url: self.url,
                data: params,
                type: "post",
                error :  function(e){
                  self.failCallback(e);
                },                
                success :  function(r){
                  self.successCallback(r);
                }
              });
            }
            Ajxur.Loader.c++;
            this.id =  ++Ajxur.Loader.numAPIs;

            if(self.tracer) console.log("INICIO PETICIÓN. ID:",self.id); 

            setTimeout(function(){
              if(self.tracer) {
                console.log("PETICIONES ACTIVAS ", Ajxur.Loader.c);
                console.log("Verificador de DELAY: Estado de ID:",self.id); 
                }
                if (self.ajax.readyState != 4){
                  if(self.tracer) console.log("DATA aún no ha llegado.:");
                  Ajxur.Loader.mostrar();
                  return;
                }
              if(self.tracer) console.log("DATA ya había llegado. ");
            },Ajxur.Loader.timer);
            
            this.back = function(){
                if (self.tracer) console.log("DATA llegó. ID: ", self.id);
                Ajxur.Loader.c--;
                if (self.tracer) console.log("PETICIONES ACTIVAS ", Ajxur.Loader.c);
                if (Ajxur.Loader.esMostrado()){
                    if (self.tracer) console.log("CARGANDO... Está en pantalla.");
                    if (Ajxur.Loader.c <= 0){
                        if (self.tracer) console.log("No hay peticiones.");
                        Ajxur.Loader.quitar();
                        return;
                    }    
                    return;
                }      
                if (self.tracer)  console.log("CARGANDO... Está fuera de pantalla");  
            };


            this.successCallback = function(success){
                self.back();
                if (  self.needParseJSON  == 1){
                    success = JSON.parse(success);    
                }
                callbackFunction(success);    
            }

            this.failCallback = function(error){
                Ajxur.Loader.quitar();

                if (  self.needParseJSON  == 1){
                  try{
                    errorJ = JSON.parse(error);            
                  } catch (e){
                    errorJ = error; 
                  }
                }

                if (errorJ.status == 0){
                  if (typeof callbackFunctionError == 'function'){
                    callbackFunctionError("No puedo conectarme al servidor.");
                  }
                  app.alert("No puedo conectarme al servidor.");
                  return;
                }

                if (typeof callbackFunctionError == 'function'){
                    callbackFunctionError(errorJ.responseText);
                } else {                                      
                    console.error(errorJ);
                }   
            }
        }
};
