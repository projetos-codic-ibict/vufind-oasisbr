async function getANetworkByName(networkId) {
  try {
    showLoader();
    const response = await axios.get(`${REMOTE_API_URL}/networks/${networkId}`);
    // const response = await axios.get(`/api-proxy/networks/${encodeURIComponent(networkId)}`);
    hideLoader();
    const network = response.data;
    return network;
  } catch (errors) {
    hideLoader();
    console.error(errors);
    return null;

  }
}

function fillDatasource(network) {
  const table = document.querySelector('#dataSource');
  table.innerHTML = `
    <caption class="visually-hidden">${getTranslatedText('Detalhes da fonte de dados')}</caption>
    <tbody>
    <tr>
      <th scope="row">${getTranslatedText('Tipo de fonte')}:</th>
      <td>${network.sourceType}</td>
    </tr>
    <tr>
      <th scope="row">${getTranslatedText('Fonte')}:</th>
      <td>${network.name}</td>
    </tr>
    <tr>
      <th scope="row">${getTranslatedText('Instituição responsável')}:</th>
      <td>${network.institution}</td>
    </tr>
    <tr>
      <th scope="row">URL:</th>
      <td>${
        network.sourceUrl != null
          ? '<a href="' +
            network.sourceUrl +
            '" target="_blank" rel="noopener noreferrer">' +
            network.sourceUrl +
            '</a>'
          : '-'
      }</td>
    </tr>
    <tr>
      <th scope="row">${getTranslatedText('Source email')}:</th>
      <td>${network.email != null ? network.email : '-'}</td>
    </tr>
    <tr>
      <th scope="row">${getTranslatedText('Documents collected')}:</th>
      <td>
        <a href="../Search/Results?type=AllFields&filter%5B%5D=network_name_str%3A%22+${
          network.name
        }">
          ${network.validSize}
        </a>
      </td>
    </tr>
    <tr>
      <th scope="row">
        ${
          network.sourceType === 'Revista Científica'
            ? 'ISSN:'
            : network.sourceType === 'Repositório de Dados de Pesquisa'
            ? 'ID re3data:'
            : 'ID OpenDOAR:'
        }
      </th>
      <td>${
        network.issn != 'null'
          ? network.issn
          : getTranslatedText('Not registered')
      }</td>
    </tr>
    </tbody>
  `;
}

function setCustomColor(sourceType) {
  const titleBar = document.querySelector('.page-title-bar');
  titleBar.classList.remove(
    'revista',
    'repo-publicacoes',
    'repo-dados',
    'biblioteca',
    'monografias',
    'preprints',
    'agregador',
    'repo'
  );
  switch (sourceType) {
    case 'Revista Científica':
      titleBar.classList.add('revista');
      break;
    case 'Repositório de Publicações':
      titleBar.classList.add('repo-publicacoes');
      break;
    case 'Repositório de Dados de Pesquisa':
      titleBar.classList.add('repo-dados');
      break;
    case 'Biblioteca Digital de Teses e Dissertações':
      titleBar.classList.add('biblioteca');
      break;
    case 'Biblioteca Digital de Monografias':
      titleBar.classList.add('monografias');
      break;
    case 'Biblioteca Digital de Monografia':
      titleBar.classList.add('monografias');
      break;
    case 'Servidor de Preprints':
      titleBar.classList.add('preprints');
      break;
    case 'Portal Agregador':
      titleBar.classList.add('agregador');
      break;
    default:
      titleBar.classList.add('repo');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const queryStrings = window.location.search.split('=');
  const queryString = `${queryStrings[0]}=${encodeURIComponent(
    queryStrings[1]
  )}`;
  const urlParams = new URLSearchParams(queryString);
  const networkName = decodeURIComponent(urlParams.get('name'));
  const network = await getANetworkByName(networkName);

  if (!network) {
    console.error('Fonte não encontrada ou erro na requisição:', networkName);
    return;
  }
  setCustomColor(network.sourceType);
  fillDatasource(network);
});
