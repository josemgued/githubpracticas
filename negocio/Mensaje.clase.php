 <?php

require_once 'util/Funciones.php';

class Mensaje {

    private $asunto;
    private $para;
    private $mensaje;

    public $empresa = "APPRACTICAR";

    public function getAsunto()
    {
        return $this->asunto;
    }
    
    
    public function setAsunto($asunto)
    {
        $this->asunto = $asunto;
        return $this;
    }

    public function getPara()
    {
        return $this->para;
    }
    
    
    public function setPara($para)
    {
        $this->para = $para;
        return $this;
    }


    public function getMensaje()
    {
        return $this->mensaje;
    }
    
    
    public function setMensaje($mensaje)
    {
        $this->mensaje = $mensaje;
        return $this;
    }

    public function getPie()
    {
        return '<br></td></tr><tr style="font-size:12px;border-top: 1px solid gray;"><td style="text-align:right"><small>Por CompuCodex</small></td></tr></table></body></html>';
    }

    public function getCabecera()
    {

        return '<html style="font-family: arial;" lang="es">'.
                    '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head>'.
                    '<body>'.
                    '<table style="border-collapse:collapse">'.
                    '<tr style="vertical-align: bottom;border-bottom:1px solid gray"><td><h2>'.$this->empresa.'</h2></td></tr>'.
                    '<tr><td><br>';
    }
    
    

    
    public function enviarCorreo($tipo){
        //require 'PHPMailer-master/PHPMailerAutoload.php';
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
        
        require 'PHPMailer-master/src/Exception.php';
        require 'PHPMailer-master/src/PHPMailer.php';
        require 'PHPMailer-master/src/SMTP.php';
     
        use PHPMailer\PHPMailer\PHPMailer;
        use PHPMailer\PHPMailer\Exception;
     
        switch($tipo){
            case "PRESELECCIONAR":
            return $this->enviarCorreoPreseleccionar();
            break;
            case "ACEPTADO":
            case "RECHAZADO":
            return $this->enviarCorreoValidacion($tipo);            
            break;
            case "CONFIRMAR_CUENTA";
            return $this->enviarCorreoConfirmacion();     
            break;
        }

    }

    private function getMensajeArmado(){
        return $this->getCabecera().$this->getMensaje().$this->getPie();
    }

    private function enviarCorreoPreseleccionar(){
        $this->setAsunto($this->empresa." - PRESELECCION EN CONVOCATORIA.");
        $estudiante = $this->getPara();

        $this->setMensaje('Estimado(a): '.$estudiante["nombres_estudiante"].'. <br>'.
                    'Ha sido preseleccionado en nuestra convocatoria: <b> '.$estudiante["convocatoria"].'</b><br>'.
                    'No estaremos comunicando vía celular con Ud. lo más pronto posible para continuar con el proceso de selección.<br><br>'.
                    'Muchas gracias.<br>');

        $data = Funciones::enviarCorreo($this->asunto,$this->getMensajeArmado(),$this->empresa,trim($estudiante["correo"]));

        return ["rpt"=>true, "msj"=>"Mensaje enviado","data"=>$data];
        
    }

    private function enviarCorreoValidacion($tipo_validacion){
        $this->setAsunto($this->empresa." - VALIDACIÓN ESTUDIANTE");
        $estudiante = $this->getPara();

        $mensaje = 'Estimado(a): '.$estudiante["nombres_estudiante"].'. <br>'.
                    'Ha sido <b>'.$tipo_validacion.'</b> en '.$this->empresa.', debido a que se han validado los datos ingresados en la creación de su cuenta.<br>'.
                    'Y sobre todo su CODIGO UNIVERSITARIO: <i>'.$estudiante["codigo_universitario"].'</i><br>';

        $mensaje .= ($tipo_validacion == "ACEPTADO" ? 'Ya' : 'No').' puede hacer uso de nuestra plataforma<br><br>'.
                    'Muchas gracias por su tiempo.<br>';
        $this->setMensaje($mensaje);

        $data = Funciones::enviarCorreo($this->asunto,$this->getMensajeArmado(),$this->empresa,trim($estudiante["correo"]));

        return ["rpt"=>true, "msj"=>"Mensaje enviado","data"=>$data];
    }   

    private function enviarCorreoConfirmacion(){
        $this->setAsunto($this->empresa." - CONFIRMAR CUENTA");
        $persona = $this->getPara();
        $tipoUsuario = "dni";
        $mensajeExtra = "";
        if ($persona["razon_social"] != ""){
            $mensajeExtra .= 'de '.$persona["razon_social"].' ';
            $tipoUsuario = "ruc";
        }


        //$HOST = "http://localhost/appJoseServer";
        $HOST = "https://serverpracticas.herokuapp.com";
        $HOST .= "/vista/validacion_cuenta?pid=".md5($persona["correo"])."&tuser=".md5($tipoUsuario);

        $mensaje = 'Estimado(a): <b>'.$persona["nombres_persona"].' '.$mensajeExtra.'</b><br>';
       
        $mensaje .= 'Bienvenido a nuestra app! <br>';
        $mensaje .= 'Para finalizar su registro, debe confirmar su cuenta accediendo al siguiente enlace: <br><br>';
        $mensaje .= '<a href="'.$HOST.'">'.$HOST.'</a> <br><br>';
        $mensaje .= 'Si no puede abrir el enlace, copie y pegue la direccion web en su navegador de preferencia.<br><br>';

        $mensaje .= 'Muchas gracias por su tiempo.<br>';
        $this->setMensaje($mensaje);

        $data = Funciones::enviarCorreo($this->asunto,$this->getMensajeArmado(),$this->empresa,trim($persona["correo"]));

        return ["rpt"=>true, "msj"=>"Mensaje enviado","data"=>$data];
    }   

}


