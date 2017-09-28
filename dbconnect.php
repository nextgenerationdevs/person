<?php

$connection = mysqli_connect('localhost', 'root', '', 'persondao');

mysqli_query($connection, 'SET NAMES "utf8" COLLATE "utf8_general_ci"');
mysqli_query($connection, 'SET CHARACTER SET "utf8"');

?>