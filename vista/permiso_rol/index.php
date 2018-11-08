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
    <title>Gestión de Permiso Rol | Admin SANIDAD</title>

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
                    MANTENIMIENTO DE PERMISOS POR ROL
                </h2>
            </div>
            <!-- Basic Examples -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="header">
                            <h2>Mantenimientos de permisos por rol</h2>
                        </div>
                        <div class="body">
                            <div id="blk-alert" tabindex="0"></div>
                            <div class="row clearfix">
                                <div class="col-sm-3">
                                    <div class="form-group form-float">
                                        <label class="form-label">Rol</label>
                                        <div class="form-line">
                                            <select id="txtid_rol" class="form-control selectpicker">                                            
                                            </select>                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row clearfix">
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12">
                                    <div class="card">
                                        <div class="header bg-green">
                                            <h2>Permiso activo</h2>
                                        </div>
                                        <div id="listar-permisos-activos" style="height:350px;overflow: scroll;"></div> 
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12" style="height:410px;display:flex;justify-content:center;align-items: center;">
                                    <div style="width: 200px;">
                                        <button type="button" disabled id="btn-izquierda" class="btn btn-block btn-lg btn-success waves-effect" onclick="agregar()">&#60;</button>
                                        <button type="button" disabled  id="btn-derecha" class="btn btn-block btn-lg btn-success waves-effect" onclick="quitar()">&#62;</button>
                                    </div>
                                </div>
                                <div class="col-lg-5 col-md-5 col-sm-5 col-xs-12">
                                    <div class="card">
                                        <div class="header bg-grey">
                                            <h2>Permiso inactivo</h2>
                                        </div>
                                        <div id="listar-permisos-inactivos" style="height:350px;overflow: scroll;"></div>                                        
                                    </div>
                                </div>
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
                                <div class="row clearfix">
                                    <div class="col-sm-4">
                                        <div class="form-group form-float">
                                            <label class="form-label">ID</label>
                                            <div class="form-line">
                                                <input type="text" id="txtid_cargo" disabled class="form-control">                                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-12">
                                         <div class="form-group form-float">
                                            <label class="form-label">Descripcion</label>
                                            <div class="form-line">
                                                <input type="text" id="txtdescripcion" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>
        
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