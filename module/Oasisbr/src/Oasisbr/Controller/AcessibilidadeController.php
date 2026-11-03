<?php

namespace Oasisbr\Controller;

class AcessibilidadeController extends \VuFind\Controller\AbstractBase
{
    public function homeAction()
    {
        return $this->createViewModel();
    }
}
