var app = {};

app.setDOM = function(){
	var DOM = {
		blkAlert : $("#blk-alert"),
		signIn: $("#frm-sign-in"),
		txtLogin:$("#txt-login"),
		txtClave: $("#txt-clave"),
		btnSubmit: $("#btn-submit")
	};

	app.DOM = DOM;
};

app.setEventos = function(){
	var DOM = app.DOM;

	DOM.signIn.submit(function(e){
		e.preventDefault();
		var objRet = app.validarSubmit();
		if (objRet.rpt == false){

			Util.alert(DOM.blkAlert, {tipo: "w", mensaje: objRet.msj});
			DOM.txtLogin.val("");
			DOM.txtClave.val("");
			setTimeout(function(){DOM.blkAlert.empty();},1500);
		} else {	
			app.ingresarUsuario();			
		}
	});
};


app.validarSubmit = function(){
	var DOM = app.DOM;

	if (DOM.txtLogin.val().length <= 0){
		return {msj: "Debe ingresar un login válido", rpt: false};
	}

	if (DOM.txtClave.val().length < 3 ){
		return {msj: "Debe ingresar una clave válida", rpt: false};
	}

	return {msj: "¡Acceso válido!", rpt: true};
};

app.ingresarUsuario = function(){

	var DOM = app.DOM;

	var fn = function (resultado) {
		if (resultado.estado === 200) {
			if (resultado.datos.rpt === true) {
				Util.alert(DOM.blkAlert, {tipo: "s", mensaje:  resultado.datos.msj});
				setTimeout(function(){
					DOM.blkAlert.empty();
					location.href = "mantenimientos_generales";
				},1250);
			}else{
				Util.alert(DOM.blkAlert, {tipo: "e", mensaje:  resultado.datos.msj});
				DOM.txtUsuario.val("");
				DOM.txtClave.val("");
			}
		}
	};

	new Ajxur.Api({
		modelo: "Personal",
		metodo: "iniciarSesionWeb",
		data_in : {
			p_login : DOM.txtLogin.val(),
			p_clave : DOM.txtClave.val()
		}
	},fn);

};
	
$(document).ready(function () {
	Ajxur.URL = "../controlador/index-web.php";
	app.data = {};
    app.setDOM();
    app.setEventos();    
});