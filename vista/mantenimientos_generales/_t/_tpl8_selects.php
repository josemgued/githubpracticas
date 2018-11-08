<?php 

	$html = '<option value="">Seleccione una opción</option>';
	foreach ($arMant as $key => $value) {
		$html.= '<option value="'.$value["src"].'">'.$value["titulo"].'</option>';
	}

	echo $html;
?>
