<?php

require_once '../datos/Conexion.clase.php';

class CarreraUniversitaria extends Conexion {
    
    private $cod_carrera_uni;
    private $descripcion;

    public function getCod_carrera_uni()
    {
        return $this->cod_carrera_uni;
    }
    
    
    public function setCod_carrera_uni($cod_carrera_uni)
    {
        $this->cod_carrera_uni = $cod_carrera_uni;
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
        $sql = "SELECT COUNT(descripcion) > 0 FROM carrera_universitaria WHERE upper(descripcion) = upper(:0) AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion()]);
    }

    private function verificarRepetidoEditar(){
        $sql = "SELECT COUNT(descripcion) > 0 FROM carrera_universitaria WHERE upper(descripcion) = upper(:0) AND cod_carrera_uni <>:1 AND estado_mrcb = 1 ";
        return $this->consultarValor($sql, [$this->getDescripcion(), $this->getCod_carrera_uni()]);
    }

    public function agregar($JSONData) {
        $this->beginTransaction();
        try {            
            $obj = json_decode($JSONData);
            $this->setDescripcion($obj->descripcion);
            
            if ($this->verificarRepetidoEditar()){
                return array("rpt"=>false,"msj"=>"Ya existe esta carrera universitaria.");
            }

            $campos_valores = 
            array("descripcion"=>$this->getDescripcion());

            $this->insert("carrera_universitaria", $campos_valores);

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
                return array("rpt"=>false,"msj"=>"Ya existe este carrera universitaria.");
            }

            $campos_valores = 
            array(  "descripcion"=>$this->getDescripcion() );

            $campos_valores_where = 
            array(  "cod_carrera_uni"=>$this->getCod_carrera_uni());

            $this->update("carrera_universitaria", $campos_valores,$campos_valores_where);

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
            $sql = "SELECT * FROM carrera_universitaria WHERE estado_mrcb = 1 ORDER BY descripcion";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;            
        }
    }

    public function leerDatos($id){
        try {
            $sql = "SELECT cod_carrera_uni as id, descripcion FROM carrera_universitaria WHERE cod_carrera_uni = :0";
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
            $this->setCod_carrera_uni($id);    

            $campos_valores = 
            array(  "estado_mrcb"=>0);

            $campos_valores_where = 
            array(  "cod_carrera_uni"=>$this->getCod_carrera_uni());

            $this->update("carrera_universitaria", $campos_valores,$campos_valores_where);

            $this->commit();
            return array("rpt"=>true,"msj"=>"Se ha eliminado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->cargolBack();
            throw $exc;
        }
    }

    public function listarBuscarCarreras(){
        try {

            $sql = "SELECT cu.cod_carrera_uni as codigo, cu.descripcion as nombre_carrera,
                        (SELECT COUNT(cod_aviso_laboral) 
                            FROM aviso_laboral al WHERE al.estado_mrcb = 1 AND al.estado = 'A'
                            AND fecha_vencimiento >= current_date AND fecha_lanzamiento <= current_date  AND al.cod_carrera_uni = cu.cod_carrera_uni) as num_convocatorias 
                    FROM carrera_universitaria cu WHERE estado_mrcb = 1  ORDER BY descripcion";

            $resultado = $this->consultarFilas($sql);

            return array("rpt"=>true,"data"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    public function listarCarreraYUniversidad(){
        try {

            $sql = "SELECT cu.cod_carrera_uni as codigo, cu.descripcion as nombre_carrera 
                    FROM carrera_universitaria cu WHERE estado_mrcb = 1  ORDER BY descripcion";

            $carreras = $this->consultarFilas($sql);


            $sql = "SELECT cod_universidad as codigo, descripcion as nombre_universidad 
                    FROM universidad WHERE estado_mrcb = 1  ORDER BY descripcion";

            $universidades = $this->consultarFilas($sql);

            return array("rpt"=>true,"data"=>["carreras"=>$carreras,"universidades"=>$universidades]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }

    
}