<?php

// 疑似遅延
// sleep( rand(0, 2) );

$design = array(
  0 => array(
    'index' => 0,
    'name'  => 'banba',
    'age'   => 40,
  ),
  1 => array(
    'index' => 1,
    'name'  => 'sakanaka',
    'age'   => 32,
  ),
  2 => array(
    'index' => 2,
    'name'  => 'takahashi',
    'age'   => rand(),
  ),
);

$postData = $_POST['hoge'];


// $returnData = $postData;
$returnData = $design[ $postData ];


echo json_encode($returnData);

// if(empty($_POST['input_val'])){
//   exit(); // POSTが空だったら終了する
// }

?>