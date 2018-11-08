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
    <title>Gestión de Permiso | Admin SANIDAD</title>
    <link href="https://cdn.rawgit.com/atatanasov/gijgo/master/dist/combined/css/gijgo.min.css" rel="stylesheet" type="text/css" />

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
                    GESTIÓN DE PERMISO                  
                </h2>
            </div>
            <!-- Basic Examples -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="header">
                            <h2>
                                Listado de Permiso
                            </h2>
                            <ul class="header-dropdown m-r--5">
                                <li class="dropdown">
                                    <button id="btnAgregar" type="button" class="btn bg-blue waves-effect" data-toggle="modal" data-target="#myModal" title="Registrar nuevo permiso">Nuevo registro</button> 
                                </li>
                            </ul>
                        </div>
                        <div class="body">
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
                                <div class="row clearfix">
                                    <div class="col-sm-4">
                                        <div class="form-group form-float">
                                            <label class="form-label">ID</label>
                                            <div class="form-line">
                                                <input type="text" id="txtid_permiso" disabled class="form-control">                                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Título interfaz</label>
                                            <div class="form-line">
                                                <input type="text" id="txttitulo_interfaz" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Icono interfaz</label>
                                            <div class="form-line">
                                                <input type="text" id="txticono_interfaz" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">                                         
                                        <div class="form-line">
                                            <input type="checkbox" id="txtseleccionar" name="txtseleccionar" />
                                            <label for="txtseleccionar">Seleccionar interfaz superior</label>                                           
                                        </div>
                                    </div>
                                    <div id="menu">
                                        <div class="col-sm-4">
                                             <div class="form-group form-float">
                                                <label class="form-label">URL interfaz</label>
                                                <div class="form-line">
                                                    <input type="text" id="txturl_interfaz" class="form-control">                                           
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-12">                                         
                                            <div id="tree"></div>
                                            <input type="text" id="txtopcion-menu" disabled class="form-control">

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
    <script src="https://cdn.rawgit.com/atatanasov/gijgo/master/dist/combined/js/gijgo.min.js" type="text/javascript"></script>

</body>

</html>