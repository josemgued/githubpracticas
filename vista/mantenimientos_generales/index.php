<?php
    include '_t/_tpl8_entries.php';
    $rutaTemplate = "../_templates/";
    include $rutaTemplate.'AccesoAuxiliar.clase.php';
    $objAcceso = new AccesoAuxiliar();
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>Gestión de Mantenimientos Generales |  <?php echo SW_NOMBRE; ?></title>

    <!-- Favicon-->
    <?php 
        include $rutaTemplate.'css.php';
    ?>
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
                // <!-- Menu -->
                include $rutaTemplate.'menu.php';
                // <!-- #Menu -->
                // <!-- Footer -->
                include $rutaTemplate.'footer.php';
                //#Footer -->
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
                <h2>
                    MANTENIMIENTOS GENERALES
                </h2>
            </div>
            <!-- Basic Examples -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="body">
                            <div id="blk-alert"></div>
                            <!-- Nav tabs -->
                            <ul id="nav" class="nav nav-tabs" role="tablist">
                                <?php  include '_t/_tpl8_tabs.php'; ?>
                            </ul>

                            <!-- Tab panes -->
                            <div class="tab-content">
                                <?php  include '_t/_tpl8_tab_panels.php'; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- #END# Basic Examples -->
        </div>

        <div class="modal fade" id="modal-mantenimiento" role="dialog" style="display: none;">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title"></h4>
                        </div>
                        <form name="frm-grabar" id="frm-grabar"  role="form">
                            <div class="modal-body">
                                <script type="handlebars-x" id="tpl8Modal">
                                    <input type="hidden" id="op" value="agregar">
                                    <input type="hidden" id="id" name="id">
                                    {{#.}} 
                                    <div class="row clearfix">
                                        {{#this}}
                                        <div class="col-sm-{{tamaño}}">
                                            <div class="form-group form-float">
                                                <label class="form-label">{{label}}</label>
                                                <div class="form-line">
                                                    {{{element}}}
                                                </div>
                                            </div>
                                        </div>
                                        {{/this}}
                                    </div>
                                    {{/.}}
                                </script>
                            </div>                        
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-success waves-effect">GRABAR</button>
                                <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">CERRAR</button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    
    </section>


    <script type="text/javascript" src="Mantenimientos.js"></script>
    <?php 
        include $rutaTemplate.'scripts-js.php';
    ?>
</body>

</html>