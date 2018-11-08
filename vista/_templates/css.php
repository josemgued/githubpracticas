    <link rel="icon" href="../../../favicon.ico" type="image/x-icon">
<?php 
      if (MODO_PRODUCCION){
            echo '<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic-ext" rel="stylesheet" type="text/css">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/node-waves/0.7.5/waves.min.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/css/bootstrap-select.min.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.0/animate.min.css" rel="stylesheet" />
                <link href="../../css/style.css" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-datetimepicker/2.0.0/css/bootstrap-material-datetimepicker.min.css" rel="stylesheet">
                <link href="../../css/themes/all-themes.min.css" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.0.0/sweetalert.min.css" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.12/css/dataTables.bootstrap.css" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/multi-select/0.9.12/css/multi-select.min.css" rel="stylesheet">
                ';
        } else {
            echo '<link href="../../css/fonts/font-roboto.css" rel="stylesheet" type="text/css">
            <link href="../../css/fonts/font-materialize.css" rel="stylesheet" type="text/css">
            <!-- Bootstrap Core Css -->
            <link href="../../plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">

            <!-- Waves Effect Css -->
            <link href="../../plugins/node-waves/waves.min.css" rel="stylesheet" />

            <!-- Bootstrap Core Css -->
            <link href="../../plugins/bootstrap-select/css/bootstrap-select.min.css" rel="stylesheet">

            <!-- Animation Css -->
            <link href="../../plugins/animate-css/animate.min.css" rel="stylesheet" />

            <!-- Custom Css -->
            <link href="../../css/style.css" rel="stylesheet">

            <link href="../../plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css" rel="stylesheet">

            <!-- AdminBSB Themes. You can choose a theme from css/themes instead of get all themes -->
            <link href="../../css/themes/all-themes.css" rel="stylesheet" />
            <link href="../../plugins/sweetalert/sweetalert.css" rel="stylesheet" />
            <link href="../../plugins/jquery-datatable/skin/bootstrap/css/dataTables.bootstrap.css" rel="stylesheet">
            <link href="../../plugins/multi-select/css/multi-select.css" rel="stylesheet">
            ';
        }

 ?>
