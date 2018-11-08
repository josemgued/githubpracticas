<?php 

require_once '../../datos/Conexion.clase.php';
require_once '../../datos/local_config_web.php';

Class AccesoAuxiliar extends Conexion{
	
	private $idRol;
	private $descripcionRol;
	private $idUsuario;
	private $usuario;
	private $correo;

	private $URL = "";
	private $ID_URL_PADRE = "";

	public function getIdRol()
	{
	    return $this->idRol;
	}
	
	
	public function setIdRol($idRol)
	{
	    $this->idRol = $idRol;
	    return $this;
	}

	public function getDesripcionRol()
	{
	    return $this->desripcionRol;
	}
	
	
	public function setDesripcionRol($desripcionRol)
	{
	    $this->desripcionRol = $desripcionRol;
	    return $this;
	}

	public function getIdUsuario()
	{
	    return $this->idUsuario;
	}
	
	
	public function setIdUsuario($idUsuario)
	{
	    $this->idUsuario = $idUsuario;
	    return $this;
	}

	public function getUsuario()
	{
	    return $this->usuario;
	}
	
	
	public function setUsuario($usuario)
	{
	    $this->usuario = $usuario;
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

	public function getMenu()
	{
		return $this->phpMenu;
	}

	public function __construct()
	{	
		parent::__construct();
		$objUsuario = $_SESSION["usuario"];
		$this->usuario = $objUsuario["nombres_apellidos"];
		$this->idRol = $objUsuario["cod_rol"];
		$this->descripcionRol = $objUsuario["rol"];
		$this->idUsuario = $objUsuario["cod_usuario"];
		$this->correo = $objUsuario["login"];

		/* OBTENGO MI URL */
		$arr = explode("/",$_SERVER["PHP_SELF"]);
        $interfaz = $arr[count($arr) - 2];
        $this->URL = $interfaz;
        /* ID PARA MENU */
        $this->ID_URL_PADRE = $this->consultarValor("SELECT padre FROM permiso WHERE url = :0", ['../'.$this->URL]);     

        $permisoURL = $this->consultarValor("SELECT COUNT(pr.cod_permiso) > 0 FROM permiso p
								INNER JOIN permiso_rol pr ON pr.cod_permiso = p.cod_permiso
								WHERE url = :0 AND pr.cod_rol = :1 AND pr.estado ='A'", ['../'.$this->URL,$this->idRol]);
		/*Funcion para verificar si es que mi acceso*/
		/*escribir funcion*/
		if(!$permisoURL){
			header("location: ../error403.php");
		}

		/*Escribir funcion*/
		$this->phpMenu = $this->obtenerMenu();
	}

	public function __desctruct()
	{
		parent::__desctruct();	
		session_destroy(_SESION_);
	}

	public function dibujarMenu()
    {
        $arr = explode("/",$_SERVER["PHP_SELF"]);
        $interfaz = $arr[count($arr) - 2];

        return $this->dibujarFila($this->crearMenu());
    }

    public function crearMenu($padre = NULL)
    {	
    	//?$this->idRol
        $sql = "SELECT pr.cod_permiso, p.es_menu_interfaz, p.titulo_interfaz, p.url, p.icono_interfaz, p.padre 
        		FROM permiso_rol pr 
        		INNER JOIN permiso p ON p.cod_permiso = pr.cod_permiso
        		WHERE pr.estado = 'A' AND pr.cod_rol = :0 AND p.padre";
        if ($padre == NULL){
            $sql .= " IS NULL ORDER BY 1";
            $hijos = $this->consultarFilas($sql,[$this->idRol]);
            $padre = array("cod_permiso"=>0);
        } else {
            $sql .= " = :1 ORDER BY 1";
            $hijos = $this->consultarFilas($sql, [$this->idRol,$padre["cod_permiso"]]);
        }

        if (count($hijos)){
            $padre["hijos"] = array();
            foreach ($hijos as $key => $value) {
                array_push($padre["hijos"], $this->crearMenu($value));
            }  
        }

        return $padre;
    }


    public function dibujarFila($item)
    {
        $html = "";        

        if ( !array_key_exists("hijos",$item) || count( $item["hijos"] ) <= 0){
            $active = ('../'.$this->URL == $item["url"])? 'class="active"' : '';
            $html.= '<li '.$active.'><a href="'.$item["url"].'">'.$item["titulo_interfaz"].'</a></li>';
        } else {
            if ($item["cod_permiso"] == 0 ){
                foreach ($item["hijos"] as $key => $value) {
                    $html.= $this->dibujarFila($value);
                }
            } else {
                $html.= '<li>';
                $toggled = ($this->ID_URL_PADRE == $item["cod_permiso"]) ?  'toggled' : '';
                $html.= '<a href="javascript:void(0);" class="menu-toggle '.$toggled.'">';
                $html.= '<i class="material-icons">'.$item["icono_interfaz"].'</i>';
                $html.= '<span>'.$item["titulo_interfaz"].'</span>';
                $html.= '</a>';
                $html.= '<ul class="ml-menu">';
                foreach ($item["hijos"] as $key => $value) {
                    $html.= $this->dibujarFila($value);
                }
                $html.= '</ul>';
            $html.= '</li>';
            }
            
        }

        return $html;
    }


    public function obtenerMenu()
    {         
        return $this->dibujarFila( $this->crearMenu() );        
    }

};

?>