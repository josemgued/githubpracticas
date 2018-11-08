<?php

require_once '../datos/Conexion.clase.php';

class Personal extends Conexion {
    private $cod_personal;
    private $nombres_apellidos;
    private $login;
    private $clave;
    private $id_rol;
    private $estado;

   public function getCodPersonal()
   {
       return $this->cod_personal;
   }
   
   
   public function setCodPersonal($cod_personal)
   {
       $this->cod_personal = $cod_personal;
       return $this;
   }

   public function getNombresApellidos()
   {
       return $this->nombres_apellidos;
   }
   
   
   public function setNombresApellidos($nombres_apellidos)
   {
       $this->nombres_apellidos = $nombres_apellidos;
       return $this;
   }

   public function getLogin()
   {
       return $this->login;
   }
   
   
   public function setLogin($login)
   {
       $this->login = $login;
       return $this;
   }

   public function getClave()
   {
       return $this->clave;
   }
   
   
   public function setClave($clave)
   {
       $this->clave = $clave;
       return $this;
   }

   public function getIdRol()
   {
       return $this->id_rol;
   }
   
   
   public function setIdRol($id_rol)
   {
       $this->id_rol = $id_rol;
       return $this;
   }

   public function getEstado()
   {
       return $this->estado;
   }
   
   
   public function setEstado($estado)
   {
       $this->estado = $estado;
       return $this;
   }

   public function iniciarSesionWeb()
   {
        try {            
            $sql = " SELECT cod_personal, nombres_apellidos, login, clave, cod_rol, estado FROM personal WHERE login = :0";
            $res = $this->consultarFila($sql, array($this->getLogin()));

            if ($res != false){

                if ($res["estado"] == 'A'){
                    if ($res["clave"] == md5($this->getClave())){

                        $_SESSION["usuario"] =  array(
                                    "nombres_apellidos"=> $res["nombres_apellidos"],
                                    "cod_usuario"=> $res["cod_personal"],
                                    "rol"=> "ADMINISTRADOR",
                                    "login"=> $res["login"],
                                    "cod_rol"=> $res["cod_rol"]
                                    );

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

    public function cerrarSesionWeb()
    {
        try {
            session_destroy();
            return array("rpt"=>true,"msj"=>"Sesión cerrada.");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc->getMessage());
        }
    }          

}