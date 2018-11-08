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
    <title>Gestión de Estudiantes |  <?php echo SW_NOMBRE; ?> </title>

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
                    MANTENIMIENTO DE ESTUDIANTE              
                </h2>
            </div>
            <!-- Basic Examples -->
            <div class="row clearfix">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="card">
                        <div class="header">
                            <h2>
                                Listado de Estudiantes
                            </h2>
                            <ul class="header-dropdown m-r--5">
                                <li class="dropdown">
                                    <button id="btnAgregar" type="button" class="btn bg-blue waves-effect" data-toggle="modal" data-target="#myModal" title="Registrar Nuevo Estudiante">NUEVO REGISTRO</button> 
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
                                        <option value="1">Validados</option>
                                        <option value="0">No Validados</option>
                                    </select>
                                </div>   
                                <div class="col-xs-4 col-lg-2">
                                    <label>Buscar por DNI/Cod.Univ. </label>
                                    <input id="txt-filtro-dni" class="form-control" placeholder="Buscar por DNI/Cod.Univ....">
                                </div>  
                                <div class="col-xs-4 col-lg-3">
                                    <label>Buscar por Nombres </label>
                                    <input id="txt-filtro-apellidos" class="form-control" placeholder="Buscar por Nombres...">
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
                                <input type="hidden" id="txtcod_estudiante"  class="form-control">                                            
                                <div class="row clearfix">
                                    <div class="col-sm-4">
                                         <div class="form-group form-float">
                                            <label class="form-label">DNI</label>
                                            <div class="form-line">
                                                <input type="text" id="txtdni" required class="form-control" autofocus maxlength="8">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                         <div class="form-group form-float">
                                            <label class="form-label">Codigo Universitario</label>
                                            <div class="form-line">
                                                <input type="text" id="txtcodigo_universitario" required class="form-control"  maxlength="11">
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                    <div class="col-sm-4">
                                         <div class="form-group form-float">
                                            <label class="form-label">Celular</label>
                                            <div class="form-line">
                                                <input type="text" id="txtcelular" required class="form-control" maxlength="9">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                         <div class="form-group form-float">
                                            <label class="form-label">Fecha Nacimiento</label>
                                            <div class="form-line">
                                                <input type="date" required id="txtfecha_nacimiento" class="form-control">                                           
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                         <div class="form-group form-float">
                                            <label class="form-label">Sexo</label>
                                            <div class="form-line">
                                                <select id="cbosexo" required class="form-control selectpicker">
                                                    <option value="F">Femenino</option>
                                                    <option value="M">Masculino</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row clearfix">
                                    <div class="col-sm-12">
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
                                <div class="row clearfix">
                                    <div class="col-sm-8">
                                        <div class="form-group">
                                            <label class="form-label">Carrera</label>
                                            <select id="txtcod_carrera" required class="form-control selectpicker"></select>
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
                                <input type="hidden" id="txtcod_estudiante_clave"  required class="form-control">                                            
                                <div class="row clearfix">
                                    <div class="col-sm-6">
                                         <div class="form-group">
                                            <label class="form-label">Correo</label>
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