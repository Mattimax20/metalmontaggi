import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://metalmontaggi.navycargo.ovh'
const SITE_NAME = 'Metal Montaggi'
const DEFAULT_DESC = 'Lavorazioni da fabbro, serramenti in metallo e carpenteria metallica a Leverano (Lecce). Cancelli, ringhiere, portoni su misura. Preventivo gratuito.'

export function SeoHead({ title, description, path = '/' }) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} – Fabbro, Serramenti e Carpenteria Metallica a Leverano (LE)`
  const desc = description || DEFAULT_DESC
  const canonical = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
    </Helmet>
  )
}
