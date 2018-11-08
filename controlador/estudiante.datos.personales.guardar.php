<?php

require_once '../datos/local_config.php';
require_once MODELO_FUNCIONES;
require_once '../negocio/Estudiante.clase.php';

if (!isset($_POST["p_array_datos"])) {
    Funciones::imprimeJSON(500, "Faltan parametros", "");
    exit();
}


try {
    $obj = new Estudiante();
    $datosFormulario = json_decode($_POST["p_array_datos"]);

    $obj->setApellidos($datosFormulario->txtapellidos);
    $obj->setNombres($datosFormulario->txtnombres);
    $obj->setDomicilio($datosFormulario->txtdomicilio == "" ? NULL : $datosFormulario->txtdomicilio);    

    if ($datosFormulario->txtregion != ""){
        $obj->setCodUbigeoRegion($datosFormulario->txtregion);
        $obj->setCodUbigeoProvincia($datosFormulario->txtprovincia);
        $obj->setCodUbigeoDistrito($datosFormulario->txtdistrito);
    }
    
    $obj->setFechaNacimiento($datosFormulario->txtfechanacimiento  == "" ? NULL : $datosFormulario->txtfechanacimiento);
    $obj->setCelular($datosFormulario->txtcelular);
    $obj->setSexo($datosFormulario->txtgenero);
    if ($datosFormulario->txtcarrerauniversitaria != NULL && $datosFormulario->txtcarrerauniversitaria != "" ){
        $obj->setCodCarreraUniversitaria($datosFormulario->txtcarrerauniversitaria);
    }

    if ($_FILES){
        $tipo = $_FILES["p_img_perfil"]["type"];
        if ($tipo != "image/png" && $tipo != "image/jpeg"){
            Funciones::imprimeJSON(200, "OK", array("rpt"=>false, "msj"=>"Solo se aceptan formatos JPEG, JPG y PNG en foto de perfil."));
            exit; 
        }      

        $obj->setImgPerfil($_FILES["p_img_perfil"]);
    }
    Funciones::imprimeJSON(200, "OK", $obj->guardarDatosPersonales());
    
} catch (Exception $exc) {
    Funciones::imprimeJSON(500, $exc->getMessage(), "");
}




