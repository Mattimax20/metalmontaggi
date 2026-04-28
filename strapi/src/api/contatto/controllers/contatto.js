'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contatto.contatto', ({ strapi }) => ({
  // Endpoint pubblico per la submission del form contatto
  async submit(ctx) {
    const body = ctx.request.body?.data ?? ctx.request.body ?? {};
    const { nome, cognome, email, telefono, oggetto, messaggio, servizio_interesse } = body;

    // Validazione campi obbligatori
    const errors = [];
    if (!nome || nome.trim() === '') errors.push('nome');
    if (!email || email.trim() === '') errors.push('email');
    if (!messaggio || messaggio.trim() === '') errors.push('messaggio');

    if (errors.length > 0) {
      return ctx.badRequest(`Campi obbligatori mancanti: ${errors.join(', ')}`);
    }

    // Validazione formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ctx.badRequest('Formato email non valido.');
    }

    try {
      const contatto = await strapi.entityService.create('api::contatto.contatto', {
        data: {
          nome: nome.trim(),
          cognome: cognome?.trim() || null,
          email: email.trim().toLowerCase(),
          telefono: telefono?.trim() || null,
          oggetto: oggetto?.trim() || null,
          messaggio: messaggio.trim(),
          servizio_interesse: servizio_interesse || null,
          stato: 'nuovo',
          ip_address: ctx.request.ip,
        },
      });

      ctx.status = 201;
      return {
        data: {
          id: contatto.id,
          messaggio: 'Richiesta inviata con successo. Ti contatteremo al più presto.',
        },
      };
    } catch (err) {
      strapi.log.error('[Contatto] Errore creazione:', err.message);
      return ctx.internalServerError('Errore interno del server. Riprova più tardi.');
    }
  },
}));
