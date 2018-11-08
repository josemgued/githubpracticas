"use strict";

var Mantenimiento = function(data){
	var self = this;
	function __init(__data){
		self.principal = __data.principal || (__data.principal = {});
		self.atributos = __data.atributos || (__data.atributos = {});

		self.itemsModal = formatearObjModal();
		self.itemsTabla = formatearObjTabla();
		return self;
	}

	function formatearObjModal(){		
		var fModal = [];
		self.atributos.forEach(
			function(obj, i){
				var objHtml = obj.html;
				if (obj.html){
					if (!fModal[objHtml.fila]){
						fModal[objHtml.fila] = [];
					}
					fModal[objHtml.fila].push({
						label : objHtml.label,
						tamaño : objHtml.tamaño,
						element : function(){
							let strRet = "";
							switch (objHtml.nombre){
								case "input":
									strRet = '<input id="txt-'+obj.nombre+'" data-validador="'+objHtml.validador+'" '+(objHtml.focus ? "autofocus" : '')+' name="'+obj.nombre+'" type="'+objHtml.type+'" '+objHtml.required+' '+ (objHtml.disabled ? "disabled" : '') +'  class="form-control"/>'
								break;
								case "textarea":
									strRet = '<textarea id="txt-'+obj.nombre+'"  data-validador="'+objHtml.validador+'"  '+(objHtml.focus ? "autofocus" : '')+' name="'+obj.nombre+'" '+objHtml.required+' class="form-control"></textarea>'
								break;
							}

							return strRet;
						}()
					});			
				}
			}
		);	

		return fModal;
	};

	function formatearObjTabla(){
		var fTabla = {};
		if (self.table){
			fTabla.tamaño = self.table.tamaño;
		};

		if (self.prinicpal){
			fTabla.titulo = self.principal.nombre; 
		};

		if (self.acciones){
			fTabla.acciones = self.acciones; 
		};

		fTabla.cabecera= [];

		self.atributos.forEach(
			function(obj, i){				
				if (!obj.col || obj.col == false){
					return;
				}

				fTabla.cabecera.push({
					nombre: obj.table.nombre,					
				}); 	
			}
		);	

		return fTabla;
	};

	this.listar = function(pFn){
		var l_fn = function(xhr){
			if (xhr.estado == 200 && xhr.datos.rpt){
				pFn(xhr.datos.msj);								
			}
		};
		new Ajxur.Api({
			metodo:"listar",
			modelo:self.principal.modelo
		},l_fn);
	};

	this.agregar = function(JSON,pFn){
		var l_fn = function(xhr){
			if (xhr.estado == 200){
				pFn(xhr.datos);
			}
		};
		new Ajxur.Api({
			metodo:"agregar",
			modelo:self.principal.modelo,
			data_out : [JSON]
		},l_fn);
	};

	this.leer = function(codigo, pFn){
		var l_fn = function(xhr){
			if (xhr.estado == 200 && xhr.datos.rpt){
				pFn(xhr.datos.msj);								
			}
		};
		new Ajxur.Api({
			metodo:"leerDatos",
			modelo:self.principal.modelo,
			data_out : [codigo]
		},l_fn);
	};

	this.editar = function(JSON,pFn){
		var l_fn = function(xhr){
			if (xhr.estado == 200){
				pFn(xhr.datos);								
			}
		};
		new Ajxur.Api({
			metodo:"editar",
			modelo:self.principal.modelo,
			data_out : [JSON]
		},l_fn);
	};

	this.eliminar = function(id, pFn){
		var l_fn = function(xhr){
			if (xhr.estado == 200 && xhr.datos.rpt){
				pFn(xhr.datos.msj);								
			}
		};
		new Ajxur.Api({
			metodo:"darBaja",
			modelo:self.principal.modelo,
			data_out: [id]
		},l_fn);
	};

	return __init(data);
};

var objCargo = new Mantenimiento({
	principal : {
		"modelo": "Cargo",
		"nombre": "Cargo de Empresa",
		"bd" : "cargo"
	},
	atributos: [
		{			
			"nombre": "cod_cargo",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 7,			
				"nombre":"input",
				"type":"text",
				"placeholder": "",
				"minlength": "",
				"maxlength": "",
				"disabled": "",
				"required": "required",
				"validador": "letra",
				"focus" : 1
			}
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":true,
		"editar":true,
		"eliminar":true
	}
});

var objCarreraUniversitaria = new Mantenimiento({
	principal : {
		"modelo": "CarreraUniversitaria",
		"nombre": "Carrera Universitaria",
		"bd" : "carrera_universitaria"
	},
	atributos: [
		{			
			"nombre": "cod_carrera_uni",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 10,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required",
				"validador": "letra",
				"focus" : 1
			}
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":true,
		"editar":true,
		"eliminar":true
	}
});

var objUniversidad = new Mantenimiento({
	principal : {
		"modelo": "Universidad",
		"nombre": "Universidad",
		"bd" : "Universidad"
	},
	atributos: [
		{			
			"nombre": "cod_universidad",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 10,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required",
				"validador": "letra",
				"focus" : 1
			}
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":true,
		"editar":true,
		"eliminar":true
	}
});

var objTipoEmpresa = new Mantenimiento({
	principal : {
		"modelo": "TipoEmpresa",
		"nombre": "Tipo de Empresa",
		"bd" : "tipo_empresa"
	},
	atributos: [
		{			
			"nombre": "cod_tipo_empresa",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 10,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required",
				"validador": "letra",
				"focus" : 1
			}
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":true,
		"editar":true,
		"eliminar":true
	}
});

var objSectorIndustrial = new Mantenimiento({
	principal : {
		"modelo": "SectorIndustrial",
		"nombre": "Sector Industrial",
		"bd" : "sector_industrial"
	},
	atributos: [
		{			
			"nombre": "cod_sector_industrial",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 10,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required",
				"validador": "letra",
				"focus" : 1
			}
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":true,
		"editar":true,
		"eliminar":true
	}
});

/*
var objRol = new Mantenimiento({
	principal : {
		"modelo": "Rol",
		"nombre": "Rol",
		"bd" : "rol"
	},
	atributos: [
		{			
			"nombre": "id_rol",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 10,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required",
				"validador": "letra",
				"focus" : 1
			}
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":true,
		"editar":true,
		"eliminar":true
	}
});

var objTipoRiesgo = new Mantenimiento({
	principal : {
		"modelo": "TipoRiesgo",
		"nombre": "Nivel de Riesgo",
		"bd" : "tipo_riesgo"
	},
	atributos: [
		{			
			"nombre": "id_tipo_riesgo",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 10,			
				"nombre":"input",
				"type":"text",
				"disabled": true,
				"required": "",
				"focus" : 1
			}
		},
		{
			"nombre": "minimo",
			"col":true,			
			"table": {
				"nombre": "Rango mínimo",
				"text-center": true,							
			},
			"html" : {
				"label": "Rango Mínimo",
				"fila": 1,
				"tamaño": 6,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required",
				"validador": "numero"
			}
		},
		{
			"nombre": "maximo",
			"col":true,			
			"table": {
				"nombre": "Valor Máximo",
				"text-center": true,							
			},
			"html" : {
				"label": "Valor Máximo",
				"fila": 1,
				"tamaño": 6,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required",
				"validador": "numero"
			}
		}
	],
	table : {
		"tamaño": 4
	},
	acciones : {
		"agregar":false,
		"editar":true,
		"eliminar":false
	}
});

var objTipoRiego = new Mantenimiento({
	principal : {
		"modelo": "TipoRiego",	
		"nombre": "Tipo de Riego",
		"bd" : "tipo_riego"
	},
	atributos: [
		{			
			"nombre": "id_tipo_riego",
			"col": false,
			"id":true
		}
	],
	table : {
		"tamaño": 5
	},
	acciones : {
		"agregar":false,
		"editar":false,
		"eliminar":false
	}
});

var objTipoDistribucion = new Mantenimiento({
	principal : {
		"modelo": "TipoDistribucion",
		"nombre": "Tipo de UMD",
		"bd" : "tipo_distribucion"
	},
	atributos: [
		{			
			"nombre": "id_tipo_distribucion",
			"col": false,
			"id":true
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":false,
		"editar":false,
		"eliminar":false
	}
});

var objVariableGeneral = new Mantenimiento({
	principal : {
		"modelo": "VariableGeneral",
		"nombre": "Variable General",
		"bd" : "variable_general"
	},
	atributos: [
		{			
			"nombre": "id_variable_general",
			"col": false,
			"id":true
		},
		{
			"nombre": "nombre",
			"col":true,			
			"table": {
				"nombre": "Nombre de Variable",
				"text-center": false,							
			},
			"html" : {
				"label": "Nombre",
				"fila": 0,
				"tamaño": 8,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required"
			}
		},
		{
			"nombre": "valor",
			"col":true,			
			"table": {
				"nombre": "Valor",
				"text-center": true,							
			},
			"html" : {
				"label": "Valor",
				"fila": 0,
				"tamaño": 4,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": "required"			}
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 1,
				"tamaño": 12,			
				"nombre":"textarea",
				"disabled": "",
				"required": "required",
				"validador" : ""
			}
		}
	],
	table : {
		"tamaño": 6
	},
	acciones : {
		"agregar":true,
		"editar":true,
		"eliminar":true
	}
});

var objVariedadCaña = new Mantenimiento({
	principal : {
		"modelo": "VariedadCania",
		"nombre": "Variedad de Caña",
		"bd" : "variedad_caña"
	},
	atributos: [
		{			
			"nombre": "id_variedad_caña",
			"col": false,
			"id":true
		},
		{
			"nombre": "descripcion",
			"col":true,			
			"table": {
				"nombre": "Descripción",
				"text-center": false,							
			},
			"html" : {
				"label": "Descripción",
				"fila": 0,
				"tamaño": 8,			
				"nombre":"input",
				"type":"text",
				"disabled": "",
				"required": ""
			}
		}
	]
});
*/