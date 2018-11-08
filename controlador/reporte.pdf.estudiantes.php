<?php      

    require_once '../negocio/util/Funciones.php';           
    require_once '../datos/local_config.php';
    require_once '../negocio/AvisoLaboral.clase.php';

    $objAvisoLaboral = new AvisoLaboral();

try
{
    $fi = $_GET["p_fi"];
    $ff = $_GET["p_ff"];
    $sonTodos = $_GET["p_son_todos"];
    $codEstudiantes = $_GET["p_cods"];

    /*obtener data*/
        $dataReporte = $objAvisoLaboral->reporteAvisoLaboralEstudiante($fi,$ff,$sonTodos,$codEstudiantes);

        $datos = $dataReporte["r"];

        $html = '';
        $html .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        $html .= '<link rel="stylesheet" href="reporte.estilos.css" media="all">';
        $html .= '<header class="clearfix">';
        $html .= '<div id="logo">
                    <img src="../images/logo_mini.jpg" style="width:150px;padding: 10px;">
                  </div>';
        $html .= '<div id="fecha">
                    <div>Fecha y Hora: </div>
                    <div>'. date('d-m-Y H:m:s') .'</div>
                    <a href="#" onclick="window.print()">Imprimir</a>
                  </div>';
        $html .= '</header>';

        $html .= '<h1>Reporte de Estudiantes</h1>';

        $html .= '<table class="f-cabecera">';
        $html .= '<tbody>';                        
            $html .= '<tr><td colspan="3"> Reporte ';
            if ($sonTodos == "true"){
                $html .= 'de todas las fechas';
            } else {
            if ($fi == $ff){
                 $html .= ' de '.Funciones::fechear($fi);
                } else {
                 $html .= ' del '.Funciones::fechear($fi).' al '.Funciones::fechear($ff);
                }    
            }
          
            $html .= '</td></tr>'; 
        $html .= '</tbody>';   
        $html .= '</table>';

        $html.= '<hr>';

        $html.= '<h3>Convocatorias de Estudiantes</h3>';
        $html .='<table>';
        $html .= '<thead> 
                        <tr style="font-size.7em">
                        <th>N°</th> 
                        <th>TITULO CONVOCATORIA</th> 
                        <th>EMPRESA</th> 
                        <th>POSTULADO</th> 
                        <th>PRESELECC.</th> 
                        <th>RETIRADO</th>
                        <th>PUNTAJE</th>
                        <th>ESTADO</th>
                        </tr>
                    </thead>';
        $html .='<tbody>';    

        foreach ($datos as $key => $estudiantes) {
            $html .="<tr>";        
                $html .='<td colspan="8" class="celda-subtitulo">'.$estudiantes["estudiante"].'</td>';            
            $html .="</tr>"; 

            $ConvocatoriasEstudiante = $estudiantes["convocatorias"];
            if (count($ConvocatoriasEstudiante)>0){
              $i = 1;
              foreach ($ConvocatoriasEstudiante as $key => $convocatoria) {
                $html .="<tr class='tr-size-medium'>";        
                    $html .='<td>'.$i.'</td>';            
                    $html .='<td>'.$convocatoria["titulo"].'</td>';            
                    $html .='<td>'.$convocatoria["empresa"].'</td>';          
                    $html .='<td>'.$convocatoria["fecha_postulacion"].'</td>';   
                    $html .='<td>'.$convocatoria["fecha_preseleccion"].'</td>';            
                    $html .='<td>'.$convocatoria["fecha_retiro"].' </td>';            
                    $html .='<td>'.$convocatoria["puntaje"].'</td>';            
                    //$html .='<td>'.$convocatoria["puesto"].'</td>';            
                    $html .='<td>'.$convocatoria["estado"].'</td>';             
                $html .="</tr>";
                $i++;
                }   
            } else{
                $html .="<tr class='tr-size-medium'>";        
                    $html .='<td colspan="8"><i>Sin convocatorias registradas.</i></td>';              
                $html .="</tr>";
            }
                
        }
        $html .='</tbody>';

        $html .='</table>';

     echo $html;

}
catch (Exception $exc) {
    var_dump($exc->getMessage());        
}   

