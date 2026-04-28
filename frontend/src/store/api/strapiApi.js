import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// In produzione (Docker) le chiamate sono relative → proxied da Nginx a Strapi
// In dev usa la variabile d'ambiente (vite.config.js ha il proxy su localhost:1337)
const BASE_URL = '/api'

export const strapiApi = createApi({
  reducerPath: 'strapiApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Company', 'Services', 'Gallery'],
  endpoints: (builder) => ({

    // ── Informazioni Azienda (single type) ──────────────
    getCompanyInfo: builder.query({
      query: () => '/informazioni-azienda?populate=*',
      providesTags: ['Company'],
      transformResponse: (res) => res?.data?.attributes ?? null,
    }),

    // ── Servizi ─────────────────────────────────────────
    getServices: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams({
          'populate': '*',
          'sort': 'ordine:asc',
          'filters[attivo][$eq]': 'true',
          'filters[publishedAt][$notNull]': 'true',
          ...params,
        }).toString()
        return `/servizi?${qs}`
      },
      providesTags: ['Services'],
      transformResponse: (res) => res?.data ?? [],
    }),

    getFeaturedServices: builder.query({
      query: () => {
        const qs = new URLSearchParams({
          'populate': '*',
          'sort': 'ordine:asc',
          'filters[in_evidenza][$eq]': 'true',
          'filters[attivo][$eq]': 'true',
          'filters[publishedAt][$notNull]': 'true',
          'pagination[pageSize]': '3',
        }).toString()
        return `/servizi?${qs}`
      },
      providesTags: ['Services'],
      transformResponse: (res) => res?.data ?? [],
    }),

    getServiceBySlug: builder.query({
      query: (slug) => `/servizi?filters[slug][$eq]=${slug}&populate=*`,
      providesTags: ['Services'],
      transformResponse: (res) => res?.data?.[0]?.attributes ?? null,
    }),

    // ── Galleria Progetti ────────────────────────────────
    getGalleryProjects: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams({
          'populate': '*',
          'sort': 'ordine:asc',
          'filters[publishedAt][$notNull]': 'true',
          'pagination[pageSize]': '100',
          ...params,
        }).toString()
        return `/galleria-progetti?${qs}`
      },
      providesTags: ['Gallery'],
      transformResponse: (res) => res?.data ?? [],
    }),

    getFeaturedGallery: builder.query({
      query: () => {
        const qs = new URLSearchParams({
          'populate': '*',
          'filters[in_evidenza][$eq]': 'true',
          'filters[publishedAt][$notNull]': 'true',
          'pagination[pageSize]': '6',
        }).toString()
        return `/galleria-progetti?${qs}`
      },
      providesTags: ['Gallery'],
      transformResponse: (res) => res?.data ?? [],
    }),
  }),
})

export const {
  useGetCompanyInfoQuery,
  useGetServicesQuery,
  useGetFeaturedServicesQuery,
  useGetServiceBySlugQuery,
  useGetGalleryProjectsQuery,
  useGetFeaturedGalleryQuery,
} = strapiApi
