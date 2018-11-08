<?php
    $rutaTemplate = "../_templates/";

    define("SW_NOMBRE","APPracticar");
    define("SW_VERSION","1.0.0");
    define("MODO_PRODUCCION",true);

/*
    $htmlMuestra = "";

    if (isset($_GET["pid"]) && isset($_GET["tuser"])){
        include '../../controlador/persona.confirmar.correo.php';  
        $htmlMuestra = $confirmarCorreo($_GET["pid"], $_GET["tuser"]);      
    } else {
        $htmlMuestra = "<h1>Enlace no válido.</h1>";
    }

    */

?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>Confirmar cuenta |  <?php echo SW_NOMBRE; ?></title>

    <!-- Favicon-->
    <?php 
        include $rutaTemplate.'css.php';
    ?>
</head>

<body class="theme-blue">
     <?php  
        include $rutaTemplate.'top-bar.php';
    ?>
    <section class="content" style="margin: 150px 15px">
        <div class="container-fluid">
            <div class="block-header">
            </div>
            <!-- Basic Examples -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body text-center">
                            <img style="width:350px" src="../../images/test.png">
                            <div id="rpta"></div>
                            <!--
                            <h2>SE HA VALIDADO CORRECTAMENTE LA INFORMACIÓN DE SU CORREO Y REGISTRO EN NUESTRA APP.</h2>
                            <h3>¡Muchas gracias!</h3>
                        -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- #END# Basic Examples -->
        </div>

       
    </section>

    <?php 

    if (MODO_PRODUCCION){
            echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/node-waves/0.7.5/waves.min.js"></script>';

        } else {
            echo '<script src="../../plugins/jquery/jquery.min.js"></script>
                <!-- Bootstrap Core Js -->
                <script src="../../plugins/bootstrap/js/bootstrap.js"></script>
                <!-- Waves Effect Plugin Js -->
                <script src="../../plugins/node-waves/waves.js"></script>
            ';
        }
     ?>
    <!-- Jquery Core Js -->
    
    <script type="text/javascript">
        var _PID = "<?php echo isset($_GET["pid"]) ? $_GET["pid"] : NULL; ?>";
        var _TUSER = "<?php echo isset($_GET["tuser"]) ? $_GET["tuser"] : NULL; ?>";
    </script>
    <script src="index.js"></script>

</body>

</html>