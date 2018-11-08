<?php 

	$html = "";
	foreach ($arMant as $key => $value) {
		$active ="";
		if ($key == 0){
		}	
	?>

		<div role="tabpanel" class="tab-pane fade <?php echo $active; ?>" id="<?php echo $value["src"]; ?>">';
			<?php include "_t/_tpl8_tab_".$value["src"].".php";?>
		</div>
	<?php
	}
	?>

