<?php

//srequire_once '../datos/Conexion.clase.php';
require_once 'Persona.clase.php';

class Empresario extends Persona {

    private $cod_empresario;
    private $cargo;
    private $nombre_empresa;
    private $ruc;
    private $razon_social;
    private $descripcion_empresa;
    private $cod_tipo_empresa;
    private $cod_sector_industrial;
    /*img_logo*/    

    public function __construct() {
        $this->tbl = "empresario";
        parent::__construct();
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

    public function getNombreEmpresa()
    {
        return $this->nombre_empresa;
    }
    
    
    public function setNombreEmpresa($nombre_empresa)
    {
        $this->nombre_empresa = $nombre_empresa;
        return $this;
    }

    public function getDescripcionEmpresa()
    {
        return $this->descripcion_empresa;
    }
    
    
    public function setDescripcionEmpresa($descripcion_empresa)
    {
        $this->descripcion_empresa = $descripcion_empresa;
        return $this;
    }

    
    public function getCargo()
    {
        return $this->cargo;
    }
    
    
    public function setCargo($cargo)
    {
        $this->cargo = $cargo;
        return $this;
    }

    public function getRazonSocial()
    {
        return $this->razon_social;
    }
    
    
    public function setRazonSocial($razon_social)
    {
        $this->razon_social = $razon_social;
        return $this;
    }

    public function getCodTipoEmpresa()
    {
        return $this->cod_tipo_empresa;
    }
    
    
    public function setCodTipoEmpresa($cod_tipo_empresa)
    {
        $this->cod_tipo_empresa = $cod_tipo_empresa;
        return $this;
    }

    public function getCodSectorIndustrial()
    {
        return $this->cod_sector_industrial;
    }
    
    
    public function setCodSectorIndustrial($cod_sector_industrial)
    {
        $this->cod_sector_industrial = $cod_sector_industrial;
        return $this;
    }

    public function getRuc()
    {
        return $this->ruc;
    }
    
    
    public function setRuc($ruc)
    {
        $this->ruc = $ruc;
        return $this;
    }

    public function iniciarSesionMovil()
    {
        return parent::iniciarSesionMovil();
    }

    public function cerrarSesionMovil()
    {
        return parent::cerrarSesionMovil();
    }

    public function verificarSesion() 
    {
       return parent::verificarSesion();
    }

    public function guardarNuevaCuenta() {
        return parent::guardarNuevaCuenta();
    }


    public function cargarDataFormulario(){
        try {
            /*Sector industrial, tipo_empreas, regiones + CARGOS*/

            $tipo_empresa = $this->consultarFilas("SELECT cod_tipo_empresa as codigo, descripcion  as nombre FROM tipo_empresa WHERE estado_mrcb = 1 ");

            $sector_industrial = $this->consultarFilas("SELECT cod_sector_industrial as codigo, descripcion as nombre FROM sector_industrial WHERE estado_mrcb = 1");

            $regiones = $this->consultarFilas("SELECT cod_ubigeo_region as codigo, nombre FROM ubigeo_region");

            $cargo = $this->consultarFilas("SELECT cod_cargo as codigo, descripcion as nombre FROM cargo");

            /*Pasar tb las regiones / provincas y disritos acorde a lo obtenido*/
            return array("rpt"=>true,"data"=>["tipo_empresa"=>$tipo_empresa, "sector_industrial"=>$sector_industrial, "regiones"=>$regiones ,"cargo"=>$cargo]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }


    public function cargarDatosEmpresario(){
        try {
            /*apll,nom NON*/
            $this->setCodEmpresario($_SESSION["usuario"]["cod_usuario"]);

            $sql = "SELECT 
                        nombres,apellidos,cargo,razon_social, domicilio, correo, descripcion_empresa, cod_ubigeo_region, cod_ubigeo_provincia, cod_ubigeo_distrito, 
                        cod_tipo_empresa, cod_sector_industrial, celular
                    FROM empresario WHERE cod_empresario = :0 AND estado_mrcb = 1 ";
            $resultado = $this->consultarFila($sql,array($this->getCodEmpresario()));

            if ($resultado == false){
                return array("rpt"=>false,"msj"=>"Registro no encontrado.");
            }

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
            return array("rpt"=>true,"data"=>["empresario"=>$resultado, "ubigeo"=>["distritos"=>$distritos, "provincias"=>$provincias]]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function guardarDatosEmpresa() {
        try {
            $this->beginTransaction();
            /*img_perfil, apellidos, nombres,
            region, provincia, distrito,
            celular*/
            $this->setCodEmpresario($_SESSION["usuario"]["cod_usuario"]);

            $campos_valores = [
                "apellidos"=>strtoupper($this->getApellidos()),
                "nombres"=>strtoupper($this->getNombres()),
                "razon_social"=>strtoupper($this->getRazonSocial()),
                "descripcion_empresa"=>strtoupper($this->getDescripcionEmpresa()),
                "cargo"=>$this->getCargo(),
                "celular"=>$this->getCelular(),
                "cod_tipo_empresa"=>$this->getCodTipoEmpresa(),
                "cod_sector_industrial"=>$this->getCodSectorIndustrial(),
                "cod_ubigeo_region"=>$this->getCodUbigeoRegion(),
                "cod_ubigeo_provincia"=>$this->getCodUbigeoProvincia(),
                "cod_ubigeo_distrito"=>$this->getCodUbigeoDistrito(),
                "celular"=>$this->getCelular(),
                "domicilio"=>$this->getDomicilio(),
            ];

            $nuevaImg = $this->getImgPerfil() != NULL;

            if ($nuevaImg){
                $extension  = substr($this->getImgPerfil()["name"], -3);
                $nombre_archivo_img = 'LE_'.$this->getCodEmpresario().'_'.time().'.'.$extension;
                $campos_valores["img_logo"] = $nombre_archivo_img;
            }

            $campos_valores_where = ["cod_empresario"=>$this->getCodEmpresario()];

            $this->update("empresario",$campos_valores,$campos_valores_where);

            if ($nuevaImg){
                if (!move_uploaded_file($this->getImgPerfil()["tmp_name"], "../images/$nombre_archivo_img")) {
                    $this->rollBack();
                    return array("rpt"=>false,"msj"=>"Error al subir la imagen.");
                }
            }

            /*Si llega una foto, debemos reemplazarla, sino llega nada dejar tal y como está.*/
            /*Actualizar SESSION; nombre, apellidos, img, */
            $sql  = "SELECT cod_empresario as cod_usuario, razon_social, nombres,apellidos, c.descripcion as cargo,
                        img_logo as img_perfil 
                        FROM empresario e 
                        INNER JOIN cargo c ON c.cod_cargo = e.cargo WHERE cod_empresario = :0";
            $nuevoUsuario = $this->consultarFila($sql, [$this->getCodEmpresario()]);

            $usuario  = [
                            "nombres"=>$nuevoUsuario["nombres"],
                            "apellidos"=>$nuevoUsuario["apellidos"],
                            "empresa"=>$nuevoUsuario["razon_social"],
                            "cargo"=>$nuevoUsuario["cargo"],
                            "cod_usuario" => $nuevoUsuario["cod_usuario"],
                            "url"=>$nuevoUsuario["img_perfil"]
                        ];

            $_SESSION["usuario"] = $usuario;

            $this->commit();
            return array("rpt"=>true,"msj"=>"Datos de empresa guardados", "data_usuario"=>$usuario);
        } catch (Exception $exc) {
            $this->rollBack();
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function cargarDatosFormulario(){
        try {
            $r = array();

            $sql = "SELECT cod_tipo_empresa as id, descripcion FROM tipo_empresa WHERE estado_mrcb = 1 ORDER BY descripcion";
            $r["tipo_empresas"] = $this->consultarFilas($sql);

            $sql = "SELECT cod_sector_industrial as id, descripcion FROM sector_industrial WHERE estado_mrcb = 1 ORDER BY descripcion";
            $r["sectores_industriales"] = $this->consultarFilas($sql);

            $sql = "SELECT cod_cargo as id, descripcion FROM cargo WHERE estado_mrcb = 1 ORDER BY descripcion";
            $r["cargos"] = $this->consultarFilas($sql);

            $sql = "SELECT cod_ubigeo_region as id, nombre as descripcion FROM ubigeo_region";
            $r["regiones"] = $this->consultarFilas($sql);
            
            return array("rpt"=>true,"r"=>$r);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function listar($filtro_ruc, $filtro_razonsocial, $filtro_estado){
        try {

            if ($filtro_estado == '-1'){
                $filtro_estado = " ";
            } else {
                $filtro_estado = " AND e.estado = '".$filtro_estado."'";
            }

            $sql = "SELECT
                    e.cod_empresario,
                    e.razon_social,
                    e.ruc,
                    (e.nombres||' '||e.apellidos) as empresario,
                    COALESCE(e.celular, '-') as celular,
                    c.descripcion as cargo,
                    COALESCE(si.descripcion,'-') as sector_industrial,
                    COALESCE(te.descripcion,'-') as tipo_empresa,
                    e.correo,
                    (CASE e.estado WHEN 'I' THEN 'INACTIVO' ELSE 'ACTIVO' END)  as estado
                    FROM empresario e 
                    LEFT JOIN cargo c ON e.cargo = c.cod_cargo
                    LEFT JOIN sector_industrial si ON e.cod_sector_industrial = si.cod_sector_industrial
                    LEFT JOIN tipo_empresa te ON e.cod_tipo_empresa = te.cod_tipo_empresa
                    WHERE
                        e.estado_mrcb = 1 AND e.ruc LIKE '%".$filtro_ruc."%' AND
                        UPPER(e.razon_social) LIKE '%".strtoupper($filtro_razonsocial)."%' 
                        ".$filtro_estado."
                    ORDER BY e.razon_social";

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
            $sql = "SELECT cod_empresario, ruc, razon_social, nombres, apellidos, celular, descripcion_empresa, domicilio, 
                    cod_ubigeo_region, cod_ubigeo_provincia, cod_ubigeo_distrito, cargo as cod_cargo, cod_sector_industrial, cod_tipo_empresa, correo                    
                    FROM empresario e WHERE cod_empresario = :0";
            $resultado = $this->consultarFila($sql,array($this->getCodEmpresario()));

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


    public function obtenerEmpresariosCB(){
        try {
            $sql = "SELECT cod_empresario as id, CONCAT('[',ruc,']',' - ',razon_social)  as descripcion FROM empresario WHERE estado_mrcb = 1 ORDER BY razon_social";
            $resultado = $this->consultarFilas($sql);

            return array("rpt"=>true,"r"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
        }
    }

}