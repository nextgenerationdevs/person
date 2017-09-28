<?php
session_start();
include ('dbconnect.php');

//инициализация полей для приёма данных персоны
$id = $_POST['id'];
$fname = $_POST['fname'];
$lname = $_POST['lname'];
$age = $_POST['age'];

$func = $_POST['func'];

    switch ($func) {
        case 'create':

            $query = ' INSERT INTO `person` (`fname`, `lname` , `age`) VALUES ("'.$fname.'","'.$lname.'","'.$age.'") ';
            $result = mysqli_query($connection, $query);
            $lastid = mysqli_insert_id($connection);
            echo 'success';
            mysqli_close($connection);
        break;

        case 'update':
            $query = ' UPDATE `person` SET `fname` = "'.$fname.'", `lname` = "'.$lname.'", `age`= "'.$age.'" WHERE `id` = "'.$id.'" ';
            $result = mysqli_query($connection, $query);
            echo 'success';
            mysqli_close($connection);
        break;

        case 'delete':

            $query = ' DELETE FROM `person` WHERE `id` = "'.$id.'" ';
            if(mysqli_query($connection, $query)){
                echo 'id_not_exist';
            }else {
                echo 'success';
            }
        break;

        case 'read':

            $query = ' SELECT * FROM `person` ';
            $result = mysqli_query($connection, $query);
            $getPersons_recordCount = mysqli_num_rows($result);

            if ($getPersons_recordCount < 1) {
                echo '0';
            }

            else {
                $data = array();
                for ($i = 0; $i < $getPersons_recordCount; $i++) {
                    $current_person = mysqli_fetch_assoc($result);
                    $element = array("id" => $current_person['id'], "fname" => $current_person['fname'], "lname" => $current_person['lname'], "age" => $current_person['age']);
                    array_push($data, $element);
                }
                echo json_encode($data);
                mysqli_close($connection);
                break;
            }
    }

?>