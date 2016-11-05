<?php
	require_once 'connection.php';

	$stmt = $conn->prepare("CALL spGetDataTypes()");

	$stmt->execute();
	
	$array = $stmt->fetchAll(PDO::FETCH_ASSOC);	
	
	echo json_encode($array);
?>