<?php

	// http://iteon.pl/pogoda/WetherSensor.php?SensorCode=1&DataType=2&Value=1.2
	// TUTORIAL: http://nirodhasoftware.com/site/how-to-call-mysql-stored-procedures-from-php/
	// http://iteon.pl/pogoda/WetherSensor.php?SensorCode=1&DataType=2&Value=1.2
	require_once 'connection.php';
	

	// IN data
	if(isset($_GET['SensorCode'])) {
		$SensorCodeParam = $_GET['SensorCode'];
	}
	else
	{
		$SensorCodeParam = '';
	}
	
	if(isset($_GET['TemperatureData'])) {
		$TemperatureDataDHT = $_GET['TemperatureData'];
	}
	else
	{
		$TemperatureDataDHT = '';
	}
	
	if(isset($_GET['FahrenheitDataDHT'])) {
		$FahrenheitDataDHT = $_GET['FahrenheitDataDHT'];
	}
	else
	{
		$FahrenheitDataDHT = '';
	}
	
	if(isset($_GET['HumidityData'])) {
		$HumidityParam = $_GET['HumidityData'];
	}
	else
	{
		$HumidityParam = '';
	}
	
	if(isset($_GET['PressureData'])) {
		$PressureParam = $_GET['PressureData'];
	}
	else
	{
		$PressureParam = '';
	}
	
	if(isset($_GET['temperatureBMP180Param'])) {
		$temperatureBMP180Param = $_GET['temperatureBMP180Param'];
	}
	else
	{
		$temperatureBMP180Param = '';
	}
	
	if(isset($_GET['altitudeDataParam'])) {
		$altitudeDataParam = $_GET['altitudeDataParam'];
	}
	else
	{
		$altitudeDataParam = '';
	}
	
	if(isset($_GET['hicDataParam'])) {
		$hicDataParam = $_GET['hicDataParam'];
	}
	else
	{
		$hicDataParam = '';
	}
	
	if(isset($_GET['hifDataParam'])) {
	$hifDataParam = $_GET['hifDataParam'];
	}
	else
	{
		$hifDataParam = '';
	}
	
	// OUT data
	$SuccessParam = false;
	//  `spInsertSensorData`(IN `SensorCode` INT(10), IN `TemperatureDataDHT` REAL, IN `FahrenheitDataDHT` REAL, IN `HumidityData` REAL, IN `PressureData` INT, IN `temperatureBMP180Param` REAL, IN `altitudeDataParam` REAL, IN `hicDataParam` REAL, IN `hifDataParam` REAL)
	$stmt = $conn->prepare("CALL spInsertSensorData(:SensorCode,:TemperatureDataDHT,:FahrenheitDataDHT,:HumidityData,:PressureData,:temperatureBMP180Param,:altitudeDataParam,:hicDataParam,:hifDataParam)");

	$params = array(
		"SensorCode"=>$SensorCodeParam, 
		"TemperatureDataDHT"=>$TemperatureDataDHT,
		"FahrenheitDataDHT"=>$FahrenheitDataDHT,
		"HumidityData"=>$HumidityParam,
		"PressureData"=>$PressureParam,
		"temperatureBMP180Param"=>$temperatureBMP180Param,
		"altitudeDataParam"=>$altitudeDataParam,
		"hicDataParam"=>$hicDataParam, 
		"hifDataParam"=>$hifDataParam
	);
	
	foreach ($params as $k => $v) 
	{	
		/*echo "klucz: $k,\n Wartosc: $v \n";*/
		$stmt->bindValue(':'.$k, $v);	
	}

	$stmt->execute();
	

	$conn = null;
?>