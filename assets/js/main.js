/* ==========================================================================
   SportSub — landing de pré-lancement
   Aucune dépendance. Trois blocs : les portes « bientôt », le quiz archétype,
   le formulaire d'inscription.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     À CONFIGURER — voir README.md
     ------------------------------------------------------------------ */
  var FORM_ENDPOINT = "";                     // ex. "https://formspree.io/f/xxxxxxxx"
  var CONTACT_EMAIL = "rdasilva75@gmail.com"; // à remplacer par une adresse pro

  // Les liens qui n'existent pas encore. Laisse vide : la porte s'affiche
  // grisée et marquée « bientôt » au lieu de tomber dans le vide.
  var LINKS = {
    carte: "https://claude.ai/artifact/TaeQFjgnWus3HHkNGm4U7F",
    questionnaire: ""   // colle ici le lien de ton formulaire Google (README, section 5)
  };
  /* ------------------------------------------------------------------ */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }

  /* ==================================================================
     Pictogrammes des archétypes
     ================================================================== */
  var GLYPHS = {
    mur: '<rect x="5" y="8" width="30" height="24"/><path d="M5 16h30M5 24h30M20 8v8M12 16v8M28 16v8M20 24v8"/>',
    canon: '<path d="M6 32 30 10M19 10h11v11"/><circle cx="9" cy="12" r="3.5"/>',
    architecte: '<rect x="8" y="5" width="24" height="30"/><path d="M8 20h24M13 5v30M27 5v30M13 12.5h14M13 27.5h14M20 12.5v15"/>',
    eclair: '<path d="M23 4 10 22h9l-3 14 14-20h-9z"/>',
    cameleon: '<circle cx="20" cy="20" r="14"/><path d="M20 6a14 14 0 0 1 0 28z" fill="currentColor"/>',
    etincelle: '<path d="M20 4v10M20 26v10M4 20h10M26 20h10M9 9l6 6M25 25l6 6M31 9l-6 6M15 25l-6 6"/>'
  };

  function glyph(slug) {
    return '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (GLYPHS[slug] || "") + "</svg>";
  }

  var ARCHETYPES = {
    mur:        { name: "Le Mur",        trait: "Régularité", tagline: "Tu remets tout. L'adversaire craque avant toi.", duo: "eclair" },
    canon:      { name: "Le Canon",      trait: "Puissance",  tagline: "Service, smash, coup droit. Ça part fort.",       duo: "architecte" },
    architecte: { name: "L'Architecte",  trait: "Tactique",   tagline: "Tu construis le point, tu lis le jeu, tu places.", duo: "canon" },
    eclair:     { name: "L'Éclair",      trait: "Vitesse",    tagline: "Tu montes au filet, tu surprends, tu conclus vite.", duo: "mur" },
    cameleon:   { name: "Le Caméléon",   trait: "Adaptation", tagline: "Tu changes de plan selon l'adversaire.",           duo: "etincelle" },
    etincelle:  { name: "L'Étincelle",   trait: "Créativité", tagline: "Amortie, lob, coup improbable. Le public t'adore.", duo: "cameleon" }
  };
  var SLUGS = ["mur", "canon", "architecte", "eclair", "cameleon", "etincelle"];

  // Les pastilles du terrain, dans le hero.
  all("[data-glyph]").forEach(function (node) { node.innerHTML = glyph(node.getAttribute("data-glyph")); });

  // La grille des six archétypes.
  var roll = document.getElementById("archetype-roll");
  if (roll) {
    SLUGS.forEach(function (slug) {
      var cell = el("div");
      cell.innerHTML = glyph(slug);
      cell.appendChild(el("b", null, ARCHETYPES[slug].name));
      cell.appendChild(el("span", null, ARCHETYPES[slug].trait));
      roll.appendChild(cell);
    });
  }

  /* ==================================================================
     Portes « bientôt disponible »
     ================================================================== */
  all("[data-door-link]").forEach(function (node) {
    var url = LINKS[node.getAttribute("data-door-link")];
    if (url) { node.setAttribute("href", url); return; }

    node.removeAttribute("href");
    node.removeAttribute("target");
    node.setAttribute("aria-disabled", "true");
    node.setAttribute("role", "link");
    var body = $(".door__b", node);
    if (body && !$(".door__soon", body)) body.appendChild(el("span", "door__soon", "Disponible très bientôt"));
    node.addEventListener("click", function (e) { e.preventDefault(); });
  });

  var dialog = document.getElementById("soon");
  if (dialog && typeof dialog.showModal === "function") {
    var lastFocus = null;

    var openSoon = function (door) {
      lastFocus = document.activeElement;
      dialog.showModal();
      var target = door ? $('[data-door-link="' + door + '"]', dialog) : null;
      var first = (target && target.getAttribute("href")) ? target : $(".door", dialog);
      if (first) first.focus();
    };
    var closeSoon = function () {
      dialog.close();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    all("[data-soon]").forEach(function (link) {
      link.addEventListener("click", function (e) { e.preventDefault(); openSoon(link.getAttribute("data-door")); });
    });

    var closeBtn = document.getElementById("soon-close");
    if (closeBtn) closeBtn.addEventListener("click", closeSoon);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeSoon(); });

    var doorListe = document.getElementById("door-liste");
    if (doorListe) {
      doorListe.addEventListener("click", function () {
        closeSoon();
        var section = document.getElementById("inscription");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        var champ = document.getElementById("f-prenom");
        if (champ) setTimeout(function () { champ.focus(); }, 500);
      });
    }
  }

  /* ==================================================================
     Quiz archétype — trois questions de style
     ================================================================== */
  var QUESTIONS = [
    {
      title: "Balle de break contre toi. Tu…",
      options: [
        { label: "remets la balle au centre, sans risque",            w: { mur: 2, cameleon: 1 } },
        { label: "frappes fort, ça passe ou ça casse",                w: { canon: 2, eclair: 1 } },
        { label: "construis le point pour le prendre à revers",       w: { architecte: 2, mur: 1 } },
        { label: "montes au filet pour abréger",                      w: { eclair: 2, canon: 1 } },
        { label: "regardes ce qui a marché sur les derniers points",  w: { cameleon: 2, architecte: 1 } },
        { label: "tentes l'amortie que personne n'attend",            w: { etincelle: 2, eclair: 1 } }
      ]
    },
    {
      title: "Ton coup préféré ?",
      options: [
        { label: "L'échange long qui use l'adversaire",   w: { mur: 2, architecte: 1 } },
        { label: "Le service ou le smash qui claque",     w: { canon: 2 } },
        { label: "Le coup croisé qui ouvre le terrain",   w: { architecte: 2, cameleon: 1 } },
        { label: "La volée au filet",                     w: { eclair: 2, canon: 1 } },
        { label: "Celui dont j'ai besoin sur le moment",  w: { cameleon: 2, mur: 1 } },
        { label: "Le lob ou l'amortie",                   w: { etincelle: 2, architecte: 1 } }
      ]
    },
    {
      title: "Après la partie, on dit de toi…",
      options: [
        { label: "« Impossible de lui faire faire une faute »", w: { mur: 2 } },
        { label: "« Il faut rester loin derrière la ligne »",   w: { canon: 2, mur: 1 } },
        { label: "« Toujours un coup d'avance »",               w: { architecte: 2 } },
        { label: "« Ça va trop vite »",                         w: { eclair: 2 } },
        { label: "« Le partenaire idéal en double »",           w: { cameleon: 2, eclair: 1 } },
        { label: "« On ne s'ennuie jamais »",                   w: { etincelle: 2, canon: 1 } }
      ]
    }
  ];

  var quizBox = document.getElementById("quiz");
  var chosenArchetype = null;
  var step = 0;
  var answers = [];

  function scoreArchetype() {
    var scores = {};
    SLUGS.forEach(function (s) { scores[s] = 0; });
    answers.forEach(function (index, q) {
      var opt = QUESTIONS[q] && QUESTIONS[q].options[index];
      if (!opt) return;
      Object.keys(opt.w).forEach(function (slug) { scores[slug] += opt.w[slug]; });
    });
    var best = SLUGS[0];
    SLUGS.forEach(function (s) { if (scores[s] > scores[best]) best = s; });
    return best;
  }

  function renderQuiz() {
    if (!quizBox) return;
    quizBox.innerHTML = "";

    if (step >= QUESTIONS.length) {
      var slug = scoreArchetype();
      var a = ARCHETYPES[slug];
      var duo = ARCHETYPES[a.duo];
      chosenArchetype = a.name;

      quizBox.className = "quiz result";
      var prog = el("p", "quiz__progress");
      prog.appendChild(el("span", null, "Ton résultat"));
      prog.appendChild(el("span", null, a.trait));
      quizBox.appendChild(prog);

      var head = el("div", "result__head");
      var g = el("span", "result__glyph");
      g.innerHTML = glyph(slug);
      head.appendChild(g);
      head.appendChild(el("p", "result__name", a.name));
      quizBox.appendChild(head);

      quizBox.appendChild(el("p", null, a.tagline));

      var facts = el("dl", "result__facts");
      [["Trait", a.trait], ["Duo en double", duo.name]].forEach(function (pair) {
        var d = el("div");
        d.appendChild(el("dt", null, pair[0]));
        d.appendChild(el("dd", null, pair[1]));
        facts.appendChild(d);
      });
      quizBox.appendChild(facts);

      quizBox.appendChild(el("p", "quiz__hint", "Un archétype décrit un style, pas un niveau. On peut être " + a.name + " en débutant comme en compétition."));

      var nav = el("div", "quiz__nav");
      var keep = el("a", "btn", "Garder et m'inscrire");
      keep.setAttribute("href", "#inscription");
      keep.addEventListener("click", function () { applyArchetype(a.name); });
      var again = el("button", "quiz__back", "Refaire le quiz");
      again.type = "button";
      again.addEventListener("click", function () { step = 0; answers = []; renderQuiz(); });
      nav.appendChild(keep);
      nav.appendChild(again);
      quizBox.appendChild(nav);
      return;
    }

    var q = QUESTIONS[step];
    quizBox.className = "quiz";

    var progress = el("p", "quiz__progress");
    progress.appendChild(el("span", null, "Question " + (step + 1) + " sur " + QUESTIONS.length));
    progress.appendChild(el("span", null, "30 secondes"));
    quizBox.appendChild(progress);

    var bar = el("div", "quiz__bar");
    var fill = el("i");
    fill.style.width = Math.round((step / QUESTIONS.length) * 100) + "%";
    bar.appendChild(fill);
    quizBox.appendChild(bar);

    var fs = document.createElement("fieldset");
    var lg = document.createElement("legend");
    lg.textContent = q.title;
    fs.appendChild(lg);

    var opts = el("div", "quiz__options");
    q.options.forEach(function (opt, i) {
      var b = el("button", "option", opt.label);
      b.type = "button";
      b.setAttribute("aria-pressed", answers[step] === i ? "true" : "false");
      b.addEventListener("click", function () {
        answers[step] = i;
        step += 1;
        renderQuiz();
        quizBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      opts.appendChild(b);
    });
    fs.appendChild(opts);
    quizBox.appendChild(fs);

    if (step > 0) {
      var nav2 = el("div", "quiz__nav");
      var back = el("button", "quiz__back", "← Question précédente");
      back.type = "button";
      back.addEventListener("click", function () { step -= 1; renderQuiz(); });
      nav2.appendChild(back);
      quizBox.appendChild(nav2);
    }
  }

  function applyArchetype(name) {
    chosenArchetype = name;
    var slot = document.getElementById("archetype-slot");
    var pill = document.getElementById("archetype-pill");
    if (!slot || !pill) return;
    pill.textContent = name;
    slot.hidden = false;
  }

  renderQuiz();

  /* ==================================================================
     Formulaire d'inscription (absent sur les autres pages)
     ================================================================== */
  var form = document.getElementById("form");
  if (!form) return;

  var stateBox = document.getElementById("state");
  var submit = document.getElementById("submit");

  var ROLES = {
    player: "Joueur/joueuse",
    missing: "Il me manque un joueur",
    coach: "Coach",
    organization: "Club ou structure"
  };

  function role() { var r = $('input[name="role"]:checked'); return r ? r.value : "player"; }

  function syncFields() {
    var current = role();
    all("[data-when]").forEach(function (node) {
      node.hidden = (node.getAttribute("data-when") || "").split(/\s+/).indexOf(current) === -1;
    });
  }
  all('input[name="role"]').forEach(function (r) { r.addEventListener("change", syncFields); });
  syncFields();

  // Les boutons « Je suis coach » / « Je représente une structure » pré-sélectionnent le bon rôle.
  all("[data-role]").forEach(function (link) {
    link.addEventListener("click", function () {
      var wanted = $('input[name="role"][value="' + link.getAttribute("data-role") + '"]');
      if (wanted) { wanted.checked = true; syncFields(); }
    });
  });

  function showError(id, message) {
    var node = document.getElementById(id);
    if (!node) return;
    node.textContent = message || "";
    node.hidden = !message;
    var input = document.getElementById(id.replace(/^e-/, "f-"));
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function checked(name) {
    return all('input[name="' + name + '"]:checked').map(function (i) { return i.value; });
  }

  function validate() {
    var ok = true, firstBad = null;

    var prenom = $("#f-prenom").value.trim();
    if (prenom.length < 2) {
      showError("e-prenom", "Indique ton prénom (2 lettres minimum).");
      ok = false; firstBad = firstBad || $("#f-prenom");
    } else showError("e-prenom", "");

    var email = $("#f-email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      showError("e-email", "Cette adresse n'a pas l'air valide. Exemple : prenom@mail.com");
      ok = false; firstBad = firstBad || $("#f-email");
    } else showError("e-email", "");

    var current = role();
    if ((current === "player" || current === "missing") && !checked("sports").length) {
      showError("e-sports", "Choisis au moins un sport.");
      ok = false; firstBad = firstBad || $('input[name="sports"]');
    } else showError("e-sports", "");

    if (!$("#f-consent").checked) {
      showError("e-consent", "Sans cet accord, on ne peut pas te recontacter.");
      ok = false; firstBad = firstBad || $("#f-consent");
    } else showError("e-consent", "");

    if (firstBad) firstBad.focus();
    return ok;
  }

  function collect() {
    var current = role();
    return {
      role: ROLES[current] || current,
      prenom: $("#f-prenom").value.trim(),
      email: $("#f-email").value.trim().toLowerCase(),
      secteur: $("#f-secteur").value.trim(),
      sports: checked("sports").join(", "),
      creneaux: checked("dispo").join(", "),
      partie: $("#f-quand").value.trim(),
      structure: $("#f-structure").value.trim(),
      archetype: chosenArchetype || "",
      message: $("#f-mot").value.trim(),
      page: location.href,
      envoye_le: new Date().toISOString()
    };
  }

  function setState(kind, message) {
    stateBox.className = "form-status form-status--" + kind;
    stateBox.textContent = message;
    stateBox.hidden = false;
  }

  function track(name, data) {
    if (typeof window.plausible === "function") window.plausible(name, { props: data });
  }

  function mailtoFallback(p) {
    var lines = ["Rôle : " + p.role, "Prénom : " + p.prenom, "E-mail : " + p.email];
    if (p.secteur) lines.push("Secteur : " + p.secteur);
    if (p.sports) lines.push("Sports : " + p.sports);
    if (p.creneaux) lines.push("Créneaux : " + p.creneaux);
    if (p.partie) lines.push("Partie à compléter : " + p.partie);
    if (p.structure) lines.push("Structure : " + p.structure);
    if (p.archetype) lines.push("Archétype : " + p.archetype);
    if (p.message) lines.push("", "Message :", p.message);
    lines.push("", "— envoyé depuis " + p.page);

    window.location.href = "mailto:" + CONTACT_EMAIL
      + "?subject=" + encodeURIComponent("SportSub — inscription : " + p.prenom)
      + "&body=" + encodeURIComponent(lines.join("\n"));
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var honeypot = $("#f-site");
    if (honeypot && honeypot.value) return;

    if (!validate()) {
      setState("error", "Il manque une ou deux choses juste au-dessus.");
      return;
    }

    var payload = collect();
    var originalLabel = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Envoi…";

    function finish(success, message) {
      submit.disabled = false;
      submit.textContent = originalLabel;
      setState(success ? "ok" : "error", message);
      if (success) {
        form.reset();
        syncFields();
        var slot = document.getElementById("archetype-slot");
        if (slot) slot.hidden = true;
        track("Inscription", { role: payload.role, archetype: payload.archetype || "aucun" });
      }
    }

    if (!FORM_ENDPOINT) {
      mailtoFallback(payload);
      finish(true, "Ton logiciel de mail s'ouvre avec le message pré-rempli : il ne reste qu'à l'envoyer. "
                 + "Si rien ne s'ouvre, écris directement à " + CONTACT_EMAIL + ".");
      return;
    }

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        finish(true, "C'est noté, " + payload.prenom + ". Ta place est réservée sur la liste du 17e. "
                   + "On te prévient dès que la bêta ouvre.");
      })
      .catch(function () {
        finish(false, "L'envoi a échoué. Réessaie dans un instant, ou écris directement à " + CONTACT_EMAIL + ".");
      });
  });
})();
