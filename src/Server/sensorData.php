<?php
ini_set('memory_limit', '-1');
//http://iteon.pl/pogoda/sensorData.php?SensorCode=2&StartDate=2016-01-01&EndDate=2016-12-30

require_once 'connection.php';

if (isset($_GET['SensorCode'])) {
    $SensorCodeParam = $_GET['SensorCode'];
} else {
    $SensorCodeParam = '';
    echo "Wymagany 'kod sensora'";
}

if (isset($_GET['StartDate'])) {
    $StartDate = $_GET['StartDate'];
} else {
    $StartDate = '';
    echo "Wymagana 'data od'";
}

if (isset($_GET['EndDate'])) {
    $EndDate = $_GET['EndDate'];
} else {
    $EndDate = '';
    echo "Wymagana 'data do'";
}

	$stmt = $conn->prepare("CALL spGetSensors(:SensorCode)");

	
$sensorParams = array(
    "SensorCode" => $SensorCodeParam
);
	
	foreach ($sensorParams as $k => $v) {
    /* echo "klucz: $k, Wartosc: $v"; */
    $stmt->bindValue(':' . $k, $v);
}
	
	$stmt->execute();
	
	$sensors_array = $stmt->fetchAll(PDO::FETCH_ASSOC);	

	// pobranie listy rejestrowanych wielkosci
	$stmt = $conn->prepare("CALL spGetDataTypes()");

	$stmt->execute();
	
	$datatypes_array = $stmt->fetchAll(PDO::FETCH_ASSOC);	

	
// pobranie labelek
$stmt = $conn->prepare("CALL sp_make_intervals_formated(:StartDate,:EndDate,:intval,:unitval)");

$dataParams = array(
    "StartDate" => $StartDate,
    "EndDate" => $EndDate,
    "intval" => '15',
    "unitval" => 'MINUTE'
);

foreach ($dataParams as $k => $v) {
    /* echo "klucz: $k, Wartosc: $v"; */
    $stmt->bindValue(':' . $k, $v);
}
try {
    $stmt->execute();
    
    $dataArray = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
catch (PDOException $e) {
    die($e->getMessage());
}

// Pobranie danych
$stmt = $conn->prepare("CALL spGetDataSensor(:SensorCode,:StartDate,:EndDate)");
/* $stmt = $conn->prepare("CALL spGetDataSensorBySequence(:SensorCode,:StartDate,:EndDate,:intval,:unitval)"); */

$params = array(
    "SensorCode" => $SensorCodeParam,
    "StartDate" => $StartDate,
    "EndDate" => $EndDate,
    /* "intval" => '15',
    "unitval" => 'MINUTE' */
);

foreach ($params as $k => $v) {
    /* echo "klucz: $k, Wartosc: $v"; */
    $stmt->bindValue(':' . $k, $v);
}
try {
    $stmt->execute();
    
    $array = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
}
catch (PDOException $e) {
    die($e->getMessage());
}

$arr= array();
$arr['Sensors'] = $sensors_array;
$arr['DataTypes'] = $datatypes_array;
$arr['Labels'] = $dataArray;
$arr['DataSensor'] = $array;

echo json_encode($arr, JSON_FORCE_OBJECT);
/* echo json_encode(array('Labels'=>$dataArray,'DataSensor'=>$array)); */
/* echo json_encode($array); */

/* 	 $labels = array();
$data = array();
$result = array();

foreach ($array as $row){
array_push($labels, $row['DateTime']);
array_push($data, $row['Value']);
}

array_push($result, $labels);
array_push($result, $data);
echo json_encode($result); */

/* http://kushagragour.in/blog/2013/06/getting-started-with-chartjs/ */
?>