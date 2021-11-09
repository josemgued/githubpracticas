window.location.hash = "";

var globalVars = {
	appNombre : "APPracticar",
	URL: "../"
	//URL: "http://localhost/appJoseServer"
},
data = {};
data.ip = globalVars.URL;
data.panelOpened = false;

/*
data = Util.Store.initApp();
data.ip = globalVars.URL;
*/

/*Data Init*/
var $$ = Dom7;	

var init = function (modo){
	data._modo = modo ? modo : 'web';
	//loadPage("estudiante-cuenta-nueva.html");
	var DOM = {
		perfilIzq : $$("#perfil-izq"),
		lstMenu : $$("#lst-menu"),
		panelLeft : $$(".panel-left")
	};

	DOM.panelLeft.on('panel:opened', function () {
		data.panelOpened = true;
	});

	DOM.panelLeft.on('panel:closed', function () {
		data.panelOpened = false;
	});

	var tipoUsuario = data.usuario.tipo_usuario;

	var menuData, esEmpresario = tipoUsuario == "Empresario", pageInicio;
	if (esEmpresario){
		menuData = [
			{icon:"person", rotulo:"Datos Empresa", href:"empresario-datos-empresa"},
			{icon:"drawers", rotulo:"Gestionar Convocatorias", href:"empresario-gestionar-convocatoria?cv=0"},
			{icon:"persons_fill", rotulo:"Mis Convocatorias", href:"empresario-mis-convocatorias"}
		];

		pageInicio = "empresario-mis-convocatorias";
	} else {
		menuData = [
			{icon:"person", rotulo:"Datos Personales", href:"estudiante-datos-personales"},
			{icon:"search_strong", rotulo:"Buscar Convocatoria", href:"estudiante-buscar-aviso"},
			{icon:"drawer", rotulo:"Mis Postulaciones", href:"estudiante-mis-postulaciones"}				
		];

		pageInicio = "estudiante-buscar-aviso";
	}
	

	var Templates = Template7.templates;
	actualizarPerfil(DOM.perfilIzq, Templates);
	DOM.lstMenu.html(Templates.menuIzqT7(menuData));

	DOM.lstMenu.on("click","li", function(e){
		if (data.panelOpened){
			app.closePanel();
		}
	});

	app.DOM = DOM;

	//loadPage("estudiante-buscar-aviso");
	console.log(pageInicio);
	if (mainView.url == "#"+pageInicio){
		mainView.router.refreshPage();
	} else {
		loadPage(pageInicio);
	}
};

var app = new Framework7({
    pushState: true,    
    material : true,
    fastClicks : true,
    uniqueHistory : true,
    smartSelectPopupCloseText: 'Cerrar',
    notificationCloseButtonText : 'CERRAR',
    cache : false,
    precompileTemplates: true,
    modalTitle : globalVars.appNombre,
    touch: {
	  tapHold: true,
	},
    preroute: function (v, options) {}
});


var mainView = app.addView('.view-main', {
  domCache: true //enable inline pages
});

var loadPage = function(pagina, params){
	if (data._modo == 'apk'){
		mainView.router.load({pageName: pagina.replace(".html",""), query: params})
	} else {
		mainView.router.loadPage(pagina);				
	}
};

var actualizarPerfil = function(perfilIzq, Templates){
	if (!Templates){
		Templates = Template7.templates;
	}

	if (!perfilIzq){
		perfilIzq = app.DOM.perfilIzq;
	}

	var _usuario = {
		nombres: data.usuario.nombres,
		apellidos : data.usuario.apellidos,
		url : globalVars.URL+"/images/"+data.usuario.url,
		fecha_formateada: Util.obtenerFechaFormateada()	
	}

	perfilIzq.html(Templates.perfilIzqT7(_usuario));
};

var pages = {};pages["estudiante-buscar-aviso"] = {
	init : function(_data){
		this.setDOM(_data.contenedor);
		this.getData();
	},
	reinit: function(){
		this.buscarAvisos();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("form,#txtconvocatoriabuscar,#blkontologia,#txtfechaibuscar,#txtfechafbuscar,#txtcarrerabuscar,#chkvigenciabuscar,#blkEmpresasBuscarAviso"),
			DOM = {
				form: preDOM.eq(0),
				txtBuscar : preDOM.eq(1),
				blkOntologia: preDOM.eq(2),
				txtFechaI : preDOM.eq(3),
				txtFechaF : preDOM.eq(4),
				txtCarrera : preDOM.eq(5),
				chkVigencia : preDOM.eq(6),
				blkEmpresas : preDOM.eq(7)
			};

		this.DOM = DOM;
	},
	render: function(_dataCarreras){
		var self = this,
			Templates = Template7.templates,
			DOM = self.DOM,
			hoy = new Date(),
			mesDespues = new Date(),
			$html,
			tmp;

			mesDespues.setMonth(hoy.getMonth() + 1);
			$html = "<option value='0' selected>Todas las carreras</option>";
			for (var i = 0; i < _dataCarreras.length; i++) {
				tmp = _dataCarreras[i];
				$html += '<option value="'+tmp.codigo+'">'+tmp.nombre_carrera+'</option>';
			}
			DOM.txtCarrera.html($html);

		//CalendarioI.setValue([hoy]);
		//CalendarioF.setValue([mesDespues]);
		DOM.txtFechaI.val(Util.obtenerFechaInput(hoy));
		DOM.txtFechaF.val(Util.obtenerFechaInput(mesDespues));

		DOM.form.submit(function(e){
			e.preventDefault();
			self.buscarAvisos();
		});

		DOM.txtBuscar.on("focusout", function(e){
			self.buscarAvisos();
			self.consultarOntologia();
		});	

		DOM.txtBuscar.on("keypress", function(e){
			self.consultarOntologia(this.value);
		});	

		DOM.txtCarrera.on("change", function(e){
			self.buscarAvisos();
		});

		DOM.chkVigencia.on("change", function(e){
			var v = this.checked;
			if (v){
				/*disabled inputs*/
				DOM.txtFechaF.attr("disabled",true);
				DOM.txtFechaI.attr("disabled",true);
			} else {
				DOM.txtFechaF.removeAttr("disabled");
				DOM.txtFechaI.removeAttr("disabled");
			}

			self.buscarAvisos();
		});


		DOM.blkOntologia.on("click","li", function(e){
			DOM.txtBuscar.val(this.innerHTML);
		});

		self.reinit();
	},
	renderResultados: function(_data){
		var DOM = this.DOM,
			dataEmpresas = _data;
			DOM.blkEmpresas.html(Template7.templates.empresasBuscarAvisoT7(_data));
		},
	buscarAvisos: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "buscarAvisos",
				data_out: [JSON.stringify(app.formToData(this.DOM.form))]
			}, function(r){
				if (r.estado === 200){
				 	self.renderResultados(r.datos.data);
				}
		});
	},
	consultarOntologia: function(str){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "consultarOntologia",
				data_out: [str]
			}, function(r){
				if (r.estado === 200){
				 	self.renderOntologia(r.datos.data);
				}
		});
	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "CarreraUniversitaria",
				metodo: "listarBuscarCarreras"
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
	renderOntologia: function(datos){
		var html = "";

		if (!datos || datos.length <= 0){
			this.DOM.blkOntologia.empty();
			return;
		}

		$$.each(datos, function(i,o){
			html+="<li>"+o.titulo+"<li>";
		});

		this.DOM.blkOntologia.html(html);
	}
};pages["estudiante-buscar-carreras"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.getData();
	},
	reinit: function(){
		
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			DOM = {
				lstMenu : $contenedor.find("#lstMenuCarrerasBuscar")
			};
		//this.DOM.txtUsuario = this.DOM.contenedor.find("#txt-usuario");
		this.DOM = DOM;
	},
	render: function(_data){
		this.DOM.lstMenu.html(Template7.templates.carrerasBuscarCarrerasT7(_data));
	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "CarreraUniversitaria",
				metodo: "listarBuscarCarreras"
			}, function(r){
				console.log(r);
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
};
pages["empresario-convocatoria-postulantes"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.reinit(data);
	},
	reinit: function(data){
		this.listarPostulantes(data.params.cv);
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("#txtConvocatoriaPostulantes, #lblPerfilRequerido, #blkPostulantes"),
			DOM = {
				txtConvocatoria : preDOM.eq(0),
				lblPerfilRequerido: preDOM.eq(1),
				blkPostulantes : preDOM.eq(2)
			};
		this.DOM = DOM;
	},
	renderResultados: function(codConvocatoria, _data){
		var DOM = this.DOM;
		DOM.txtConvocatoria.html(_data.convocatoria.titulo);
		DOM.lblPerfilRequerido.html("PERFL REQUERIDO: "+_data.convocatoria.total_puntaje+" (100%)");
		DOM.blkPostulantes.html(
			Template7.templates.postulantesPostulantesT7(
					{	postulantes: _data.postulantes,
						cod_aviso_laboral: codConvocatoria}
					));
	},
	listarPostulantes: function(codConvocatoria){
		var self = this;

		if (!codConvocatoria || codConvocatoria <= 0){
			history.back();
			app.alert("¡Código de convocatoria no válido!");
			return;
		}

		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "listarPostulantes",
				data_in: {p_codAvisoLaboral :codConvocatoria}
			}, function(r){
				if (r.estado === 200){
				 	self.renderResultados(codConvocatoria, r.datos.r);
				}
		});
	}
};pages["empresario-cuenta-nueva"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.setEventos();
		this.setearCargos();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("form,#txtCargo,#txtPassword,#txtRepetirPassword,#spnNuevaCuentaError,#btnGuardarNuevaCuenta"),
			DOM = {
				form: preDOM.eq(0),
				txtCargo : preDOM.eq(1),
				txtPassword : preDOM.eq(2),
				txtRepetirPassword : preDOM.eq(3),
				spnNuevaCuentaError : preDOM.eq(4),
				btnGuardar : preDOM.eq(5)
			};

			console.log(DOM);
		//this.DOM.txtUsuario = this.DOM.contenedor.find("#txt-usuario");
		this.DOM = DOM;
	},
	limpiarFormulario : function(){
		this.DOM.form[0].reset(); 
		this.DOM.form.find(".not-empty-state").removeClass("not-empty-state");
	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM;

		var fnPasswordIguales = function(ipt, iptOtro){
			var val = ipt.val(), valOtro = iptOtro.val();
			 if (valOtro == "" || val == ""){
			 	self.passIguales();
			 	return;
			 }

			 if (val === valOtro){
			 	self.passIguales();
			 	return;
			 }

			 if (val !== valOtro){
			 	self.passNoIguales();
			 } else {
			 	self.passIguales();
			 }
		};

		DOM.txtPassword.on("change", function(e){
			/*If txt repetir == null no hacer nada ELSE
			 verificar si son iguales sino MOSTRAR MENSAJE */
			 fnPasswordIguales(DOM.txtPassword, DOM.txtRepetirPassword);
		});	

		DOM.txtRepetirPassword.on("change", function(e){
			/*If txt passowrd == null no hacern ada ELSE
			verificar si son iguales sino MOSTRAR MENSAJE*/
			fnPasswordIguales(DOM.txtRepetirPassword, DOM.txtPassword);
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			self.guardarNuevaCuenta();
		});
	},
	setearCargos: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "Cargo",
				metodo: "obtenerCargos"
			}, function(r){
				if (r.estado === 200){
					var r = r.datos.r,
						html = "<option value=''>Seleccionar cargo</option>";
					for (var i = 0; i < r.length; i++) {
						tmp = r[i];
						html += '<option value="'+tmp.codigo+'">'+tmp.descripcion+'</option>';
					};
					self.DOM.txtCargo.html(html);
				}
		});
	},
	passNoIguales: function(){
		var DOM = this.DOM;
		DOM.spnNuevaCuentaError.show();
		DOM.btnGuardar[0].disabled = true;
		DOM.txtPassword.focus();
	},
	passIguales: function(){
		var DOM = this.DOM;
		DOM.spnNuevaCuentaError.hide();
		DOM.btnGuardar[0].disabled = false;
	},
	guardarNuevaCuenta: function(){
		var self = this, 
			DOM = self.DOM,
			datos_frm = new FormData();

	        datos_frm.append("p_array_datos", JSON.stringify(app.formToData(DOM.form)));
		
		if (DOM.txtPassword.val() != DOM.txtPasswordRepetir.val()){
			self.passNoIguales();
			return;
		}

	        DOM.btnGuardar[0].disabled = true;
	        app.showPreloader("Creando cuenta...");
	       	$$.ajax({
	            url: globalVars.URL+"/controlador/empresario.nueva.cuenta.guardar.php",
	            cache: false,
	            contentType: false,
	            processData: false,
	            data: datos_frm,
	            type: 'post',
	            success: function (r) {
					var datos;
					app.hidePreloader();
					try{
	                	r = JSON.parse(r); 
	                } catch (e){
	                	console.error("Can't parse");
	                	setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3500);
	                	return;
	                }

	                if (r.estado === 200) {
	                	datos = r.datos;
						if (datos.rpt == true){
	                		DOM.btnGuardar[0].disabled = false;
	                		app.alert(datos.msj);
	                		self.limpiarFormulario();
							pages.login.abrirLogin();
						} else {
	                		setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3500);
						}
	                }
	            },
	            error: function (error) {
	            	app.hidePreloader();
	                DOM.btnGuardar[0].disabled = false;
	                console.error(error);
	            }
	        });

	}
};
pages["estudiante-cuenta-nueva"] = {
	init : function(_data){
		this.setDOM(_data.contenedor);
		this.setEventos();		
		this.reinit(_data);
		this.getData(); /*Carreras y universidades*/
	},
	reinit: function(_data){
		if (data.usuario != null){ 
			/*Si hay inicio de sesión  y trato de ir a registrar nuevo,
			me mandará a atrás*/
			window.history.replaceState(null,{},"#estudiante-buscar-aviso");
			//history.replace;
			return;
		}
		this.limpiarFormulario();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("form,#txtCarrera_es,#txtUniversidad_es, #txtPassword_es,#txtRepetirPassword_es, #spnNuevaCuentaError_es, #btnGuardarNuevaCuenta_es"),
			DOM = {
			form: preDOM.eq(0),
			txtCarrera : preDOM.eq(1),
			txtUniversidad : preDOM.eq(2),
			txtPassword : preDOM.eq(3),
			txtRepetirPassword : preDOM.eq(4),
			spnNuevaCuentaError : preDOM.eq(5),
			btnGuardar : preDOM.eq(6)
		};		
		this.DOM = DOM;
		
		console.log(preDOM);
	},
	limpiarFormulario : function(){
		this.DOM.form[0].reset(); 
		this.DOM.form.find(".not-empty-state").removeClass("not-empty-state");
	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM;
		var fnPasswordIguales = function(ipt, iptOtro){
			var val = ipt.val(), valOtro = iptOtro.val();
			 if (valOtro == "" || val == ""){
			 	self.passIguales();
			 	return;
			 }

			 if (val === valOtro){
			 	self.passIguales();
			 	return;
			 }

			 if (val !== valOtro){
			 	self.passNoIguales();
			 } else {
			 	self.passIguales();
			 }
		};

		DOM.txtPassword.on("change", function(e){
			/*If txt repetir == null no hacer nada ELSE
			 verificar si son iguales sino MOSTRAR MENSAJE */
			 fnPasswordIguales(DOM.txtPassword, DOM.txtRepetirPassword);
		});	

		DOM.txtRepetirPassword.on("change", function(e){
			/*If txt passowrd == null no hacern ada ELSE
			verificar si son iguales sino MOSTRAR MENSAJE*/
			fnPasswordIguales(DOM.txtRepetirPassword, DOM.txtPassword);
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			self.guardarNuevaCuenta();
		});
	},
	passNoIguales: function(){
		var DOM = this.DOM;
		DOM.spnNuevaCuentaError.show();
		DOM.btnGuardar[0].disabled = true;
		DOM.txtPassword.focus();
	},
	passIguales: function(){
		var DOM = this.DOM;
		DOM.spnNuevaCuentaError.hide();
		DOM.btnGuardar[0].disabled = false;
	},
	guardarNuevaCuenta: function(){
		var self = this, 
			DOM = self.DOM,
			datos_frm = new FormData();

	        datos_frm.append("p_array_datos", JSON.stringify(app.formToData(DOM.form)));
		
		if (DOM.txtPassword.val() != DOM.txtPasswordRepetir.val()){
			self.passNoIguales();
			return;
		}

	        DOM.btnGuardar[0].disabled = true;
	        app.showPreloader("Creando cuenta...");
	       	$$.ajax({
	            url: globalVars.URL+"/controlador/estudiante.nueva.cuenta.guardar.php",
	            cache: false,
	            contentType: false,
	            processData: false,
	            data: datos_frm,
	            type: 'post',
	            success: function (r) {
					var datos;
					app.hidePreloader();
					try{
	                	r = JSON.parse(r); 
	                } catch (e){
	                	setTimeout(function(){DOM.btnGuardar[0].disabled = false;},2000);
	                }

	                if (r.estado === 200) {
	                	datos = r.datos;
						if (datos.rpt == true){
	                		DOM.btnGuardar[0].disabled = false;
	                		self.limpiarFormulario();
							pages.login.abrirLogin();
							window.history.replaceState(null,{},"#");
						} else {
	                		setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3000);
						}
	                	app.alert(datos.msj);
	                }
	            },
	            error: function (error) {
	            	app.hidePreloader();
	                DOM.btnGuardar[0].disabled = false;
	                console.error(error);
	            }
	        });

	},
	render : function(_data){
		var _dataCarreras = _data.carreras,
			_dataUniversidades = _data.universidades,
			$html = "<option value='' selected>Seleccionar carrera</option>";

		for (var i = 0; i < _dataCarreras.length; i++) {
			tmp = _dataCarreras[i];
			$html += '<option value="'+tmp.codigo+'">'+tmp.nombre_carrera+'</option>';
		}

		this.DOM.txtCarrera.html($html);

		$html = "<option value='' selected>Seleccionar universidad</option>";

		for (var i = 0; i < _dataUniversidades.length; i++) {
			tmp = _dataUniversidades[i];
			$html += '<option value="'+tmp.codigo+'">'+tmp.nombre_universidad+'</option>';
		}

		this.DOM.txtUniversidad.html($html);

	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "CarreraUniversitaria",
				metodo: "listarCarreraYUniversidad"
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
};
pages["empresario-datos-empresa"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.setEventos();
		this.getData();		
	},
	reinit: function(){
		if (data.usuario){
			this.getDataPersonal();
		} else {
			app.alert("¡No existe token de usuario válido!")
			pages.login.abrirLogin();
		}
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("form, #txtapellidosdatos,#txtnombresdatos,#txtcargodatos,#imgperfil,#btnEditarPerfil,#txtperfildatos,#txtrazonsocialdatos,"+
									"#txtnombreempresadatos,#txtdescripcionempresadatos, #txtdomiciliodatos,#txtregiondatos,#txtprovinciadatos,#txtdistritodatos,"+
									"#txtcelulardatos,#txttipoempresadatos,#txtsectorindustrialdatos,#btnGuardarDatos"),			
			DOM = {
				form: preDOM.eq(0),
				txtApellidos : preDOM.eq(1),
				txtNombres : preDOM.eq(2),
				txtCargo : preDOM.eq(3),
				imgPerfil : preDOM.eq(4),
				btnEditarPerfil : preDOM.eq(5),
				txtPerfil : preDOM.eq(6),
				txtRazonSocial : preDOM.eq(7),
				txtNombreEmpresa : preDOM.eq(8),
				txtDescripcion : preDOM.eq(9),
				txtDomicilio : preDOM.eq(10),
				txtRegion : preDOM.eq(11),
				txtProvincia : preDOM.eq(12),
				txtDistrito : preDOM.eq(13),
				txtCelular: preDOM.eq(14),
				txtTipoEmpresa : preDOM.eq(15),
				txtSectorIndustrial : preDOM.eq(16),
				btnGuardar : preDOM.eq(17)
			};

		this.DOM = DOM;
	},
	setEventos: function(){

		var self = this,
			Templates = Template7.templates,
			DOM = self.DOM;

		DOM.btnEditarPerfil.on("click", function(){
			DOM.txtPerfil.click();
		});

		DOM.imgPerfil.on("dblclick", function(e){
			DOM.imgPerfil.attr('src','img/perfil-def.jpg');
			DOM.txtPerfil.value = "";
		});

		DOM.txtPerfil.change(function(e){
		  var $this = $$(this);
	      var id = this.id;

		  if (this.files && this.files[0]) {        
		    var num = id.substr(id.length - 1);
		    var reader = new FileReader();
		       reader.onload = function(e){
		       	DOM.imgPerfil.attr('src', e.target.result)
		    };
		    reader.readAsDataURL(this.files[0]);
		  }
		});

		DOM.txtRegion.change(function(e){
			self.cambiarRegion(this.value);
		});

		DOM.txtProvincia.change(function(e){
			self.cambiarProvincia(DOM.txtRegion.val(),this.value);
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			self.guardarDatosPersonales();
		});
	},
	render: function(_data){
		var DOM = this.DOM;
		this.llenarComboUbigeo('R',_data.regiones);
		this.llenarCombo("Seleccionar", DOM.txtCargo, _data.cargo);
		this.llenarCombo("Seleccionar", DOM.txtTipoEmpresa, _data.tipo_empresa);
		this.llenarCombo("Seleccionar", DOM.txtSectorIndustrial, _data.sector_industrial);

		this.getDataPersonal();
	},
	fill: function(_data){
		var DOM = this.DOM,
			dataPersonal = _data.empresario;
			dataUbigeo = _data.ubigeo;

			dataPersonal.apellidos =  data.usuario.apellidos;
			dataPersonal.nombres =  data.usuario.nombres;
			dataPersonal.img =  data.usuario.url;

			DOM.txtApellidos.val(dataPersonal.apellidos);
			DOM.txtNombres.val(dataPersonal.nombres);
			DOM.imgPerfil[0].src = globalVars.URL+'/images/'+dataPersonal.img;			
			DOM.txtDomicilio.val(dataPersonal.domicilio);

			DOM.txtCargo.val(dataPersonal.cargo);
			DOM.txtRazonSocial.text(dataPersonal.razon_social);
			DOM.txtDescripcion.text(dataPersonal.descripcion_empresa);
			/* DOM.txtNombreEmpresa.val(dataPersonal.nombre_empresa);*/
			DOM.txtRegion.val(dataPersonal.cod_ubigeo_region);
			this.llenarComboUbigeo('P',dataUbigeo.provincias);
			DOM.txtProvincia.val(dataPersonal.cod_ubigeo_provincia);
			this.llenarComboUbigeo('D',dataUbigeo.distritos);
			DOM.txtDistrito.val(dataPersonal.cod_ubigeo_distrito);
			
			DOM.txtCelular.val(dataPersonal.celular);
			DOM.txtTipoEmpresa.val(dataPersonal.cod_tipo_empresa);
			DOM.txtSectorIndustrial.val(dataPersonal.cod_sector_industrial);

		},
	getDataPersonal: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "Empresario",
				metodo: "cargarDatosEmpresario"
			}, function(r){
				console.log(r);
				if (r.estado === 200){
					self.fill(r.datos.data);
				}
		});
	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "Empresario",
				metodo: "cargarDataFormulario"
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
	llenarCombo : function(rotulo, $combo, _data){
		var tmp, html = "<option value=''>"+rotulo+"</option>";
		for (var i = 0; i < _data.length; i++) {
			tmp = _data[i];
			html += '<option value="'+tmp.codigo+'">'+tmp.nombre+'</option>';
		};
		$combo.html(html);
	},
	llenarComboUbigeo :function(tipo, _data){
		var rotulo, $combo;
		switch(tipo){
			case 'R':
			$combo = this.DOM.txtRegion;
			rotulo = "Región";
			break;
			case 'P':
			$combo = this.DOM.txtProvincia;
			rotulo = "Provincia";
			break;
			case 'D':
			$combo = this.DOM.txtDistrito;
			rotulo = 'Distrito';
			break;
		}

		this.llenarCombo(rotulo, $combo, _data);
	},
	cambiarRegion: function(codigoRegion){
		var self = this,
			fn = function(r){
				if (r.estado === 200){
					self.llenarComboUbigeo('P',r.datos.data);
				}
			};

		if (codigoRegion == ""){
			this.llenarComboUbigeo('P',[]);
		} else {
			var self = this;
			new Ajxur.Api({
					modelo: "Ubigeo",
					metodo: "cargarProvincias",
					data_in : {p_codUbigeoRegion : codigoRegion}
				}, fn);
		}	
		this.llenarComboUbigeo("D",[]);
	},
	cambiarProvincia: function(codigoRegion,codigoProvincia){
		var self = this,
			fn = function(r){
				if (r.estado === 200){
					self.llenarComboUbigeo('D',r.datos.data);
				}
			};

		if (codigoProvincia == ""){
			this.llenarComboUbigeo('D',[]);
		} else {
			var self = this;
			new Ajxur.Api({
					modelo: "Ubigeo",
					metodo: "cargarDistritos",
					data_in : {p_codUbigeoRegion : codigoRegion, p_codUbigeoProvincia : codigoProvincia}
				}, fn);
		}	
	},
	guardarDatosPersonales : function(){
		var self = this, 
			DOM = self.DOM,
			datos_frm = new FormData(),
			region = DOM.txtRegion.val(),
			provincia = DOM.txtProvincia.val(),
			distrito = DOM.txtDistrito.val();

		if (region != ""){
			if (provincia != ""){
				if (distrito == ""){
					app.notificar("Debe ingresar Distrito.");	
					return;
				}
			} else {
				app.notificar("Debe ingresar Provincia.");	
				return;
			}
		}

        datos_frm.append("p_array_datos", JSON.stringify(app.formToData(DOM.form)));
        datos_frm.append("p_img_perfil",DOM.txtPerfil[0].files[0]);

        DOM.btnGuardar[0].disabled = true;
       	$$.ajax({
            url: globalVars.URL+"/controlador/empresario.datos.empresa.guardar.php",
            cache: false,
            contentType: false,
            processData: false,
            data: datos_frm,
            type: 'post',
            success: function (r) {
				var datos;
                r = JSON.parse(r); 
                if (r.estado === 200) {
                	datos = r.datos;
					if (datos.rpt == true){
                		DOM.btnGuardar[0].disabled = false;
                		data.usuario = datos.data_usuario;
                		actualizarPerfil();
					} else {
                		setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3500);
					}
					app.notificar(datos.msj);
                }
            },
            error: function (error) {
                console.error(error.responseText);
                DOM.btnGuardar[0].disabled = false;
            }
        });
	}
};pages["estudiante-datos-personales"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.render();
		this.getData();
	},
	reinit: function(){
		if (data.usuario){
			this.getData();
		} else {
			app.alert("¡No existe token de usuario válido!")
			pages.login.abrirLogin();
		}
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
		 	preDOM = $contenedor.find("form,#imgPerfil,#btnEditarPerfil,#txtPerfil,#txtApellidosDatos_es,#txtNombresDatos_es,"+
									"#txtfechanacimiento,#txtDomicilio,#txtRegion,#txtProvincia,#txtDistrito,#txtCelular,#txtGenero,#txtcarrerauniversitaria,#btnGuardarDatos_es"),
			DOM = {
				form: preDOM.eq(0),
				imgPerfil : preDOM.eq(1),
				btnEditarPerfil : preDOM.eq(2),
				txtPerfil : preDOM.eq(3),
				txtApellidos : preDOM.eq(4),
				txtNombres : preDOM.eq(5),
				txtFechaNacimiento : preDOM.eq(6),
				txtDomicilio : preDOM.eq(7),
				txtRegion : preDOM.eq(8),
				txtProvincia : preDOM.eq(9),
				txtDistrito : preDOM.eq(10),
				txtCelular: preDOM.eq(11),
				txtGenero : preDOM.eq(12),
				txtCarrera: preDOM.eq(13),
				btnGuardar : preDOM.eq(14)
			};
		this.DOM = DOM;
	},
	render: function(){

		var self = this,
			Templates = Template7.templates,
			DOM = self.DOM;
			/*
			Calendario = app.calendar({
			toolbarCloseText: 'LISTO',
			    input: '#txtfechanacimiento',
			    dateFormat: 'dd/mm/yyyy',
			    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
			    monthNames : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto' , 'Setiembre' , 'Octubre', 'Noviembre', 'Diciembre'],
   				maxDate: new Date().setDate(hoy.getYear() - 16)
			});
		*/

		DOM.btnEditarPerfil.on("click", function(){
			DOM.txtPerfil.click();
		});

		DOM.imgPerfil.on("dblclick", function(e){
			DOM.imgPerfil.attr('src','img/perfil-def.jpg');
			DOM.txtPerfil.value = "";
		});

		DOM.txtPerfil.change(function(e){
		  var $this = $$(this);
	      var id = this.id;

		  if (this.files && this.files[0]) {        
		    var num = id.substr(id.length - 1);
		    var reader = new FileReader();
		       reader.onload = function(e){
		       	DOM.imgPerfil.attr('src', e.target.result)
		    };
		    reader.readAsDataURL(this.files[0]);
		  }
		});

		DOM.txtRegion.change(function(e){
			self.cambiarRegion(this.value);
		});

		DOM.txtProvincia.change(function(e){
			self.cambiarProvincia(DOM.txtRegion.val(),this.value);
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			self.guardarDatosPersonales();
		});
	
	},
	fill: function(_data){
		var DOM = this.DOM,
			dataPersonal = _data.estudiante,
			dataCarreras = _data.carreras,
			dataUbigeo = _data.ubigeo;

			dataPersonal.apellidos =  data.usuario.apellidos;
			dataPersonal.nombres =  data.usuario.nombres;
			dataPersonal.img =  data.usuario.url;

			/*Para evitar errores.*/

			DOM.txtApellidos.val(dataPersonal.apellidos);
			DOM.txtNombres.val(dataPersonal.nombres);
			DOM.imgPerfil[0].src =  globalVars.URL+'/images/'+dataPersonal.img;

			if (dataPersonal.fecha_nacimiento != null){
				//this.Calendario.setValue([dataPersonal.fecha_nacimiento]);
				DOM.txtFechaNacimiento.val(dataPersonal.fecha_nacimiento);
			}
			DOM.txtDomicilio.val(dataPersonal.domicilio);
			
			this.llenarComboUbigeo('R',dataUbigeo.regiones);
			DOM.txtRegion.val(dataPersonal.cod_ubigeo_region);
			this.llenarComboUbigeo('P',dataUbigeo.provincias);
			DOM.txtProvincia.val(dataPersonal.cod_ubigeo_provincia);
			this.llenarComboUbigeo('D',dataUbigeo.distritos);
			DOM.txtDistrito.val(dataPersonal.cod_ubigeo_distrito);

			this.llenarCombo(DOM.txtCarrera, "Carrera Universitaria", dataCarreras);
			DOM.txtCarrera.val(dataPersonal.cod_carrera_uni);

			if (_data.carrera_editable == "true"){
				console.log("editable");
				DOM.txtCarrera.removeAttr("disabled");
			} else {
				DOM.txtCarrera.attr("disabled",true);
			}
			/*Si tiene algo postulado, bloquear este select. Además no se envía en el SUBMIT*/
			
			DOM.txtCelular.val(dataPersonal.celular);
			DOM.txtGenero.val(dataPersonal.genero);

		},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "Estudiante",
				metodo: "cargarDatosPersonales"
			}, function(r){
				if (r.estado === 200){
					self.fill(r.datos.data);
				}
		});
	},
	llenarCombo : function($combo, rotulo, data){
		var html = "<option value=''>"+rotulo+"</option>";
		for (var i = 0; i < data.length; i++) {
			tmp = data[i];
			html += '<option value="'+tmp.codigo+'">'+tmp.nombre+'</option>';
		};
		$combo.html(html);
	},
	llenarComboUbigeo :function(tipo, data){
		var rotulo, tmp, DOM = this.DOM;
		switch(tipo){
			case 'R':
			$combo = DOM.txtRegion;
			rotulo = "Región";
			break;
			case 'P':
			$combo = DOM.txtProvincia;
			rotulo = "Provincia";
			break;
			case 'D':
			$combo = DOM.txtDistrito;
			rotulo = 'Distrito';
			break;
		}

		this.llenarCombo($combo, rotulo, data);
	},
	cambiarRegion: function(codigoRegion){
		var self = this,
			fn = function(r){
				if (r.estado === 200){
					self.llenarComboUbigeo('P',r.datos.data);
				}
			};

		if (codigoRegion == ""){
			this.llenarComboUbigeo('P',[]);
		} else {
			var self = this;
			new Ajxur.Api({
					modelo: "Ubigeo",
					metodo: "cargarProvincias",
					data_in : {p_codUbigeoRegion : codigoRegion}
				}, fn);
		}	
		this.llenarComboUbigeo("D",[]);
	},
	cambiarProvincia: function(codigoRegion,codigoProvincia){
		var self = this,
			fn = function(r){
				if (r.estado === 200){
					self.llenarComboUbigeo('D',r.datos.data);
				}
			};

		if (codigoProvincia == ""){
			this.llenarComboUbigeo('D',[]);
		} else {
			var self = this;
			new Ajxur.Api({
					modelo: "Ubigeo",
					metodo: "cargarDistritos",
					data_in : {p_codUbigeoRegion : codigoRegion, p_codUbigeoProvincia : codigoProvincia}
				}, fn);
		}	
	},
	guardarDatosPersonales : function(){
		var self = this, 
			DOM = self.DOM,
			datos_frm = new FormData(),
			region = DOM.txtRegion.val(),
			provincia = DOM.txtProvincia.val(),
			distrito = DOM.txtDistrito.val();

		if (region != ""){
			if (provincia != ""){
				if (distrito == ""){
					app.notificar("Debe ingresar Distrito.");	
					return;
				}
			} else {
				app.notificar("Debe ingresar Provincia.");	
				return;
			}
		}

        datos_frm.append("p_array_datos", JSON.stringify(app.formToData(DOM.form)));
        datos_frm.append("p_img_perfil",DOM.txtPerfil[0].files[0]);

        DOM.btnGuardar[0].disabled = true;
       	$$.ajax({
            url: globalVars.URL+"/controlador/estudiante.datos.personales.guardar.php",
            cache: false,
            contentType: false,
            processData: false,
            data: datos_frm,
            type: 'post',
            success: function (r) {
				var datos;
                r = JSON.parse(r); 
                if (r.estado === 200) {
                	datos = r.datos;
                	if (datos.rpt == true){
                		DOM.btnGuardar[0].disabled = false;
                		data.usuario = datos.data_usuario;
                		actualizarPerfil();
					} else {
                		setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3500);
					}
                	app.notificar(datos.msj);          
                }
            },
            error: function (error) {
                console.error(error.responseText);
                DOM.btnGuardar[0].disabled = false;
            }
        });
	}
};pages["estudiante-convocatoria-formulario"] = {
	init : function(data){
		this.setDOM(data.contenedor);			
		this.setEventos();
		this.reinit(data);

		this.arrImg = {};


		try{

			var dl = new download();		 
			dl.Initialize({
			    //fileSystem : cordova.file.dataDirectory,
			    fileSystem : cordova.file.externalRootDirectory,
			    folder: "appracticar",
			    unzip: true,
			    remove: true,
			    timeout: 0,
			    success: DownloaderSuccess,
			    error: DownloaderError
			    /*,
			    headers: [
			        {
			            Key: 'Authorization',
			            Value: 'Basic ' + btoa(token)
			        }
			    ]*/
			});

			function DownloaderError(err) {
			    console.log("download error: " + err);
			    alert("download error: " + err);
			}
			 
			function DownloaderSuccess() {
			    console.log("yay!");
			}

			this.DL = dl;
			
		} catch (e){
			this.DL = null;
		}
	},
	reinit: function(data){
		this.cv = data.params.cv;
		this.numPreguntas
		this.getData();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
		 	preDOM = $contenedor.find("form,#blkFormularioFC, #btnGuardarFC"),
			DOM = {
				form : preDOM.eq(0),
				blkFormulario : preDOM.eq(1),
				btnGuardar : preDOM.eq(2)
			};
		this.DOM = DOM;
		this.t7Preguntas = Template7.templates.preguntasConvocatoriaFormularioT7;
	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM,
			esAndroid = window.device && window.device.platform == "Android";

		/*Obtener el dater*/
		DOM.form.on("submit", function(e){
			e.preventDefault();
			app.confirm('¿Desea enviar formulario convocatoria?', function () {
				self.guardarConvocatoria();
		    });
		});

		var recibirArchivo = function($this, nombre_archivo, archivo){
			var $parent = $this.parent(),
				$aArchivo = $parent.find(".titulo-archivo")
				$aQuitar = $parent.find(".quitar");

			$aArchivo.html(nombre_archivo);
			$aArchivo.removeClass("hide");
			$aQuitar.removeClass("hide");

			self.arrImg[$this.attr("id")] = {
				name: nombre_archivo,						  		
				File : archivo
			};

		};

		DOM.blkFormulario.on("change",".file-escondido", function(e){
			/*Son botones que en teoría debería abrir un filechooser.*/
			var $this = $$(this),
					archivo =  $this[0].files[0];	
			recibirArchivo($this, archivo.name, archivo);
		});

		DOM.blkFormulario.on("click","._archivos", function(e){
			/*Abrir inputter-filer*/
			var $this = $$(this), $ipt = $this.parent().find(".file-escondido");

			if (esAndroid){
				fileChooser.open(function(fileUri) {
					window.resolveLocalFileSystemURL(fileUri, function(fileEntry) {
						 fileEntry.file(function(file) {
						 		var reader = new FileReader();
				                reader.onloadend = function() {
				                    // Create a blob based on the FileReader "result", which we asked to be retrieved as an ArrayBuffer
				                    //console.log(blob);
				                    var archivo = new Blob([new Uint8Array(this.result)], {type: file.type});
				                  //  var archivo = new File(blob, fileEntry.name, { type: file.type });
				                    recibirArchivo($ipt, fileEntry.name, archivo);
				                };
				                // Read the file as an ArrayBuffer
				                reader.readAsArrayBuffer(file);
								/*
				               var reader = new FileReader();
				               reader.onloadend = function(e) {
				                   var content = this.result;
				                   var archivo = new Blob([content], {type: file.type});
								   recibirArchivo($ipt, fileEntry.name, archivo);
				               };
				               reader.readAsDataURL(file); // Finally !file = new Blob(['file contents'], {type: 'plain/text'});
				               */
							});
					});
				});
			} else {
				$ipt.click();
			}
		});

		DOM.blkFormulario.on("click",".archivos.quitar", function(e){
			var $this = $$(this),
				$parent = $this.parent(),
				$aArchivo = $parent.find(".titulo-archivo")
				$aQuitar = $parent.find(".quitar"),
				$input = $parent.find(".file-escondido"),
				idInput  = $input.attr("id"),
				htmlInput = "<input type='file' class='file-escondido' id='"+idInput+"'/>";


			if (esAndroid){
				self.arrImg[idInput] = null;
				delete self.arrImg[idInput];
			} else {
				$input.remove();
				$parent.append(htmlInput);		
			}		

			$aQuitar.addClass("hide");
			$aArchivo.addClass("hide");
			//$input.type = ''; $input.type='file';
			//$this.addClass("hide");
		});

		DOM.blkFormulario.on("click",".descargar-archivo", function(e){
			var $this = this,
				_url =  globalVars.URL+"/images/files/"+$this.dataset.url;

			console.log(_url);

			if (self.DL){
				/*Si existe downloader, usarlo SINO, usar el metodo web*/
				self.DL.Get(_url);
			} else {
				window.open(_url,"_blank");
			}
		});

	},
	render : function(_dataRender){

		 var DOM = this.DOM,
		 	blkFormulario = DOM.blkFormulario,
		 	frmPreguntas = _dataRender.formulario_preguntas;

		 blkFormulario.html(this.t7Preguntas(frmPreguntas));
		 this.nP = _dataRender.num_preguntas;

		 if (_dataRender.respuestas != null){
		 	app.formFromData(DOM.form, _dataRender.respuestas);
		 	DOM.btnGuardar.addClass("hide");
		 	blkFormulario.find(".label-radio").attr("disabled","");
		 	blkFormulario.find(".blk-archivos").addClass("hide");

		 } else {
		 	DOM.btnGuardar.removeClass("hide");
		 	blkFormulario.find(".label-radio").removeAttr("disabled");
		 	blkFormulario.find("input[type=number]").removeAttr("disabled");
		 	blkFormulario.find(".blk-archivos").removeClass("hide");
		 }
		 //app.initPageMaterialInputs(blkFormulario);
	},
	getData: function(){
		var self = this;
		if (!self.cv || self.cv <= 0){
			loadPage("estudiante-buscar-aviso");
			return;
		}
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "obtenerFormularioEstudiante",
				data_in : {p_codAvisoLaboral : self.cv}
			}, function(r){
				var datos = r.datos;
				if (r.estado === 200){
					if (datos.rpt){
						self.render(datos.r);
					}
				}
		});
	},
	guardarConvocatoria: function(){
		var self = this,
			DOM = self.DOM,
			dataForm = app.formToData(DOM.form),
			np = self.nP,
			esAndroid = window.device && window.device.platform == "Android";

		if ( Object.keys(dataForm).length < np){
			app.alert("Debe contestar todas las preguntas del formulario.");
			return;
		}


		var datos_frm = new FormData(),
			_archivos = $$(".file-escondido");

		if (esAndroid){
			//console.log(self.arrImg);
			$$.each(self.arrImg, function(i,o){
				datos_frm.append("p_"+i, o.File, o.name);
			});
		} else {
			$$.each(_archivos, function(i,o){
				var _id = o.id,
					_cadena = _id.substr(5);
				console.log(i,o);
				datos_frm.append("p_file_"+_cadena, o.files[0]);
			});
		}

		datos_frm.append("p_app", !esAndroid);
		datos_frm.append("p_cod_aviso_laboral", self.cv);
        datos_frm.append("p_array_datos", JSON.stringify(dataForm));

		DOM.btnGuardar[0].disabled = true;
		Ajxur.Loader.mostrar();
		$$.ajax({
            url: globalVars.URL+"/controlador/estudiante.formulario.guardar.php",
            cache: false,
            contentType: false,
            processData: false,
            data: datos_frm,
            type: 'post',
            success: function (xhr) {
                Ajxur.Loader.quitar();                
                var r = JSON.parse(xhr);
				var datos = r.datos;
				console.log("ok", xhr, r); 	

				if (r.estado === 200){
					app.notificar(datos.msj);
					if (datos.rpt){
						DOM.blkFormulario.empty();
						self.arrImg = {};
						mainView.history.pop();
						loadPage("estudiante-mis-postulaciones");
					} else {
						app.alert(datos.msj);
					}
				}

			    DOM.btnGuardar[0].disabled = false;					
            },
            error: function (e) {
            	Ajxur.Loader.quitar();           
            	console.log("error"); 	
                try {
			    var DE= JSON.parse(e);
			    	app.alert(DE.mensaje);
				}
				catch(err) {
					app.alert(e.responseText)
					console.log("error",err);
				}
				setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3000);
            }
        });
	}
};var BloquePregunta = function BloquePregunta(dataInit){
	var _self = this,
		_keys = {
			"titulo_pregunta": ".__ti",
			"blk_preguntas": ".__blkp",
			"btn_pregunta": ".__b",
		};

	_self.t7Pregunta = Template7.templates.preguntaFormularioT7;

	function init(_dataInit){
		//_self.id = _dataInit.id;
		_self.DOM = _dataInit.DOM;	
		_self.pesos = _dataInit.pesos;	
		_self.Pregunta = Pregunta;
		_self.numPreguntasIndex = 0;
		_self.listaPreguntas = [];
		_self.nombre = _dataInit.nombre || "Pregunta";
		_self.rotulo  = _dataInit.rotulo || "Pregunta";

		var DOM = _dataInit.DOM.find(_keys.titulo_pregunta+","+_keys.blk_preguntas+","+_keys.btn_pregunta);

		//console.log(DOM);
		_self.id = _dataInit.DOM[0].dataset.id;
		_self.$ = {			
			tituloPregunta : DOM.eq(0),
			blkPreguntas : DOM.eq(1),	
			agregarPregunta : DOM.eq(2)
		};	

		initEvents();
		return _self;
	};


	function initEvents(){
		var __self = _self,
			$ = __self.$;

		$.agregarPregunta.on("click", function(e){
			e.preventDefault();
			__self.agregarPregunta()
		});
	}

	this.agregarPregunta = function(dataInit){
		/*Agregar una pregunta al final de la tabla*/
		var self = this,
			$ = self.$,
			lp = self.listaPreguntas,
			_id = ++self.numPreguntasIndex,
			_n = lp.length + 1,
			textoPregunta, esSalario, soloPersonalizada,
			numero_opciones, opciones, np, s;

		if (dataInit){
			textoPregunta = dataInit.textoPregunta || null;
			esSalario = dataInit.esSalario || false;
			soloPersonalizada = dataInit.soloPersonalizada || false;	
			rotulo = dataInit.rotulo || "Pregunta";
			numero_opciones = dataInit.numero_opciones;
			opciones = dataInit.opciones;
			np = dataInit.np || _n;
			s = dataInit.s;
		} else {
			textoPregunta = null;
			esSalario = soloPersonalizada = false;
			rotulo = self.rotulo;
			numero_opciones = 2;
			opciones = [{n:1, d: "", valor: "0"},
						{n:2, d: "", valor: "0"}];
			np = _n;
			s = "Descripción";
		} 


		var DOMPregunta = $$(self.t7Pregunta([{id:_id, n: _n, texto_pregunta : textoPregunta, rotulo: rotulo, 
												es_salario: esSalario, solo_personalizada: soloPersonalizada,
												opciones : opciones, numero_opciones: numero_opciones,
												np: np, s: s
												}]));
		$.blkPreguntas.append(DOMPregunta);
		app.initPageMaterialInputs(DOMPregunta);

		lp.push(new self.Pregunta({id: _id, n: _n, DOM: DOMPregunta, p: self, esSalario: esSalario, rotulo: rotulo,  numero_opciones: numero_opciones,
									soloPersonalizada:soloPersonalizada}));
	};

	this.reajustarPreguntas = function(){
		var lp =  this.listaPreguntas,
			lg = lp.length;

		for (var i = lg - 1; i >= 0; i--) {		
			lp[i].renderizeN(i + 1);
		};
	};

	this.eliminarTodasPreguntas = function(){
		var lp =  this.listaPreguntas,
			lg = lp.length;

		for (var i = lg - 1; i >= 0; i--) {		
			lp[i].destroy();
		};
	},


	this.getDataProcesada = function(){
		var __self = _self,
			$ = __self.$,
			_preguntas = [];


		for (var i = 0; i < _self.listaPreguntas.length; i++) {
			_preguntas.push(__self.listaPreguntas[i].getDataProcesada());		
		};	

		return {id: _self.id,  nombre : __self.nombre, rotulo: __self.rotulo, preguntas : _preguntas };
	}

	this.destroy = function(){
		this.eliminarTodasPreguntas();
		this.$ = null;
		this.DOM.remove();
		this.DOM = null;
		this.id = null;
		delete this;
		return;	
	};

	return init(dataInit);
};


var Pregunta = function Pregunta(dataInit){
	var _self = this,
		_keys = {
			"nombre_pregunta": ".__np",
			"tipo_pregunta": ".__tp",
			"numero_opciones": ".__no",
			"cancelar_pregunta": ".__cp",
			"blk_opciones": ".__blko",
			"label_pregunta" : ".__lblcp"
		},
		t7 = Template7.templates.opcionFormularioT7,
		NOAnterior;

	function init(_dataInit){
		_self.id = _dataInit.id;
		_self.n = _dataInit.n;
		_self.DOM = _dataInit.DOM;
		_self.Padre = _dataInit.p;
		_self.esSalario = _dataInit.esSalario || false;
		_self.rotulo = _dataInit.rotulo;
		_self.soloPersonalizada = _dataInit.soloPersonalizada || false;
		NOAnterior = dataInit.numero_opciones || 2;		

		console.log("PREGUNTA: ",dataInit.n, "NO ANTERIOR :" ,NOAnterior, "rotulo: ",dataInit.rotulo);

		var DOM = _dataInit.DOM.find(_keys.label_pregunta+","+_keys.cancelar_pregunta+","+_keys.nombre_pregunta+","+_keys.tipo_pregunta+","+ _keys.numero_opciones+","+_keys.blk_opciones);

		_self.$ = {			
			labelPregunta : DOM.eq(0),
			cancelarPregunta : DOM.eq(1),
			nombrePregunta : DOM.eq(2),
			tipoPregunta  : DOM.eq(3),
			numeroOpciones : DOM.eq(4),
			blkOpciones : DOM.eq(5)
		};	

		initEvents();
		return _self;

	};

	function initEvents(){
		var __self = _self,
			$ = __self.$;

		if (__self.soloPersonalizada == false){
			$.cancelarPregunta.on("click", function(e){
				e.preventDefault();
				app.confirm('¿Seguro que desea eliminar esta pregunta?', function () {
					__self.destroy();
			    });
			});

			/*0 : Personalizada, 1 Dicotómica (2), 2 Escala (3), 3 Likert.*/
			$.tipoPregunta.on("change", function(){
				var valorTp = this.value,
					_dataHijos = [{"n":1,"d":null},{"n":2,"d":null}],
					$nO = $.numeroOpciones;

				console.log("changu");

				switch(valorTp){
					case "0": 
					$nO.val("2");
					$nO.removeAttr("readonly");
					NOAnterior = 2;
					break;

					case "1":
					$nO.val("2");
					$nO.attr("readonly",true);
					_dataHijos = [{"n":"1","d": "SI",valor: "3"}, {"n":"2","d": "NO",valor: "0"}];
					break;

					case "2":
					$nO.val("3");
					$nO.attr("readonly",true);
					_dataHijos = [{"n":"1","d": "BAJO",valor: "1"}, {"n":"2","d": "MEDIO",valor: "5"},{"n":"3","d":"ALTO",valor: "7"}];
					break;

					case "3":
					$nO.val("5");
					$nO.attr("readonly",true);
					_dataHijos = [{"n":"1","d": "MUY BAJO", valor: "1"}, {"n":"2","d": "BAJO", valor: "3"},{"n":"3","d":"MEDIO", valor: "5"},{"n":"4","d":"ALTO", valor: "7"},{"n":"5","d":"MUY ALTO", valor: "9"}];
					break;
				}

				__self.crearOpciones(_dataHijos);
			});
		} else {
			$.cancelarPregunta.addClass("invisible");
		}

		$.numeroOpciones.on("change", function(e){						
			var _valor  = this.value,
				_esPersonalizada =  $.tipoPregunta.val() == "0",
				_diferencia;

			if (this.value <= 1){
				this.value = 2;
			}


			if (!_esPersonalizada){
				return;
			}

			if (_valor  == 2 && NOAnterior == 2){
				return;
			}

			console.log(_valor, NOAnterior);

			_diferencia = _valor - NOAnterior;

			if (_diferencia > 0){
				/*agregar al final un conjutn ode opciones. */
				__self.agregarOpciones(_diferencia);
			} else if (_diferencia < 0) {
				/*quitar N finales*/
				__self.quitarOpciones(_diferencia * -1);
			}

			NOAnterior = _valor;
		});
	};

	this.crearOpciones = function(_dataHijos){		
		_self.$.blkOpciones.html(t7({np: _self.id,opciones: _dataHijos, "s":(_self.esSalario ? "Monto <=" :"Descripción")}));
	};

	this.agregarOpciones = function(numeroOpciones){
		var _dataHijos = [],
			actualOpciones = _self.$.blkOpciones.find("div.opcion").length;
		for (var i = numeroOpciones - 1; i >= 0; i--) {
			_dataHijos.push({"n": (numeroOpciones - i + actualOpciones),"d":null});
		};

		_self.$.blkOpciones.append(t7({np: _self.id,opciones: _dataHijos, "s":(_self.esSalario ? "Monto <=" :"Descripción")}));
	};

	this.quitarOpciones = function(numeroOpciones){
		var $li = _self.$.blkOpciones.find("div.opcion"),
			lg = $li.length;
		for (var i = numeroOpciones; i > 0; i--) {
			$li.eq(lg  - i).remove();
		};
	};

	this.renderizeN = function(nuevoN){
		var $ = _self.$,
			cadena = "Pregunta "+nuevoN;
		$.labelPregunta.html(cadena);
		$.nombrePregunta.attr("placeholder",cadena);
	};

	this.getDataProcesada = function(){
		var $ = _self.$,
			_dataProcesada,
			_opciones = [];
		$$.each($.blkOpciones.find("div.opcion"), function(i,e){
			var inputs = $$(e).find("input");
			_opciones.push({"descripcion": inputs.eq(0).val(), "valor":  inputs.eq(1).val()});
		});

		_dataProcesada = {
			n: _self.n,
			nombre_pregunta : $.nombrePregunta.val(),
 			opciones : _opciones,
			es_salario: _self.esSalario 
		};

		/*n, nombre_pregunta, opciones ([descripciones, valor])*/
		return _dataProcesada;
	};

	this.destroy = function(){
		var p = _self.Padre,
			lp = p.listaPreguntas;
				for (var i = lp.length - 1; i >= 0; i--) {
					if (lp[i].id == _self.id){				
						lp.splice(i, 1);	
						_self.$ = null;
						_self.DOM.remove();			
						_self.DOM = null;
						_self.id = null;
						p.reajustarPreguntas();					
						_self = null;
						delete _self;
						return;
					}
				}
	};

	return init(dataInit);
};

pages["empresario-formulario-convocatoria"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.setVars();
		this.render();
	},
	reinit: function(){

	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("form,#blkPreguntasForm, #btnCancelarForm, #btnPreviaForm"),
			DOM = {
			form: preDOM.eq(0),				
			blkPreguntas : preDOM.eq(1),
			btnCancelar : preDOM.eq(2),
			btnPrevia: preDOM.eq(3)
		};

		this.DOM = DOM;
		this.t7Bloque = Template7.templates.bloquePreguntaFormularioT7;
	},
	setVars: function(){
		var self = this;
		self.listaBloques = [];
		
		self.numPreguntasIndex = 0;
		self.BloquePregunta = BloquePregunta;
		self.datosProcesados = null;
	},
	render: function(){

		var self = this,
			DOM = self.DOM,
			lB = self.listaBloques,
			categorias = [	{"codigo": 1, "nombre":"CONOCIMIENTOS", rotulo: "Conocimiento", "btn_pregunta": true},
							{"codigo": 2, "nombre":"HABILIDADES", rotulo: "Habilidad", "btn_pregunta": true},
							{"codigo": 3, "nombre":"DISPONIBILIDAD", rotulo: "Descripción disponibilidad"},
							{"codigo": 4, "nombre":"SALARIO", rotulo: "Descripción salario"}],
			pgAnterior = pages["empresario-gestionar-convocatoria"];

		//var DOMBloque = $$(self.t7Bloque([{codigo:_id, n: _n}]));
		//DOM.blkPreguntas.append(DOMBloque);
		DOM.blkPreguntas.html(self.t7Bloque(categorias));

		this._PESOS = pgAnterior._PESOS;

		$$.each(DOM.blkPreguntas.find("div._blk_"), function(i,o){
			var _BP = new self.BloquePregunta({DOM: $$(o), rotulo: categorias[i].rotulo, nombre: categorias[i].nombre});
			if (i == 2){
				_BP.agregarPregunta({textoPregunta: "Ingrese el tiempo del que disponga.", 
									rotulo: categorias[i].rotulo,
									soloPersonalizada : true,
									numero_opciones: 3,
									np: 1,
									s: "Descripción",
									opciones: [
										{n: 1, d: "POR HORAS", valor:"1"},
										{n: 2, d: "PART TIME", valor:"3"},
										{n: 3, d: "FULL TIME", valor:"5"}
										]});
			}else if (i == 3){
				_BP.agregarPregunta({textoPregunta: "Ingrese el salario que desee percibir.", 
									esSalario: true,
									rotulo: categorias[i].rotulo,
									pesos: null,
									soloPersonalizada : true,
									numero_opciones: 2,
									np: 1,
									s: "Monto <=",
									opciones: [
										{n:1, d: "", valor: "0"},
										{n:2, d: "", valor: "0"}]});
			}
			lB.push(_BP);
		});

		DOM.btnCancelar.on("click", function(e){
			e.preventDefault();
			app.confirm("¿Desea cancelar el registro?", function(){
				self.eliminarTodasPreguntas();
				pgAnterior._ = 0;
				history.back();
			});
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			/*Procesar datos, validarlos y asignarlos a la variable datosValidados*/
			if (!self.procesarDatos()){
				return;
			}
			pgAnterior._ = 2;			
			loadPage("empresario-formulario-previa");		
		});


	},
	agregarPregunta: function(){
		/*Agregar una pregunta al final de la tabla*/
		var self = this,
			DOM = self.DOM,
			lp = self.listaPreguntas,
			_id = ++self.numPreguntasIndex,
			_n = lp.length + 1;

		/*Al agregar una pregunta se agrega también hijos*/

		var DOMPregunta = $$(self.t7Pregunta([{id:_id, n: _n}]));
		DOM.blkPreguntas.append(DOMPregunta);
		//app.initPageMaterialInputs(DOMPregunta);

		lp.push(new self.Pregunta({id: _id, n: _n, DOM: DOMPregunta}));
	},
	eliminarTodasPreguntas: function(){
		var lB =  this.listaBloques,
			lg = lB.length;

		for (var i = lg - 1; i >= 0; i--) {		
			lB[i].destroy();
		};
	},
	procesarDatos: function(){
		/*validar y procesar datos
		- debe haber al menso 1 pregutna de habilidad y una d conocimiento*/
		var lB =  this.listaBloques,
			 lgConocimiento = lB[0].listaPreguntas.length,
			 lgHabilidad = lB[1].listaPreguntas.length,
			_dataProcesada = [];

		if (lgConocimiento <= 0){
			app.notificar("Debe registrar al menos un conocimiento requerido.");
			return false;
		}

		if (lgHabilidad <= 0){
			app.notificar("Debe registrar al menos una habilidad requerida.");
			return false;
		}

		var actualBloques = lB.length;
		for (var i = actualBloques; i > 0; i--) {
			_dataProcesada.push(lB[actualBloques - i].getDataProcesada());
		};

		this.datosProcesados = _dataProcesada;
		return true;
	}
};pages["empresario-formulario-previa"] = {
	init : function(data){
		this.setDOM(data.contenedor);			
		this.setEventos();
		this.render();
	},
	reinit: function(){
		this.render();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("#blkConvocatoriaVP, #btnGuardarVP"),
			DOM = {
				blkConvocatoria : preDOM.eq(0),
				btnGuardarVP : preDOM.eq(1)
			};
		this.DOM = DOM;
		this.t7Preguntas = Template7.templates.preguntaVistaPreviaT7;
	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM;
		/*Obtener el dater*/
		DOM.btnGuardarVP.on("click", function(e){
			e.preventDefault();
			app.confirm('¿Desea guardar convocatoria?', function () {
				self.guardarConvocatoria();
		    });
		});

	},
	render : function(){
		 var dataP1 = pages["empresario-gestionar-convocatoria"].procesarData(),
		  	dataP2 = pages["empresario-formulario-convocatoria"].datosProcesados,
		 	objRender = {
			 	nombre_empresa : data.usuario.empresa,
				titulo_convocatoria: dataP1.txttitulo,
				bloques : dataP2
			 };
		 /**/

		 console.log(objRender);
		 /*Cuidado.*/
		 this.DOM.blkConvocatoria.html(this.t7Preguntas(objRender));
		 app.initPageMaterialInputs(this.DOM.blkConvocatoria);

		 this.DP1 = dataP1;
		 this.DP2 = dataP2;
		/*Consulta P1 y P2 por ss respectivos FORM y datos*/
	},
	guardarConvocatoria: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "guardarAvisoLaboral",
				data_out : [JSON.stringify(self.DP1), JSON.stringify(self.DP2)]
			}, function(r){
				var datos = r.datos;
				if (r.estado === 200){
					app.alert(datos.msj);
					if (datos.rpt){
						pages["empresario-gestionar-convocatoria"].limpiarFormulario();
						pages["empresario-formulario-convocatoria"].eliminarTodasPreguntas();
						self.DOM.blkConvocatoria.empty();
						loadPage("empresario-mis-convocatorias");
					}
				}
		});

	}
};pages["empresario-convocatoria-formulario"] = {
	init : function(data){
		this.setDOM(data.contenedor);			
		this.reinit(data);
	},
	reinit: function(data){
		this.cv = data.params.cv;
		this.getData();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
		 	preDOM = $contenedor.find("#blkFormularioFC"),
			DOM = {
				blkFormulario : preDOM.eq(0)
			};
		this.DOM = DOM;
		this.t7Preguntas = Template7.templates.preguntasConvocatoriaFormularioT7;
	},
	setEventos: function(){

	},
	render : function(_dataRender){
		 var DOM = this.DOM,
		 	blkFormulario = DOM.blkFormulario,
		 	frmPreguntas = _dataRender.formulario_preguntas;

		 blkFormulario.html(this.t7Preguntas(frmPreguntas));
		 /*
		 if (_dataRender.respuestas != null){
		 	app.formFromData(DOM.form, _dataRender.respuestas);
		 }
		 */
		 app.initPageMaterialInputs(blkFormulario);
	},
	getData: function(){
		var self = this;
		if (!self.cv || self.cv <= 0){
			loadPage("empresario-mis-convocatorias");
			return;
		}
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "obtenerFormulario",
				data_in : {p_codAvisoLaboral : self.cv},
				data_out: [0] /*codEstudiante*/
			}, function(r){
				var datos = r.datos;
				if (r.estado === 200){
					if (datos.rpt){
						self.render(datos.r);
					}
				}
		});
	}
};pages["empresario-gestionar-convocatoria"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.render();
		this.getData();
		this.reinit(data);
		this.consultarPesos();
	},
	reinit: function(data){
		this.CV = data.cv;
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			cadenaDOM = "form, #txtcarreraconv, #txtFechaLanzamiento, #txtFechaVencimiento"+
						",#txtRegionConv, #txtProvinciaConv, #txtDistritoConv"+
						",#btnCancelarConv",
						//",#btnCancelarConv,#btnSiguienteConv1",
			preDOM = $contenedor.find(cadenaDOM),
			DOM = {
				form: preDOM.eq(0),
				txtCarrera : preDOM.eq(1),
				txtFechaLanzamiento : preDOM.eq(2),
				txtFechaVencimiento : preDOM.eq(3),
				txtRegion : preDOM.eq(4),
				txtProvincia : preDOM.eq(5),
				txtDistrito : preDOM.eq(6),
				btnCancelar : preDOM.eq(7)
				//,btnSiguiente : preDOM.eq(8)
			};

		this._PESOS = null;
		this.DOM = DOM;
	},
	render: function(_data){

		var self = this,
			Templates = Template7.templates,
			DOM = self.DOM,
			hoy = new Date(),
			mañana = new Date();
			mañana.setDate(hoy.getDate()+1);
			/*
			CalendarioLanzamiento = app.calendar({
				toolbarCloseText: 'LISTO',
			    input: '#txtfechalanzamiento',
			    dateFormat: 'dd/mm/yyyy',
			    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
			    monthNames : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto' , 'Setiembre' , 'Octubre', 'Noviembre', 'Diciembre'],
			    //disabled: {to: new Date() //Y,M,D - La fecha de lanzamiento mínima es el día de hoy}
   				//min: new Date().setDate(hoy.getYear() - 16)

   				minDate: new Date().setDate(hoy.getDate()-1)
			}),
			*/		
			/*
			CalendarioVencimiento = app.calendar({
				toolbarCloseText: 'LISTO',
			    input: '#txtfechavencimiento',
			    dateFormat: 'dd/mm/yyyy',
			    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
			    monthNames : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto' , 'Setiembre' , 'Octubre', 'Noviembre', 'Diciembre'],
			    //disabled: {to: new Date() //Y,M,D - La fecha de lanzamiento mínima es el día de hoy}
   				//min: new Date().setDate(hoy.getYear() - 16)
   				minDate: hoy
			});
			*/	

		//CalendarioLanzamiento.setValue([hoy]);
		//CalendarioVencimiento.setValue([mañana]);
		DOM.txtFechaLanzamiento.val(Util.obtenerFechaInput(hoy));
		DOM.txtFechaVencimiento.val(Util.obtenerFechaInput(mañana));

		DOM.btnCancelar.on("click", function(e){
			e.preventDefault();
			app.confirm("¿Desea cancelar el registro?", function(){
				self.limpiarFormulario();
			});
		});

		DOM.txtRegion.change(function(e){
			self.cambiarRegion(this.value);
		});

		DOM.txtProvincia.change(function(e){
			self.cambiarProvincia(DOM.txtRegion.val(),this.value);
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			self._ = 1;
			loadPage("empresario-formulario-convocatoria");
		});

		/*
		DOM.btnSiguiente.on("click", function(e){
			e.preventDefault();
			loadPage("empresario-formulario-convocatoria");
		});
		*/

	},
	renderDataExtra : function(_data){
		/*carreas y ubigeo*/
		var DOM = this.DOM,
			_carreras = _data.carreras,
			_regiones = _data.regiones;

			html = '<option value="">Seleccionar carrera</option>';
			for (var i = 0; i < _carreras.length; i++) {
				tmp = _carreras[i];
				html += '<option value="'+tmp.codigo+'">'+tmp.descripcion+'</option>';
			};

		DOM.txtCarrera.html(html);
		this.llenarComboUbigeo('R', _regiones);
	},
	fill: function(_data){
		var DOM = this.DOM,
			dataPersonal = _data.estudiante;
			dataUbigeo = _data.ubigeo;

			dataPersonal.apellidos =  data.usuario.apellidos;
			dataPersonal.nombres =  data.usuario.nombres;
			dataPersonal.img =  data.usuario.url;

			DOM.txtApellidos.val(dataPersonal.apellidos);
			DOM.txtNombres.val(dataPersonal.nombres);
			DOM.imgPerfil[0].src = globalVars.URL+'/images/'+dataPersonal.img;
			
			DOM.txtDomicilio.val(dataPersonal.domicilio);
			
			this.llenarComboUbigeo('R',dataUbigeo.regiones);
			DOM.txtRegion.val(dataPersonal.cod_ubigeo_region);
			this.llenarComboUbigeo('P',dataUbigeo.provincias);
			DOM.txtProvincia.val(dataPersonal.cod_ubigeo_provincia);
			this.llenarComboUbigeo('D',dataUbigeo.distritos);
			DOM.txtDistrito.val(dataPersonal.cod_ubigeo_distrito);
			
			DOM.txtCelular.val(dataPersonal.celular);
			DOM.txtGenero.val(dataPersonal.genero);
	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "cargarDatosFormularioInicial"
			}, function(r){
				if (r.estado === 200){
					self.renderDataExtra(r.datos.data);
				}
		});
	},
	llenarComboUbigeo :function(tipo, data){
		var rotulo, html, tmp, DOM = this.DOM;
		switch(tipo){
			case 'R':
			$combo = DOM.txtRegion;
			rotulo = "Región";
			break;
			case 'P':
			$combo = DOM.txtProvincia;
			rotulo = "Provincia";
			break;
			case 'D':
			$combo = DOM.txtDistrito;
			rotulo = 'Distrito';
			break;
		}

		html = "<option value=''>"+rotulo+"</option>";
		for (var i = 0; i < data.length; i++) {
			tmp = data[i];
			html += '<option value="'+tmp.codigo+'">'+tmp.nombre+'</option>';
		};
		$combo.html(html);
	},
	cambiarRegion: function(codigoRegion){
		var self = this,
			fn = function(r){
				if (r.estado === 200){
					self.llenarComboUbigeo('P',r.datos.data);
				}
			};

		if (codigoRegion == ""){
			this.llenarComboUbigeo('P',[]);
		} else {
			var self = this;
			new Ajxur.Api({
					modelo: "Ubigeo",
					metodo: "cargarProvincias",
					data_in : {p_codUbigeoRegion : codigoRegion}
				}, fn);
		}	
		this.llenarComboUbigeo("D",[]);
	},
	cambiarProvincia: function(codigoRegion,codigoProvincia){
		var self = this,
			fn = function(r){
				if (r.estado === 200){
					self.llenarComboUbigeo('D',r.datos.data);
				}
			};

		if (codigoProvincia == ""){
			this.llenarComboUbigeo('D',[]);
		} else {
			var self = this;
			new Ajxur.Api({
					modelo: "Ubigeo",
					metodo: "cargarDistritos",
					data_in : {p_codUbigeoRegion : codigoRegion, p_codUbigeoProvincia : codigoProvincia}
				}, fn);
		}	
	},
	limpiarFormulario: function(){
		var hoy = new Date(),
		mañana = new Date().setDate(hoy.getDate()+1);

		this._ = 0;
		this.DOM.form[0].reset();

		//this.CalendarioLanzamiento.setValue([hoy]);
		//this.CalendarioVencimiento.setValue([mañana]);
		this.llenarComboUbigeo('P',[]);	
		this.llenarComboUbigeo('D',[]);
	},
	procesarData: function(){
		return app.formToData(this.DOM.form);
	},
	consultarPesos: function(){
		var self = this;
			new Ajxur.Api({
					modelo: "AvisoLaboral",
					metodo: "obtenerPesosFormularioLaboral"					
				},  function(r){
						var datos = r.datos;
						self._PESOS = datos.r;						
				});
	}
};pages["estudiante-gestionar-perfil"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		//this.render();
		//this.getDataFull();
		//this.fill();
	},
	reinit: function(){
		this.getDataParcial();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			DOM = {
			_contenedor : $contenedor,
			form : $contenedor.find("form"),
			txtIdioma: $contenedor.find("#txtIdioma"),
			blkIdiomas: $contenedor.find("#blkIdiomas"),
			blkEstudios: $contenedor.find("#blkEstudios"),
			blkConocimientos : $contenedor.find("#blkConocimientos"),
			blkIntereses : $contenedor.find("#blkIntereses"),
			txtIntereses : $contenedor.find("#txtIntereses"),
			blkHabilidades : $contenedor.find("#blkHabilidades"),
			txtHabilidades : $contenedor.find("#txtHabilidades"),
			btnGuardar : $contenedor.find("#btnGuardarPerfil")
		};
		this.DOM = DOM;

		Template7.registerPartial('itemInput', 
								' <div class="item-content">'+
                              		'<div class="item-inner">'+
                                		'<div class="item-title label">{{subtitulo}}</div>'+
                                		'<div class="item-input {{#with type}}item-input-field{{/with}}">'+
											'{{#js_if "this.type"}}'+
			                                  '<input type="{{type}}" name="{{id}}"  id="{{id}}" placeholder="{{subtitulo}}">'+
			                                '{{else}}'+
			                                  '<select name="{{id}}" id="{{id}}">'+
			                                  	'<option value="">Seleccionar</option>'+
			                                    '{{#each items}}'+
			                                      '<option value="{{codigo}}">{{descripcion}}</option>'+
			                                    '{{/each}}'+
			                                  '</select>'+
			                                '{{/js_if}} '+
			                            '</div>'+
			                            '</div>'+
			                       '</div>'+
			                     '</div>'
                           );
	},
	render: function(_data){
		var Templates = Template7.templates,
			DOM = this.DOM,
			dataInterfaz = _data.interfaz;

		var estudiosData = [		
			{item : 2,
			items : [
				{
				subtitulo: "Región",
				id : "txtregionperfil",
				items : dataInterfaz.regiones
				},
				{
				subtitulo: "Universidad",
				id : "txtuniversidad",
				items :  []
				}],
			},
			{item : 1,
			subtitulo: "Nivel Universitario",
			id : "txtniveluniversitario",
			items : dataInterfaz.niveles_universitario
			},
			{item : 1,
			subtitulo: "Carrera Universitaria",
			id : "txtcarrera",
			items : dataInterfaz.carreras
			}
		];

		dataInterfaz.idiomas.unshift({"codigo":"","descripcion":"Agregar Idioma"});
		DOM.txtIdioma.html(Templates.optionsGlobalT7(dataInterfaz.idiomas));
		DOM.blkEstudios.html(Templates.estudiosGestionarPerfilT7(estudiosData));

		var conocimientosData = [
			{item : 2,
			items : [
				{
				subtitulo: "Nivel Office",
				id : "txtniveloffice",
				items :  dataInterfaz.niveles
				},
				{
				subtitulo: "Nivel Internet",
				id : "txtnivelinternet",
				items :  dataInterfaz.niveles
				}],
			},
			{item : 2,
			items : [
				{
				subtitulo: "Disponibilidad",
				id : "txtdisponibilidad",
				items : dataInterfaz.disponibilidad
				},
				{
				subtitulo: "Salario",
				id : "txtsalario",
				type:"number",
				items :  []
				}],
			}/*,
			{item : 1,
			subtitulo: "Áreas de Interés",
			id : "txtintereses",
			items : dataInterfaz.intereses
			}*/
		];

		dataInterfaz.habilidades.unshift({"codigo":"","descripcion":"Agregar habilidad"});
		dataInterfaz.intereses.unshift({"codigo":"","descripcion":"Agregar interés"});

		var habilidadesData = {
			intereses : dataInterfaz.intereses,
			habilidades : dataInterfaz.habilidades,
		};

		DOM.blkConocimientos.html(Templates.estudiosGestionarPerfilT7(conocimientosData));
		DOM.txtIntereses.html(Templates.optionsGlobalT7(habilidadesData.intereses));
		DOM.txtHabilidades.html(Templates.optionsGlobalT7(habilidadesData.habilidades));

		this.setPostDOM();
		this.setEventos();

		this.fill(_data.perfil_estudiante);
	},
	setPostDOM: function(){
		var DOM = this.DOM;
		//$contenedor = $$(contenedor);
		DOM.nivelUniversitario = $contenedor.find("#txtniveluniversitario");
		//DOM.niveIidioma = $contenedor.find("#txtnivelidioma");
		//DOM.idioma = $contenedor.find("#txtidioma");
		DOM.region = $contenedor.find("#txtregionperfil");
		DOM.universidad = $contenedor.find("#txtuniversidad");
		DOM.carrera = $contenedor.find("#txtcarrera");

		DOM.office = $contenedor.find("#txtniveloffice");
		DOM.internet = $contenedor.find("#txtnivelinternet");
		DOM.disponibilidad = $contenedor.find("#txtdisponibilidad");
		DOM.salario = $contenedor.find("#txtsalario");
		DOM.interes = $contenedor.find("#txtintereses");

		this.DOM = DOM;
	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM,
			Templates = Template7.templates,
			fnComboChange = function(tipo){
				var txt, blk;
				switch (tipo){
					case "intereses":
						txt = DOM.txtIntereses;
						blk = DOM.blkIntereses;
					break;
					case "habilidades":
						txt = DOM.txtHabilidades;
						blk = DOM.blkHabilidades;
				}

				var val = txt.val();
				if (val == ""){
					return;
				}

				/*Detectar si ya está cargada.*/
				var auxCargada = false;

				$$.each(blk.find(".chip .chip-delete"),function(i,o){
					if (o.dataset.codigo == val){
						auxCargada = true;
						return false;
					}
				});

				if (!auxCargada){
					/*Si no está cargada, cárgala*/
					blk.append(Templates.habilidadesGestionarPerfilT7([{codigo: val, descripcion: txt.find("option:checked").html()}]));
				} else {
					app.notificar("Habilidad ya agregada.",2000);
				}
			},
			fnChipDelete = function(tipo, dis){
				var $this = $$(dis); $this.parent().remove();
				DOM[tipo == "intereses" ? "txtIntereses" : "txtHabilidades"].val("");
			};

		DOM.txtIntereses.change(function(e){
			fnComboChange("intereses");
		});

		DOM.blkIntereses.on("click", ".chip .chip-delete", function(e){
			fnChipDelete("intereses", this);
		});

		DOM.txtHabilidades.change(function(e){
			fnComboChange("habilidades");
		});

		DOM.blkHabilidades.on("click", ".chip .chip-delete", function(e){
			fnChipDelete("habilidades", this);
		});

		DOM.region.on("change", function(e){
			if (this.value == ""){
				DOM.universidad.html(Templates.optionsGlobalT7([]));
				return;
			}
			self.getUniversidades(this.value);
			/*Cargar universidades de esa región.*/
		});


		DOM.txtIdioma.on("change", function(e){
			/*Verificar que ya existe, sino agregar con value = 2.*/
			var val = this.value;
			if (val == ""){
				return;
			}

			/*Detectar si ya está cargada.*/
			var auxCargada = false;

				$$.each(DOM.blkIdiomas.find("select"),function(i,o){
					if (o.dataset.codigo == val){
						auxCargada = true;
						return false;
					}
				});

				if (!auxCargada){
					/*Si no está cargada, cárgala*/
					DOM.blkIdiomas.append(Templates.idiomasGestionarPerfilT7([{codigo: val, descripcion: DOM.txtIdioma.find("option:checked").html(), nivel : 2}]));
				} else {
					this.value = "";
					app.notificar("Idioma ya agregado.",2000);
				}

		});

		DOM.blkIdiomas.on("change","select", function(e){
			var val = this.value, $this, numIdiomasActual;
			if (val == ""){
				/*Quitar*/
				$this = $$(this); 
				$this.parent().parent().remove();
				DOM.txtIdioma.val("");

				numIdiomasActual = DOM.blkIdiomas.find("select").length;
				if (numIdiomasActual <= 0){
					DOM.blkIdiomas.html(Templates.idiomasGestionarPerfilT7());
				}

			}
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			app.confirm("¿Desea guardar nuevo perfil?", 
					function(e){
						self.guardarPerfil();
					});
		});
	},
	fill : function(datosPerfil){
		/* nive uni: 1-3, idioma, nivel idioma: 1-3, region, universidad, carrera, office: 1-3, internet: 1-3, disponibilidad: 1-2, salario (txt), interes, habilidades */
		DOM = this.DOM;

		DOM.nivelUniversitario.val(datosPerfil.cod_nivel_universitario);
		DOM.region.val(datosPerfil.cod_ubigeo_region);
		DOM.universidad.html(Template7.templates.optionsGlobalT7(datosPerfil._universidades));
		DOM.universidad.val(datosPerfil.cod_universidad);
		DOM.carrera.val(datosPerfil.cod_carrera_uni);
		DOM.office.val(datosPerfil.nivel_office);
		DOM.internet.val(datosPerfil.nivel_internet);
		DOM.disponibilidad.val(datosPerfil.nivel_disponibilidad);
		DOM.salario.val(datosPerfil.salario);
		DOM.interes.val(datosPerfil.interes);

		DOM.blkIdiomas.html(Template7.templates.idiomasGestionarPerfilT7(datosPerfil.idiomas));
		DOM.blkIntereses.html(Template7.templates.habilidadesGestionarPerfilT7(datosPerfil.intereses));
		DOM.blkHabilidades.html(Template7.templates.habilidadesGestionarPerfilT7(datosPerfil.habilidades));
	},
	getDataFull: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "EstudiantePerfil",
				metodo: "cargarDatosPerfil"
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
	getUniversidades: function(codigoRegion){	
		var self = this;
		new Ajxur.Api({
				modelo: "Universidad",
				metodo: "listarXRegion",
				data_in: {p_codUbigeoRegion: codigoRegion}
			}, function(r){
				if (r.estado === 200){					
					if (r.datos.data.length){
						self.DOM.universidad.html(Template7.templates.optionsGlobalT7(r.datos.data));	
					} else {
						self.DOM.universidad.html(Template7.templates.optionsGlobalT7([{codigo:"",descripcion:"Sin registros"}]));	
					}
					
				}
		});
	},
	getDataParcial: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "EstudiantePerfil",
				metodo: "cargarPerfil"
			}, function(r){
				if (r.estado === 200){
					self.fill(r.datos.data);
				}
		});
	},
	guardarPerfil: function(){
		var self = this, 
			DOM = self.DOM,
			datos_frm = new FormData(),
			habilidades = [], intereses = [], idiomas=[];

	        datos_frm.append("p_array_datos", JSON.stringify(app.formToData(DOM.form)));

			/*Habiliddes*/
			$$.each(DOM.blkHabilidades.find(".chip .chip-delete"),function(i,o){
				habilidades.push(o.dataset.codigo);
			});
			/*intereses*/
			$$.each(DOM.blkIntereses.find(".chip .chip-delete"),function(i,o){
				intereses.push(o.dataset.codigo);
			});
			/*idiomas*/
			$$.each(DOM.blkIdiomas.find("select"),function(i,o){
				idiomas.push({codigo: o.dataset.codigo, nivel: o.value});
			});


			datos_frm.append("p_habilidades", JSON.stringify(habilidades));
			datos_frm.append("p_intereses", JSON.stringify(intereses));
			datos_frm.append("p_idiomas", JSON.stringify(idiomas));

	        DOM.btnGuardar[0].disabled = true;
	       	$$.ajax({
	            url: globalVars.URL+"/controlador/estudiante.perfil.guardar.php",
	            cache: false,
	            contentType: false,
	            processData: false,
	            data: datos_frm,
	            type: 'post',
	            success: function (r) {
					var datos;
	                r = JSON.parse(r); 
	                if (r.estado === 200) {
	                	datos = r.datos;
						if (datos.rpt == true){
	                		DOM.btnGuardar[0].disabled = false;
	                		data.usuario.carrera = datos.data_carrera;
	                		pages["estudiante-perfil"].actualizarPerfil();
	                		loadPage("estudiante-perfil");
	                		app.alert(datos.msj);
						} else {
	                		setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3500);
						}
	                }
	            },
	            error: function (error) {
	                DOM.btnGuardar[0].disabled = false;
	                console.error(error);
	            }
	        });
	}
}; pages["estudiante-gestionar-perfil"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		//this.render();
		this.getDataFull();
		//this.fill();
	},
	reinit: function(){
		this.getDataParcial();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			DOM = {
			_contenedor : $contenedor,
			form : $contenedor.find("form"),
			txtIdioma: $contenedor.find("#txtIdioma"),
			blkIdiomas: $contenedor.find("#blkIdiomas"),
			blkEstudios: $contenedor.find("#blkEstudios"),
			blkConocimientos : $contenedor.find("#blkConocimientos"),
			blkIntereses : $contenedor.find("#blkIntereses"),
			txtIntereses : $contenedor.find("#txtIntereses"),
			blkHabilidades : $contenedor.find("#blkHabilidades"),
			txtHabilidades : $contenedor.find("#txtHabilidades"),
			btnGuardar : $contenedor.find("#btnGuardarPerfil")
		};
		this.DOM = DOM;

		Template7.registerPartial('itemInput', 
								' <div class="item-content">'+
                              		'<div class="item-inner">'+
                                		'<div class="item-title label">{{subtitulo}}</div>'+
                                		'<div class="item-input {{#with type}}item-input-field{{/with}}">'+
											'{{#js_if "this.type"}}'+
			                                  '<input type="{{type}}" name="{{id}}"  id="{{id}}" placeholder="{{subtitulo}}">'+
			                                '{{else}}'+
			                                  '<select name="{{id}}" id="{{id}}">'+
			                                  	'<option value="">Seleccionar</option>'+
			                                    '{{#each items}}'+
			                                      '<option value="{{codigo}}">{{descripcion}}</option>'+
			                                    '{{/each}}'+
			                                  '</select>'+
			                                '{{/js_if}} '+
			                            '</div>'+
			                            '</div>'+
			                       '</div>'+
			                     '</div>'
                           );
	},
	render: function(_data){
		var Templates = Template7.templates,
			DOM = this.DOM,
			dataInterfaz = _data.interfaz;

		var estudiosData = [		
			{item : 2,
			items : [
				{
				subtitulo: "Región",
				id : "txtregionperfil",
				items : dataInterfaz.regiones
				},
				{
				subtitulo: "Universidad",
				id : "txtuniversidad",
				items :  []
				}],
			},
			{item : 1,
			subtitulo: "Nivel Universitario",
			id : "txtniveluniversitario",
			items : dataInterfaz.niveles_universitario
			},
			{item : 1,
			subtitulo: "Carrera Universitaria",
			id : "txtcarrera",
			items : dataInterfaz.carreras
			}
		];

		dataInterfaz.idiomas.unshift({"codigo":"","descripcion":"Agregar Idioma"});
		DOM.txtIdioma.html(Templates.optionsGlobalT7(dataInterfaz.idiomas));
		DOM.blkEstudios.html(Templates.estudiosGestionarPerfilT7(estudiosData));

		var conocimientosData = [
			{item : 2,
			items : [
				{
				subtitulo: "Nivel Office",
				id : "txtniveloffice",
				items :  dataInterfaz.niveles
				},
				{
				subtitulo: "Nivel Internet",
				id : "txtnivelinternet",
				items :  dataInterfaz.niveles
				}],
			},
			{item : 2,
			items : [
				{
				subtitulo: "Disponibilidad",
				id : "txtdisponibilidad",
				items : dataInterfaz.disponibilidad
				},
				{
				subtitulo: "Salario",
				id : "txtsalario",
				type:"number",
				items :  []
				}],
			}/*,
			{item : 1,
			subtitulo: "Áreas de Interés",
			id : "txtintereses",
			items : dataInterfaz.intereses
			}*/
		];

		dataInterfaz.habilidades.unshift({"codigo":"","descripcion":"Agregar habilidad"});
		dataInterfaz.intereses.unshift({"codigo":"","descripcion":"Agregar interés"});

		var habilidadesData = {
			intereses : dataInterfaz.intereses,
			habilidades : dataInterfaz.habilidades,
		};

		DOM.blkConocimientos.html(Templates.estudiosGestionarPerfilT7(conocimientosData));
		DOM.txtIntereses.html(Templates.optionsGlobalT7(habilidadesData.intereses));
		DOM.txtHabilidades.html(Templates.optionsGlobalT7(habilidadesData.habilidades));

		this.setPostDOM();
		this.setEventos();

		this.fill(_data.perfil_estudiante);
	},
	setPostDOM: function(){
		var DOM = this.DOM;
		//$contenedor = $$(contenedor);
		DOM.nivelUniversitario = $contenedor.find("#txtniveluniversitario");
		//DOM.niveIidioma = $contenedor.find("#txtnivelidioma");
		//DOM.idioma = $contenedor.find("#txtidioma");
		DOM.region = $contenedor.find("#txtregionperfil");
		DOM.universidad = $contenedor.find("#txtuniversidad");
		DOM.carrera = $contenedor.find("#txtcarrera");

		DOM.office = $contenedor.find("#txtniveloffice");
		DOM.internet = $contenedor.find("#txtnivelinternet");
		DOM.disponibilidad = $contenedor.find("#txtdisponibilidad");
		DOM.salario = $contenedor.find("#txtsalario");
		DOM.interes = $contenedor.find("#txtintereses");

		this.DOM = DOM;
	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM,
			Templates = Template7.templates,
			fnComboChange = function(tipo){
				var txt, blk;
				switch (tipo){
					case "intereses":
						txt = DOM.txtIntereses;
						blk = DOM.blkIntereses;
					break;
					case "habilidades":
						txt = DOM.txtHabilidades;
						blk = DOM.blkHabilidades;
				}

				var val = txt.val();
				if (val == ""){
					return;
				}

				/*Detectar si ya está cargada.*/
				var auxCargada = false;

				$$.each(blk.find(".chip .chip-delete"),function(i,o){
					if (o.dataset.codigo == val){
						auxCargada = true;
						return false;
					}
				});

				if (!auxCargada){
					/*Si no está cargada, cárgala*/
					blk.append(Templates.habilidadesGestionarPerfilT7([{codigo: val, descripcion: txt.find("option:checked").html()}]));
				} else {
					app.notificar("Habilidad ya agregada.",2000);
				}
			},
			fnChipDelete = function(tipo, dis){
				var $this = $$(dis); $this.parent().remove();
				DOM[tipo == "intereses" ? "txtIntereses" : "txtHabilidades"].val("");
			};

		DOM.txtIntereses.change(function(e){
			fnComboChange("intereses");
		});

		DOM.blkIntereses.on("click", ".chip .chip-delete", function(e){
			fnChipDelete("intereses", this);
		});

		DOM.txtHabilidades.change(function(e){
			fnComboChange("habilidades");
		});

		DOM.blkHabilidades.on("click", ".chip .chip-delete", function(e){
			fnChipDelete("habilidades", this);
		});

		DOM.region.on("change", function(e){
			if (this.value == ""){
				DOM.universidad.html(Templates.optionsGlobalT7([]));
				return;
			}
			self.getUniversidades(this.value);
			/*Cargar universidades de esa región.*/
		});


		DOM.txtIdioma.on("change", function(e){
			/*Verificar que ya existe, sino agregar con value = 2.*/
			var val = this.value;
			if (val == ""){
				return;
			}

			/*Detectar si ya está cargada.*/
			var auxCargada = false;

				$$.each(DOM.blkIdiomas.find("select"),function(i,o){
					if (o.dataset.codigo == val){
						auxCargada = true;
						return false;
					}
				});

				if (!auxCargada){
					/*Si no está cargada, cárgala*/
					DOM.blkIdiomas.append(Templates.idiomasGestionarPerfilT7([{codigo: val, descripcion: DOM.txtIdioma.find("option:checked").html(), nivel : 2}]));
				} else {
					this.value = "";
					app.notificar("Idioma ya agregado.",2000);
				}

		});

		DOM.blkIdiomas.on("change","select", function(e){
			var val = this.value, $this, numIdiomasActual;
			if (val == ""){
				/*Quitar*/
				$this = $$(this); 
				$this.parent().parent().remove();
				DOM.txtIdioma.val("");

				numIdiomasActual = DOM.blkIdiomas.find("select").length;
				if (numIdiomasActual <= 0){
					DOM.blkIdiomas.html(Templates.idiomasGestionarPerfilT7());
				}

			}
		});

		DOM.form.submit(function(e){
			e.preventDefault();
			app.confirm("¿Desea guardar nuevo perfil?", 
					function(e){
						self.guardarPerfil();
					});
		});
	},
	fill : function(datosPerfil){
		/* nive uni: 1-3, idioma, nivel idioma: 1-3, region, universidad, carrera, office: 1-3, internet: 1-3, disponibilidad: 1-2, salario (txt), interes, habilidades */
		DOM = this.DOM;

		DOM.nivelUniversitario.val(datosPerfil.cod_nivel_universitario);
		DOM.region.val(datosPerfil.cod_ubigeo_region);
		DOM.universidad.html(Template7.templates.optionsGlobalT7(datosPerfil._universidades));
		DOM.universidad.val(datosPerfil.cod_universidad);
		DOM.carrera.val(datosPerfil.cod_carrera_uni);
		DOM.office.val(datosPerfil.nivel_office);
		DOM.internet.val(datosPerfil.nivel_internet);
		DOM.disponibilidad.val(datosPerfil.nivel_disponibilidad);
		DOM.salario.val(datosPerfil.salario);
		DOM.interes.val(datosPerfil.interes);

		DOM.blkIdiomas.html(Template7.templates.idiomasGestionarPerfilT7(datosPerfil.idiomas));
		DOM.blkIntereses.html(Template7.templates.habilidadesGestionarPerfilT7(datosPerfil.intereses));
		DOM.blkHabilidades.html(Template7.templates.habilidadesGestionarPerfilT7(datosPerfil.habilidades));
	},
	getDataFull: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "EstudiantePerfil",
				metodo: "cargarDatosPerfil"
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
	getUniversidades: function(codigoRegion){	
		var self = this;
		new Ajxur.Api({
				modelo: "Universidad",
				metodo: "listarXRegion",
				data_in: {p_codUbigeoRegion: codigoRegion}
			}, function(r){
				if (r.estado === 200){					
					if (r.datos.data.length){
						self.DOM.universidad.html(Template7.templates.optionsGlobalT7(r.datos.data));	
					} else {
						self.DOM.universidad.html(Template7.templates.optionsGlobalT7([{codigo:"",descripcion:"Sin registros"}]));	
					}
					
				}
		});
	},
	getDataParcial: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "EstudiantePerfil",
				metodo: "cargarPerfil"
			}, function(r){
				if (r.estado === 200){
					self.fill(r.datos.data);
				}
		});
	},
	guardarPerfil: function(){
		var self = this, 
			DOM = self.DOM,
			datos_frm = new FormData(),
			habilidades = [], intereses = [], idiomas=[];

	        datos_frm.append("p_array_datos", JSON.stringify(app.formToData(DOM.form)));

			/*Habiliddes*/
			$$.each(DOM.blkHabilidades.find(".chip .chip-delete"),function(i,o){
				habilidades.push(o.dataset.codigo);
			});
			/*intereses*/
			$$.each(DOM.blkIntereses.find(".chip .chip-delete"),function(i,o){
				intereses.push(o.dataset.codigo);
			});
			/*idiomas*/
			$$.each(DOM.blkIdiomas.find("select"),function(i,o){
				idiomas.push({codigo: o.dataset.codigo, nivel: o.value});
			});


			datos_frm.append("p_habilidades", JSON.stringify(habilidades));
			datos_frm.append("p_intereses", JSON.stringify(intereses));
			datos_frm.append("p_idiomas", JSON.stringify(idiomas));

	        DOM.btnGuardar[0].disabled = true;
	       	$$.ajax({
	            url: globalVars.URL+"/controlador/estudiante.perfil.guardar.php",
	            cache: false,
	            contentType: false,
	            processData: false,
	            data: datos_frm,
	            type: 'post',
	            success: function (r) {
					var datos;
	                r = JSON.parse(r); 
	                if (r.estado === 200) {
	                	datos = r.datos;
						if (datos.rpt == true){
	                		DOM.btnGuardar[0].disabled = false;
	                		data.usuario.carrera = datos.data_carrera;
	                		pages["estudiante-perfil"].actualizarPerfil();
	                		loadPage("estudiante-perfil");
	                		app.alert(datos.msj);
						} else {
	                		setTimeout(function(){DOM.btnGuardar[0].disabled = false;},3500);
						}
	                }
	            },
	            error: function (error) {
	                DOM.btnGuardar[0].disabled = false;
	                console.error(error);
	            }
	        });
	}
};pages.login = {
	init : function(){
		this.setDOM();
		this.setEventos();
	},
	reinit: function(){

	},
	setDOM: function(){
		var contenedor = $$(".login-screen-content"),
			preDOM = contenedor.find("form,#txt-usuario,#txt-contraseña,#cbo-tipo-persona,#txt-ip"),
			DOM = {
				form : preDOM.eq(0),
				txtUsuario : preDOM.eq(1),
				txtContraseña :preDOM.eq(2),
				cboTipoPersona : preDOM.eq(3),
				txtIP : preDOM.eq(4)
			}
		this.DOM = DOM;

	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM;

		DOM.form.submit(function(e){
			e.preventDefault();
			self.iniciarSesion();
		});

		DOM.txtIP.change(function(e){
			e.preventDefault();
			var v = "http://"+this.value+"/appJoseServer";
			data.ip = v; 
			globalVars.URL  = v;
			Util.Store.set("ip", v);
		});

		TRICK = 1;
		$$("#trick").click(function(e){
			if (TRICK == 1){
				$$(".blk-ip").hide();
			}
			else {
				$$(".blk-ip").show();
			}

			TRICK  *= -1;
		});

	},
	validarIptSesion: function(){
		if (this.DOM.txtUsuario.val() == ""){
			app.notificar("Debe ingresar un usuario válido",5000);			
			return false;
		}

		if (this.DOM.txtContraseña.val() == ""){
			app.notificar("Debe ingresar una contraseña válida",5000);			
			return false;
		}

		return true;
	},
	iniciarSesion: function(){
		var DOM = this.DOM;
		
		if (this.validarIptSesion()){
			var formData = app.formToData(DOM.form);			
			var fn = function(xhr){
				var r = xhr.datos;

				if ( r.rpt == true ){					
					Util.Store.set("usuario", r.usuario);
					DOM.txtContraseña.val("");
					pages.login.cerrarLogin();
					init('apk');
				} 

				app.notificar(r.msj);
			};

			if (DOM.cboTipoPersona.val() == ""){
				console.error("No se ha seleccionado un tipo de usuario válido.");
				return;
			}

			new Ajxur.Api({
				modelo: DOM.cboTipoPersona.val(),
				metodo: "iniciarSesionMovil",
				data_in : formData
			},fn);
		}
	},
	cerrarLogin : function(){
		app.closeModal(".login-screen");
	},
	abrirLogin : function(){
		app.loginScreen();
	}
};
pages["empresario-mis-convocatorias"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.listarConvocatorias();
		this.setEventos();
		this.reinit();
		//this.getData();
	},
	reinit: function(){
		this.resetSeleccionado();
		this.listarConvocatorias();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("#refhelper, #blkConvocatoriasMisConvocatorias"),
			DOM = {
				ref : preDOM.eq(0),
				blkConvocatorias : preDOM.eq(1)
			};

		this.DOM = DOM;
	},
	setEventos: function(){
		var self = this,
			DOM = self.DOM,		
			irEditar = function(id){
				app.alert("No desarrollado aún.")
				/*
				self.DOM.ref.attr("href","#empresario-gestionar-convocatoria?cv="+id);
				setTimeout(function(){
					self.DOM.ref.click();
				}, 100);
				*/	
				//loadPage("empresario-gestionar-convocatoria", {cv: id});		
			},
			irVer = function(id){
				self.DOM.ref.attr("href","#empresario-ver-convocatoria?cv="+id);
				setTimeout(function(){
					self.DOM.ref.click();
				}, 100);	
			},
			irPostulantes = function(id){
				self.DOM.ref.attr("href","#empresario-convocatoria-postulantes?cv="+id);
				setTimeout(function(){
					self.DOM.ref.click();
				}, 100);
			},				
			fnButtons =  function(_infoJSON, _this){
				var info = JSON.parse(_infoJSON),
					estaIniciado = info.i == "true",
					bts = [	{text: info.t, label : true, color:"white",bg:"lightblue"},
							{text: "GESTIONAR POSTULANTES", color: "green", bold: true, onClick: function(){irPostulantes(info.id)}},
							{text: "VER CONVOCATORIA", color: "lightblue", bold: true, onClick: function(){irVer(info.id)}}
						  ];

				self.selConvocatoria = info.id;
				if (self.sel$Convocatoria){
					self.sel$Convocatoria.removeClass("item-seleccionado");
					self.sel$Convocatoria = null;
				} 

				self.sel$Convocatoria = $$(_this);
				self.sel$Convocatoria.addClass("item-seleccionado");	
					
				if (!estaIniciado){
					/* bts.push({text: "EDITAR CONVOCATORIA", color: "amber", bold: true, onClick: function(){self.irEditar(info.id)}});	*/				
					bts.push({text: "CANCELAR CONVOCATORIA", color: "red", bold: true, onClick: function(){self.cancelarConvocatoria(info.id)}});					
				}

				return bts;				
			};

		DOM.blkConvocatorias.on("click","li",function(e){
			var act = self._actions;
			if (this.dataset.info == null){
				return;
			}

			if (act){							
				app.closeModal(act);
				act = null;
			}
		    act = app.actions(this, fnButtons(this.dataset.info, this));
		    $$(act).once("actions:close", function(){
		    	self.resetSeleccionado();
		    })
		});
	},
	renderResultados: function(_data){
		var DOM = this.DOM,
			dataConvocatorias = _data;
			DOM.blkConvocatorias.html(Template7.templates.convocatoriaMisConvocatoriaT7(dataConvocatorias));

		this.mySearchbar = app.searchbar('.searchbar', {
		    searchList: '.list-block',
		    searchIn: '.item-description, .item-title'
		});
	},
	listarConvocatorias: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "listarAvisosEmpresario",
			}, function(r){
				var datos = r.datos;
				if (datos.rpt){
				 	self.renderResultados(datos.r);
				}
		});
	},
	cancelarConvocatoria: function(codConvocatoria){
		if (codConvocatoria < 0){
			return;
		}
		
		var self = this;
		app.confirm("¿Seguro que desea cancelar esta convocatoria?",function(){
			new Ajxur.Api({
					modelo: "AvisoLaboral",
					metodo: "cancelar",
					data_in: {p_codAvisoLaboral :codConvocatoria}
				}, function(r){
					var datos = r.datos;
					if (datos.rpt){
						self.resetSeleccionado();
					 	self.renderResultados(datos.r);
					}
					app.alert(datos.msj);
			});

		});
	},
	resetSeleccionado: function(){
		this.selConvocatoria = -1;
		if (this.sel$Convocatoria){
			this.sel$Convocatoria.removeClass("item-seleccionado");
			this.sel$Convocatoria = null;
		}
		if (this._actions){
			this._actions = null;	
		}			
		
	}
};

pages["empresario-ver-convocatoria"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.setEventos();
		this.reinit(data);
	},
	reinit: function(data){
		this.AL = data.params.cv;
		if (this.AL == null || this.AL == ""){
			app.notificar("Aviso Laboral no válido.");
			history.back();
			return;
		}
		this.getData();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
			preDOM = $contenedor.find("#blkVerConvocatoria, #btnSiguienteVerConvocatoria"),
			DOM = {
				blkVerConvocatoria: preDOM.eq(0),
				btnSiguiente : preDOM.eq(1)				
			};
		this.DOM = DOM;
	},
	setEventos: function(){
		var self = this, DOM = self.DOM;

		DOM.btnSiguiente.on("click", function(e){
			e.preventDefault();
			loadPage("empresario-convocatoria-formulario", {cv: self.AL});
		});

	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "obtenerAvisoLaboral",
				data_in: {p_codAvisoLaboral : self.AL}
			}, function(r){
				if (r.estado === 200){
					var datos = r.datos;
					self.render(datos.r);
				}
		});
	},
	render: function(_data){
		this.DOM.blkVerConvocatoria.html(Template7.templates.convocatoriaVerConvocatoriaT7(_data));
	}
};


pages["estudiante-ver-empresa"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.reinit(data);
	},
	reinit: function(data){
		this.AL = data.params.ce;
		if (this.AL == null || this.AL == ""){
			app.notificar("Aviso Laboral no válido.");
			history.back();
			return;
		}
		this.getData();
	},
	setDOM: function(contenedor){		
		var $contenedor = $$(contenedor),
		DOM = {
			blkVerEmpresa: $contenedor.find("#blkVerEmpresa"),
			btnPostular : $contenedor.find("#btnPostular")
		};
		this.DOM = DOM;
	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "obtenerAvisoLaboral",
				data_in: {p_codAvisoLaboral : self.AL}
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
	render: function(_data){
		this.DOM.blkVerEmpresa.html(Template7.templates.empresaVerEmpresaT7(_data));
	}
};


pages["estudiante-mis-postulaciones"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.reinit(data);
	},
	reinit: function(data){
		this.getData();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
		 	DOM = {
			blkResumen : $contenedor.find("#blkResumenMisPostulaciones"),
			blkPostulaciones : $contenedor.find("#blkPostulacionesMisPostulaciones")
		};
		this.DOM = DOM;
	},
	render: function(_data){

		var DOM = this.DOM;
		DOM.blkResumen.html("Postulado en <b>"+_data.total_postulados+"</b> convocatoria(s).<p>Seleccionado en <b>"+_data.total_seleccionados+"</b> convocatoria(s).</p>");
		DOM.blkPostulaciones.html(Template7.templates.postulacionesMisPostulacionesT7(_data.postulaciones));

		var self = this;
		DOM.blkPostulaciones.on("click",".btn-retirarse", function(e){
			e.preventDefault();
			var btn = this;
			app.confirm("¿Está seguro de RETIRARSE de esta convocatoria?",
				function(){
					self.retirarse(btn);			
				})
		});

	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboralEstudiante",
				metodo: "obtenerMisAvisosLaboralesEstudiante"				
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.r);
				}
		});
	},
	retirarse: function(btn){		
		var $btn = $$(btn),
			_codAvisoLaboral = btn.dataset.id;

		new Ajxur.Api({
				modelo: "AvisoLaboralEstudiante",
				metodo: "retirarse",
				data_in: {p_codAvisoLaboral: _codAvisoLaboral}				
			}, function(r){
				var datos = r.datos;
				if (datos.rpt){
					$btn.parent().parent().next().html('<div class="chip  bg-green chip-small color-white">'+
													'<div class="chip-label">PRESELECCIONADO</div></div>');
					$btn.off("click");					
					$btn.remove();					
				} 

				$btn = null;
				app.notificar(datos.msj)
		});
	}
};
/*a 29 host looking*/
pages["empresario-postulante-formulario"] = {
	init : function(data){
		this.setDOM(data.contenedor);			
		this.reinit(data);
	},
	reinit: function(data){
		this.cv = data.params.cv;
		this.e = data.params.e;
		this.getData();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
		 	preDOM = $contenedor.find("#blkPostulantePF,form,#blkFormularioPF,#lblRank, #btnPreseleccionar,#lblPreseleccionado"),
			DOM = {
				blkPostulantePF : preDOM.eq(0),
				form: preDOM.eq(1),
				blkFormulario : preDOM.eq(2),
				lblRank : preDOM.eq(3),
				btnPreseleccionar: preDOM.eq(4),
				lblPreseleccionado : preDOM.eq(5)
			};
		this.DOM = DOM;

		var t = Template7.templates;		
		this.t7Postulante = t.postulantePFT7;
		this.t7Preguntas =  t.preguntasConvocatoriaFormularioT7;


		var self = this;
		DOM.btnPreseleccionar.on("click", function(e){
			e.preventDefault();
			app.confirm("¿Seguro que desea preseleccionar el estudiante?"
				,function(){
					self.preseleccionar();		
				});
			
		});

		DOM.blkFormulario.on("click",".descargar-archivo", function(e){
			var $this = this,
				_url =  globalVars.URL+"/images/files/"+$this.dataset.url;

			console.log(_url);

			if (self.DL){
				/*Si existe downloader, usarlo SINO, usar el metodo web*/
				self.DL.Get(_url);
			} else {
				window.open(_url,"_blank");
			}
		});
	},
	render : function(_dataRender){
		 var DOM = this.DOM,		 	
		 	blkFormulario = DOM.blkFormulario,
		 	objRank = _dataRender.rank;

		 console.log(_dataRender.formulario_preguntas, _dataRender.respuestas);
						
		 _dataRender.postulante.img_host = data.ip+"/images/";
		 DOM.blkPostulantePF.html(this.t7Postulante(_dataRender.postulante));
		 blkFormulario.html(this.t7Preguntas(_dataRender.formulario_preguntas));
		 app.formFromData(DOM.form, _dataRender.respuestas);
		 app.initPageMaterialInputs(blkFormulario);

		 DOM.lblRank.html("PUNTAJE: <b>"+objRank.puntaje+"</b>. PUESTO N°: <b class='color-"+objRank.color_rank+"'>"+objRank.rank+"</b>/"+objRank.total_rank);
		 this.renderPreseleccion(objRank.estado);

	},
	getData: function(){
		var self = this;
		if (!self.cv || self.cv <= 0 || !self.e || self.e <= 0){
			app.alert("Falta código de convocatoria o estudiante.");
			loadPage("empresario-mis-convocatorias");
			return;
		}
		new Ajxur.Api({
				modelo: "AvisoLaboralEstudiante",
				metodo: "obtenerPostulanteFormulario",
				data_in : {p_codAvisoLaboral : self.cv, p_codEstudiante: self.e},
			}, function(r){
				var datos = r.datos;
				if (r.estado === 200){
					if (datos.rpt){
						self.render(datos.r);
					} 
				}
		});
	},
	renderPreseleccion: function(estado){
		var DOM = this.DOM;
		 if (estado == 'S'){
		 	DOM.btnPreseleccionar.addClass("hide");
		 	DOM.lblPreseleccionado.removeClass("hide");
		 } else {
		 	DOM.btnPreseleccionar.removeClass("hide");
		 	DOM.lblPreseleccionado.addClass("hide");
		 }
	},	
	preseleccionar: function(){
		var self = this;
		if (!self.cv || self.cv <= 0 || !self.e || self.e <= 0){
			app.alert("Falta código de convocatoria o estudiante.");
			history.back();
			return;
		}
		new Ajxur.Api({
				modelo: "AvisoLaboralEstudiante",
				metodo: "preseleccionar",
				data_in : {p_codAvisoLaboral : self.cv, p_codEstudiante: self.e},
			}, function(r){
				var datos = r.datos;
				if (r.estado === 200){
					app.alert(datos.msj);
					if (datos.rpt){
						self.renderPreseleccion('S');
					}
				}
		});
	}
};	pages["estudiante-ver-convocatoria"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.setEventos();
		this.reinit(data);
	},
	reinit: function(data){
		this.AL = data.params.ce;
		if (this.AL == null || this.AL == ""){
			app.notificar("Aviso Laboral no válido.");
			history.back();
			return;
		}
		this.getData();
	},
	setDOM: function(contenedor){
		var $contenedor = $$(contenedor),
		 	preDOM = $contenedor.find("#blkVerEmpresa, #btnPostuladoVerEmpresa, #btnPostularVerEmpresa"),
			DOM = {
				blkVerEmpresa: preDOM.eq(0),
				btnPostulado : preDOM.eq(1),
				btnPostular : preDOM.eq(2)
			};
		this.DOM = DOM;
	},
	setEventos: function(){
		var self = this, DOM= self.DOM;

		DOM.btnPostulado.on("click", function(e){
			e.preventDefault();
			loadPage("estudiante-convocatoria-formulario", {cv: self.AL});
		});

		DOM.btnPostular.on("click", function(e){
			e.preventDefault();
			loadPage("estudiante-convocatoria-formulario", {cv: self.AL});
		});
	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "obtenerAvisoLaboralEstudiante",
				data_in: {p_codAvisoLaboral : self.AL}
			}, function(r){
				if (r.estado === 200){
					var datos = r.datos;

					self.render(datos.r);

					if (datos.r.vencido == true){
						self.DOM.btnPostulado.addClass("hide");
						self.DOM.btnPostular.addClass("hide");
						return;
					}

					if (datos.v){ /*v = existen datos.*/
						self.DOM.btnPostulado.removeClass("hide");
						self.DOM.btnPostular.addClass("hide");
					} else{
						self.DOM.btnPostulado.addClass("hide");
						self.DOM.btnPostular.removeClass("hide");
					}
					
				}
		});
	},
	render: function(_data){
		this.DOM.blkVerEmpresa.html(Template7.templates.empresaVerEmpresaT7(_data));
	}
};
pages["estudiante-ver-empresa"] = {
	init : function(data){
		this.setDOM(data.contenedor);
		this.reinit(data);
	},
	reinit: function(data){
		this.AL = data.params.ce;
		if (this.AL == null || this.AL == ""){
			app.notificar("Aviso Laboral no válido.");
			history.back();
			return;
		}
		this.getData();
	},
	setDOM: function(contenedor){		
		var $contenedor = $$(contenedor),
		DOM = {
			blkVerEmpresa: $contenedor.find("#blkVerEmpresa"),
			btnPostular : $contenedor.find("#btnPostular")
		};
		this.DOM = DOM;
	},
	getData: function(){
		var self = this;
		new Ajxur.Api({
				modelo: "AvisoLaboral",
				metodo: "obtenerAvisoLaboral",
				data_in: {p_codAvisoLaboral : self.AL}
			}, function(r){
				if (r.estado === 200){
					self.render(r.datos.data);
				}
		});
	},
	render: function(_data){
		this.DOM.blkVerEmpresa.html(Template7.templates.empresaVerEmpresaT7(_data));
	}
};

app.cerrarSesion = function(){
	var _app = this;
	_app.confirm('¿Desea cerrar sesión?',globalVars.appNombre, function () {

		new Ajxur.Api({
					modelo: "Estudiante",
					metodo: "cerrarSesionMovil"
			}, function(r){
				app.__resetarSesion();
			});
/*
		$$('.navbar-on-left').remove(); 
		$$('.page-on-left').remove(); 
		$$('.navbar-on-center').remove(); 
		$$('.page-on-center').remove(); 
*/
		//_app.offPages();
/*
       mainView.history.push("login.html");            
            mainView.router.back();*/
    });
};


app.darBajaCuenta = function(){
	var _app = this;
	_app.confirm('¿Desea dar baja cuenta? Esta operación es IRREVERSIBLE.',globalVars.appNombre, function () {
		new Ajxur.Api({
			modelo: data.usuario.tipo_usuario,
			metodo: "darBajaMovil"
		}, function(r){
			app.__resetarSesion();
		});
	});
};

app.__resetarSesion = function(){
	Util.Store.del("usuario");
	mainView.history = [];
	window.location.hash = "";
	pages.login.abrirLogin();
};

app.navegarDataHref = function(b){
	loadPage(b.dataset.href);
	//mainView.router.loadPage(b.dataset.href);
	if (data.panelOpened){
		app.closePanel();
	}
};


app.notificar = function(mensaje, tiempo){
	if (!mensaje) mensaje = "";
	if (!tiempo) tiempo = 2500;
	app.closeNotification(".notification-item");
	app.addNotification({
		message: mensaje
	});

	setTimeout(function(){
		app.closeNotification(".notification-item");
	},tiempo);
};

app.startPages = function(){
	$$(document).on("pageInit", function(e){
		var pg = e.detail.page;
		if (pg && pg.name && pages[pg.name]){
			if (pages[pg.name].init && typeof pages[pg.name].init === 'function' ){
				console.log("Página "+pg.name+" inicializada.");
				pages[pg.name].init({
					contenedor : pg.container,
					params : pg.query
				});		
			} else {
				console.error("Página: "+pg.name+" no tiene método INIT.")
			}
		} else {
			console.error("Página: "+pg.name+" no está declarada.")
		};
	});

	$$(document).on("page:reinit", function(e){
		var pg = e.detail.page;	
		if (pg && pg.name && pages[pg.name]){
			if (pages[pg.name].reinit && typeof pages[pg.name].reinit === 'function' ){
				console.log("Página "+pg.name+" REinicializada.");
				pages[pg.name].reinit({
					params : pg.query
				});		
			} else {
				console.error("Página: "+pg.name+" no tiene método REINIT.")
			}
		} 
	});
};

app.initDB = function(){
	var db = new DBHandler();
	db.initDB();	
    db.createStructure();
    app.db = db;
       /*
	setTimeout(()=>{
	   console.log("crete structure");
     },2000);
	*/
}

app.offPages = function(){
	$$(document).off("pageInit");
};

pages.login.init();
app.startPages();

new Ajxur.Api({
	modelo: "Persona",
	metodo: "verificarSesion"
}, function(r){		
	if (r.estado === 200){
		if (r.datos.rpt == true){
			if (r.datos.usuario == null){
				Util.Store.del("usuario");
			} else {
				data.usuario = r.datos.usuario;
			}
		}

		if (data.usuario){
			pages.login.cerrarLogin();
			init('apk');
		}

	}
});

