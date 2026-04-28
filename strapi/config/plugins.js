'use strict';

module.exports = ({ env }) => ({
  // ── Upload (local) ──────────────────────────────────────
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: env.int('UPLOAD_MAX_SIZE', 100 * 1024 * 1024), // 100 MB default
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  // ── Users & Permissions ─────────────────────────────────
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },

  // ── i18n (internazionalizzazione) ───────────────────────
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'it',
      locales: ['it', 'en'],
    },
  },
});
