<?php

require_once '../datos/local_config.php';
require_once MODELO_FUNCIONES;
require_once '../negocio/EstudiantePerfil.clase.php';

if (!isset($_POST["p_array_datos"])) {
    Funciones::imprimeJSON(500, "Faltan parametros", "");
    exit();
}


try {
    $obj = new EstudiantePerfil();
    $datosFormulario = json_decode($_POST["p_array_datos"]);
    $habilidades = json_decode($_POST["p_habilidades"]);
    $idiomas = json_decode($_POST["p_idiomas"]);
    $intereses = json_decode($_POST["p_intereses"]);

    $obj->setNivelOffice($datosFormulario->txtniveloffice);
    $obj->setNivelInternet($datosFormulario->txtnivelinternet);
    $obj->setSalario($datosFormulario->txtsalario == "" ? 0.00 : $datosFormulario->txtsalario);    
    $obj->setDisponibilidad($datosFormulario->txtdisponibilidad == "" ? NULL : $datosFormulario->txtdisponibilidad);    
    $obj->setCodNivelUniversitario($datosFormulario->txtniveluniversitario == "" ? NULL : $datosFormulario->txtniveluniversitario);   
    $obj->setCodCarreraUni($datosFormulario->txtcarrera == "" ? NULL : $datosFormulario->txtcarrera);   
    $obj->setCodUniversidad($datosFormulario->txtuniversidad == "" ? NULL : $datosFormulario->txtuniversidad);   

    $obj->setHabilidades($habilidades);
    $obj->setIntereses($intereses);
    $obj->setIdiomas($idiomas);

    Funciones::imprimeJSON(200, "OK", $obj->guardarPerfil());
    
} catch (Exception $exc) {
    Funciones::imprimeJSON(500, $exc->getMessage(), "");
}




