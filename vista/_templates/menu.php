  <div class="menu">
                <ul class="list">
                    <li class="header">MENÚ PRINCIPAL</li>
                    <?php  echo $objAcceso->getMenu();?>
                    <li class="header">OPCIONES</li>
                    <li>
                        <a href="javascript:void(0);" onclick="Util.cerrarSesion();"  class="waves-effect waves-block">
                            <i class="material-icons col-blue">donut_large</i>
                            <span>Cerrar Sesión</span>
                        </a>
                    </li>
                </ul>
            </div>