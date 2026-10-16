<?php

namespace Oasisbr\Controller;

class DataSourcesController extends \VuFind\Controller\AbstractBase
{
  public function homeAction()
  {
    return $this->createViewModel();
  }

  public function datasourceAction()
  {
    $id = $this->params()->fromQuery('name');
    return $this->createViewModel([
      'id' => $id,
    ]);
  }
}
