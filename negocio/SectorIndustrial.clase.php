<?php

require_once '../datos/Conexion.clase.php';

class SectorIndustrial extends Conexion {
    private $cod_sector_industrial;
    private $descripcion;

    public function getCod_sector_industrial()
    {
        return $this->cod_sector_industrial;
    }
    
    public function setCod_sector_industrial($cod_sector_industrial)
    {
        $this->cod_sector_industrial = $cod_sector_industrial;
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
        $sql = "SELECT COUNT(descripcion) > 0 FROM sector_industrial WHERE upper(descripcion) = upper(:0) AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion()]);
    }

    private function verificarRepetidoEditar(){
        $sql = "SELECT COUNT(descripcion) > 0 FROM sector_industrial WHERE upper(descripcion) = upper(:0) AND cod_sector_industrial <>:1 AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion(), $this->getcod_sector_industrial()]);
    }

    public function agregar($JSONData) {
        $this->beginTransaction();
        try {            
            $obj = json_decode($JSONData);
            $this->setDescripcion($obj->descripcion);
            
            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe este sector industrial.");
            }

            $campos_valores = 
            array("descripcion"=>$this->getDescripcion());

            $this->insert("sector_industrial", $campos_valores);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha agregado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->sector_industriallBack();
            throw $exc;
        }
    }

    public function editar($JSONData) {
        $this->beginTransaction();
        try { 

            $obj = json_decode($JSONData);
            $this->setCod_sector_industrial($obj->id);
            $this->setDescripcion($obj->descripcion);

            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe este sector industrial");
            }

            $campos_valores = 
            array(  "descripcion"=>$this->getDescripcion() );

            $campos_valores_where = 
            array(  "cod_sector_industrial"=>$this->getcod_sector_industrial());

            $this->update("sector_industrial", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha actualizado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->sector_industriallBack();
            throw $exc;
        }
    }

    public function listar(){
        try {
            $sql = "SELECT * FROM sector_industrial WHERE estado_mrcb = 1 ORDER BY descripcion";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    }

    public function leerDatos($id){
        try {
            $sql = "SELECT cod_sector_industrial as id, descripcion FROM sector_industrial WHERE cod_sector_industrial = :0";
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
            $this->setcod_sector_industrial($id);    

            $campos_valores = 
            array(  "estado_mrcb"=>0);

            $campos_valores_where = 
            array(  "cod_sector_industrial"=>$this->getcod_sector_industrial());

            $this->update("sector_industrial", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha eliminado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->sector_industriallBack();
            throw $exc;
        }
    }

    public function obtenerSectorIndustrials(){
        try{

            $sql = "SELECT cod_sector_industrial as codigo, descripcion FROM sector_industrial ORDER BY descripcion";
            $r = $this->consultarFilas($sql);

            return array("rpt"=>true,"r"=>$r);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

}