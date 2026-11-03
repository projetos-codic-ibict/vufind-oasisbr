<?php

namespace Oasisbr\Controller;

class TeamController extends \VuFind\Controller\AbstractBase
{
    public function homeAction()
    {
        return $this->createViewModel();
    }
}
