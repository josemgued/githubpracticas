<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>Iniciar Sesión | App José</title>
    <!-- Favicon-->
    <link rel="icon" href="../../favicon.ico" type="image/x-icon">

    <!-- Google Fonts -->
    <!--
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic-ext" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">
    -->
    <link href="../css/fonts/font-roboto.css" rel="stylesheet" type="text/css">
    <link href="../css/fonts/font-materialize.css" rel="stylesheet" type="text/css">

    <!-- Bootstrap Core Css -->
    <link href="../plugins/bootstrap/css/bootstrap.css" rel="stylesheet">

    <!-- Waves Effect Css -->
    <link href="../plugins/node-waves/waves.css" rel="stylesheet" />

    <!-- Animation Css -->
    <link href="../plugins/animate-css/animate.css" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="../css/style.css" rel="stylesheet">
</head>

<?php include '_templates/loader.php' ?>
<body class="login-page bg-lightblue">
    <div class="login-box">
        <div class="logo">
            <a href="javascript:void(0);">App <b>José</b></a>
            <small>Sistema de Preselección de Personal</small>
        </div>
        <div class="card">
            <div class="body">
                <form id="frm-sign-in" method="POST">
                    <div class="msg">Identifíquese</div>
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">person</i>
                        </span>
                        <div class="form-line">
                            <input id="txt-login" type="text" class="form-control" name="username" placeholder="Usuario" required autofocus>
                        </div>
                    </div>
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">lock</i>
                        </span>
                        <div class="form-line">
                            <input  id="txt-clave"  type="password" class="form-control" name="password" placeholder="Clave" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-8 p-t-5">
                           
                        </div>
                        <div class="col-xs-4">
                            <button id="btn-submit" class="btn btn-block bg-green waves-effect" type="submit">ACCEDER</button>
                        </div>
                    </div>
                    <div id="blk-alert"></div>
                </form>
            </div>
        </div>
    </div>

    <!-- Jquery Core Js -->
    <script src="../plugins/jquery/jquery.min.js"></script>
    <!-- Bootstrap Core Js -->
    <script src="../plugins/bootstrap/js/bootstrap.js"></script>
    <!-- Waves Effect Plugin Js -->
    <script src="../plugins/node-waves/waves.js"></script>

    <!-- Custom Js -->
    <script src="../js/Ajxur.js"></script>    
    <script src="../js/admin.js"></script>
    <script src="../js/util.js"></script>
    <script src="_js/login.js"></script>
</body>

</html>