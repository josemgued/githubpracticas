<?php

require_once '../datos/Conexion.clase.php';

class Ubigeo extends Conexion {

    private $cod_ubigeo_region;
    private $cod_ubigeo_provincia;
    private $cod_ubigeo_distrito;

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

    public function cargarProvincias($sql = null){
        try {
            if (!$sql){
                $sql = "SELECT cod_ubigeo_provincia as codigo, nombre FROM ubigeo_provincia WHERE cod_ubigeo_region = :0";
            }
            $resultado = $this->consultarFilas($sql,array($this->getCodUbigeoRegion()));

            return array("rpt"=>true,"data"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function cargarDistritos($sql = null){
        try {
            if (!$sql){
                $sql = "SELECT cod_ubigeo_distrito as codigo, nombre FROM ubigeo_distrito WHERE  cod_ubigeo_region = :0 AND cod_ubigeo_provincia = :1";
            }
            $resultado = $this->consultarFilas($sql,array($this->getCodUbigeoRegion(),$this->getCodUbigeoProvincia()));

            return array("rpt"=>true,"data"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function cargarProvinciasW(){
        $sql = "SELECT cod_ubigeo_provincia as id, nombre as descripcion FROM ubigeo_provincia WHERE cod_ubigeo_region = :0";
        return $this->cargarProvincias($sql);
    }

    public function cargarDistritosW(){
        $sql = "SELECT cod_ubigeo_distrito as id, nombre as descripcion FROM ubigeo_distrito WHERE  cod_ubigeo_region = :0 AND cod_ubigeo_provincia = :1";
        return $this->cargarDistritos($sql);
    }

}