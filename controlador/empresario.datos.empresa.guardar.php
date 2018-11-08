<?php

require_once '../datos/local_config.php';
require_once MODELO_FUNCIONES;
require_once '../negocio/Empresario.clase.php';

if (!isset($_POST["p_array_datos"])) {
    Funciones::imprimeJSON(500, "Faltan parametros", "");
    exit();
}


try {
    $obj = new Empresario();
    $datosFormulario = json_decode($_POST["p_array_datos"]);

    $obj->setApellidos($datosFormulario->txtapellidos);
    $obj->setNombres($datosFormulario->txtnombres);
    $obj->setDomicilio($datosFormulario->txtdomicilio == "" ? NULL : $datosFormulario->txtdomicilio);
    $obj->setCargo($datosFormulario->txtcargo == "" ? NULL : $datosFormulario->txtcargo);
    $obj->setRazonSocial($datosFormulario->txtrazonsocial == "" ? NULL : $datosFormulario->txtrazonsocial);
    $obj->setDescripcionEmpresa($datosFormulario->txtdescripcion == "" ? NULL : $datosFormulario->txtdescripcion);
    $obj->setCodTipoEmpresa($datosFormulario->txttipoempresa == "" ? NULL : $datosFormulario->txttipoempresa);
    $obj->setCodSectorIndustrial($datosFormulario->txtsectorindustrial == "" ? NULL : $datosFormulario->txtsectorindustrial);
    $obj->setCelular($datosFormulario->txtcelular);

    if ($datosFormulario->txtregion != ""){
        $obj->setCodUbigeoRegion($datosFormulario->txtregion);
        $obj->setCodUbigeoProvincia($datosFormulario->txtprovincia);
        $obj->setCodUbigeoDistrito($datosFormulario->txtdistrito);
    }
    
    if ($_FILES){
        $tipo = $_FILES["p_img_perfil"]["type"];
        if ($tipo != "image/png" && $tipo != "image/jpeg"){
            Funciones::imprimeJSON(200, "OK", array("rpt"=>false, "msj"=>"Solo se aceptan formatos JPEG, JPG y PNG en foto de perfil."));
            exit; 
        }      

        $obj->setImgPerfil($_FILES["p_img_perfil"]);
    }
    Funciones::imprimeJSON(200, "OK", $obj->guardarDatosEmpresa());
    
} catch (Exception $exc) {
    Funciones::imprimeJSON(500, $exc->getMessage(), "");
}




