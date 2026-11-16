<?php

namespace Oasisbr\Controller;

use VuFind\Controller\FeedbackController;

/**
 * Declaração de acessibilidade do Oasisbr.
 *
 * Renderiza a declaração e processa, na própria página, o formulário inline
 * "Comunicar barreira de acessibilidade" (FeedbackForms.yaml: AccessibilityBarrier).
 * O envio reaproveita a validação, os handlers de e-mail e as regras de bloqueio
 * de remetentes do FeedbackController. Após o envio, redireciona (PRG) para a
 * página com ?barreira=enviada, que exibe o estado de sucesso.
 */
class AcessibilidadeController extends FeedbackController
{
    public const BARRIER_FORM_ID = 'AccessibilityBarrier';

    public function homeAction()
    {
        $user = $this->getUser();
        $form = $this->getService($this->formClass);
        $params = [];
        if ($refererHeader = $this->getRequest()->getHeader('Referer')) {
            $params['referrer'] = $refererHeader->getFieldValue();
        }
        if ($userAgentHeader = $this->getRequest()->getHeader('User-Agent')) {
            $params['userAgent'] = $userAgentHeader->getFieldValue();
        }
        $form->setFormId(self::BARRIER_FORM_ID, $params);
        $formEnabled = $form->isEnabled() && ($user || !$form->showOnlyForLoggedUsers());
        $state = $this->params()->fromQuery('barreira');
        $submitted = (bool)$this->params()->fromPost('submitButton', false);

        $view = $this->createViewModel([
            'form' => $form,
            'formId' => self::BARRIER_FORM_ID,
            'formEnabled' => $formEnabled,
            'barrierSent' => $state === 'enviada',
            'barrierOpen' => $submitted || $state === 'aberta',
            'useCaptcha' => $this->captcha()->active('feedback') && $form->useCaptcha(),
        ]);
        if (!$formEnabled) {
            return $view;
        }

        $form->setData($this->params()->fromPost());
        if (!$this->formWasSubmitted(useCaptcha: $view->useCaptcha)) {
            $this->prefillUserInfo($form, $user);
            return $view;
        }
        if (!$form->isValid()) {
            return $view;
        }
        if ($this->senderIsBlocked($form)) {
            $this->flashMessenger()->addErrorMessage('could_not_process_feedback');
            return $view;
        }
        if (!$this->senderIsIgnored($form)) {
            if (!$form->getPrimaryHandler()->handle($form, $this->params(), $user)) {
                $this->flashMessenger()->addErrorMessage('could_not_process_feedback');
                return $view;
            }
            foreach ($form->getSecondaryHandlers() as $handler) {
                try {
                    $handler->handle($form, $this->params(), $user);
                } catch (\Exception $e) {
                    $this->logError($e->getMessage());
                }
            }
        }
        return $this->redirect()->toUrl(
            $this->url()->fromRoute('acessibilidade-home') . '?barreira=enviada#form-barreira'
        );
    }
}
