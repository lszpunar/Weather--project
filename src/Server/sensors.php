<?php
	require_once 'connection.php';
	
	if (isset($_GET['SensorCode'])) {
    $SensorCodeParam = $_GET['SensorCode'];
} else {
    $SensorCodeParam = '';
    echo "Wymagany 'kod sensora'";
}
	
	/* $stmt = $conn->prepare("CALL spGetSensors()"); */
	$stmt = $conn->prepare("CALL spGetSensors(:SensorCode)");

	
$sensorParams = array(
    "SensorCode" => $SensorCodeParam
);
	
	foreach ($sensorParams as $k => $v) {
    /* echo "klucz: $k, Wartosc: $v"; */
    $stmt->bindValue(':' . $k, $v);
}
	$stmt->execute();
	
	$array = $stmt->fetchAll(PDO::FETCH_ASSOC);	
	
	echo json_encode($array);
?>