'use strict';

// Route pubblica per la submission del form contatto
// Non richiede autenticazione
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/contatti/submit',
      handler: 'contatto.submit',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
        description: 'Submission pubblica del form di contatto',
        tags: ['contatto'],
      },
    },
  ],
};
