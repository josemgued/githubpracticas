<?php

require_once '../datos/local_config.php';
require_once MODELO_FUNCIONES;
require_once '../negocio/AvisoLaboralEstudiante.clase.php';

/*
; Maximum allowed size for uploaded files.
upload_max_filesize = 40M

; Must be greater than or equal to upload_max_filesize
post_max_size = 40M
*/


if (isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > ((int) ini_get('post_max_size') * 1024 * 1024)) 
{
    Funciones::imprimeJSON(500, "Se ha cargado archivos demasiado grandes.", "");
    exit();
}

if (!isset($_POST["p_array_datos"])) {
    Funciones::imprimeJSON(500, "Faltan parametros", "");
    exit();
}

try {
    $obj = new AvisoLaboralEstudiante();

    $esApp = $_POST["p_app"];
    $obj->setCodAvisoLaboral($_POST["p_cod_aviso_laboral"]);

    $maximoLimiteArchivo = 5 * 1024 * 1024; //5 mb.
    $arregloArchivos = [];
    foreach ($_FILES as $key => $value) {
        $nuevaKey = "o".substr($key,6);

        $tamano = $value["size"];
        $nombre = $value["name"];
        if ($tamano > $maximoLimiteArchivo){
            Funciones::imprimeJSON(200, "OK", ["rpt"=>false, "msj"=>"El archivo '".$nombre."' pasa el límite de 5MB."]);
            exit;
        }

        if (!$esApp){
            $arTmpNombre = explode(".",$nombre);
            $tmpContarExtension = count($arTmpNombre);
            if ($tmpContarExtension <= 1){
                Funciones::imprimeJSON(200, "OK", ["rpt"=>false, "msj"=>"El archivo '".$nombre."' no tiene un formato válido."]);
                exit;   
            }

            $ext = $arTmpNombre[$tmpContarExtension - 1];
        } else {
            $ext = Funciones::mimeToExt($value["type"]);

            if ($ext == "unknown"){
                Funciones::imprimeJSON(200, "OK", ["rpt"=>false, "msj"=>"El archivo '".$nombre."' no tiene un formato válido."]);
                exit;   
            }
        }
            
        $objTmp = array("tmp"=> $value["tmp_name"],
                        "nombre"=>$nombre,
                        "ext"=> $ext,                        
                        "tamano"=>$value["size"]);
        
        $arregloArchivos[$nuevaKey]  = $objTmp;    
    }
    //Funciones::imprimeJSON(200, "OK", ["rpt"=>true, "msj"=>"¡Formulario enviado correctamente!"])
   Funciones::imprimeJSON(200, "OK", $obj->guardarFormularioEstudiante($_POST["p_array_datos"],$arregloArchivos));
    
} catch (Exception $exc) {
    Funciones::imprimeJSON(500, $exc->getMessage(), "");
}




