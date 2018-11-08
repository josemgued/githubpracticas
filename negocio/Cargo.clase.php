<?php

require_once '../datos/Conexion.clase.php';

class Cargo extends Conexion {
    private $cod_cargo;
    private $descripcion;

    public function getCod_cargo()
    {
        return $this->cod_cargo;
    }
    
    public function setCod_cargo($cod_cargo)
    {
        $this->cod_cargo = $cod_cargo;
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
        $sql = "SELECT COUNT(descripcion) > 0 FROM cargo WHERE upper(descripcion) = upper(:0) AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion()]);
    }

    private function verificarRepetidoEditar(){
        $sql = "SELECT COUNT(descripcion) > 0 FROM cargo WHERE upper(descripcion) = upper(:0) AND cod_cargo <>:1 AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion(), $this->getcod_cargo()]);
    }

    public function agregar($JSONData) {
        $this->beginTransaction();
        try {            
            $obj = json_decode($JSONData);
            $this->setDescripcion($obj->descripcion);
            
            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe este cargo.");
            }

            $campos_valores = 
            array("descripcion"=>$this->getDescripcion());

            $this->insert("cargo", $campos_valores);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha agregado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->cargolBack();
            throw $exc;
        }
    }

    public function editar($JSONData) {
        $this->beginTransaction();
        try { 

            $obj = json_decode($JSONData);
            $this->setCod_cargo($obj->id);
            $this->setDescripcion($obj->descripcion);

            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe este cargo");
            }

            $campos_valores = 
            array(  "descripcion"=>$this->getDescripcion() );

            $campos_valores_where = 
            array(  "cod_cargo"=>$this->getcod_cargo());

            $this->update("cargo", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha actualizado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->cargolBack();
            throw $exc;
        }
    }

    public function listar(){
        try {
            $sql = "SELECT * FROM cargo WHERE estado_mrcb = 1 ORDER BY descripcion DESC";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    }

    public function leerDatos($id){
        try {
            $sql = "SELECT cod_cargo as id, descripcion FROM cargo WHERE cod_cargo = :0";
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
            $this->setcod_cargo($id);    

            $campos_valores = 
            array(  "estado_mrcb"=>0);

            $campos_valores_where = 
            array(  "cod_cargo"=>$this->getcod_cargo());

            $this->update("cargo", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha eliminado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->cargolBack();
            throw $exc;
        }
    }

    public function obtenerCargos(){
        try{

            $sql = "SELECT cod_cargo as codigo, descripcion FROM cargo ORDER BY descripcion DESC";
            $r = $this->consultarFilas($sql);

            return array("rpt"=>true,"r"=>$r);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

}