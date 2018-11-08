<?php
    $rutaTemplate = "../_templates/";
    include $rutaTemplate.'AccesoAuxiliar.clase.php';
    $objAcceso = new AccesoAuxiliar();
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>Gestión de Variedad Caña | Admin SANIDAD</title>

    <!-- Favicon-->
    <?php 
        include $rutaTemplate.'css.php';
    ?>
</head>

<body class="theme-green">
     <?php  
        include $rutaTemplate.'loader.php';     
        include $rutaTemplate.'search-bar.php';
        include $rutaTemplate.'top-bar.php';
    ?>
    <section>
        <!-- Left Sidebar -->
        <aside id="leftsidebar" class="sidebar">
            <?php include $rutaTemplate.'user-info.php';?>
            <!-- Menu -->
            <div class="menu">
                <ul class="list">
                    <li class="header">MENÚ PRINCIPAL</li>
                    <?php  echo $objAcceso->getMenu();?>
                    <li class="header">OPCIONES</li>
                    <li>
                        <a href="javascript:void(0);" onclick="Util.cerrarSesion();"  class="waves-effect waves-block">
                            <i class="material-icons col-green">donut_large</i>
                            <span>Cerrar Sesión</span>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- #Menu -->
            <!-- Footer -->
            <?php include $rutaTemplate.'footer.php';?>
            <!-- #Footer -->
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
                <h2>
                    MANTENIMIENTO DE PERSONAL              
                </h2>
            </div>
            <!-- Basic Examples -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="header">
                            <h2>
                                Listado de Personal
                            </h2>
                            <ul class="header-dropdown m-r--5">
                                <li class="dropdown">
                                    <button id="btnAgregar" type="button" class="btn bg-blue waves-effect" data-toggle="modal" data-target="#myModal" title="Registrar Nuevo Personal">NUEVO REGISTRO</button> 
                                </li>
                            </ul>
                        </div>
                        <div class="body">
                            <div id="blk-alert" tabindex="0"></div>
                            <div class="row">
                                <div class="col-xs-4 col-lg-2">
                                    <label>Estado </label>
                                    <select class="form-control" id="cbo-filtro-estado">
                                        <option value="1" selected>ACTIVOS</option>
                                        <option value="0">INACTIVOS</option>
                                        <option value="-1">TODOS</option>
                                    </select>
                                </div>    
                                <div class="col-xs-4 col-lg-3">
                                    <label>Buscar por Apellidos </label>
                                    <input id="txt-filtro-apellidos" class="form-control" placeholder="Buscar por apellidos...">
                                </div>                             
                                <div class="col-xs-4 col-lg-2">
                                    <label>Buscar por Cargo </label>
                                    <input id="txt-filtro-cargo" class="form-control" placeholder="Buscar por cargo...">
                                </div>                             
                            </div>
                            <div class="table-responsive" id="listado">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- #END# Basic Examples -->
        </div>

        <div class="modal fade" id="myModal" role="dialog" style="display: none;">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title"></h4>
                        </div>
                        <form name="frm-grabar" id="frm-grabar"  role="form">
                            <div class="modal-body">
                                <input type="hidden" id="txtoperacion" disabled class="form-control">
                                <input type="hidden" id="txtid_personal" disabled class="form-control">                                            
                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">DNI</label>
                                            <div class="form-line">
                                                <input type="text" id="txtdni" class="form-control" autofocus maxlength="8">                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Nombres</label>
                                            <div class="form-line">
                                                <input type="text" id="txtnombres" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Apellidos</label>
                                            <div class="form-line">
                                                <input type="text" id="txtapellidos" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Celular Móvil</label>
                                            <div class="form-line">
                                                <input type="text" id="txtnumero_celular" class="form-control" maxlength="9">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Fecha ingreso</label>
                                            <div class="form-line">
                                                <input type="date" id="txtfecha_ingreso" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-12">
                                        <br>
                                        <select id="txtid_cargo" class="form-control selectpicker"></select>
                                    </div>                                                                    
                                </div>        
                                <div id="blk-alert-modal" tabindex="0"></div>
                            </div>
                        
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-success waves-effect">Grabar</button>
                                <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">Cerrar</button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    </section>

    <?php 
        include $rutaTemplate.'scripts-js.php';        
    ?>

</body>

</html>