<?php 
require_once '../datos/Conexion.clase.php';

class AvisoLaboralEstudiante extends Conexion {
    
    private $cod_aviso_laboral;
    private $cod_estudiante;

    public function getCodAvisoLaboral()
    {
        return $this->cod_aviso_laboral;
    }
    
    public function setCodAvisoLaboral($cod_aviso_laboral)
    {
        $this->cod_aviso_laboral = $cod_aviso_laboral;
        return $this;
    }

    public function getCodEstudiante()
    {
        return $this->cod_estudiante;
    }
    
    
    public function setCodEstudiante($cod_estudiante)
    {
        $this->cod_estudiante = $cod_estudiante;
        return $this;
    }

     public function obtenerPostulanteFormulario(){
        try {

            if (!isset($_SESSION["usuario"])){
                return ["rpt"=>false,"msj"=>"No hay token de usuario, acceso no autorizado."];
            }

            /*Cod Estudiante | Cod Aviso Laboral 
                1.- Prfil Estudiante
                2.- Formulario
                3.- Respuestas
                4.- RANK
            */

            if ($this->getCodEstudiante() == NULL){
                return ["rpt"=>false,"msj"=>"Código de estudiante inválido."];
            }

            $arCodEstudiante = [$this->getCodEstudiante()];

            if ($this->getCodAvisoLaboral() == NULL){
                return ["rpt"=>false,"msj"=>"Código de convocatoria inválido."];
            }

            $bloques = [["id"=>1,"nombre"=>"CONOCIMIENTOS","rotulo"=>"Conocimiento"],
                        ["id"=>2,"nombre"=>"HABILIDADES","rotulo"=>"Habilidad"],
                        ["id"=>3,"nombre"=>"DISPONIBILIDAD","rotulo"=>"Descripción"],
                        ["id"=>4,"nombre"=>"SALARIO","rotulo"=>"Descripción"]];

            $arAL = [$this->getCodAvisoLaboral()];
            $arALE = [$this->getCodAvisoLaboral(), $this->getCodEstudiante()];

            $sql = "SELECT COUNT(cod_aviso_laboral) > 0 FROM aviso_laboral_estudiante ale WHERE cod_aviso_laboral = :0 AND cod_estudiante = :1";
            $existe = $this->consultarValor($sql, $arALE);


            if (!$existe){
                return ["rpt"=>false,"msj"=>"Este estudiante no ha enviado formulario de esta convocatoria."];
            }

            $sql = "SELECT codigo_universitario,
                    CONCAT(nombres,' ',apellidos) as nombre_estudiante, img_perfil, 
                    correo, celular, (CASE sexo WHEN 'M' THEN 'Masculino' ELSE 'Femenino' END) as sexo,
                    domicilio, COALESCE(ub_d.nombre,'') as distrito,
                    COALESCE(DATE_PART('YEAR',AGE(fecha_nacimiento)),0) as edad,
                    COALESCE(u.descripcion,'No registrado') as universidad,
                    cu.descripcion as carrera
                    FROM estudiante e 
                    LEFT JOIN ubigeo_distrito ub_d ON e.cod_ubigeo_distrito = ub_d.cod_ubigeo_distrito AND e.cod_ubigeo_provincia = ub_d.cod_ubigeo_provincia AND  e.cod_ubigeo_region = ub_d.cod_ubigeo_region
                    LEFT JOIN carrera_universitaria cu on cu.cod_carrera_uni = e.cod_carrera_uni
                    LEFT JOIN universidad u on u.cod_universidad = e.cod_universidad
                    WHERE cod_estudiante = :0";

            $estudiante = $this->consultarFila($sql, $arCodEstudiante);

            $sql = "SELECT al.titulo
                        FROM aviso_laboral al 
                        WHERE al.cod_aviso_laboral = :0";

            $titulo_convocatoria = $this->consultarvalor($sql,$arAL);

            $respuestas = [];
            $sql = "SELECT fr.cod_pregunta as o , 
                        (CASE 
                            WHEN fr.valor_textual IS NULL THEN
                            fr.cod_opcion::numeric::text
                            ELSE
                            CONCAT(fr.valor_textual::numeric,' (',fr.valor_puntaje,')')
                        END) as v
                        FROM formulario_respuesta fr
                        INNER JOIN formulario_pregunta fp ON fp.cod_aviso_laboral = fr.cod_aviso_laboral AND fp.cod_pregunta = fr.cod_pregunta
                        WHERE fr.cod_aviso_laboral = :0 AND fr.cod_estudiante = :1
                        ORDER BY fp.categoria_pregunta, fp.item";


            $resultadoRespuestas = $this->consultarFilas($sql, $arALE);


            $i = 0;
            foreach ($bloques as $_ => $bloque){
                $sql = "SELECT fp.cod_pregunta, fp.categoria_pregunta,fp.item, fp.descripcion as nombre_pregunta, 
                        (SELECT array_to_json(array_agg(row_to_json( _opcs)))
                              FROM (
                                SELECT cod_opcion, rotulo, valor_asignado
                                FROM formulario_pregunta_opcion 
                                WHERE cod_pregunta = fp.cod_pregunta AND cod_aviso_laboral = fp.cod_aviso_laboral AND estado_mrcb = 1
                              ) _opcs) as opciones_json
                        ,(SELECT COALESCE(nombre_archivo_original,'') FROM formulario_respuesta_archivo fra 
                        WHERE fra.cod_aviso_laboral = fp.cod_aviso_laboral AND fra.cod_pregunta = fp.cod_pregunta AND fra.cod_estudiante = :2 ) as nombre_archivo
                        ,
                        (SELECT url_archivo FROM formulario_respuesta_archivo fra 
                        WHERE fra.cod_aviso_laboral = fp.cod_aviso_laboral AND fra.cod_pregunta = fp.cod_pregunta AND fra.cod_estudiante = :2 ) as url_archivo
                        FROM formulario_pregunta fp
                        WHERE cod_aviso_laboral = :0 AND categoria_pregunta = :1
                        ORDER BY categoria_pregunta, fp.item";

                $preguntas = $this->consultarFilas($sql,[$this->getCodAvisoLaboral(), $bloque["id"], $this->getCodEstudiante()]);

                foreach ($preguntas as $key => $value) {            
                    $preguntas[$key]["opciones"] = json_decode($value["opciones_json"]);
                    if ($existe){
                       $objRpta = $resultadoRespuestas[$i];
                       $respuestas["o_".$value["categoria_pregunta"]."_".$objRpta["o"]] = $objRpta["v"]."";
                    }

                    $i++;
                }

                //$i += count($preguntas);
                $bloques[$_]["preguntas"] = $preguntas;

            }

            $resultado["bloques"] = $bloques;

            /*falta blqoue de RANK y puntaje
            1.- Puntaje
            2.- Color_rank
            3.- Rank
            4.- Total_Rank
            5.- Estado    
            */
            $objRank;
            $sql = "SELECT 
                    t.cod_estudiante, 
                    t.puntaje,
                    t.estado,
                    RANK() OVER (ORDER BY puntaje DESC) as rank
                    FROM (SELECT    
                       cod_estudiante,
                       (SELECT SUM(valor_puntaje)::integer
                        FROM formulario_respuesta 
                        WHERE cod_aviso_laboral = ale.cod_aviso_laboral AND 
                        cod_estudiante = ale.cod_estudiante
                        GROUP BY cod_aviso_laboral, cod_estudiante) as puntaje,
                     estado
                    FROM aviso_laboral_estudiante ale
                    WHERE cod_aviso_laboral = :0 
                    ORDER BY puntaje DESC) t";
            $rankFilas = $this->consultarFilas($sql, [$this->getCodAvisoLaboral()]);        
            $totalRank = count($rankFilas);

            foreach ($rankFilas as $key => $value) {
                if ($value["cod_estudiante"] == $this->getCodEstudiante()){
                    $porc = $value["rank"] / $totalRank;
                    if ($porc > .5){
                        $color = "red";
                    } else if ($porc > .25){
                        $color = "amber";
                    } else {
                        $color = "green";
                    }
                    $objRank = ["estado"=>$value["estado"], "puntaje"=>$value["puntaje"], "color_rank"=>$color, "rank"=>$value["rank"], "total_rank"=>$totalRank];
                }
            }

            return array("rpt"=>true,"r"=>["postulante"=>$estudiante,
                                           "rank" => $objRank
                                           ,"formulario_preguntas"=>["titulo_convocatoria"=>$titulo_convocatoria,"bloques"=>$bloques]
                                           ,"respuestas"=>$respuestas]);

        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function guardarFormularioEstudiante($respuestasJSON, $arregloArchivos)
    {
        try {
            $this->beginTransaction();
            /*Llegan como JSON */
            $respuestas = json_decode($respuestasJSON);
            $this->setCodEstudiante($_SESSION["usuario"]["cod_usuario"]);

            /*Checar si ya no existe.*/
            $sql = "SELECT COUNT(cod_aviso_laboral) > 0 FROM aviso_laboral_estudiante WHERE cod_aviso_laboral = :0 AND cod_estudiante = :1";
            $existe = $this->consultarValor($sql, [$this->getCodAvisoLaboral(), $this->getCodEstudiante()]);

            if ($existe){
                return ["rpt"=>false, "msj"=>"Ya ha enviado una postulación. No se puede enviar de nuevo."];
            }

            $sql = "SELECT COUNT(cod_pregunta)::integer FROM formulario_pregunta WHERE cod_aviso_laboral = :0 AND estado_mrcb = 1";
            $numeroPreguntas = $this->consultarValor($sql, [$this->getCodAvisoLaboral()]);

            $campos_valores = ["cod_aviso_laboral"=> $this->getCodAvisoLaboral(),
                                "cod_estudiante"=>$this->getCodEstudiante()];

            $this->insert("aviso_laboral_estudiante", $campos_valores);

            if (count(get_object_vars($respuestas)) < $numeroPreguntas){
                $this->rollBack();    
                return ["rpt"=>false, "msj"=>"No se han enviado todas las respuestas del formulario."];
            }

            $i = 0;
            foreach ($respuestas as $key => $value) {
                $cp = explode("_",$key); /*0: o, 1: categoria_pregunta, 2: codigo_pregunta*/

                if ($cp[1] == 4){
                  /*Si es salario se va a recibir el valor que está en un input. Ergo es un monto. Por lo tanto  este monto 
                    va a filtrarse entre las opciones disponibles, siempre con la regla menor igual. Si la opcion es 0 (se paso el limite), 
                    entonces el valor_puntaje tb es 0, esto solo aplica con las preguntas categoria 4.*/
                    $sql = "SELECT cod_opcion, valor_asignado FROM formulario_pregunta_opcion
                        WHERE cod_aviso_laboral = :0 and cod_pregunta = :1 and rotulo::numeric >= :2
                        ORDER by rotulo::numeric ASC
                        LIMIT 1";

                    $_puntaje = $this->consultarFila($sql,[$this->getCodAvisoLaboral(), $cp[2], $value]);

                    if ($_puntaje == false){
                        $codOpcion = 0;
                        $valorPuntaje = 0;
                    } else {
                        $codOpcion = $_puntaje["cod_opcion"];
                        $valorPuntaje = $_puntaje["valor_asignado"];
                    }

                    $valorTextual = $value;

                } else {
                    $sql = "SELECT valor_asignado FROM formulario_pregunta_opcion 
                        WHERE cod_opcion = :0 AND cod_pregunta = :1 AND cod_aviso_laboral = :2";
                    $valorPuntaje = $this->consultarValor($sql,[$value, $cp[2], $this->getCodAvisoLaboral()]);
                    $codOpcion = $value;
                    $valorTextual = NULL;
                    
                }

                
                $campos_valores = [ "cod_aviso_laboral"=> $this->getCodAvisoLaboral(),
                                        "cod_estudiante"=>$this->getCodEstudiante(),
                                        "cod_pregunta"=>$cp[2],
                                        "cod_opcion"=>$codOpcion,
                                        "valor_puntaje"=>$valorPuntaje,
                                        "valor_textual"=>$valorTextual
                                        ];    

                $this->insert("formulario_respuesta", $campos_valores);


                if ( $cp[1] < 3 && isset($arregloArchivos[$key])){
                    /*Tiene archivos*/
                    $objRespuestaArchivo = $arregloArchivos[$key];
                    $urlArchivo = "FL"."_".$this->getCodAvisoLaboral()."_".$this->getCodEstudiante()."_".$cp[2].".".$objRespuestaArchivo["ext"];
                    $campos_valores = ["cod_aviso_laboral"=> $this->getCodAvisoLaboral(),
                                       "cod_estudiante"=>$this->getCodEstudiante(),
                                       "cod_pregunta"=>$cp[2],
                                       "numero_archivo"=>1, /*Por defecto 1 ,porque por ahora consideramos solo 1 archivo.*/
                                       "url_archivo"=>$urlArchivo,
                                       "nombre_archivo_original"=>$objRespuestaArchivo["nombre"]
                                        ];    

                    $rpta = $this->insert("formulario_respuesta_archivo", $campos_valores);

                    if ($rpta = !1) {
                        $this->rollBack();
                        return ["rpt"=>false, "msj"=>"Problema al registrar el archivo de la pregunta N° ".$cp[2]];
                    }

                    if (!move_uploaded_file($objRespuestaArchivo["tmp"], "../images/files/$urlArchivo")) {
                        $this->rollBack();
                        return ["rpt"=>false, "msj"=>"Problema al subir un archivo de la pregunta N° ".$cp[2]];
                    }

                }

                $i++;
            }
            /*Si todo  ok calcular sumatorai de puntaje.*/
            $this->commit();
            return ["rpt"=>true, "msj"=>"¡Formulario enviado correctamente!"];
        } catch (Exception $exc) {
            $this->rollBack();
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }


    public function obtenerMisAvisosLaboralesEstudiante(){
        try {
            if (!isset($_SESSION["usuario"])){
                return ["rpt"=>false,"msj"=>"No hay token de usuario."];
            }
            $codEstudiante = $_SESSION["usuario"]["cod_usuario"];
            $arCodEstudiante = [$codEstudiante];

            $sql = "SELECT  COUNT((CASE estado WHEN 'S' THEN cod_estudiante ELSE NULL END)) as seleccionados,
                            COUNT(cod_estudiante) as totales
                            FROM aviso_laboral_estudiante ale WHERE ale.cod_estudiante = :0";
            $totales = $this->consultarFila($sql,$arCodEstudiante);

            $sql = "SELECT 
                    al.cod_aviso_laboral,
                    CONCAT(e.razon_social) as nombre_empresa,
                    al.titulo,
                    TO_CHAR(fecha_postulacion,'dd/mm/YYYY') as fecha_postulacion,
                    ale.estado,
                    (CASE ale.estado WHEN 'P' THEN 'POSTULADO' WHEN 'S' THEN 'PRESELECCIONADO' WHEN 'R' THEN 'RETIRADO' ELSE 'ERROR' END) as estado_rotulo,
                    (CASE ale.estado WHEN 'P' THEN 'amber' WHEN 'S' THEN 'green' WHEN 'R' THEN 'red' ELSE 'gray' END) as estado_color,
                    al.fecha_vencimiento >= current_date as vencido
                    FROM aviso_laboral_estudiante ale
                    INNER JOIN aviso_laboral al ON al.cod_aviso_laboral = ale.cod_aviso_laboral
                    INNER JOIN empresario e ON al.cod_empresario = e.cod_empresario
                    WHERE ale.cod_estudiante = :0
                    ORDER BY DATE(fecha_postulacion) DESC";

            $resultado = $this->consultarFilas($sql,$arCodEstudiante);

            return array("rpt"=>true,"r"=>["postulaciones"=>$resultado, "total_postulados"=>$totales["totales"], "total_seleccionados"=>$totales["seleccionados"]]);

        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function preseleccionar(){
        try {
            /*  
                1.- Aviso Laboral existe?
                2.- Existe postulancion de este estudiante=?
                2.5.- 
                3.- Cambiar estado
                4.- Enviar correo.
            */

            $sql  = "SELECT COUNT(cod_aviso_laboral) > 0 FROM aviso_laboral WHERE cod_aviso_laboral = :0 AND estado_mrcb = 1 AND fecha_vencimiento >= current_date";
            $existe = $this->consultarValor($sql, [$this->getCodAvisoLaboral()]);

            if (!$existe){
                return ["rpt"=>false,"msj"=>"Convocatoria no válida."];
            }

            $ALE = [$this->getCodAvisoLaboral(), $this->getCodEstudiante()];

            $sql  = "SELECT cod_estudiante, estado FROM aviso_laboral_estudiante WHERE cod_aviso_laboral = :0 AND cod_estudiante = :1";
            $existe = $this->consultarFila($sql, $ALE);

            if (!$existe){
                return ["rpt"=>false,"msj"=>"Estudiante en convocatoria no válido."];
            } 

            switch($existe["estado"]){
                case "R":
                    return ["rpt"=>false,"msj"=>"Estudiante ya RETIRADO de la convocatoria."];
                break;
                case "S":
                    return ["rpt"=>false,"msj"=>"Estudiante ya PRESELECCIONADO en la convocatoria."];
                break;
            }

            $campos_valores = ["estado" => 'S', "fecha_seleccion"=> date("Y-m-d")];
            $campos_valores_where = ["cod_aviso_laboral" => $this->getCodAvisoLaboral(), "cod_estudiante" => $this->getCodEstudiante()];
        
            $this->update("aviso_laboral_estudiante", $campos_valores, $campos_valores_where);     

            $sql = "SELECT 
                            CONCAT(nombres,' ',apellidos) as nombres_estudiante, correo,
                            titulo as convocatoria
                            FROM aviso_laboral_estudiante ale 
                            INNER JOIN estudiante e ON ale.cod_estudiante = e.cod_estudiante
                            INNER JOIN aviso_laboral al ON al.cod_aviso_laboral = ale.cod_aviso_laboral
                            WHERE ale.cod_aviso_laboral = :0 AND ale.cod_estudiante = :1";

            $estudiante = $this->consultarFila($sql, $ALE);
            require_once 'Mensaje.clase.php';
            $objMensaje = new Mensaje();
            $objMensaje->setPara($estudiante);     
            $objMensaje->enviarCorreo("PRESELECCIONAR");        
            return array("rpt"=>true,"msj"=>"Estudiante preseleccionado.");

        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function retirarse(){
          /*  
                1.- Aviso Laboral VIGENTE existe?
                2.- Existe postulancion de este estudiante=?
                2.5.- No está preseleccionado.
                3.- Cambiar estado
            */
        try{

            if (!isset($_SESSION["usuario"])){
                return ["rpt"=>false,"msj"=>"No hay token de usuario estudiante."];
            }
            $this->setCodEstudiante($_SESSION["usuario"]["cod_usuario"]);

            $sql  = "SELECT COUNT(cod_aviso_laboral) > 0 FROM aviso_laboral WHERE cod_aviso_laboral = :0 AND estado_mrcb = 1 AND fecha_vencimiento >= current_date";
            $existe = $this->consultarValor($sql, [$this->getCodAvisoLaboral()]);

            if (!$existe){
                return ["rpt"=>false,"msj"=>"Convocatoria no válida."];
            }

            $ALE = [$this->getCodAvisoLaboral(), $this->getCodEstudiante()];

            $sql  = "SELECT cod_estudiante, estado FROM aviso_laboral_estudiante WHERE cod_aviso_laboral = :0 AND cod_estudiante = :1";
            $existe = $this->consultarFila($sql, $ALE);

            if (!$existe){
                return ["rpt"=>false,"msj"=>"Estudiante en convocatoria no válido."];
            } 

            switch($existe["estado"]){
                case "R":
                    return ["rpt"=>false,"msj"=>"Estudiante ya RETIRADO de la convocatoria."];
                break;
                case "S":
                    return ["rpt"=>false,"msj"=>"Estudiante ya PRESELECCIONADO en la convocatoria."];
                break;
            }

            $campos_valores = ["estado" => 'R', "fecha_retiro"=> date("Y-m-d")];
            $campos_valores_where = ["cod_aviso_laboral" => $this->getCodAvisoLaboral(), "cod_estudiante" => $this->getCodEstudiante()];
        
            $this->update("aviso_laboral_estudiante", $campos_valores, $campos_valores_where);     
      
            return array("rpt"=>true,"msj"=>"Postulación RETIRADA correctamente.");

        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }
}