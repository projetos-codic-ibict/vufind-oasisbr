async function getIndicatorsByType() {
  const indicators = await getIndicatorsBy(
    'search?type=AllFields&facet[]=format&sort=relevance&page=1&limit=0'
  )
  // console.log('indicators recebido:', indicators)

  const data = indicators?.facets?.format || []
  // console.log('data (facets.format):', data)
  return data
}

async function getHomeIndicators() {
  const indicators = await getIndicatorsBy(
    'search?type=AllFields&facet[]=format&sort=relevance&page=1&limit=0'
  )
  return indicators || {}
}

function setHomeIndicator(selector, value) {
  const element = document.querySelector(selector)
  if (element) {
    element.textContent = value
  }
}

function getFormatTotal(indicators, formats) {
  return indicators
    .filter((indicator) => formats.includes(indicator.value))
    .reduce((value, item) => value + item.count, 0)
}

function fillArticles(indicators) {
  setHomeIndicator('#articles', formatNumber(getFormatTotal(indicators, ['article'])))
}

function fillTeses(indicators) {
  setHomeIndicator(
    '#teses',
    formatNumber(getFormatTotal(indicators, ['masterThesis', 'doctoralThesis']))
  )
}

function fillDatasets(indicators) {
  setHomeIndicator('#datasets', formatNumber(getFormatTotal(indicators, ['dataset'])))
}

function fillBooks(indicators) {
  setHomeIndicator(
    '#books',
    formatNumber(getFormatTotal(indicators, ['book', 'bookPart']))
  )
}

function fillEvents(indicators) {
  setHomeIndicator(
    '#events',
    formatNumber(getFormatTotal(indicators, ['conferenceObject']))
  )
}

function fillReports(indicators) {
  setHomeIndicator('#reports', formatNumber(getFormatTotal(indicators, ['report'])))
}

async function fillHomeNetworkStats() {
  try {
    const response = await axios.get(`${REMOTE_API_URL}/api/v1/networks`)
    const networks = Array.isArray(response.data) ? response.data : []
    const institutions = new Set(
      networks
        .map((network) => network.institution)
        .filter((institution) => Boolean(institution))
    )

    setHomeIndicator('#sources-home', formatNumber(networks.length))
    setHomeIndicator('#institutions-home', formatNumber(institutions.size))
  } catch (error) {
    console.error('Failed to load home network indicators', error)
    setHomeIndicator('#sources-home', '-')
    setHomeIndicator('#institutions-home', '-')
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const homeIndicators = await getHomeIndicators()
  const indicators = homeIndicators?.facets?.format || []
  if (homeIndicators.resultCount != null) {
    setHomeIndicator('#total-docs-home', formatNumber(homeIndicators.resultCount))
  }
  fillArticles(indicators)
  fillTeses(indicators)
  fillDatasets(indicators)
  fillBooks(indicators)
  fillEvents(indicators)
  fillReports(indicators)
  fillHomeNetworkStats()
})
