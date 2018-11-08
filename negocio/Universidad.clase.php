<?php

require_once '../datos/Conexion.clase.php';

class Universidad extends Conexion {
    
    private $cod_universidad;
    private $descripcion;
    private $estado_mrcb;

    public function getCodUniversidad()
    {
        return $this->cod_universidad;
    }
        
    public function setCodUniversidad($cod_universidad)
    {
        $this->cod_universidad = $cod_universidad;
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

    public function getEstadoMrcb()
    {
        return $this->estado_mrcb;
    }
    
    
    public function setEstadoMrcb($estado_mrcb)
    {
        $this->estado_mrcb = $estado_mrcb;
        return $this;
    }

    private function verificarRepetidoAgregar(){
        $sql = "SELECT COUNT(descripcion) > 0 FROM universidad WHERE upper(descripcion) = upper(:0) AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion()]);
    }

    private function verificarRepetidoEditar(){
        $sql = "SELECT COUNT(descripcion) > 0 FROM universidad WHERE upper(descripcion) = upper(:0) AND cod_universidad <>:1 AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion(), $this->getCodUniversidad()]);
    }

    public function agregar($JSONData) {
        $this->beginTransaction();
        try {            
            $obj = json_decode($JSONData);
            $this->setDescripcion($obj->descripcion);
            
            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe esta universidad.");
            }

            $campos_valores = 
            array("descripcion"=>$this->getDescripcion());

            $this->insert("universidad", $campos_valores);

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
            $this->setCod_carrera_uni($obj->id);
            $this->setDescripcion($obj->descripcion);

            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe esta universidad.");
            }

            $campos_valores = 
            array(  "descripcion"=>$this->getDescripcion() );

            $campos_valores_where = 
            array(  "cod_universidad"=>$this->getCodUniversidad());

            $this->update("universidad", $campos_valores,$campos_valores_where);

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
            $sql = "SELECT * FROM universidad WHERE estado_mrcb = 1 ORDER BY descripcion DESC";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    }

    public function leerDatos($id){
        try {
            $sql = "SELECT cod_universidad as id, descripcion FROM universidad WHERE cod_universidad = :0";
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
            $this->setCodUniversidad($id);    

            $campos_valores = 
            array(  "estado_mrcb"=>0);

            $campos_valores_where = 
            array(  "cod_universidad"=>$this->getCodUniversidad());

            $this->update("universidad", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha eliminado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->cargolBack();
            throw $exc;
        }
    }
}