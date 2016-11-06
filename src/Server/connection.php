<?php
	// read the .ini file and create an associative array
	// zaczytanie konfiguracji
	$db = parse_ini_file("config-file.ini");
	
	// Pobranie ustawie
	$dbhost = $db['dbhost'];
	$dbuser = $db['dbuser'];
	$dbpass = $db['dbpass'];
	$dbname = $db['dbname'];
	
	try 
	{
		//$conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
		//echo "Connected to $dbname at $host successfully.";
		//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // <== add this line
		
		$conn = new PDO(
		"mysql:host=$dbhost;dbname=$dbname", 
		$dbuser, 
		$dbpass, 
		array(
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
		));
		
		header('Content-Type: application/json');
		/* echo "Connected successfully"; */
	} 
	catch (PDOException $pe) 
	{
		//die("Could not connect to the database $dbname :" . $pe->getMessage());
		die("Connection failed");
	}
?>