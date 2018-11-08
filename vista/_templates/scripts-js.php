<?php 
      if (MODO_PRODUCCION){
            echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/js/bootstrap-select.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.0/jquery.slimscroll.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/node-waves/0.7.5/waves.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/mouse0270-bootstrap-notify/3.1.3/bootstrap-notify.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-datetimepicker/2.0.0/js/bootstrap-material-datetimepicker.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.0.0/sweetalert.min.js"></script>
                <script src="../../js/full.produccion.min.js"></script>';

        } else {
            echo '<!-- Jquery Core Js -->
                <script src="../../plugins/jquery/jquery.min.js"></script>

                <!-- Bootstrap Core Js -->
                <script src="../../plugins/bootstrap/js/bootstrap.min.js"></script>

                <!-- HBARS Js -->
                <script src="../../plugins/handlebars/handlebars.min.js"></script>

                <!-- Select Plugin Js -->
                <script src="../../plugins/bootstrap-select/js/bootstrap-select.min.js"></script>

                <!-- Slimscroll Plugin Js -->
                <script src="../../plugins/jquery-slimscroll/jquery.slimscroll.js"></script>

                <!-- Waves Effect Plugin Js -->
                <script src="../../plugins/node-waves/waves.min.js"></script>

                <!-- Moment.js -->
                <script src="../../plugins/momentjs/moment.js"></script>

                <script src="../../plugins/bootstrap-notify/bootstrap-notify.min.js"></script>

                <!-- Moment.js -->
                <script src="../../plugins/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js"></script>

                <script src="../../plugins/sweetalert/sweetalert.min.js"></script>
                
                <!-- Custom Js -->
                <script src="../../js/admin.js"></script>

                <!-- Demo Js -->
                <script src="../../js/demo.js"></script>

                <!-- Ajxur -->
                <script src="../../js/Ajxur.js"></script>
                <!-- Util -->
                <script src="../../js/Util.js"></script>';
        }

 ?>
    <!-- PROPIO -->
    <script src="index.js"></script>
