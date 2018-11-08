<?php 
    require_once '../datos/local_config_web.php';
    $isLogged = array_key_exists("obj_usuario",$_SESSION);
    $href = $isLogged ?  "evaluaciones" : "index.php";
?>

<html><head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>403 | SisVentas - Material Design</title>
    <!-- Favicon-->
    <link rel="icon" href="../../favicon.ico" type="image/x-icon">

    <!-- Google Fonts -->
    <link href="../css/fonts/font-roboto.css" rel="stylesheet" type="text/css">
    <link href="../css/fonts/font-materialize.css" rel="stylesheet" type="text/css">

    <!-- Bootstrap Core Css -->
    <link href="../plugins/bootstrap/css/bootstrap.css" rel="stylesheet">

    <!-- Waves Effect Css -->
    <link href="../plugins/node-waves/waves.css" rel="stylesheet">

    <!-- Custom Css -->
    <link href="../css/style.css" rel="stylesheet">
</head>

<body class="four-zero-four">
    <div class="four-zero-four-container">
        <div class="error-code">403</div>
        <div class="error-message">No tiene permiso de acceso.</div>
        <div class="button-place">
            <a href="<?php echo $href; ?>" class="btn btn-default btn-lg waves-effect">Ir a Inicio </a>
        </div>
    </div>

    <!-- Jquery Core Js -->
    <script src="../plugins/jquery/jquery.min.js"></script>

    <!-- Bootstrap Core Js -->
    <script src="../plugins/bootstrap/js/bootstrap.js"></script>

    <!-- Waves Effect Plugin Js -->
    <script src="../plugins/node-waves/waves.js"></script>

</body></html>