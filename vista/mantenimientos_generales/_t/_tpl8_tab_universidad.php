<div class="row">
            <div class="col-xs-12 col-sm-8 col-lg-6">
                    <div class="card">
                        <div class="header">
                            <h2>Lista de Universidad </h2> 
                                <ul class="header-dropdown m-r--5">
                                    <li class="dropdown">
                                        <button type="button" onclick = "app.registroNuevo()" class="btn bg-blue waves-effect">Nuevo Registro</button>
                                    </li>
                                </ul>
                        </div>
                        <div class="body table-responsive">
                                    <table class="table">
                                            <thead>
                                                <tr>
                                                 <th style="width: 125px;">Opciones</th>                                
                                                <th >Descripción</th>                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <script type="handlebars-x" id="tpl8Universidad_Tabla">
                                             {{#.}}
                                                <tr>
                                                      <th>
                                                        <button type="button" onclick="app.editar({{cod_universidad}})" 
                                                            class="btn btn-sm bg-blue waves-effect"><i class="material-icons col-blue">edit</i></button>
                                                            <button type="button" onclick="app.eliminar({{cod_universidad}})" 
                                                            class="btn btn-sm bg-red waves-effect"><i class="material-icons col-red">delete</i></button>
                                                      </th>
                                                      <td>{{descripcion}}</td>                                
                                                </tr>
                                            {{/.}}
                                            {{^.}}
                                                <tr class="null-td">
                                                    <td colspan="2" class="text-center"><i>No hay universidades registradas</i> 
                                                </tr>
                                            {{/.}}
                                            </script>
                                        </tbody>
                                   </table>
                               
                        </div>                
                    </div>
            </div>
</div>  