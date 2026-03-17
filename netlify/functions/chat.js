const knowledgeBase = require("../../knowledge_base.json");

// Build context from knowledge base based on user message
function findRelevantContext(message) {
  const lowerMsg = message.toLowerCase();
  const contexts = [];

  // Check services
  const serviceKeywords = {
    kotikäynti: ["koti", "kotiin", "kotikäynti", "luokseni", "luokse", "paikan pääl"],
    etätuki: ["etä", "puhelin", "soitta", "etäyhteys", "etätuki"],
    käyttöönotto: ["uusi laite", "käyttöönotto", "uusi puhelin", "uusi tietokone", "uusi tabletti"],
    koulutus: ["koulut", "opettaa", "oppia", "oppiminen", "kurssi"],
    tekninen_apu: ["rikki", "ei toimi", "ongelma", "korjaa", "hidas", "jumissa", "kaatuu"],
    pikatuki: ["nopea", "pika", "heti", "kiire", "ilmainen"],
    tietoturva: ["turva", "virus", "hakkeri", "suojau", "tietoturva", "salasana", "huijau"],
    tekoäly: ["tekoäly", "ai", "chatgpt", "gpt", "keinoäly", "robotti"],
  };

  for (const [key, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some((kw) => lowerMsg.includes(kw))) {
      const service = knowledgeBase.palvelut[key];
      if (service) {
        contexts.push(
          `Palvelu "${key}": ${service.kuvaus} Hinta: ${service.hinta}. Sisältö: ${(service.sisältö || service.aiheet || []).join(", ")}`
        );
      }
    }
  }

  // Check guides
  const guideKeywords = {
    kuvan_ottaminen: ["kuva", "valoku", "kamera", "selfie"],
    salasanan_vaihto: ["salasana", "password", "kirjautu"],
    sähköposti: ["sähköpost", "email", "gmail", "outlook", "viesti"],
    zoom: ["zoom", "teams", "video", "videoneuvottelu", "videoyhteys"],
    verkkopankki: ["pankki", "verkko pankki", "e-lasku", "lasku", "tilisiirto"],
    wifi: ["wifi", "wlan", "netti", "internet", "verkko"],
    huijausviestit: ["huijau", "roska", "phish", "kalastelu", "epäilyttävä"],
    whatsapp: ["whatsapp", "whatsupp", "viesti"],
    tulostaminen: ["tulost", "printteri", "printtaa"],
    sovelluksen_asennus: ["asentaa", "asennus", "sovellus", "appi", "lataa"],
    varmuuskopiointi: ["varmuuskopi", "backup", "tallentaa", "tallenn"],
    näytön_kuvakaappaus: ["kuvakaappau", "screenshot", "ruutukuva"],
    fonttikoon_muuttaminen: ["fontti", "teksti", "koko", "suurent", "pienent", "iso", "pieni"],
    päivitykset: ["päivit", "update", "ajan tasalle"],
  };

  for (const [key, keywords] of Object.entries(guideKeywords)) {
    if (keywords.some((kw) => lowerMsg.includes(kw))) {
      const guide = knowledgeBase.ohjeet[key];
      if (guide) {
        let guideText = `Ohje "${guide.otsikko}" (${guide.taso}): `;
        if (guide.vaiheet) {
          guideText += `Vaiheet: ${guide.vaiheet.map((v, i) => `${i + 1}. ${v}`).join(" ")}`;
        }
        if (guide.vinkki) guideText += ` Vinkki: ${guide.vinkki}`;
        if (guide.tärkeää) guideText += ` Tärkeää: ${guide.tärkeää}`;
        if (guide.turvallisuus) guideText += ` Turvallisuus: ${guide.turvallisuus.join(" ")}`;
        if (guide.merkit) guideText += ` Merkit: ${guide.merkit.join(" ")}`;
        if (guide.toimintaohjeet) guideText += ` Toimintaohjeet: ${guide.toimintaohjeet.join(" ")}`;
        // Handle sub-sections
        if (guide.tietokone) guideText += ` Tietokone: ${guide.tietokone.join(" ")}`;
        if (guide.puhelin && Array.isArray(guide.puhelin)) guideText += ` Puhelin: ${guide.puhelin.join(" ")}`;
        if (guide.android) guideText += ` Android: ${guide.android.join ? guide.android.join(" ") : guide.android}`;
        if (guide.iphone) guideText += ` iPhone: ${guide.iphone.join ? guide.iphone.join(" ") : guide.iphone}`;
        if (guide.windows && typeof guide.windows === "string") guideText += ` Windows: ${guide.windows}`;
        if (guide.windows && Array.isArray(guide.windows)) guideText += ` Windows: ${guide.windows.join(" ")}`;
        if (guide.selain) guideText += ` Selain: ${guide.selain}`;
        contexts.push(guideText);
      }
    }
  }

  // Check FAQ
  if (lowerMsg.includes("mikä") || lowerMsg.includes("kuka") || lowerMsg.includes("digi-mikko") || lowerMsg.includes("digimikko")) {
    contexts.push(`Tietoa: ${knowledgeBase.usein_kysytyt.mikä_on_digi_mikko}`);
  }
  if (lowerMsg.includes("hinta") || lowerMsg.includes("maksa") || lowerMsg.includes("kustann") || lowerMsg.includes("paljonko")) {
    contexts.push(`Hinnat: ${knowledgeBase.usein_kysytyt.paljonko_maksaa}`);
  }
  if (lowerMsg.includes("varaa") || lowerMsg.includes("aika") || lowerMsg.includes("tilaa")) {
    contexts.push(`Ajanvaraus: ${knowledgeBase.usein_kysytyt.miten_varaan_ajan}`);
  }
  if (lowerMsg.includes("missä") || lowerMsg.includes("alue") || lowerMsg.includes("paikka")) {
    contexts.push(`Sijainti: ${knowledgeBase.usein_kysytyt.missä_toimitte}`);
  }
  if (lowerMsg.includes("peru") || lowerMsg.includes("peruut")) {
    contexts.push(`Peruutus: ${knowledgeBase.usein_kysytyt.voiko_perua}`);
  }

  // Always include contact info
  const contact = knowledgeBase.yhteystiedot;
  contexts.push(`Yhteystiedot: Puh ${contact.puhelin}, Email ${contact.email}, Aukioloajat: ${contact.aukioloajat}`);

  return contexts.join("\n\n");
}

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const { message, history } = JSON.parse(event.body);

    if (!message || typeof message !== "string" || message.length > 1000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Virheellinen viesti." }),
      };
    }

    // Find relevant knowledge base context
    const context = findRelevantContext(message);

    // Build conversation for LLM
    const systemPrompt = `Olet Digi-Mikkon ystävällinen AI-avustaja. Digi-Mikko tarjoaa digitukea ikäihmisille Suomessa.

TÄRKEÄT SÄÄNNÖT:
- Vastaa AINA suomeksi
- Vastaa lyhyesti ja selkeästi, mutta anna konkreettisia neuvoja
- Käytä yksinkertaista kieltä jota ikäihmiset ymmärtävät
- Kun annat ohjeita, numeroi vaiheet selkeästi
- Jos et tiedä vastausta, ohjaa ottamaan yhteyttä: 040 123 4567
- Olet avulias, kärsivällinen ja ystävällinen
- Älä keksi tietoja - käytä vain annettua kontekstia

TIETOKANTA-KONTEKSTI:
${context}`;

    // Try HuggingFace Inference API with a good free model
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

    if (!HF_TOKEN) {
      // Fallback: smart local response using knowledge base
      const fallbackResponse = generateLocalResponse(message, context);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ response: fallbackResponse }),
      };
    }

    // Call HuggingFace Inference API
    const messages = [{ role: "system", content: systemPrompt }];

    // Add conversation history (last 6 messages)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role === "user" ? "user" : "assistant",
            content: String(msg.content).substring(0, 500),
          });
        }
      }
    }

    messages.push({ role: "user", content: message });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      // Fallback to local response if API fails
      const fallbackResponse = generateLocalResponse(message, context);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ response: fallbackResponse }),
      };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || generateLocalResponse(message, context);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: aiResponse }),
    };
  } catch (error) {
    console.error("Chat error:", error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: "Pahoittelen, minulla on teknisiä ongelmia juuri nyt. Voit soittaa suoraan numeroon 040 123 4567 niin saat apua!",
      }),
    };
  }
};

// Smart local response generator using knowledge base context
function generateLocalResponse(message, context) {
  const lowerMsg = message.toLowerCase();

  // Greetings
  if (/^(hei|moi|terve|huomenta|iltaa|moro|heippa)/i.test(lowerMsg)) {
    return "Hei! Olen Digi-Mikkon AI-avustaja 🤖 Miten voin auttaa sinua tänään? Voit kysyä minulta esimerkiksi:\n\n• Miten vaihdan salasanan?\n• Miten yhdistän WiFi-verkkoon?\n• Mitä palveluja tarjoatte?\n• Paljonko palvelut maksavat?";
  }

  // Thanks
  if (/kiitos|hyvä|mahtava|loistava|auttoi/i.test(lowerMsg)) {
    return "Ole hyvä! Mukava kun pystyin auttamaan 😊 Jos tulee lisää kysymyksiä, kysy rohkeasti. Voit myös soittaa numeroon 040 123 4567 niin jutellaan lisää!";
  }

  // If we have context, build a structured response
  if (context && context.length > 100) {
    // Extract and format guide steps if found
    const guideMatch = context.match(/Ohje "([^"]+)"[^:]*: Vaiheet: (.+?)(?=\n|Vinkki|Tärkeää|$)/);
    if (guideMatch) {
      let response = `**${guideMatch[1]}**\n\n`;
      const steps = guideMatch[2].split(/\d+\.\s/).filter(Boolean);
      steps.forEach((step, i) => {
        response += `${i + 1}. ${step.trim()}\n`;
      });

      // Add tip if available
      const tipMatch = context.match(/Vinkki: ([^\n]+)/);
      if (tipMatch) {
        response += `\n💡 ${tipMatch[1]}`;
      }

      // Add warning if available
      const warnMatch = context.match(/Tärkeää: ([^\n]+)/);
      if (warnMatch) {
        response += `\n\n⚠️ ${warnMatch[1]}`;
      }

      response += "\n\nTarvitsetko lisäapua? Soita 040 123 4567!";
      return response;
    }

    // Extract service info
    const serviceMatch = context.match(/Palvelu "([^"]+)": (.+?) Hinta: (.+?)\./);
    if (serviceMatch) {
      return `**${serviceMatch[1].charAt(0).toUpperCase() + serviceMatch[1].slice(1)}**\n\n${serviceMatch[2]}\n\n💰 Hinta: ${serviceMatch[3]}\n\nHaluatko varata ajan? Soita 040 123 4567 tai lähetä viesti osoitteeseen mikko@digi-mikko.fi!`;
    }

    // Price info
    if (/hinta|maksa|kustann|paljonko/i.test(lowerMsg)) {
      return "**Digi-Mikko hinnat:**\n\n📞 Pikatuki: Ensimmäiset 15 min ILMAISEKSI\n💻 Etätuki: 40 €/tunti\n🏠 Kotikäynti: 50 €/tunti + matkakulut\n🤖 Tekoäly-opastus: 50 €/tunti\n🔒 Tietoturva: 60 €/tunti\n📱 Käyttöönotto: 80 € (2 tuntia)\n👨‍🏫 Koulutus: 120 € (3 tuntia)\n\nSoita 040 123 4567 niin sovitaan sinulle sopiva palvelu!";
    }

    // Security topics
    if (/huijau|turva|virus/i.test(lowerMsg)) {
      const secMatch = context.match(/Merkit: (.+?)(?=Toimintaohjeet|$)/);
      const actionMatch = context.match(/Toimintaohjeet: (.+?)(?=\n|$)/);
      let response = "**Näin tunnistat huijausviestin:**\n\n";
      if (secMatch) {
        const signs = secMatch[1].split(/(?=⚠️|Kiire|Pelottelu|Liian|Pyydetään|Oudot|Huono|Tuntematon)/).filter(Boolean);
        signs.forEach((s) => {
          response += `⚠️ ${s.trim()}\n`;
        });
      }
      if (actionMatch) {
        response += "\n**Mitä tehdä:**\n";
        const actions = actionMatch[1].split(/(?=ÄLÄ|Poista|Soita)/).filter(Boolean);
        actions.forEach((a) => {
          response += `• ${a.trim()}\n`;
        });
      }
      response += "\n🛡️ Muista: Pankki tai viranomaiset eivät KOSKAAN kysy tunnuksiasi!\n\nTarvitsetko tietoturvatarkastuksen? Soita 040 123 4567!";
      return response;
    }
  }

  // Default
  return "Kiitos kysymyksestäsi! Voin auttaa monissa asioissa:\n\n📱 Puhelin- ja tietokone-ongelmat\n🔐 Salasanat ja tietoturva\n📧 Sähköposti ja viestintä\n🏦 Verkkopankki\n🤖 Tekoäly ja ChatGPT\n\nKerro tarkemmin ongelmastasi, niin yritän auttaa! Tai soita suoraan 040 123 4567.";
}
