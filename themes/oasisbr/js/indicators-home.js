const TYPE_CARDS = [
  { selector: '#articles', formats: ['article'] },
  { selector: '#teses', formats: ['masterThesis', 'doctoralThesis'] },
  { selector: '#datasets', formats: ['dataset'] },
  { selector: '#books', formats: ['book', 'bookPart'] },
  { selector: '#events', formats: ['conferenceObject'] },
  { selector: '#reports', formats: ['report'] },
]

async function getHomeIndicators() {
  try {
    const indicators = await getIndicatorsBy(
      'search?type=AllFields&facet[]=format&sort=relevance&page=1&limit=0'
    )
    return indicators || {}
  } catch (error) {
    console.error('Failed to load home indicators', error)
    return {}
  }
  // console.log('indicators recebido:', indicators)
  // const data = indicators?.facets?.format || []
  // // console.log('data (facets.format):', data)
  // return data
}

function isValidCount(value) {
  // return Number.isFinite(Number(value)) && Number(value) >= 0
  return value !== null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0

}

function sanitizeFormatFacets(facets) {
  if (!Array.isArray(facets)) return []
  return facets.filter(
    (f) => f && typeof f.value === 'string' && f.value !== '' && isValidCount(f.count)
  )
}

function getFormatTotal(indicators, formats) {
  return indicators
    .filter((indicator) => formats.includes(indicator.value))
    .reduce((value, item) => value + Number(item.count), 0)
}

function setHomeIndicator(selector, value) {
  const element = document.querySelector(selector)
  if (element) {
    element.textContent = value
    element.dataset.homeIndicatorLoaded = 'true'
    element.closest('.oasis-home-card-count')?.removeAttribute('hidden')
  }
}

function setHomeIndicatorUnavailable(selector) {
  const element = document.querySelector(selector)
  if (element && element.dataset.homeIndicatorLoaded !== 'true') {
    element.textContent = element.dataset.unavailableLabel || ''
  }
}

function fillTypeCards(facets) {
  TYPE_CARDS.forEach(({ selector, formats }) => {
    setHomeIndicator(selector, formatNumber(getFormatTotal(facets, formats)))
  })
}

async function fillHomeNetworkStats() {
  try {
    const response = await axios.get(`${REMOTE_API_URL}/networks`)
    const networks = response.data
    if (!Array.isArray(networks) || !networks.every((network) => network && typeof network === 'object')) {
      throw new Error('Invalid networks response')
    }
    const institutions = new Set(
      networks
        .map((network) => network.institution)
        .filter((institution) => Boolean(institution))
    )

    setHomeIndicator('#sources-home', formatNumber(networks.length))
    setHomeIndicator('#institutions-home', formatNumber(institutions.size))
  } catch (error) {
    console.error('Failed to load home network indicators', error)
    setHomeIndicatorUnavailable('#sources-home')
    setHomeIndicatorUnavailable('#institutions-home')
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const homeIndicators = await getHomeIndicators()

  // Total: depende só de resultCount
  if (isValidCount(homeIndicators.resultCount)) {
    setHomeIndicator('#total-docs-home', formatNumber(homeIndicators.resultCount))
  } else {
    setHomeIndicatorUnavailable('#total-docs-home')
  }

  // Cards: dependem só de facets.format (itens inválidos são ignorados)
  const formatFacets = sanitizeFormatFacets(homeIndicators.facets?.format)
  if (formatFacets.length > 0) {
    fillTypeCards(formatFacets)
  }

  fillHomeNetworkStats()
})
