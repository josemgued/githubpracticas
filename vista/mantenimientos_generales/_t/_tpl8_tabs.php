<?php 

	$html = "";
	foreach ($arMant as $key => $value) {
		$active ="";

		$html.= '<li role ="presentation" '.$active.'>';
		$html.= '<a href="#'.$value["src"].'" data-objeto="'.$value["jsObj"].'" data-toggle="tab" aria-expanded="false">';
		$html.= '<i class="material-icons">settings</i> '.$value["titulo"];
		$html.= '</a></li>';
	}

	echo $html;
?>
