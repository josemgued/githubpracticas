<?php

require_once '../datos/local_config.php';
require_once MODELO_FUNCIONES;
require_once '../negocio/Empresario.clase.php';

if (!isset($_POST["p_array_datos"])) {
    Funciones::imprimeJSON(500, "Faltan parametros", "");
    exit;
}


try {
    $obj = new Empresario();
    $datosFormulario = json_decode($_POST["p_array_datos"]);

    $obj->setRazonSocial($datosFormulario->txtrazonsocial);
    $obj->setRuc($datosFormulario->txtruc);
    $obj->setApellidos($datosFormulario->txtapellidos);
    $obj->setNombres($datosFormulario->txtnombres);
    $obj->setCargo($datosFormulario->txtcargo);
    $obj->setCorreo($datosFormulario->txtemail);
    $obj->setPassword(md5($datosFormulario->txtpassword));

    Funciones::imprimeJSON(200, "OK", $obj->guardarNuevaCuenta());
    
} catch (Exception $exc) {
    Funciones::imprimeJSON(500, $exc->getMessage(), "");
}


