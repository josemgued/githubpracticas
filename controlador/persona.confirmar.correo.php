<?php

require_once '..\datos\local_config.php';
var_dump($_GET);
exit;
require_once '..\negocio\Persona.clase.php';

if (!isset($_GET["pid"]) ||  !isset($_GET["tuser"])){
    echo '<h1>Enlace no válido.</h1>';
    return;
}

$pid = $_GET["pid"];
$tuser = $_GET["tuser"];

 $obj = new Persona();
 $resultado = $obj->confirmacionCorreo($pid, $tuser);


  if ($resultado == 0){
        /*Validado pasó de -1 a 1*/
        echo '<h1>Enlace no válido.</h1>';
        return;
    } 

    if ($resultado == 1){
        /*Validado pasó de -1 a 1*/
        echo '<h2>SE HA VALIDADO CORRECTAMENTE LA INFORMACIÓN DE SU CORREO Y REGISTRO EN NUESTRA APP.</h2>
                            <h3>¡Muchas gracias!</h3>';
        return;
    } 

    if ($resultado == 2) {
        /*Valor diferente de -1*/
        echo '<h2>ESTE USUARIO YA HA SIDO CONFIRMADO ANTERIORMENTE.</h2>
                            <h3>¡Muchas gracias!</h3>';
        return;
    }


