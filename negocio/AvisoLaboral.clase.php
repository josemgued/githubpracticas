<?php

require_once '../datos/Conexion.clase.php';

class AvisoLaboral extends Conexion {
    
    private $cod_aviso_laboral;
    private $cod_carrera_uni;
    private $cod_empresario;

    public function getCodAvisoLaboral()
    {
        return $this->cod_aviso_laboral;
    }
    
    public function setCodAvisoLaboral($cod_aviso_laboral)
    {
        $this->cod_aviso_laboral = $cod_aviso_laboral;
        return $this;
    }

    public function getCodCarreraUni()
    {
        return $this->cod_carrera_uni;
    }
    
    
    public function setCodCarreraUni($cod_carrera_uni)
    {
        $this->cod_carrera_uni = $cod_carrera_uni;
        return $this;
    }

    public function getCodEmpresario()
    {
        return $this->cod_empresario;
    }
    
    
    public function setCodEmpresario($cod_empresario)
    {
        $this->cod_empresario = $cod_empresario;
        return $this;
    }
    public function buscarAvisos($dataJSON){
        try {

            $data = json_decode($dataJSON);
            $vigencia = count($data->chkvigencia);

            $params = [];
            $sqlWhere = "";

            if (!$vigencia){
                $params = [$data->txtfechai, $data->txtfechaf];
                $sqlWhere = " AND ((fecha_lanzamiento > :0 OR fecha_lanzamiento >=  :1 )    
                            OR (fecha_vencimiento > :0 OR fecha_vencimiento >= :1)) ";
            } else{
                $sqlWhere = " AND fecha_vencimiento > current_date "; 
            }

            if ($data->txtcarrera != "0"){
                $sqlWhere .= " AND al.cod_carrera_uni = :2 ";
                array_push($params, $data->txtcarrera);
            }
            $postBuscar = strtolower(rtrim($data->txtbuscar));

            $sql = "SELECT 
                        al.cod_aviso_laboral as codigo,
                        e.razon_social as empresa,
                        al.titulo as titulo,
                        TO_CHAR(fecha_lanzamiento, 'DD/MM/YYYY') as fecha_lanzamiento,
                        (CASE WHEN fecha_vencimiento <= current_date THEN 'NO VIGENTE' ELSE 'VIGENTE' END)  as estado_rotulo,
                        (CASE WHEN fecha_vencimiento <= current_date THEN 'red' ELSE 'green' END) as estado_color
                        FROM aviso_laboral al 
                        INNER JOIN carrera_universitaria cu ON al.cod_carrera_uni = cu.cod_carrera_uni
                        INNER JOIN empresario e ON e.cod_empresario = al.cod_empresario

                        WHERE (LOWER(al.descripcion_aviso) LIKE '%".$postBuscar."%' OR LOWER(al.titulo) LIKE '%".$postBuscar."%') "                      
                            .$sqlWhere." AND al.estado_mrcb = 1 AND al.estado =  'A' ORDER  BY fecha_lanzamiento";

            $resultado = $this->consultarFilas($sql,$params);
            return array("rpt"=>true,"data"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function consultarOntologia($cadena){
        try {

            $postBuscar = strtolower(rtrim($cadena));
            $sql = "SELECT 
                        al.titulo as titulo
                        FROM aviso_laboral al 
                        INNER JOIN carrera_universitaria cu ON al.cod_carrera_uni = cu.cod_carrera_uni
                        INNER JOIN empresario e ON e.cod_empresario = al.cod_empresario
                        WHERE (LOWER(al.descripcion_aviso) LIKE '%".$postBuscar."%' OR LOWER(al.titulo) LIKE '%".$postBuscar."%') ".
                        " AND al.estado_mrcb = 1 AND al.estado =  'A' ORDER  BY fecha_lanzamiento
                        LIMIT 6";

            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"data"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function obtenerAvisoLaboralEstudiante(){
        try {

            $codEstudiante = $_SESSION["usuario"]["cod_usuario"];
            if (!isset($codEstudiante)){
                return ["rpt"=>false,"msj"=>"No hay token de usuario."];
            }

            $sql = "SELECT COUNT(cod_estudiante) > 0 FROM aviso_laboral_estudiante WHERE cod_aviso_laboral = :0 AND cod_estudiante = :1";
            $v = $this->consultarValor($sql,[$this->getCodAvisoLaboral(), $codEstudiante]);

            $sql = "SELECT al.titulo,cu.descripcion as carrera, e.razon_social as nombre_empresa, e.descripcion_empresa, al.descripcion_aviso, al.domicilio_aviso,
                        TO_CHAR(fecha_lanzamiento, 'DD/MM/YYYY') as fecha_lanzamiento,
                        TO_CHAR(fecha_vencimiento, 'DD/MM/YYYY') as fecha_vencimiento,
                        COALESCE(ubi_r.nombre,'-') as region, COALESCE(ubi_p.nombre,'-') as provincia, COALESCE(ubi_d.nombre,'-') as distrito,
                        fecha_vencimiento <= current_date as vencido
                        FROM aviso_laboral al 
                        INNER JOIN carrera_universitaria cu ON al.cod_carrera_uni = cu.cod_carrera_uni
                        INNER JOIN empresario e ON e.cod_empresario = al.cod_empresario                        
                        LEFT JOIN ubigeo_region ubi_r ON ubi_r.cod_ubigeo_region = al.cod_ubigeo_region
                        LEFT JOIN ubigeo_provincia ubi_p ON ubi_p.cod_ubigeo_provincia = al.cod_ubigeo_provincia AND ubi_p.cod_ubigeo_region = al.cod_ubigeo_region
                        LEFT JOIN ubigeo_distrito ubi_d ON ubi_d.cod_ubigeo_distrito = al.cod_ubigeo_distrito AND ubi_d.cod_ubigeo_region = al.cod_ubigeo_region AND ubi_d.cod_ubigeo_provincia = al.cod_ubigeo_provincia AND ubi_d.cod_ubigeo_region = al.cod_ubigeo_region                       
                        WHERE al.cod_aviso_laboral = :0";

            $resultado = $this->consultarFila($sql,[$this->getCodAvisoLaboral()]);

            return array("rpt"=>true,"r"=>$resultado,"v"=>$v);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function obtenerAvisoLaboral(){
        try {

            $sql = "SELECT al.titulo,cu.descripcion as carrera, e.razon_social as nombre_empresa, e.descripcion_empresa, al.descripcion_aviso, al.domicilio_aviso,
                        TO_CHAR(fecha_lanzamiento, 'DD/MM/YYYY') as fecha_lanzamiento,
                        TO_CHAR(fecha_vencimiento, 'DD/MM/YYYY') as fecha_vencimiento,
                        COALESCE(ubi_r.nombre,'-') as region, COALESCE(ubi_p.nombre,'-') as provincia, COALESCE(ubi_d.nombre,'-') as distrito
                        FROM aviso_laboral al 
                        INNER JOIN carrera_universitaria cu ON al.cod_carrera_uni = cu.cod_carrera_uni
                        INNER JOIN empresario e ON e.cod_empresario = al.cod_empresario                        
                        LEFT JOIN ubigeo_region ubi_r ON ubi_r.cod_ubigeo_region = al.cod_ubigeo_region
                        LEFT JOIN ubigeo_provincia ubi_p ON ubi_p.cod_ubigeo_provincia = al.cod_ubigeo_provincia AND ubi_p.cod_ubigeo_region = al.cod_ubigeo_region
                        LEFT JOIN ubigeo_distrito ubi_d ON ubi_d.cod_ubigeo_distrito = al.cod_ubigeo_distrito AND ubi_d.cod_ubigeo_region = al.cod_ubigeo_region AND ubi_d.cod_ubigeo_provincia = al.cod_ubigeo_provincia AND ubi_d.cod_ubigeo_region = al.cod_ubigeo_region                       
                        WHERE al.cod_aviso_laboral = :0";

            $resultado = $this->consultarFila($sql,[$this->getCodAvisoLaboral()]);

            return array("rpt"=>true,"r"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function cargarDatosFormularioInicial(){
        try {

            /*ubigeo regiones, carreras, */
            $sql = "SELECT  cod_ubigeo_region as codigo, nombre FROM ubigeo_region";
            $regiones = $this->consultarFilas($sql);

            $sql = "SELECT cod_carrera_uni as codigo, descripcion FROM carrera_universitaria WHERE estado_mrcb = 1 ORDER BY descripcion";
            $carreras = $this->consultarFilas($sql);

            return array("rpt"=>true,"data"=>["regiones"=>$regiones,"carreras"=>$carreras]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function guardarAvisoLaboral($datosJSON, $formularioJSON)
    {
        try {

            $this->beginTransaction();
            /*Llegan como JSON */
            $datos = json_decode($datosJSON);
            $bloqueLista = json_decode($formularioJSON);

            $codEmpresario = $_SESSION["usuario"]["cod_usuario"];
            $this->setCodAvisoLaboral($this->consultarValor("SELECT COALESCE(MAX(cod_aviso_laboral)+1, 1) FROM aviso_laboral"));

            $campos_valores = ["cod_aviso_laboral"=> $this->getCodAvisoLaboral(),
                                "titulo"=> $datos->txttitulo,
                                "descripcion_aviso"=>$datos->txtdescripcion,
                                "domicilio_aviso"=>$datos->txtdireccion,
                                "cod_carrera_uni"=>$datos->txtcarrera,
                                "fecha_lanzamiento"=>$datos->txtfechalanzamiento,
                                "fecha_vencimiento"=>$datos->txtfechavencimiento,
                                "cod_ubigeo_region"=>$datos->txtregion,
                                "cod_ubigeo_provincia"=>$datos->txtprovincia,
                                "cod_ubigeo_distrito"=>$datos->txtdistrito,
                                "cod_empresario"=>$codEmpresario];

            $this->insert("aviso_laboral", $campos_valores);

            /*Se procede a registrar las preguntas*/

            $i = 1;
            foreach ($bloqueLista as $key => $bloque) {

                foreach ($bloque->preguntas as $key_ => $pregunta) {

                    $campos_valores_preguntas = ["cod_pregunta"=>$i,          
                                                    "cod_aviso_laboral"=>$this->getCodAvisoLaboral(),
                                                    "item"=>$pregunta->n,
                                                    "descripcion"=>$pregunta->nombre_pregunta,
                                                    "categoria_pregunta"=>$bloque->id
                                                    ];
                    $this->insert("formulario_pregunta",$campos_valores_preguntas);


                    $j = 1;
                    foreach ($pregunta->opciones as $_key => $opcion) {

                        $campos_valores_opciones = ["cod_aviso_laboral"=>$this->getCodAvisoLaboral(),
                                                    "cod_pregunta"=>$i,
                                                    "cod_opcion"=> $j,
                                                    "rotulo"=>$opcion->descripcion,
                                                    "valor_asignado"=>$opcion->valor];
                        $this->insert("formulario_pregunta_opcion", $campos_valores_opciones);
                        $j++;
                    }

                    $i++;
                }

            }

            $this->commit();
            return array("rpt"=>true, "msj"=>"¡Convocatoria registrada correctamente!");
        } catch (Exception $exc) {
            $this->rollBack();
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function cancelar()
    {
        try {
            /*Llegan como JSON */
            $campos_valores = ["estado"=>"X"];
            $campos_valores_where = ["cod_aviso_laboral"=> $this->getCodAvisoLaboral()];

            $this->update("aviso_laboral", $campos_valores, $campos_valores_where);

            $avisosFeedback = $this->listarAvisosEmpresario()["r"];

            return array("rpt"=>true, "msj"=>"¡Convocatoria cancelada!","r"=>$avisosFeedback);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function buscarAvisosEmpresario($cadenaBusqueda){
        try {

            $this->setCodEmpresario($_SESSION["usuario"]["cod_usuario"]);

            $sql = "SELECT cod_aviso_laboral as codigo, titulo, TO_CHAR(fecha_lanzamiento, 'DD/MM/YYYY') as fecha_lanzamiento,
                        TO_CHAR(fecha_vencimiento, 'DD/MM/YYYY') as fecha_vencimiento, 
                        cu.descripcion as carrera, estado
                        FROM aviso_laboral al
                        INNER JOIN carrera_universitaria cu ON al.cod_carrera_uni = cu.cod_carrera_uni
                        WHERE al.cod_empresario = :0 AND al.estado_mrcb = 1 AND al.estado <> 'X' AND titulo LIKE  '%".$cadenaBusqueda."%' OR descripcion_aviso  LIKE  '%".$cadenaBusqueda."%'";

            $resultado = $this->consultarFilas($sql, [$this->getCodEmpresario()]);
            return array("rpt"=>true,"r"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function listarAvisosEmpresario(){
        try {

            if (!isset($_SESSION["usuario"])){
                return ["rpt"=>false,"msj"=>"No hay token de usuario."];
            }

            $this->setCodEmpresario($_SESSION["usuario"]["cod_usuario"]);

            $sql = "SELECT cod_aviso_laboral as codigo, titulo, al.descripcion_aviso as descripcion,
                        TO_CHAR(fecha_lanzamiento, 'DD/MM/YYYY') as fecha_lanzamiento,
                        TO_CHAR(fecha_vencimiento, 'DD/MM/YYYY') as fecha_vencimiento, 
                        fecha_lanzamiento < current_date as iniciado,
                        cu.descripcion as carrera, estado
                        FROM aviso_laboral al
                        INNER JOIN carrera_universitaria cu ON al.cod_carrera_uni = cu.cod_carrera_uni
                        WHERE al.cod_empresario = :0 AND al.estado_mrcb = 1 AND al.estado <> 'X'  AND fecha_vencimiento >= current_date
                        ORDER BY DATE(fecha_lanzamiento)";

            $resultado = $this->consultarFilas($sql, [$this->getCodEmpresario()]);
            return array("rpt"=>true,"r"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }


    public function listarPostulantes(){
        try {
            $codAL = $this->getCodAvisoLaboral();        

            $sql = "SELECT al.titulo,
                         (SELECT      
                            SUM(t_.max_valor)
                            FROM
                            (SELECT cod_pregunta, MAX(valor_asignado) as max_valor
                            FROM formulario_pregunta_opcion
                            WHERE cod_aviso_laboral = al.cod_aviso_laboral  AND estado_mrcb = 1
                            GROUP BY cod_aviso_laboral, cod_pregunta) t_) as total_puntaje
                    FROM aviso_laboral al WHERE cod_aviso_laboral = :0";

            $convocatoria = $this->consultarFila($sql, [$codAL]);

             $sql = "SELECT 
                        e.cod_estudiante, CONCAT(e.nombres,' ',e.apellidos) as nombre_postulante,                        
                        (CASE ale.estado WHEN 'P' THEN 'POSTULADO' ELSE 'SELECCIONADO' END) as estado,
                        (CASE ale.estado WHEN 'P' THEN 'gray' ELSE 'green' END) as estado_color,
                        (SELECT COALESCE(SUM(valor_puntaje),0) FROM formulario_respuesta WHERE cod_aviso_laboral = ale.cod_aviso_laboral AND cod_estudiante = e.cod_estudiante) as puntaje,
                        ((SELECT COALESCE(SUM(valor_puntaje),0) FROM formulario_respuesta WHERE cod_aviso_laboral = ale.cod_aviso_laboral AND cod_estudiante = e.cod_estudiante)* ".(round(100/$convocatoria["total_puntaje"],4)).")::integer as porcentaje_puntaje
                        FROM aviso_laboral_estudiante ale
                        INNER JOIN estudiante e ON e.cod_estudiante = ale.cod_estudiante
                        WHERE ale.cod_aviso_laboral = :0 AND ale.estado <> 'R' ORDER BY puntaje DESC";

            $postulantes = $this->consultarFilas($sql, [$codAL]);

            return array("rpt"=>true,"r"=>["convocatoria"=>$convocatoria,  "postulantes"=>$postulantes]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function obtenerFormularioEstudiante(){
        try {
            $arAL = [$this->getCodAvisoLaboral()];

            /*Check if its already sent
            si uya hay registros, se necesita cargar amdeás las opciones 
            en el formato
            {o_1: VALOR}... {o_n: VALOR_N}
            */
            $codEstudiante = $_SESSION["usuario"]["cod_usuario"];
            if (!isset($codEstudiante)){
                return ["rpt"=>false,"msj"=>"No hay token de usuario."];
            }

            if ($this->getCodAvisoLaboral() == NULL){
                return ["rpt"=>false,"msj"=>"No hay codigo de convocatoria."];
            }

            $arALE = [$this->getCodAvisoLaboral(),$codEstudiante];

            $sql = "SELECT COUNT(cod_aviso_laboral) > 0 FROM aviso_laboral_estudiante ale WHERE cod_aviso_laboral = :0 AND cod_estudiante = :1";
            $existe = $this->consultarValor($sql, $arALE);

            $bloques = [["id"=>1,"nombre"=>"CONOCIMIENTOS","rotulo"=>"Conocimiento"],
                        ["id"=>2,"nombre"=>"HABILIDADES","rotulo"=>"Habilidad"],
                        ["id"=>3,"nombre"=>"DISPONIBILIDAD","rotulo"=>"Descripción"],
                        ["id"=>4,"nombre"=>"SALARIO","rotulo"=>"Descripción"]];

            $respuestas = [];
            if ($existe){
                $sql = "SELECT fr.cod_pregunta as o, COALESCE(fr.valor_textual::numeric, fr.cod_opcion::numeric)  as v -- ,  fr.valor_textual as vt                    
                    FROM formulario_respuesta fr
                    INNER JOIN formulario_pregunta fp ON fp.cod_aviso_laboral = fr.cod_aviso_laboral AND fp.cod_pregunta = fr.cod_pregunta
                    WHERE fr.cod_aviso_laboral = :0  AND fr.cod_estudiante = :1
                    ORDER BY fp.categoria_pregunta, fp.item";

                $resultadoRespuestas = $this->consultarFilas($sql, $arALE);
            }

            $sql = "SELECT al.titulo as titulo_convocatoria, e.razon_social as nombre_empresa
                        FROM aviso_laboral al 
                        INNER JOIN empresario e ON e.cod_empresario = al.cod_empresario                        
                        WHERE al.cod_aviso_laboral = :0";

             $resultado = $this->consultarFila($sql,$arAL);

            $i = 0;
            foreach ($bloques as $_ => $bloque){
                $sql = "SELECT fp.cod_pregunta, fp.categoria_pregunta,fp.item, fp.descripcion as nombre_pregunta, 
                        (SELECT array_to_json(array_agg(row_to_json( _opcs)))
                              FROM (
                                SELECT cod_opcion, rotulo, valor_asignado
                                FROM formulario_pregunta_opcion 
                                WHERE cod_pregunta = fp.cod_pregunta AND cod_aviso_laboral = fp.cod_aviso_laboral AND estado_mrcb = 1
                              ) _opcs) as opciones_json
                        , 
                        (SELECT COALESCE(nombre_archivo_original,'') FROM formulario_respuesta_archivo fra 
                        WHERE fra.cod_aviso_laboral = fp.cod_aviso_laboral AND fra.cod_pregunta = fp.cod_pregunta AND fra.cod_estudiante = :2 ) as nombre_archivo
                        ,
                        (SELECT url_archivo FROM formulario_respuesta_archivo fra 
                        WHERE fra.cod_aviso_laboral = fp.cod_aviso_laboral AND fra.cod_pregunta = fp.cod_pregunta AND fra.cod_estudiante = :2 ) as url_archivo
                        FROM formulario_pregunta fp
                        WHERE cod_aviso_laboral = :0 AND categoria_pregunta = :1
                        ORDER BY categoria_pregunta, fp.item";

                $preguntas = $this->consultarFilas($sql,[$this->getCodAvisoLaboral(), $bloque["id"], $codEstudiante]);

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

            return array("rpt"=>true,"r"=>["num_preguntas"=> $i, "formulario_preguntas"=>$resultado, "respuestas"=> (count($respuestas) <= 0 ? null: $respuestas )]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }
    

    public function obtenerFormulario($codEstudiante){
        try {
            $arAL = [$this->getCodAvisoLaboral()];

            if ($this->getCodAvisoLaboral() == NULL){
                return ["rpt"=>false,"msj"=>"No hay codigo de convocatoria."];
            }


            $bloques = [["id"=>1,"nombre"=>"CONOCIMIENTOS","rotulo"=>"Conocimiento"],
                        ["id"=>2,"nombre"=>"HABILIDADES","rotulo"=>"Habilidad"],
                        ["id"=>3,"nombre"=>"DISPONIBILIDAD","rotulo"=>"Descripción"],
                        ["id"=>4,"nombre"=>"SALARIO","rotulo"=>"Descripción"]];

            $respuestas = [];

            if ($codEstudiante  >= 0){
                $arALE = [$this->getCodAvisoLaboral(),$codEstudiante];

                $sql = "SELECT COUNT(cod_aviso_laboral) > 0 FROM aviso_laboral_estudiante ale WHERE cod_aviso_laboral = :0 AND cod_estudiante = :1";
                $existe = $this->consultarValor($sql, $arALE);

                $respuestas = [];
                if ($existe){
                    $sql = "SELECT fr.cod_pregunta as o , fr.cod_opcion  as v, fr.valor_textual as vt
                        FROM formulario_respuesta fr
                        INNER JOIN formulario_pregunta fp ON fp.cod_aviso_laboral = fr.cod_aviso_laboral AND fp.cod_pregunta = fr.cod_pregunta
                        WHERE fr.cod_estudiante = :0 AND fr.cod_aviso_laboral = :1
                        ORDER BY categoria_pregunta, fp.item";

                    $resultadoRespuestas = $this->consultarFilas($sql, $arALE);
                }
            }
         
            $sql = "SELECT al.titulo as titulo_convocatoria, e.razon_social as nombre_empresa
                        FROM aviso_laboral al 
                        INNER JOIN empresario e ON e.cod_empresario = al.cod_empresario                        
                        WHERE al.cod_aviso_laboral = :0";

            $resultado = $this->consultarFila($sql,$arAL);

            foreach ($bloques as $_ => $bloque){
                $sql = "SELECT fp.cod_pregunta, fp.categoria_pregunta,fp.item, fp.descripcion as nombre_pregunta, 
                        (SELECT array_to_json(array_agg(row_to_json( _opcs)))
                              FROM (
                                SELECT cod_opcion, rotulo, valor_asignado
                                FROM formulario_pregunta_opcion 
                                WHERE cod_pregunta = fp.cod_pregunta AND cod_aviso_laboral = fp.cod_aviso_laboral AND estado_mrcb = 1
                              ) _opcs) as opciones_json
                        FROM formulario_pregunta fp
                        WHERE cod_aviso_laboral = :0 AND categoria_pregunta = :1
                        ORDER BY categoria_pregunta, fp.item";

                $preguntas = $this->consultarFilas($sql,[$this->getCodAvisoLaboral(), $bloque["id"]]);

                foreach ($preguntas as $key => $value) {            
                    $preguntas[$key]["opciones"] = json_decode($value["opciones_json"]);
                    if ($existe){
                       // $objRpta = $resultadoRespuestas[$key];
                       // $respuestas["o_".$objRpta["o"]] = $objRpta["v"]."";
                    }
                }

                $bloques[$_]["preguntas"] = $preguntas;

            }
            $resultado["bloques"] = $bloques;

            return array("rpt"=>true,"r"=>["formulario_preguntas"=>$resultado, "respuestas"=> (count($respuestas) <= 0 ? null: $respuestas )]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function obtenerPesosFormularioLaboral()
    {
        try{

            $sql  = "SELECT nombre, valor FROM _variables WHERE nombre IN ('pesos_dicotomica','pesos_escala_3','pesos_escala_5','pesos_disponibilidad') ORDER BY 1";

            return array("rpt"=>true,"r"=>$this->consultarFilas($sql));
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

     public function obtenerConvocatorias($fi,$ff, $sonTodos, $codEmpresario)
    {
        try
        {

        $sqlFechas = "true";

        if ($sonTodos =="false"){
            $sqlFechas  = " al.fecha_lanzamiento  BETWEEN '".$fi."' AND '".$ff."' ";
        }

        $sqlEmpresario = "";
        if ($codEmpresario != ""){
            $sqlEmpresario = " AND al.cod_empresario IN (".$codEmpresario.") ";
        }

        $sql = "SELECT cod_aviso_laboral, UPPER(titulo) as titulo, UPPER(cu.descripcion) as carrera, TO_CHAR(fecha_lanzamiento,'DD-MM-YYYY') as fecha_lanzamiento, 
                TO_CHAR(fecha_vencimiento,'DD-MM-YYYY') as fecha_vencimiento,
                e.razon_social as empresario,
                (SELECT COUNT(*) FROM aviso_laboral_estudiante ale WHERE ale.cod_aviso_laboral = al.cod_aviso_laboral) as cantidad_postulantes,
                (SELECT COUNT(*) FROM aviso_laboral_estudiante ale WHERE ale.cod_aviso_laboral = al.cod_aviso_laboral AND estado = 'S') as cantidad_postulantes_aceptados,
                (
                SELECT MAX(puntaje)
                FROM (SELECT SUM(valor_puntaje)as puntaje 
                FROM formulario_respuesta
                WHERE cod_aviso_laboral = al.cod_aviso_laboral
                GROUP BY cod_estudiante, cod_aviso_laboral) t
                ) as maximo_puntaje,
                (CASE al.estado WHEN 'A' THEN 'ACTIVO' ELSE 'INACTIVO' END) as estado
                FROM aviso_laboral al
                INNER JOIN carrera_universitaria cu ON cu.cod_carrera_uni = al.cod_carrera_uni
                INNER JOIN empresario e ON e.cod_empresario = al.cod_empresario
                WHERE ".$sqlFechas." ".$sqlEmpresario." ORDER BY e.razon_social";

        $r = $this->consultarFilas($sql);

        return array("rpt"=>true,"r"=>$r);
        } catch (Exception $exc) {
              var_dump($exc); 
        return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }


    public function reporteAvisoLaboralEmpresario($fi,$ff, $sonTodos, $codEmpresario)
    {
        try
        {

        $sqlFechas = "true";

        if (!$sonTodos){
            $sqlFechas  = " al.fecha_lanzamiento  BETWEEN '".$fi."' AND '".$ff."' ";
        }

        $sqlEmpresario = "";
        if ( $codEmpresario != "null" && $codEmpresario != "" && $codEmpresario[0] != "0"){
            $sqlEmpresario = " AND e.cod_empresario IN (".$codEmpresario.") ";
        }

        $sql = "SELECT e.cod_empresario, razon_social FROM empresario e  WHERE e.estado_mrcb = 1 ". $sqlEmpresario. " ORDER BY razon_social";

        $empresarios = $this->consultarFilas($sql);

        foreach ($empresarios as $key => $value) {
            $sql = "SELECT cod_aviso_laboral, UPPER(titulo) as titulo, UPPER(cu.descripcion) as carrera, TO_CHAR(fecha_lanzamiento,'DD-MM-YYYY') as fecha_lanzamiento, 
                TO_CHAR(fecha_vencimiento,'DD-MM-YYYY') as fecha_vencimiento,
                (SELECT COUNT(*) FROM aviso_laboral_estudiante ale WHERE ale.cod_aviso_laboral = al.cod_aviso_laboral) as cantidad_postulantes,
                (SELECT COUNT(*) FROM aviso_laboral_estudiante ale WHERE ale.cod_aviso_laboral = al.cod_aviso_laboral AND estado = 'S') as cantidad_postulantes_aceptados,
                (
                SELECT MAX(puntaje)
                FROM (SELECT SUM(valor_puntaje)as puntaje 
                FROM formulario_respuesta
                WHERE cod_aviso_laboral = al.cod_aviso_laboral
                GROUP BY cod_estudiante, cod_aviso_laboral) t
                ) as maximo_puntaje,
                (CASE al.estado WHEN 'A' THEN 'ACTIVO' ELSE 'INACTIVO' END) as estado
                FROM aviso_laboral al
                INNER JOIN carrera_universitaria cu ON cu.cod_carrera_uni = al.cod_carrera_uni
                WHERE ".$sqlFechas." AND cod_empresario = ".$value["cod_empresario"];    

            $empresarios[$key]["convocatorias"] = $this->consultarFilas($sql);
        }


        return array("rpt"=>true,"r"=>$empresarios);
        } catch (Exception $exc) {
              var_dump($exc); 
        return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function reporteAvisoLaboralEmpresarioEstudiantes($codAvisoLaboral)
    {
        try
        {

        $sql = " SELECT titulo, fecha_vencimiento, fecha_lanzamiento, e.razon_social as empresario
                 FROM aviso_laboral al
                 INNER JOIN  empresario e ON al.cod_empresario = e.cod_empresario
                 WHERE al.cod_aviso_laboral = :0 ";

        $aviso_laboral = $this->consultarFila($sql, [$codAvisoLaboral]);

        $sql = "    SELECT CONCAT(e.nombres,' ',e.apellidos)  as estudiante, 
                    (SELECT SUM(valor_puntaje)as puntaje 
                    FROM formulario_respuesta
                    WHERE cod_aviso_laboral = ale.cod_aviso_laboral AND cod_estudiante = ale.cod_estudiante
                    GROUP BY cod_estudiante, cod_aviso_laboral) as puntaje,
                    --as puesto,
                    (CASE ale.estado WHEN 'P' THEN 'POSTULADO' WHEN 'S' THEN 'PRESELECCIONADO' ELSE 'RETIRADO' END) as estado,
                    (CASE ale.estado WHEN 'P' THEN 'yellow' WHEN 'S' THEN 'green' ELSE 'red' END) as estado_color,
                    COALESCE(TO_CHAR(fecha_retiro,'DD-MM-YYYY'),'-') as fecha_retiro,
                    COALESCE(TO_CHAR(fecha_postulacion,'DD-MM-YYYY'),'-')  as fecha_postulacion,
                    COALESCE(TO_CHAR(fecha_seleccion,'DD-MM-YYYY'),'-') as fecha_seleccion
                    FROM aviso_laboral_estudiante ale 
                    INNER JOIN estudiante e ON e.cod_estudiante = ale.cod_estudiante
                    WHERE cod_aviso_laboral = :0
                    ORDER BY (CASE ale.estado WHEN 'S' THEN 0 WHEN 'P' THEN 1 ELSE 2 END), puntaje DESC,fecha_postulacion::date";

            $estudiantes = $this->consultarFilas($sql, [$codAvisoLaboral]);

            return array("rpt"=>true,"r"=>["estudiantes"=>$estudiantes, "aviso_laboral"=>$aviso_laboral]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function reporteAvisoLaboralEstudiante($fi,$ff, $sonTodos, $codEstudiante)
    {
        try
        {

        $sqlFechas = "true";

        if (!$sonTodos){
            $sqlFechas  = " ale.fecha_postulacion  BETWEEN '".$fi."' AND '".$ff."' ";
        }

        $sqlEstudiante = "";


        if ( $codEstudiante != "null" && $codEstudiante != "" && $codEstudiante[0] != "0"){
            $sqlEstudiante = " AND e.cod_estudiante IN (".$codEstudiante.") ";
        }

        $sql = "SELECT e.cod_estudiante, CONCAT(nombres,' ',apellidos) as estudiante FROM estudiante e  WHERE e.estado_mrcb = 1 AND e.validado = 1  ". $sqlEstudiante. " ORDER BY nombres";
        $estudiantes = $this->consultarFilas($sql);


        foreach ($estudiantes as $key => $value) {
            $sql = "SELECT
                ale.cod_aviso_laboral, al.titulo, em.razon_social as empresa,
                CONCAT(e.nombres,' ',e.apellidos) as estudiante,
                TO_CHAR(fecha_postulacion,'DD-MM-YYYY') as fecha_postulacion,
                TO_CHAR(fecha_seleccion,'DD-MM-YYYY') as fecha_preseleccion,
                TO_CHAR(fecha_retiro,'DD-MM-YYYY') as fecha_retiro,
                (CASE ale.estado WHEN 'P' THEN 'POSTULADO' WHEN 'S' THEN 'PRESELECCIONADO' ELSE 'RETIRADO' END) as estado,
                (CASE ale.estado WHEN 'P' THEN 'yellow' WHEN 'S' THEN 'green' ELSE 'red' END) as estado_color,
                (SELECT SUM(valor_puntaje)as puntaje 
                    FROM formulario_respuesta
                    WHERE cod_aviso_laboral = ale.cod_aviso_laboral AND cod_estudiante = ale.cod_estudiante
                    GROUP BY cod_estudiante, cod_aviso_laboral) as puntaje
                FROM aviso_laboral_estudiante ale
                INNER JOIN estudiante e ON e.cod_estudiante = ale.cod_estudiante
                INNER JOIN aviso_laboral al ON al.cod_aviso_laboral = ale.cod_aviso_laboral
                INNER JOIN empresario em ON em.cod_empresario = al.cod_empresario
                WHERE ".$sqlFechas." AND ale.cod_estudiante = ".$value["cod_estudiante"]." 
                ORDER BY fecha_postulacion::date, (CASE ale.estado WHEN 'S' THEN 0 WHEN 'P' THEN 1 ELSE 2 END)";    

            $estudiantes[$key]["convocatorias"] = $this->consultarFilas($sql);
        }

            return array("rpt"=>true,"r"=>$estudiantes);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }


}