<?php
// set default timezone
//date_default_timezone_set('UTC'); // CDT
date_default_timezone_set('Europe/Warsaw');


$info = getdate();
$date = $info['mday'];
$month = $info['mon'];
$year = $info['year'];
$hour = $info['hours'];
$min = $info['minutes'];
$sec = $info['seconds'];

$current_date = "$date/$month/$year == $hour:$min:$sec";

echo date("H:i:s")
//echo "$hour:$min:$sec";
//echo "Current date and local time on this server is $current_date";
?>