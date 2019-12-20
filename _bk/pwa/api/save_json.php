<?php

$receiveData = $_POST['todo_list'];
// $receiveData = json_encode( $_POST['todo_list'] );

// $receiveData = mb_convert_encoding($receiveData, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');

// $receiveData = json_decode($receiveData,true);


file_put_contents("todo_list.json" , $receiveData );

echo $receiveData;


// $returnData = $postData;

// echo json_encode($returnData);

?>