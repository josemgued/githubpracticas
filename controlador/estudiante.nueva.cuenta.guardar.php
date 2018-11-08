<?php

require_once '../datos/local_config.php';
require_once MODELO_FUNCIONES;
require_once '../negocio/Estudiante.clase.php';

if (!isset($_POST["p_array_datos"])) {
    Funciones::imprimeJSON(500, "Faltan parametros", "");
    exit;
}


try {
    $obj = new Estudiante();
    $datosFormulario = json_decode($_POST["p_array_datos"]);

    $obj->setCorreo($datosFormulario->txtemail);
    $obj->setDni($datosFormulario->txtdni);
    $obj->setApellidos($datosFormulario->txtapellidos);
    $obj->setNombres($datosFormulario->txtnombres);
    $obj->setPassword(md5($datosFormulario->txtpassword));
    $obj->setCodigoUniversitario($datosFormulario->txtcodigouniversitario);
    $obj->setCodCarreraUniversitaria($datosFormulario->txtcarrera);
    $obj->setCodUniversidad($datosFormulario->txtuniversidad);

    Funciones::imprimeJSON(200, "OK", $obj->guardarNuevaCuenta());
    
} catch (Exception $exc) {
    Funciones::imprimeJSON(500, $exc->getMessage(), "");
}




