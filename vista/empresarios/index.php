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
    <title>Gestión de Empresarios | <?php echo SW_NOMBRE; ?></title>

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
                    MANTENIMIENTO DE EMPRESARIO              
                </h2>
            </div>
            <!-- Basic Examples -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="header">
                            <h2>
                                Listado de Empresarios
                            </h2>
                            <ul class="header-dropdown m-r--5">
                                <li class="dropdown">
                                    <button id="btnAgregar" type="button" class="btn bg-blue waves-effect" data-toggle="modal" data-target="#myModal" title="Registrar Nuevo Empresario">NUEVO REGISTRO</button> 
                                </li>
                            </ul>
                        </div>
                        <div class="body">
                            <div id="blk-alert" tabindex="0"></div>
                            <div class="row">
                                <div class="col-xs-4 col-lg-2">
                                    <label>Estado </label>
                                    <select class="form-control" id="txt-filtro-estado">
                                        <option value="-1" selected>TODOS</option>
                                        <option value="A">Activos</option>
                                        <option value="I">Inactivos</option>
                                    </select>
                                </div>   
                                <div class="col-xs-4 col-lg-2">
                                    <label>Buscar por RUC </label>
                                    <input id="txt-filtro-ruc" class="form-control" placeholder="Buscar por RUC....">
                                </div>  
                                <div class="col-xs-4 col-lg-3">
                                    <label>Buscar por Razón Social </label>
                                    <input id="txt-filtro-razonsocial" class="form-control" placeholder="Buscar por Razón Social...">
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
                                <input type="hidden" id="txtoperacion"  class="form-control">
                                <input type="hidden" id="txtcod_empresario"  class="form-control">                                            

                                <h4>Sobre la Empresa</h4>
                                <div class="row clearfix">
                                    <div class="col-sm-4">
                                         <div class="form-group form-float">
                                            <label class="form-label">RUC</label>
                                            <div class="form-line">
                                                <input type="text" id="txtruc" required class="form-control" autofocus maxlength="11">                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-12">
                                         <div class="form-group form-float">
                                            <label class="form-label">Razón Social</label>
                                            <div class="form-line">
                                                <input type="text" id="txtrazon_social" required class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row clearfix">
                                    <div class="col-sm-12">
                                         <div class="form-group form-float">
                                            <label class="form-label">Descripción Empresa</label>
                                            <div class="form-line">
                                                <textarea  id="txtdescripcion" class="form-control" ></textarea>                                         
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label class="form-label">Tipo Empresa</label>
                                            <select id="txtcod_tipo_empresa" required class="form-control selectpicker"></select>
                                        </div>
                                    </div>     
                                     <div class="col-sm-6">
                                        <div class="form-group">
                                            <label class="form-label">Sector Industrial</label>
                                            <select id="txtcod_sector_industrial" required class="form-control selectpicker"></select>
                                        </div>
                                    </div>                                                              
                                </div> 

                                <div class="row clearfix">
                                   <div class="col-sm-4">
                                         <div class="form-group form-float">
                                            <label class="form-label">Celular</label>
                                            <div class="form-line">
                                                <input type="text" id="txtcelular" required class="form-control" maxlength="9">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-8">
                                         <div class="form-group form-float">
                                            <label class="form-label">Domicilio</label>
                                            <div class="form-line">
                                                <textarea  id="txtdomicilio" class="form-control" ></textarea>                                         
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-4">
                                         <div class="form-group">
                                            <label class="form-label">Región</label>
                                            <div class="form-line">
                                                <select id="cboregion" required  class="form-control selectpicker">
                                                    <option value="">Seleccionar región</option>
                                                </select>                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                         <div class="form-group">
                                            <label class="form-label">Provincia</label>
                                            <div class="form-line">
                                                <select id="cboprovincia" required class="form-control selectpicker">
                                                    <option value="">Seleccionar provincia</option>
                                                </select>                                          
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                         <div class="form-group">
                                            <label class="form-label">Distrito</label>
                                            <div class="form-line">
                                                <select id="cbodistrito" class="form-control selectpicker">
                                                    <option value="">Seleccionar distrito</option>
                                                </select>                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h4>Sobre el Empresario</h4>

                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Nombres</label>
                                            <div class="form-line">
                                                <input type="text" id="txtnombres" required class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>    
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Apellidos</label>
                                            <div class="form-line">
                                                <input type="text" id="txtapellidos" required class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>                                                            
                                </div>  

                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Cargo en la Empresa</label>
                                            <div class="form-line">
                                                <select id="txtcod_cargo" required class="form-control selectpicker"></select>                                         
                                            </div>
                                        </div>
                                    </div>    
                                </div>  

                                <h4>Accesos</h4>
                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                        <div class="form-group">
                                            <label class="form-label">Correo</label>
                                            <div class="form-line">
                                                <input type="text" id="txtcorreo" required class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>     
                                    <div class="col-sm-6 clave-div">
                                        <div class="form-group">
                                            <label class="form-label">Clave</label>
                                            <div class="form-line">
                                                <input type="password" required id="txtclave" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>                                                              
                                </div>       
                                <div id="blk-alert-modal" tabindex="0"></div>
                            </div>
                        
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-success waves-effect">GRABAR</button>
                                <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">CERRAR</button>
                            </div>
                        </form>
                    </div>
                </div>
        </div>


        <div class="modal fade" id="modalClave" role="dialog" style="display: none;">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Cambiar Clave</h4>
                        </div>
                        <form name="frm-clave" id="frm-clave"  role="form">
                            <div class="modal-body">
                                <input type="hidden" id="txtcod_empresario_clave"  required class="form-control">                                            
                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group">
                                            <label class="form-label">Correo de Empresario</label>
                                            <p id="lbl-correo"></p>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                         <div class="form-group form-float">
                                            <label class="form-label">Nueva Clave</label>
                                            <div class="form-line">
                                                <input type="password" id="txtclave_cambio" required class="form-control" >
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                <div id="blk-alert-modal-clave" tabindex="0"></div>     
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

    <?php 
        include $rutaTemplate.'scripts-js.php';        
    ?>

</body>

</html>