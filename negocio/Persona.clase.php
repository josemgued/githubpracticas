<?php

require_once '../datos/Conexion.clase.php';

class Persona extends Conexion {
    private $apellidos;
    private $nombres;
    private $password;
    private $cod_ubigeo_region;
    private $cod_ubigeo_provincia;
    private $cod_ubigeo_distrito;
    private $domicilio;
    private $celular;
    private $correo;
    private $fecha_hora_registro;
    private $estado_mrcb;
    private $estado;    
    private $img_perfil;
    private $cod_personal_baja;
    protected $tbl;    

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

    public function getPassword()
    {
        return $this->password;
    }
    
    
    public function setPassword($password)
    {
        $this->password = $password;
        return $this;
    }

    public function getCodUbigeoRegion()
    {
        return $this->cod_ubigeo_region;
    }
    
    
    public function setCodUbigeoRegion($cod_ubigeo_region)
    {
        $this->cod_ubigeo_region = $cod_ubigeo_region;
        return $this;
    }

    public function getCodUbigeoProvincia()
    {
        return $this->cod_ubigeo_provincia;
    }
    
    
    public function setCodUbigeoProvincia($cod_ubigeo_provincia)
    {
        $this->cod_ubigeo_provincia = $cod_ubigeo_provincia;
        return $this;
    }

    public function getCodUbigeoDistrito()
    {
        return $this->cod_ubigeo_distrito;
    }
    
    
    public function setCodUbigeoDistrito($cod_ubigeo_distrito)
    {
        $this->cod_ubigeo_distrito = $cod_ubigeo_distrito;
        return $this;
    }

    public function getCelular()
    {
        return $this->celular;
    }
    
    
    public function setCelular($celular)
    {
        $this->celular = $celular;
        return $this;
    }

    public function getCorreo()
    {
        return $this->correo;
    }
    
    
    public function setCorreo($correo)
    {
        $this->correo = $correo;
        return $this;
    }

    public function getImgPerfil()
    {
        return $this->img_perfil;
    }
    
    
    public function setImgPerfil($img_perfil)
    {
        $this->img_perfil = $img_perfil;
        return $this;
    }

    public function getDomicilio()
    {
        return $this->domicilio;
    }
    
    
    public function setDomicilio($domicilio)
    {
        $this->domicilio = $domicilio;
        return $this;
    }

    public function getEstado_mrcb()
    {
        return $this->estado_mrcb;
    }
    
    
    public function setEstado_mrcb($estado_mrcb)
    {
        $this->estado_mrcb = $estado_mrcb;
        return $this;
    }

    public function getCodPersonalBaja()
    {
        return $this->cod_personal_baja;
    }
    
    
    public function setCodPersonalBaja($cod_personal_baja)
    {
        $this->cod_personal_baja = $cod_personal_baja;
        return $this;
    }

    protected function iniciarSesionMovil()
    {
        try {            

            $esEmpresario = $this->tbl == "empresario";
            if ($esEmpresario){
                $sql_0 = " e.cod_empresario as cod_usuario, razon_social, c.descripcion as cargo, img_logo as url ";      
                $sql_1 =  " FROM ".$this->tbl." e INNER JOIN cargo c ON e.cargo = c.cod_cargo ";         
            } else {
                $sql_0 = " e.cod_estudiante as cod_usuario, img_perfil as url";
                $sql_1 = " FROM ".$this->tbl." e";
            }

            $sql = " SELECT ".$sql_0.", apellidos,nombres,password,estado ".$sql_1." WHERE e.estado_mrcb = 1 AND e.estado = 'A' AND correo  = :0";

            $res = $this->consultarFila($sql, array($this->getCorreo()));

            if ($res != false){

                if ($res["estado"] == 'A'){
                    if ($res["password"] == md5($this->getPassword())){

                        $_SESSION["usuario"] =  array(
                                    "nombres"=> $res["nombres"],
                                    "cod_usuario"=> $res["cod_usuario"],
                                    "apellidos"=> $res["apellidos"],
                                    "url"=>$res["url"]
                                    );

                        if ($esEmpresario){
                            $_SESSION["usuario"]["empresa"] = $res["razon_social"];
                            $_SESSION["usuario"]["cargo"] = $res["cargo"];
                        } 
                        return array("rpt"=>true, "msj"=>"Acceso permitido.",
                                    "usuario" => $_SESSION["usuario"]);
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

    protected function cerrarSesionMovil()
    {
        try {
            session_destroy();
            return array("rpt"=>true,"msj"=>"Sesión cerrada.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    protected function verificarSesion()
     {
        try {

            if (isset($_SESSION["usuario"])){
                return array("rpt"=>true,"usuario"=>$_SESSION["usuario"]);
            } else {
                return array("rpt"=>false,"usuario"=>null);
            }
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }


    private function esEstudiante(){
        return $this->tbl == "estudiante";
    }


    public function guardarNuevaCuenta() {
        try {
            /*Creación de cuenta desde el app. Por defecto se registra validado en -1.*/
            /*RUC VS DNI*/

            $doc = $this->esEstudiante() ? "dni" : "ruc";
            $valorDoc = $this->esEstudiante() ? $this->getDni() : $this->getRuc();

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE $doc = :0 AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$valorDoc]);
            if ($existe){
                return array("rpt"=>false,"msj"=>strtoupper($doc)." ya existente.");
            }

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE correo = :0 AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$this->getCorreo()]);
            if ($existe){
                return array("rpt"=>false,"msj"=>"CORREO ya existente.");
            }

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE celular = :0 AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$this->getCelular()]);
            if ($existe){
                return array("rpt"=>false,"msj"=>"CELULAR ya existente.");
            }

            if ($this->esEstudiante()){
                $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE codigo_universitario = :0 AND estado_mrcb = 1";
                $existe = $this->consultarValor($sql, [$this->getCodigoUniversitario()]);
                if ($existe){
                    return array("rpt"=>false,"msj"=>"CÓDIGO UNIVERSITARIO ya existente.");
                }
            }

            /*Check if dni not repetido*/
            $this->setApellidos(strtoupper($this->getApellidos()));
            $this->setNombres(strtoupper($this->getNombres()));

            $campos_valores = [
                "apellidos"=>$this->getApellidos(),
                "nombres"=>$this->getNombres(),
                "correo"=>$this->getCorreo(),
                "password"=>$this->getPassword(),
                $doc=>$valorDoc
            ];

            if ($this->esEstudiante()){
                $campos_valores["codigo_universitario"] = $this->getCodigoUniversitario();
                $campos_valores["cod_carrera_uni"] = $this->getCodCarreraUniversitaria();
                $campos_valores["cod_universidad"] = $this->getCodUniversidad();
            } else {
                $campos_valores["razon_social"] = $this->getRazonSocial();
                $campos_valores["cargo"] = $this->getCargo();
                $campos_valores["ruc"] = $this->getRuc();
            }

            //$this->insert($this->tbl,$campos_valores);

            //Si todo ok, enviar correo.
            //Persona: Nombres, apellidos (razonsocial), correo, (ruc or cod uni) 

            $persona = ["nombres_persona"=> $this->getNombres()." ".$this->getApellidos(),
                            "razon_social"=> $this->esEstudiante() ? "" : $this->getRazonSocial() ,
                            "documento"=>  $this->esEstudiante() ? $this->getCodigoUniversitario() : $this->getRuc(),
                            "correo"=>$this->getCorreo()];
                            
            require 'Mensaje.clase.php';
            $objMensaje = new Mensaje;
            $objMensaje->setPara($persona);     
            $objMensaje->enviarCorreo("CONFIRMAR_CUENTA");

            return array("rpt"=>true,"msj"=>"Cuenta creada correctamente. Se ha enviado correo de confirmación.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function cargarDatosPersonales(){
        try {
            /*apll,nom NON*/

            $this->setCodEstudiante($_SESSION["usuario"]["cod_usuario"]);

            $sql = "SELECT 
                        EXTRACT(DAY FROM fecha_nacimiento) as dia,
                        EXTRACT(MONTH FROM fecha_nacimiento) as mes, 
                        EXTRACT(YEAR FROM fecha_nacimiento) as año,
                        domicilio, cod_ubigeo_region, cod_ubigeo_provincia, cod_ubigeo_distrito, 
                        cod_universidad,
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

            /*Pasar tb las regiones / provincas y disritos acorde a lo obtenido*/
            return array("rpt"=>true,"data"=>["estudiante"=>$resultado, "ubigeo"=>["distritos"=>$distritos, "provincias"=>$provincias,"regiones"=>$regiones]]);
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
                "fecha_nacimiento"=>$this->getFechaNacimiento(),
                "cod_ubigeo_region"=>$this->getCodUbigeoRegion(),
                "cod_ubigeo_provincia"=>$this->getCodUbigeoProvincia(),
                "cod_ubigeo_distrito"=>$this->getCodUbigeoDistrito(),
                "celular"=>$this->getCelular(),
                "sexo"=>$this->getSexo()
            ];

            $nuevaImg = $this->getImgPerfil() != NULL;

            if ($nuevaImg){
                $extension  = substr($this->getImgPerfil()["name"], -3);
                $nombre_archivo_img = 'FP_ES_'.$this->getCodEstudiante().'_'.time().'.'.$extension;
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

            $sql  = "SELECT cod_estudiante,nombres,apellidos,img_perfil FROM estudiante WHERE cod_estudiante = :0";
            $nuevoUsuario = $this->consultarFila($sql, [$this->getCodEstudiante()]);

            $usuario  = [
                            "nombres"=>$nuevoUsuario["nombres"],
                            "apellidos"=>$nuevoUsuario["apellidos"],
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

    protected function darBaja() {
        $this->beginTransaction();
        try {        

            if ($this->esEstudiante()){
                $campos_valores_where = array(  "cod_estudiante"=>$this->getCodEstudiante());
            } else {
                $campos_valores_where = array(  "cod_empresario"=>$this->getCodEmpresario());
            }

            /*Eliminar todo rastro de él en los registros*/
            $campos_valores = array(  "estado_mrcb"=>0, 
                                      "fecha_hora_baja"=>date('Y-m-d H:i:s'));

            if ($this->getCodPersonalBaja() != NULL){
                $campos_valores["cod_personal_baja"] = $this->getCodPersonalBaja();
            }


            $this->update($this->tbl, $campos_valores,$campos_valores_where);

            if ($this->esEstudiante()){
                $campos_valores = array("estado"=>'R',
                                        "fecha_retiro"=>date('Y-m-d'));
                $tbl = "aviso_laboral_estudiante";
            } else {
                $campos_valores = array("estado_mrcb"=>0);
                $tbl = "aviso_laboral";
            }

            $this->update($tbl, $campos_valores, $campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha dado de baja exitosamente");
        } catch (Exception $exc) {
            $this->rollBack();
            return array("rpt"=>false,"msj"=>$exc);
        }
    }

    protected function agregar() {
        try {

            /*RUC VS DNI*/
            $doc = $this->esEstudiante() ? "dni" : "ruc";
            $valorDoc = $this->esEstudiante() ? $this->getDni() : $this->getRuc();

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE $doc = :0 AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$valorDoc]);
            if ($existe){
                return array("rpt"=>false,"msj"=>strtoupper($doc)." ya existente.");
            }

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE correo = :0 AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$this->getCorreo()]);
            if ($existe){
                return array("rpt"=>false,"msj"=>"CORREO ya existente.");
            }

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE celular = :0 AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$this->getCelular()]);
            if ($existe){
                return array("rpt"=>false,"msj"=>"CELULAR ya existente.");
            }

            if ($this->esEstudiante()){
                $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE codigo_universitario = :0 AND estado_mrcb = 1";
                $existe = $this->consultarValor($sql, [$this->getCodigoUniversitario()]);
                if ($existe){
                    return array("rpt"=>false,"msj"=>"CÓDIGO UNIVERSITARIO ya existente.");
                }
            }

            /*Check if dni not repetido*/
            $campos_valores = [
                "apellidos"=>strtoupper($this->getApellidos()),
                "nombres"=>strtoupper($this->getNombres()),
                "correo"=>$this->getCorreo(),
                "password"=>md5($this->getPassword()),
                "cod_ubigeo_region"=>$this->getCodUbigeoRegion(),
                "cod_ubigeo_provincia"=>$this->getCodUbigeoProvincia(),
                "cod_ubigeo_distrito"=>$this->getCodUbigeoDistrito(),
                "domicilio"=>$this->getDomicilio(),
                "celular"=>$this->getCelular(),
                "tipo_registro"=>0,
                $doc=>$valorDoc
            ];

            if ($this->esEstudiante()){
                $campos_valores["codigo_universitario"] = $this->getCodigoUniversitario();
                $campos_valores["cod_carrera_uni"] = $this->getCodCarreraUniversitaria();
                $campos_valores["cod_universidad"] = $this->getCodUniversidad();
                $campos_valores["fecha_nacimiento"] = $this->getFechaNacimiento();
                $campos_valores["sexo"] = $this->getSexo();
            } else {
                $campos_valores["razon_social"] = $this->getRazonSocial();
                $campos_valores["descripcion_empresa"] = $this->getDescripcionEmpresa();
                $campos_valores["cargo"] = $this->getCargo();
                $campos_valores["cod_sector_industrial"] = $this->getCodSectorIndustrial();
                $campos_valores["cod_tipo_empresa"] = $this->getCodTipoEmpresa();
                $campos_valores["ruc"] = $this->getRuc();
            }

            $this->insert($this->tbl,$campos_valores);
            return array("rpt"=>true,"msj"=>"Registro realizado correctamente.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    protected function editar() {
        try {

            $doc = $this->esEstudiante() ? "dni" : "ruc";
            $valorDoc = $this->esEstudiante() ? $this->getDni() : $this->getRuc();

            /*obtener datos anteriores*/
            $codWhere;

            if ($this->esEstudiante()){                
                $codWhere = ["campo"=>"cod_estudiante", "valor"=>$this->getCodEstudiante()];
            } else {
                $codWhere = ["campo"=>"cod_empresario", "valor"=>$this->getCodEmpresario()];
            }

            $sql = "SELECT correo, celular, $doc". ($this->esEstudiante() ? ",codigo_universitario " : "").
                                " FROM ".$this->tbl." WHERE ".$codWhere["campo"]." = :0";

            $registroAnterior = $this->consultarFila($sql, [$codWhere["valor"]]);    

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE ($doc = :0  AND $doc <> :1) AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$valorDoc, $registroAnterior[$doc]]);
            if ($existe){
                return array("rpt"=>false,"msj"=>strtoupper($doc)." ya existente.");
            }

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE (correo = :0 AND correo <> :1) AND estado_mrcb = 1";
            $existe = $this->consultarValor($sql, [$this->getCorreo(), $registroAnterior["correo"]]);
            if ($existe){
                return array("rpt"=>false,"msj"=>"CORREO ya existente.");
            }

            $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE (celular = :0 AND celular <> :1) AND estado_mrcb = 1 ";
            $existe = $this->consultarValor($sql, [$this->getCelular(), $registroAnterior["celular"]]);
            if ($existe){
                return array("rpt"=>false,"msj"=>"CELULAR ya existente.");
            }

            if ($this->esEstudiante()){
                $sql = "SELECT COUNT(*) > 0 FROM $this->tbl WHERE codigo_universitario = :0 AND estado_mrcb = 1 AND codigo_universitario <> :1";
                $existe = $this->consultarValor($sql, [$this->getCodigoUniversitario(), $registroAnterior["codigo_universitario"]]);
                if ($existe){
                    return array("rpt"=>false,"msj"=>"CÓDIGO UNIVERSITARIO ya existente.");
                }
            }

            /*Check if dni not repetido*/
            $campos_valores = [
                "apellidos"=>strtoupper($this->getApellidos()),
                "nombres"=>strtoupper($this->getNombres()),
                "correo"=>$this->getCorreo(),
                "cod_ubigeo_region"=>$this->getCodUbigeoRegion(),
                "cod_ubigeo_provincia"=>$this->getCodUbigeoProvincia(),
                "cod_ubigeo_distrito"=>$this->getCodUbigeoDistrito(),
                "domicilio"=>$this->getDomicilio(),
                "celular"=>$this->getCelular(),
                $doc=>$valorDoc
            ];

            if ($this->esEstudiante()){
                $campos_valores["codigo_universitario"] = $this->getCodigoUniversitario();
                $campos_valores["cod_carrera_uni"] = $this->getCodCarreraUniversitaria();
                $campos_valores["fecha_nacimiento"] = $this->getFechaNacimiento();
                $campos_valores["cod_universidad"] = $this->getCodUniversidad();
                $campos_valores["sexo"] = $this->getSexo();
            } else {
                $campos_valores["razon_social"] = $this->getRazonSocial();
                $campos_valores["descripcion_empresa"] = $this->getDescripcionEmpresa();
                $campos_valores["cargo"] = $this->getCargo();
                $campos_valores["cod_sector_industrial"] = $this->getCodSectorIndustrial();
                $campos_valores["cod_tipo_empresa"] = $this->getCodTipoEmpresa();
                $campos_valores["ruc"] = $this->getRuc();
            }

            $campos_valores_where = [
                $codWhere["campo"] => $codWhere["valor"]
            ];

            $this->update($this->tbl,$campos_valores, $campos_valores_where);
            return array("rpt"=>true,"msj"=>"Registro actualizado correctamente.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    protected function cambiarClaveWeb() {
        try {

            if ($this->esEstudiante()){                
                $codWhere = ["campo"=>"cod_estudiante", "valor"=>$this->getCodEstudiante()];
            } else {
                $codWhere = ["campo"=>"cod_empresario", "valor"=>$this->getCodEmpresario()];
            }

            $campos_valores = [
                "password"=>md5($this->getPassword())
            ];

            $campos_valores_where = [
                $codWhere["campo"] => $codWhere["valor"]
            ];

            $this->update($this->tbl,$campos_valores, $campos_valores_where);
            return array("rpt"=>true,"msj"=>"Clave cambiada correctamente.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function confirmacionCorreo($correoUsuario, $tipoUsuario){

         try {
            $sql = "";
            if ($tipoUsuario == md5("dni")){                
                $sql = "SELECT 'cod_estudiante' as id_colname, cod_estudiante as id, validado FROM estudiante WHERE md5(correo)  = '".$correoUsuario."'";            
                $tbl = "estudiante";
            } else {            
                $sql = "SELECT 'cod_empresario' as id_colname,  cod_empresario as id, validado FROM empresario WHERE md5(correo)  = '".$correoUsuario."'";            
                $tbl = "empresario";
            }


            $estaValidado = $this->consultarFila($sql);

            if ($estaValidado == false){
                return 0;
            }

            if ($estaValidado["validado"] == -1 ){

                $campos_valores = [
                    "validado"=>"1"
                ];

                $campos_valores_where = [
                    $estaValidado["id_colname"] => $estaValidado["id"] 
                ];

                $this->update($tbl,$campos_valores, $campos_valores_where);
                return 1;
            }

            if ($estaValidado["validado"] > -1 ){
                return 2;
            }

        } catch (Exception $exc) {
            throw $exc;
        }   
    }

    protected function darBajaMovil() {
        try {        
            $codUsuario = $_SESSION["usuario"]["cod_usuario"];

            if ($this->esEstudiante()){
                $this->setCodEstudiante($codUsuario);
            } else {
                $this->setCodEmpresario($codUsuario);
            }        

            $rptBaja = $this->darBaja();

            if (!$rptBaja["rpt"]){
                return $rptBaja;
            }
            session_destroy();
            return array("rpt"=>true,"msj"=>"Se ha dado de baja exitosamente.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
        }
    }
}