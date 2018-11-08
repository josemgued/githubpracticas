<?php      

    require_once '../negocio/util/Funciones.php';           
    require_once '../datos/local_config.php';
    require_once '../negocio/AvisoLaboral.clase.php';

    $objAvisoLaboral = new AvisoLaboral();

try
{
        $codConvocatoria = $_GET["p_cod"];

    /*obtener data*/
        $dataReporte = $objAvisoLaboral->reporteAvisoLaboralEmpresarioEstudiantes($codConvocatoria)["r"];
        $convocatoria = $dataReporte["aviso_laboral"];
        $estudiantes = $dataReporte["estudiantes"];

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

        $html .= '<h1>Reporte de Convocatorias</h1>';

        $html .= '<table class="f-cabecera">';
        $html .= '<tbody>'; 
            $html .= '<tr>';   
            $html .= '<td style="font-size:1.3em; padding-top:1em">Título Convocatoria: '.$convocatoria["titulo"].' </td></tr>';
            $html .= '<tr><td style="font-size:1.1em; padding-top:.5em">Empresario: '.$convocatoria["empresario"].' </td>';
            $html .= '</tr>';
        $html .= '</tbody>';   
        $html .= '</table>';

        $html.= '<hr>';

        $html.= '<h3>Postulantes</h3>';
        $html .='<table>';
        $html .= '<thead> 
                        <tr style="font-size.9em">
                        <th>N°</th> 
                        <th>ESTUDIANTE</th> 
                        <th>PUNTAJE</th> 
                        <th>FECHA POSTULACION</th>
                        <th>FECHA PRESELECCIONADO</th>
                        <th>FECHA RETIRO</th>
                        <th>ESTADO</th>
                        </tr>
                    </thead>';
        $html .='<tbody>';    

        if (count($estudiantes)>0){
              $i = 1;
              foreach ($estudiantes as $key => $convocatoria) {
                $html .="<tr class='tr-size-medium'>";        
                    $html .='<td>'.$i.'</td>';            
                    $html .='<td>'.$convocatoria["estudiante"].'</td>';            
                    $html .='<td>'.$convocatoria["puntaje"].'</td>';   
                    $html .='<td>'.$convocatoria["fecha_postulacion"].'</td>';            
                    $html .='<td>'.$convocatoria["fecha_seleccion"].'</td>';            
                    $html .='<td>'.$convocatoria["fecha_retiro"].'</td>';            
                    $html .='<td>'.$convocatoria["estado"].'</td>';             
                $html .="</tr>";
                $i++;
                }   
            } else{
                $html .="<tr class='tr-size-medium'>";        
                    $html .='<td colspan="8"><i>Sin estudiantes postulados.</i></td>';
                $html .="</tr>";
            }
        $html .='</tbody>';

        $html .='</table>';

     echo $html;

}
catch (Exception $exc) {
    var_dump($exc->getMessage());        
}   

