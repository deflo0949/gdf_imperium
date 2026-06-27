exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const WEBHOOK = process.env.DISCORD_WEBHOOK;
  if (!WEBHOOK) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Webhook non configurato' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Dati non validi' }) };
  }

  const { nome, eta, discord, exp, motivo, disp, fascia, porto, usoem, sana } = data;

  if (!nome || !discord || !motivo) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Campi obbligatori mancanti' }) };
  }

  const payload = {
    username: 'Guardia di Finanza',
    embeds: [{
      title: '📋 Nuova Candidatura — Guardia di Finanza',
      color: 0xd4a017,
      fields: [
        { name: '👤 Nome e Cognome',          value: nome,             inline: true  },
        { name: '🎂 Età',              value: eta || '—',       inline: true  },
        { name: '💬 Applicativo',               value: discord,          inline: true  },
        { name: '🔫 Certificato Sana e Robusta Costituzione',         value: sana,            inline: true  },
        { name: '🔫 Certificato di Uso e Maneggio',         value: usoem,            inline: true  },
        { name: '🔫 Porto d\'armi',         value: porto,            inline: true  },
        { name: '📅 Disponibilità',         value: disp,             inline: true  },
        { name: '🕐 Fascia oraria',          value: fascia,           inline: true  },
        { name: '🏛️ Esperienze precedenti', value: exp || 'Nessuna', inline: false },
        { name: '✍️ Motivazione',           value: motivo,           inline: false }
      ],
      footer: { text: 'Portale GdF — ' + new Date().toLocaleString('it-IT') }
    }]
  };

  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Errore invio Discord' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
