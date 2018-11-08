<?php
    $rutaTemplate = "../_templates/";
    include $rutaTemplate.'AccesoAuxiliar.clase.php';
    $objAcceso = new AccesoAuxiliar();    
    $fechaHoy =  date('Y-m-d');
?> 
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>Reporte de Estudiantes |  <?php echo SW_NOMBRE; ?></title>

    <!-- Favicon-->
    <?php 
        include $rutaTemplate.'css.php';
    ?>
    <link href="../../plugins/multi-select/css/multi-select.css" rel="stylesheet">
</head>

<body class="theme-light-blue">
    <?php  
        include $rutaTemplate.'loader.php';     
        include $rutaTemplate.'search-bar.php';
        include $rutaTemplate.'top-bar.php';
    ?>
    <section>
        <!-- Left Sidebar -->
        <aside id="leftsidebar" class="sidebar">
            <?php 
                include $rutaTemplate.'user-info.php';
                include $rutaTemplate.'menu.php';
                include $rutaTemplate.'footer.php';
            ?>
        </aside>
        <!-- #END# Left Sidebar -->
        <!-- Right Sidebar -->
        <?php 
            include $rutaTemplate.'right-menu.php';
        ?>            
        <!-- #END# Right Sidebar -->
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <h2> REPORTE DE ESTUDIANTES  </h2>
            </div>
            <!-- Basic Examples -->
            <div class="card">
                <div id="blk-alert" tabindex="0"></div>               
                <div class="header">
                     <form class="row form-group">
                        <div class="col-md-6">
                            <label class="form-label">Estudiantes: </label>
                            <select title="Todos los estudiantes" data-live-search="true"  class="form-control show-tick"  multiple id="cbo-estudiante"  name="cbo-estudiante">    
                            </select>
                        </div>
                        <div class="col-sm-3 col-md-1">
                            <input type="checkbox" value="T" id="chk-todos">
                            <label for="chk-todos">Todas las fechas:</label>
                        </div>  
                        <div class="col-sm-4 col-md-2">
                            <label class="form-label">Fecha Inicio: </label>
                            <input type="date" id="txt-fecha-inicio" value="<?php echo $fechaHoy;?>" required class="form-control">
                        </div>
                        <div class="col-sm-4 col-md-2">
                            <label class="form-label">Fecha Fin: </label>
                            <input type="date" id="txt-fecha-fin" value="<?php echo $fechaHoy;?>" required class="form-control">
                        </div>
                        <div class="col-sm-2 col-md-1">
                            <button type="submit" class="btn btn-lg bg-red waves-effect">GENERAR</button>
                        </div>
                    </form> 
                </div> 

            </div>

        </div>

    </section>

    <?php 
        include $rutaTemplate.'scripts-js.php';
    ?>
     <script src="../../plugins/multi-select/js/jquery.multi-select.js"></script>
    <script src="../../plugins/jquery-datatable/jquery.dataTables.js"></script>
    <script src="../../plugins/jquery-datatable/skin/bootstrap/js/dataTables.bootstrap.js"></script>
    

</body>

</html>