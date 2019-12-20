<?php

// 疑似遅延
// sleep( rand(0, 2) );

$items = array();

$items[0] = array(
  'index' => 0,
  'name'  => 'banba',
  'age'   => 40,
);

$items[1] = array(
  'index' => 1,
  'name'  => 'sakanaka',
  'age'   => 35,
);

$items[2] = array(
  'index' => 2,
  'name'  => 'takahashi',
  'age'   => rand(),
);
$items[3] = array(
  'index' => 4,
  'name'  => 'oyama',
  'age'   => rand(),
);

echo json_encode($items);





// $data = array(
//   'headers' => $headers,
//   'items'   => $items,
// );

?>