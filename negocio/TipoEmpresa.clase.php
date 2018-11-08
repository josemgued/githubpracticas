<?php

require_once '../datos/Conexion.clase.php';

class TipoEmpresa extends Conexion {
    private $cod_tipo_empresa;
    private $descripcion;

    public function getCod_tipo_empresa()
    {
        return $this->cod_tipo_empresa;
    }
    
    public function setCod_tipo_empresa($cod_tipo_empresa)
    {
        $this->cod_tipo_empresa = $cod_tipo_empresa;
        return $this;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }
    
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    private function verificarRepetidoAgregar(){
        $sql = "SELECT COUNT(descripcion) > 0 FROM tipo_empresa WHERE upper(descripcion) = upper(:0) AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion()]);
    }

    private function verificarRepetidoEditar(){
        $sql = "SELECT COUNT(descripcion) > 0 FROM tipo_empresa WHERE upper(descripcion) = upper(:0) AND cod_tipo_empresa <>:1 AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion(), $this->getcod_tipo_empresa()]);
    }

    public function agregar($JSONData) {
        $this->beginTransaction();
        try {            
            $obj = json_decode($JSONData);
            $this->setDescripcion($obj->descripcion);
            
            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe este tipo de empresa.");
            }

            $campos_valores = 
            array("descripcion"=>$this->getDescripcion());

            $this->insert("tipo_empresa", $campos_valores);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha agregado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->tipo_empresalBack();
            throw $exc;
        }
    }

    public function editar($JSONData) {
        $this->beginTransaction();
        try { 

            $obj = json_decode($JSONData);
            $this->setCod_tipo_empresa($obj->id);
            $this->setDescripcion($obj->descripcion);

            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe este tipo de empresa");
            }

            $campos_valores = 
            array(  "descripcion"=>$this->getDescripcion() );

            $campos_valores_where = 
            array(  "cod_tipo_empresa"=>$this->getcod_tipo_empresa());

            $this->update("tipo_empresa", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha actualizado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->tipo_empresalBack();
            throw $exc;
        }
    }

    public function listar(){
        try {
            $sql = "SELECT * FROM tipo_empresa WHERE estado_mrcb = 1 ORDER BY descripcion";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    }

    public function leerDatos($id){
        try {
            $sql = "SELECT cod_tipo_empresa as id, descripcion FROM tipo_empresa WHERE cod_tipo_empresa = :0";
            $resultado = $this->consultarFila($sql,array($id));
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    }

    public function darBaja($id) {
        $this->beginTransaction();
        try {            
            $this->setcod_tipo_empresa($id);    

            $campos_valores = 
            array(  "estado_mrcb"=>0);

            $campos_valores_where = 
            array(  "cod_tipo_empresa"=>$this->getcod_tipo_empresa());

            $this->update("tipo_empresa", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha eliminado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->tipo_empresalBack();
            throw $exc;
        }
    }

    public function obtenerTipoEmpresas(){
        try{

            $sql = "SELECT cod_tipo_empresa as codigo, descripcion FROM tipo_empresa WHERE estado_mrcb = 1 ORDER BY descripcion";
            $r = $this->consultarFilas($sql);

            return array("rpt"=>true,"r"=>$r);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

}