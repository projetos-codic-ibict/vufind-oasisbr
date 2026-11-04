# Página de Acessibilidade do Oasisbr

> Documento preparado para importação no Notion.  
> Última atualização: 03/11/2026.

## 1. Objetivo e contexto

Foi criada uma página pública de acessibilidade para o Portal Oasisbr, na rota `/acessibilidade`, no contexto da migração para VuFind 11. A página reúne os atalhos e recursos de acessibilidade disponibilizados pelo portal e é acessível pelo painel de acessibilidade do cabeçalho e pelo rodapé.

A referência de conteúdo e direção visual consultada foi:

```text
/home/kedna/Downloads/7Oasisbr Redesign.html
```

O histórico Git disponível registra a entrega no commit abaixo:

```text
5bb46888d feat(accessibility): create public page and integrate portal links
```

## 2. Implementação

### Adaptação do procedimento de criação de página

O procedimento tomado como referência para a página Sobre do Diadorim foi adaptado ao módulo existente do Oasisbr:

1. Registrar o controller no módulo customizado com `VuFind\Controller\AbstractBaseFactory`.
2. Criar a action `homeAction()` retornando `createViewModel()`.
3. Declarar uma rota literal nomeada.
4. Criar o template no tema `oasisbr`.

Não há evidência no histórico Git de que os comandos de gerador do tutorial tenham sido executados. O que está confirmado é o resultado versionado: controller, configuração de módulo, rota e template foram criados no commit `5bb46888d`. Portanto, quaisquer comandos de geração são apenas exemplos e não devem ser interpretados como comandos executados nesta implementação.

### Arquivos e responsabilidades

| Arquivo | Elemento / nome real | Função |
| --- | --- | --- |
| `module/Oasisbr/Module.php` | Módulo `Oasisbr` | Carrega `config/module.config.php` e registra o autoloader do namespace `Oasisbr`. |
| `module/Oasisbr/config/module.config.php` | Namespace `Oasisbr\Controller` | Registra factory, aliases e rota da página. |
| `module/Oasisbr/src/Oasisbr/Controller/AcessibilidadeController.php` | `AcessibilidadeController` | Controller da página; estende `VuFind\Controller\AbstractBase`. |
| `themes/oasisbr/templates/acessibilidade/home.phtml` | Template `acessibilidade/home` | Define título, oculta a caixa de busca e renderiza o conteúdo semântico da página. |
| `themes/oasisbr/css/custom.css` | Classes `.oasis-accessibility-page*` | Contém os estilos específicos, responsivos e com foco visível da página. |
| `themes/oasisbr/languages/pt-br.ini` | Chaves `accessibility *` | Textos da página em português. |
| `themes/oasisbr/languages/en.ini` | Chaves `accessibility *` | Textos da página em inglês. |
| `themes/oasisbr/languages/es.ini` | Chaves `accessibility *` | Textos da página em espanhol. |
| `themes/oasisbr/templates/header.phtml` | Link `accessibility page` | Direciona a opção “Página de acessibilidade” do painel próprio do cabeçalho para a rota nomeada. |
| `themes/oasisbr/templates/footer.phtml` | Link `footer_accessibility` | Disponibiliza a página no rodapé. |

### Controller, factory, aliases e action

O módulo e namespace reais são `Oasisbr` e `Oasisbr\Controller`; não foi usado o namespace `Diadorim`.

```php
// module/Oasisbr/src/Oasisbr/Controller/AcessibilidadeController.php
namespace Oasisbr\Controller;

class AcessibilidadeController extends \VuFind\Controller\AbstractBase
{
    public function homeAction()
    {
        return $this->createViewModel();
    }
}
```

O controller é registrado com a factory padrão:

```php
'Oasisbr\\Controller\\AcessibilidadeController' => 'VuFind\\Controller\\AbstractBaseFactory',
```

Os aliases configurados são `Acessibilidade` e `acessibilidade`, ambos apontando para `Oasisbr\Controller\AcessibilidadeController`.

### Rota e template

| Propriedade | Valor |
| --- | --- |
| Nome da rota | `acessibilidade-home` |
| Tipo | `Laminas\Router\Http\Literal` |
| URL | `/acessibilidade` |
| Controller padrão | `Acessibilidade` |
| Action padrão | `Home` |
| Template | `themes/oasisbr/templates/acessibilidade/home.phtml` |

O template define o título da página e desativa a caixa de busca:

```php
<?php $this->headTitle($this->translate('Acessibilidade')); ?>
<?php $this->layout()->searchbox = false; ?>
```

O link do painel de acessibilidade usa o helper de URL e a rota nomeada, sem URL fixa:

```php
<?= $this->url('acessibilidade-home') ?>
```

O botão do cabeçalho que expande os recursos de acessibilidade foi preservado. O link adicionado fica dentro desse painel; não foi alterado código do web component externo da barra gov.br.

### Comandos: evidência disponível

Não foi possível recuperar comandos de criação de controller ou rota pelo histórico Git. O Git registra apenas os arquivos resultantes e o commit `5bb46888d`.

Os comandos abaixo são exemplos equivalentes de inspeção local, não um registro de execução do gerador:

```bash
git show --stat 5bb46888d
git show 5bb46888d -- module/Oasisbr/config/module.config.php
php -l module/Oasisbr/src/Oasisbr/Controller/AcessibilidadeController.php
```

## 3. Ajustes de conteúdo e design

A referência foi inspecionada e orientou a estrutura com título, navegação interna, atalhos, recursos e canais de orientação.

O código confirmado contém:

- título principal `h1`;
- subtítulos `h2` e `h3` em hierarquia semântica;
- navegação interna para atalhos, recursos e contato;
- tabela de atalhos realmente configurados no cabeçalho: `Alt + 2`, `Alt + 3` e `Alt + 4`;
- cartões para tamanho do texto, contraste e VLibras;
- links de orientação para Acessibilidade Digital do Governo Federal e eMAG;
- estilos com contêiner, bordas, cartões, layout responsivo e `:focus-visible` específico;
- tradução das novas chaves em português, inglês e espanhol.

Nem toda afirmação da referência foi publicada. Foram deliberadamente excluídos itens sem confirmação no Oasisbr, como declaração formal de conformidade, resultados de avaliação, datas de avaliação/publicação, PDF para download, prazo de resposta, limitações conhecidas e o atalho `Alt + 1`.

Não há validação visual automatizada, screenshot comparativo ou teste de navegador registrado no histórico disponível. Portanto, esta documentação não afirma equivalência visual completa com o arquivo de referência.

## 4. Problema na homologação

### Fatos relatados e evidências recebidas

- A rota funcionava no computador de desenvolvimento.
- Após a atualização da máquina de homologação com Docker Compose, a aplicação passou a falhar ao renderizar páginas que incluem o cabeçalho.
- O serviço da aplicação na homologação é `vufind-web`.
- O ambiente informado no contêiner é:

```text
VUFIND_LOCAL_MODULES=Oasisbr
VUFIND_ENV=production
VUFIND_LOCAL_DIR=/usr/local/vufind/local/docker
```

- A fonte montada continha `acessibilidade-home` em `module/Oasisbr/config/module.config.php`.
- Os arquivos de configuração, controller e cabeçalho passaram em `php -l`.
- Foi encontrado o cache de configuração de módulos:

```text
/usr/local/vufind/local/docker/cache/configs/cc47d537c5a68779183d5629c226c106/module-config-cache.php
```

- A busca por `acessibilidade-home` nesse cache não retornou ocorrência.
- O log fornecido contém o erro de rota ausente ao chamar o helper de URL em `themes/oasisbr/templates/header.phtml:51`.

O healthcheck relatado retornava erro HTTP 500. O log anexado também continha avisos relativos a `Oasisbr\Record\Loader::$config`; esses avisos devem ser investigados separadamente. A falha fatal que explica a indisponibilidade geral registrada nos logs foi a tentativa de montar a rota `acessibilidade-home` ausente.

### Conclusão técnica

O resultado é compatível com uma configuração de rotas em cache desatualizada: a fonte já possuía a rota, enquanto o cache carregado pelo processo web não a possuía.

O comportamento é sustentado pelo código do Laminas presente no projeto: em produção, `config/application.config.php` habilita `config_cache_enabled`; quando há um `module-config-cache.php`, o `ConfigListener` o inclui e deixa de mesclar novamente os `module.config.php`.

Não foi feita uma inspeção direta do processo Apache/OPcache antes da intervenção, portanto não se atribui a causa a OPcache. O reinício do serviço também renova os processos PHP, mas a evidência principal é o cache de configuração sem a rota.

O erro separado de build da imagem baseada em `php:8.3-apache-bullseye`, devido a respostas 404 de pacotes de `bullseye-security`, não foi usado como explicação para a rota ausente.

## 5. Solução aplicada

Após a confirmação do cache desatualizado, foram executados na máquina de homologação os comandos abaixo:

```bash
sudo docker compose exec vufind-web sh -lc '
  rm -- /usr/local/vufind/local/docker/cache/configs/cc47d537c5a68779183d5629c226c106/module-config-cache.php
'

sudo docker compose restart vufind-web
```

| Comando | Finalidade |
| --- | --- |
| `docker compose exec ... rm -- .../module-config-cache.php` | Remove exclusivamente o arquivo derivado de cache de configuração que não continha a nova rota. Na próxima inicialização, o Laminas recompõe a configuração a partir dos módulos. |
| `docker compose restart vufind-web` | Reinicia somente o serviço web, fazendo-o carregar a configuração recomposta e renovando os processos PHP. |

O diretório `cc47d537c5a68779183d5629c226c106` pertence à estrutura de cache desta homologação. Ele pode ser diferente em outro ambiente, pois a aplicação calcula o diretório de cache a partir da configuração e dos módulos ativos.

### Limite da intervenção

Não foram removidos:

- volumes Docker;
- banco de dados;
- `module-classmap-cache`;
- todo o diretório de cache;
- demais caches de objeto, idioma ou aplicação.

## 6. Validação após o restart

Os comandos abaixo foram definidos para execução na máquina de homologação após o restart:

```bash
sudo docker compose exec vufind-web sh -lc '
  grep -Hn "acessibilidade-home" \
    /usr/local/vufind/local/docker/cache/configs/*/module-config-cache*.php
'

curl -sS -o /dev/null -w 'início: %{http_code}\n' http://localhost/
curl -sS -o /dev/null -w 'acessibilidade: %{http_code}\n' http://localhost/acessibilidade
curl -sS -o /dev/null -w 'busca: %{http_code}\n' \
  'http://localhost/Search/Results?lookfor=teste'
```

O primeiro comando verifica que a rota está presente no cache de configuração recriado. Os demais imprimem o código HTTP das páginas inicial, acessibilidade e busca.

O resultado esperado para páginas disponíveis diretamente é HTTP `200`. Caso alguma URL responda com redirecionamento (`301`, `302`, `307` ou `308`), é necessário consultar o cabeçalho `Location` e validar o destino, em vez de considerar apenas o primeiro código como falha.

As saídas desses comandos não foram incluídas nesta documentação; portanto, ela não declara esses retornos como obtidos. Além dos testes HTTP, é necessário confirmar manualmente:

1. abertura da página de acessibilidade;
2. conteúdo, layout desktop e celular;
3. ausência de rolagem horizontal ou sobreposição;
4. navegação por teclado e foco visível;
5. acesso pela opção “Página de acessibilidade” no painel do cabeçalho;
6. acesso pelo link de acessibilidade no rodapé.

## 7. Resultado e orientação para futuras atualizações

A usuária confirmou o restabelecimento da página após a remoção seletiva do cache e o restart de `vufind-web`.

Em futuras atualizações que alterem `module.config.php` — especialmente rotas, controllers, factories, aliases ou serviços — investigue o cache de configuração de módulos quando ocorrerem sintomas como:

- rota presente na fonte, mas ausente no roteador em execução;
- erro ao chamar `$this->url('nome-da-rota')`;
- comportamento antigo persistindo após a atualização do código em produção.

Fluxo recomendado:

1. Confirmar que a fonte montada contém a alteração.
2. Identificar o `module-config-cache*.php` realmente usado pelo processo web.
3. Inspecionar se a configuração nova está presente nesse arquivo.
4. Remover somente o arquivo de cache comprovadamente desatualizado.
5. Reiniciar ou recarregar somente o serviço web e validar as rotas afetadas.

Não excluir caches, volumes ou banco de forma indiscriminada. Em particular, não usar a limpeza de cache de CLI como substituta da inspeção do cache web: o VuFind separa os caminhos de cache de CLI e Apache.
