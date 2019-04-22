var Util ={
	Store :  {
		master_key : "_app_jose_:",
		set : function(nombre, valor){
			data[nombre] = valor;
			return $.jStorage.set(Util.Store.master_key+nombre,valor);
		},
		get : function(nombre){
			return $.jStorage.get(Util.Store.master_key+nombre);
		},
		del : function(nombre){
            data[nombre] = null;
			return $.jStorage.deleteKey(Util.Store.master_key+nombre);
		},
		initApp : function(){
			var keysInicio  = ["usuario"],
			ret = {};

			keysInicio.forEach(function(o,i){
				if ($.jStorage.get(Util.Store.master_key+o)){
					ret[o] = $.jStorage.get(Util.Store.master_key+o);
				}
			});

			return ret;
		}
	},
	obtenerFechaFormateada: function(){
		var d = new Date();
		var day = d.getDate();
        return this.getDia(d.getDay())+ ", " + (day<10 ? '0' : '') + day + " de "+ this.getMes(d.getMonth())+ " del "+ d.getFullYear();
	},
    obtenerFechaInput: function(fecha){
        var d = fecha || new Date(), 
            dia = d.getDate(),            
            mes = d.getMonth()+1,
            año = d.getFullYear();

        dia = (dia<10 ? '0':'')+dia;
        mes = (mes<10 ? '0':'')+mes;

        return año+"-"+mes+"-"+dia;
    },
    formatearHora: function(hora){     
        /*Llega hora, formato HH:MM:SS (24)*/   
        var hh  = hora.substr(0,2),
            nHora = hora.substr(2,6);
            am = "AM";
        if (hh >= 12){
            am = "PM";
            if (hh > 12){
                hh -= 12;
                if (hh < 10){
                    hh = '0'+hh;
                }   
            }
           
        }
        nHora = hh+nHora+" "+am;
        return nHora;
    },
    getMes : function (numMes){         
            switch (numMes){
                case 0 : return "Enero";
                case 1 : return "Febrero";
                case 2 : return "Marzo";
                case 3 : return "Abril";
                case 4 : return "Mayo";
                case 5 : return "Junio";
                case 6 : return "Julio";
                case 7 : return "Agosto";
                case 8 : return "Setiembre";
                case 9 : return "Octubre";
                case 10 : return "Noviembre";
                case 11 : return "Diciembre";
                default: return "Error";
            }
	},
    getDia  : function (numDia){         
            switch (numDia){
                case 0 : return "Domingo";                
                case 1 : return "Lunes";
                case 2 : return "Martes";
                case 3 : return "Miércoles";
                case 4 : return "Jueves";
                case 5 : return "Viernes";
                case 6 : return "Sábado";
                default: return "Error";
            }
    },
    Calendario : function(){
        var i, añoActual = new Date().getYear()+1900, 
            años = [], añoBase = 1970, meses = [], dias = [];
        for (i = añoBase; i <= añoActual; i++) {
            años.push(i);
        };

        for (i = 0; i < 12; i++) {
            meses.push(i+1);
        };

        for (i = 0; i <  31; i++) {
            dias.push(i+1);
        };

        return {"años": años, "meses" : meses, "dias": dias};
    },
    capitalize: function(str){
      var lower = str.toLowerCase();
      return lower.replace(/(^| )(\w)/g, function(x) {
        return x.toUpperCase();
      });
    },
    resultSetToArray: function(sqlRS){
        var arrayRetorno = [];
        for (var i = 0, len = sqlRS.length; i < len; i++) {
            arrayRetorno.push(sqlRS.item(i));
        };

        return arrayRetorno;
    }

};


if (typeof Array.prototype.find != 'function'){
    Array.prototype._find  = function find(key, value) {
        for (var i = 0; i < this.length; i++) {
             if (this[i][key] === value) {
                 return this[i];
            }
        }
        return null;
    }
} 
/*else {
    Array.prototype._find = function find(key,value){
        return this.find((e)=>{return e[key] == value});
    }
}*/