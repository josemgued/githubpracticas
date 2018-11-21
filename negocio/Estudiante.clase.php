<?php

//require_once '../datos/Conexion.clase.php';
require_once 'Persona.clase.php';

class Estudiante extends Persona {
    private $cod_estudiante;
    private $dni;
    private $fecha_nacimiento;
    private $sexo;
    private $codigo_universitario;
    private $carrera_universitaria;
    private $cod_universidad;
    /*img_perfil*/   

    public function __construct() {
        $this->tbl = "estudiante";
        parent::__construct();
    }    

    public function getDni()
    {
        return $this->dni;
    }
    
    
    public function setDni($dni)
    {
        $this->dni = $dni;
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

    public function getApellidos()
    {
        return $this->apellidos;
    }
    
    
    public function setApellidos($apellidos)
    {
        $this->apellidos = $apellidos;
        return $this;
    }

    public function getNombres()
    {
        return $this->nombres;
    }
    
    
    public function setNombres($nombres)
    {
        $this->nombres = $nombres;
        return $this;
    }

    public function getFechaNacimiento()
    {
        return $this->fecha_nacimiento;
    }
    
    
    public function setFechaNacimiento($fecha_nacimiento)
    {
        $this->fecha_nacimiento = $fecha_nacimiento;
        return $this;
    }

    public function getSexo()
    {
        return $this->sexo;
    }
    
    
    public function setSexo($sexo)
    {
        $this->sexo = $sexo;
        return $this;
    }

    public function getCodigoUniversitario()
    {
        return $this->codigo_universitario;
    }
    
    
    public function setCodigoUniversitario($codigo_universitario)
    {
        $this->codigo_universitario = $codigo_universitario;
        return $this;
    }

    public function getCodCarreraUniversitaria()
    {
        return $this->cod_carrera_universitaria;
    }
    
    
    public function setCodCarreraUniversitaria($cod_carrera_universitaria)
    {
        $this->cod_carrera_universitaria = $cod_carrera_universitaria;
        return $this;
    }

    public function getCodUniversidad()
    {
        return $this->cod_universidad;
    }
    
    
    public function setCodUniversidad($cod_universidad)
    {
        $this->cod_universidad = $cod_universidad;
        return $this;
    }

    public function iniciarSesionMovil()
    {
       return parent::iniciarSesionMovil();
    }
    
/*
    public function iniciarSesionMovil()
    {
        try {

            $sql = "SELECT e.cod_estudiante as cod_usuario, apellidos,nombres, password, img_perfil as url, estado, validado
                        FROM estudiante e
                        WHERE e.estado_mrcb = 1 AND e.estado = 'A' AND correo = :0";
            $res = $this->consultarFila($sql, array($this->getCorreo()));

            if ($res != false){

                if ($res["validado"] == "-1"){
                    return array("rpt"=>false, "msj"=>"Su cuenta aún no ha sido VALIDADA por nuestro administrador."); 
                }

                if ($res["validado"] == "0"){
                    return array("rpt"=>false, "msj"=>"Esta dirección de correo electrónico ha sido rechazada. Consulte nuestro administrador."); 
                }

                if ($res["estado"] == 'A'){
                    if ($res["password"] == md5($this->getPassword())){
                        $_SESSION["usuario"] =  array(
                                    "nombres"=> $res["nombres"],
                                    "cod_usuario"=> $res["cod_usuario"],
                                    "apellidos"=> $res["apellidos"],
                                    "url"=>$res["url"]
                                    );

                        return array("rpt"=>true, "msj"=>"Acceso permitido.",
                                    "usuario" => $_SESSION["usuario"]
                                );
                    }    

                    return array("rpt"=>false, "msj"=>"Password incorrecto");
                }

                return array("rpt"=>false, "msj"=>"Usuario inactivo.");                
                

            } else{
                return array("rpt"=>false, "msj"=>"Usuario inexistente.");
            }

            
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }
*/
    public function verificarSesion() 
    {
       return parent::verificarSesion();
    }

    public function cerrarSesionMovil()
    {
        return parent::cerrarSesionMovil();       
    }

    public function guardarNuevaCuenta() {
        return parent::guardarNuevaCuenta();
    }

    public function cargarDatosPersonales(){
        try {
            $this->setCodEstudiante($_SESSION["usuario"]["cod_usuario"]);

            $sql = "SELECT 
                        fecha_nacimiento,
                        cod_universidad, domicilio, cod_ubigeo_region, cod_ubigeo_provincia, cod_ubigeo_distrito, cod_carrera_uni,
                        celular, sexo as genero
                    FROM estudiante WHERE cod_estudiante = :0 AND estado_mrcb = 1 ";
            $resultado = $this->consultarFila($sql,array($this->getCodEstudiante()));

            if ($resultado == false){
                return array("rpt"=>false,"msj"=>"Registro no encontrado.");
            }

            $regiones = $this->consultarFilas("SELECT cod_ubigeo_region as codigo, nombre FROM ubigeo_region");
            $provincias = []; $distritos = [];
            $_uregion = $resultado["cod_ubigeo_region"];
            $_uprovincia = $resultado["cod_ubigeo_provincia"];

            if (isset($_uregion) && $_uregion != ""){
                $provincias =  $this->consultarFilas("SELECT cod_ubigeo_provincia as codigo, nombre FROM ubigeo_provincia WHERE cod_ubigeo_region = :0", [$_uregion]);
                
                if (isset($_uprovincia) && $_uprovincia != ""){
                    $distritos = $this->consultarFilas("SELECT cod_ubigeo_distrito  as codigo, nombre FROM ubigeo_distrito WHERE cod_ubigeo_region = :0 AND cod_ubigeo_provincia = :1", [$_uregion,$_uprovincia]);
                }
            }

            $carreras = $this->consultarFilas("SELECT cod_carrera_uni as codigo, descripcion as nombre FROM carrera_universitaria WHERE estado_mrcb = 1 ORDER BY descripcion");

            /*Nuevo, verificar que no tenga algun aviso labora lpostulado, 0 o 1.*/
            $esEditable = $this->consultarValor("SELECT COUNT(*) < 1 FROM aviso_laboral_estudiante WHERE cod_estudiante = :0", array($this->getCodEstudiante()));

            /*Pasar tb las regiones / provincas y disritos acorde a lo obtenido*/
            return array("rpt"=>true,"data"=>["estudiante"=>$resultado, "carreras"=>$carreras, "ubigeo"=>["distritos"=>$distritos, "provincias"=>$provincias,"regiones"=>$regiones], "carrera_editable"=>($esEditable ? "true" : "false")]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function guardarDatosPersonales() {
        try {
            $this->beginTransaction();
            /*img_perfil, apellidos, nombres,
            dia, mes, año,
            region, provincia, distrito,
            celular,genero*/
            $this->setCodEstudiante($_SESSION["usuario"]["cod_usuario"]);

            $campos_valores = [
                "apellidos"=>strtoupper($this->getApellidos()),
                "nombres"=>strtoupper($this->getNombres()),
                "celular"=>$this->getCelular(),
                "domicilio"=>$this->getDomicilio(),
                "fecha_nacimiento"=>$this->getFechaNacimiento(),
                "cod_ubigeo_region"=>$this->getCodUbigeoRegion(),
                "cod_ubigeo_provincia"=>$this->getCodUbigeoProvincia(),
                "cod_ubigeo_distrito"=>$this->getCodUbigeoDistrito(),
                "cod_universidad"=>$this->getCodUniversidad(),
                "celular"=>$this->getCelular(),
                "sexo"=>$this->getSexo()
            ];

            $esEditable = $this->consultarValor("SELECT COUNT(*) < 1 FROM aviso_laboral_estudiante WHERE cod_estudiante = :0", array($this->getCodEstudiante()));
            if ($esEditable){
                $campos_valores["cod_carrera_uni"] = $this->getCodCarreraUniversitaria();
            }

            $nuevaImg = $this->getImgPerfil() != NULL;

            if ($nuevaImg){
                $extension  = substr($this->getImgPerfil()["name"], -3);
                $nombre_archivo_img = 'FP_'.$this->getCodEstudiante().'_'.time().'.'.$extension;
                $campos_valores["img_perfil"] = $nombre_archivo_img;
            }

            $campos_valores_where = ["cod_estudiante"=>$this->getCodEstudiante()];

            $this->update("estudiante",$campos_valores,$campos_valores_where);


            if ($nuevaImg){
                if (!move_uploaded_file($this->getImgPerfil()["tmp_name"], "../images/$nombre_archivo_img")) {
                    $this->rollBack();
                    return array("rpt"=>false,"msj"=>"Error al subir la imagen.");
                }
            }

            /*Si llega una foto, debemos reemplazarla, sino llega nada dejar tal y como está.*/
            /*Actualizar SESSION; nombre, apellidos, img, */

            $sql  = "SELECT cod_estudiante,nombres,apellidos,img_perfil, c.descripcion as carrera FROM estudiante e 
                        INNER JOIN carrera_universitaria c ON c.cod_carrera_uni = e.cod_carrera_uni WHERE cod_estudiante = :0";
            $nuevoUsuario = $this->consultarFila($sql, [$this->getCodEstudiante()]);

            $usuario  = [
                            "nombres"=>$nuevoUsuario["nombres"],
                            "apellidos"=>$nuevoUsuario["apellidos"],
                            "carrera" => $nuevoUsuario["carrera"],
                            "cod_usuario" => $nuevoUsuario["cod_estudiante"],
                            "url"=>$nuevoUsuario["img_perfil"]
                        ];

            $_SESSION["usuario"] = $usuario;

            $this->commit();
            return array("rpt"=>true,"msj"=>"Datos personales guardados", "data_usuario"=>$usuario);
        } catch (Exception $exc) {
            $this->rollBack();
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function cargarDatosFormulario(){
        try {
            $r = array();

            $sql = "SELECT cod_carrera_uni as id, descripcion FROM carrera_universitaria WHERE estado_mrcb = 1 ORDER BY descripcion ";
            $r["carreras"] = $this->consultarFilas($sql);

            $sql = "SELECT cod_universidad as id, descripcion FROM universidad WHERE estado_mrcb = 1 ORDER BY descripcion ";
            $r["universidades"] = $this->consultarFilas($sql);

            $sql = "SELECT cod_ubigeo_region as id, nombre as descripcion FROM ubigeo_region";
            $r["regiones"] = $this->consultarFilas($sql);
            
            return array("rpt"=>true,"r"=>$r);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function listar($filtro_dni, $filtro_apellido, $filtro_estado){
        try {

            if ($filtro_estado == 1){
                $filtro_estado = " AND e.validado > -1 ";
            } else if ($filtro_estado == 0){
                $filtro_estado = " AND e.validado = -1";
            } else {
                $filtro_estado = " ";
            }

            $sql = "SELECT
                    e.cod_estudiante,
                    e.dni,
                    e.codigo_universitario,
                    e.nombres,
                    e.apellidos,
                    COALESCE(e.celular, '-') as celular,
                    cu.descripcion as carrera,
                    u.descripcion as universidad,
                    (CASE e.sexo WHEN 'M' THEN 'MASCULINO' ELSE 'FEMENINO' END) as sexo,
                    e.correo,
                    COALESCE(DATE_PART('YEAR',AGE(fecha_nacimiento))::varchar,'-') as edad,
                    (CASE e.estado WHEN 'I' THEN 'INACTIVO' ELSE 'ACTIVO' END)  as estado,
                    e.validado
                    FROM estudiante e 
                    LEFT JOIN carrera_universitaria cu ON e.cod_carrera_uni = cu.cod_carrera_uni
                    LEFT JOIN universidad u ON u.cod_universidad = e.cod_universidad
                    WHERE
                        e.estado_mrcb = 1 AND (e.dni LIKE '%".$filtro_dni."%' OR
                        e.codigo_universitario LIKE '%".$filtro_dni."%') AND
                        UPPER(e.nombres||' '||e.apellidos) LIKE '%".strtoupper($filtro_apellido)."%' 
                        ".$filtro_estado."
                    ORDER BY e.apellidos";

            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"data"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    }

    public function darBaja() {
        return parent::darBaja();
    }

    public function darBajaMovil() {
        return parent::darBajaMovil();
    }

    public function leerDatos(){
        try {
            $sql = "SELECT cod_estudiante, dni, codigo_universitario, nombres, apellidos, celular, fecha_nacimiento, sexo, domicilio, cod_universidad,
                    cod_ubigeo_region, cod_ubigeo_provincia, cod_ubigeo_distrito, cod_carrera_uni, correo
                    FROM estudiante e WHERE cod_estudiante = :0";
            $resultado = $this->consultarFila($sql,array($this->getCodEstudiante()));

            $ubigeo = array();
            if ($resultado["cod_ubigeo_region"] != null){
                $ubigeo["provincias"] = $this->consultarFilas("SELECT cod_ubigeo_provincia as id, nombre as descripcion FROM ubigeo_provincia WHERE cod_ubigeo_region = :0", [$resultado["cod_ubigeo_region"]]);
                if ($resultado["cod_ubigeo_provincia"] != null){
                    $ubigeo["distritos"] = $this->consultarFilas("SELECT cod_ubigeo_distrito as id, nombre as descripcion FROM ubigeo_distrito WHERE cod_ubigeo_region = :0 AND cod_ubigeo_provincia = :1", [$resultado["cod_ubigeo_region"],$resultado["cod_ubigeo_provincia"]]);
                }
            }

            return array("rpt"=>true,"r"=>$resultado, "ubigeo"=> $ubigeo);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    } 

    public function agregar() {
        return parent::agregar();
    }   

    public function editar() {
        return parent::editar();
    }  

    public function cambiarClaveWeb() {
        return parent::cambiarClaveWeb();
    }  

    public function validar($tipoValidacion) { /*0: rechazado, 1: aceptado*/
        try {

            if ($this->getCodEstudiante() == NULL){
                return array("rpt"=>false,"msj"=>"Código de estudiante inválido.");
            }

            if ($tipoValidacion < 0 && $tipoValidacion > 1){
                return array("rpt"=>false,"msj"=>"Código de validación inválido.");
            }

            $campos_valores = [
                "validado"=>$tipoValidacion
            ];

            $campos_valores_where = [
                "cod_estudiante"=>$this->getCodEstudiante()
            ];
        
            
            /*
            Si tipo_validacion == 0
                enviarCorreoRechazo
            else 
                enviarCorreoAceptacion
            */

            $sql = "SELECT 
                            CONCAT(nombres,' ',apellidos) as nombres_estudiante, correo, codigo_universitario
                            FROM estudiante e 
                            WHERE e.cod_estudiante = :0";

            $estudiante = $this->consultarFila($sql, [$this->getCodEstudiante()]);

            require_once 'Mensaje.clase.php';
            $objMensaje = new Mensaje();
            $objMensaje->setPara($estudiante);         
            $objMensaje->enviarCorreo($tipoValidacion == 1 ? "ACEPTADO" : "RECHAZADO");      

            $this->update($this->tbl,$campos_valores, $campos_valores_where);
            return array("rpt"=>true,"msj"=>"Estudiante validado. Se envió el correo correspondiente.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

     public function obtenerEstudiantesCB(){
        try {
            $sql = "SELECT cod_estudiante as id, CONCAT('[',dni,']',' - ',nombres,' ',apellidos)  as descripcion FROM estudiante WHERE estado_mrcb = 1 ORDER BY apellidos";
            $resultado = $this->consultarFilas($sql);

            return array("rpt"=>true,"r"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
        }
    }
    
}
