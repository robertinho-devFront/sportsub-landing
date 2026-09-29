/* ==========================================================================
   SportSub — landing de pré-lancement
   Aucune dépendance. Le formulaire fonctionne dans deux modes :
   1. FORM_ENDPOINT renseigné  -> envoi POST (Formspree, Getform, Basin…)
   2. FORM_ENDPOINT vide       -> ouverture du client mail, pré-rempli
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     À CONFIGURER — voir README.md, section « Brancher le formulaire »
     ------------------------------------------------------------------ */
  var FORM_ENDPOINT = "";                     // ex. "https://formspree.io/f/xxxxxxxx"
  var CONTACT_EMAIL = "rdasilva75@gmail.com"; // à remplacer par une adresse pro

  // Les deux portes de la fenêtre « bientôt disponible ».
  // Laisse une valeur vide : la porte s'affiche alors grisée, marquée « bientôt ».
  var LINKS = {
    carte: "https://claude.ai/artifact/TaeQFjgnWus3HHkNGm4U7F",
    questionnaire: ""   // colle ici le lien de ton formulaire Google (voir README, section 5)
  };
  /* ------------------------------------------------------------------ */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ==================================================================
     Portes « bientôt disponible »
     ================================================================== */
  all("[data-door-link]").forEach(function (node) {
    var url = LINKS[node.getAttribute("data-door-link")];
    if (url) {
      node.setAttribute("href", url);
      return;
    }
    node.removeAttribute("href");
    node.removeAttribute("target");
    node.setAttribute("aria-disabled", "true");
    node.setAttribute("role", "link");
    var label = $(".door__b", node);
    if (label && !$(".door__soon", label)) {
      var tag = document.createElement("span");
      tag.className = "door__soon";
      tag.textContent = "Disponible très bientôt";
      label.appendChild(tag);
    }
    node.addEventListener("click", function (e) { e.preventDefault(); });
  });

  var dialog = document.getElementById("soon");

  if (dialog && typeof dialog.showModal === "function") {
    var lastFocus = null;

    function openSoon(door) {
      lastFocus = document.activeElement;
      dialog.showModal();
      var target = door ? $('[data-door-link="' + door + '"]', dialog) : null;
      var first = (target && target.getAttribute("href")) ? target : $(".door", dialog);
      if (first) first.focus();
    }

    function closeSoon() {
      dialog.close();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // Tout lien marqué data-soon ouvre la fenêtre au lieu de naviguer.
    // Sans JavaScript, il mène à bientot.html, qui dit la même chose.
    all("[data-soon]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openSoon(link.getAttribute("data-door"));
      });
    });

    var closeBtn = document.getElementById("soon-close");
    if (closeBtn) closeBtn.addEventListener("click", closeSoon);

    // Clic sur le fond, en dehors du panneau.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closeSoon();
    });

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
     Formulaire d'inscription (absent sur les autres pages)
     ================================================================== */
  var form = document.getElementById("form");
  if (!form) return;

  var stateBox = document.getElementById("state");
  var submit = document.getElementById("submit");

  var LABELS = {
    profil: { joueur: "Joueur/joueuse", coach: "Coach ou club", partenaire: "Partenaire / sponsor" },
    niveau: {
      decouverte: "Découverte", loisir: "Loisir", regulier: "Régulier",
      classe: "Classé (30/4 à 15/5)", competition: "Compétition (15/4 et mieux)"
    },
    dispo: {
      matin: "Matin en semaine", midi: "Pause déjeuner", soir: "Après 18h",
      samedi: "Samedi", dimanche: "Dimanche"
    }
  };

  function profil() { var r = $('input[name="profil"]:checked'); return r ? r.value : "joueur"; }

  /* ---------- champs conditionnels ---------- */
  function syncConditionalFields() {
    var p = profil();
    all("[data-when]").forEach(function (node) {
      node.hidden = node.getAttribute("data-when") !== p;
    });
  }
  all('input[name="profil"]').forEach(function (r) {
    r.addEventListener("change", syncConditionalFields);
  });
  syncConditionalFields();

  /* ---------- pré-sélection depuis un bouton « Parler d'un partenariat » ---------- */
  all('[data-role]').forEach(function (link) {
    link.addEventListener("click", function () {
      var role = link.getAttribute("data-role");
      var radio = $('input[name="profil"][value="' + role + '"]');
      if (radio) { radio.checked = true; syncConditionalFields(); }
    });
  });

  /* ---------- validation ---------- */
  function showError(id, message) {
    var node = document.getElementById(id);
    if (!node) return;
    node.textContent = message || "";
    node.hidden = !message;
    var input = document.getElementById(id.replace(/^e-/, "f-"));
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
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

    if (firstBad) firstBad.focus();
    return ok;
  }

  /* ---------- collecte ---------- */
  function collect() {
    var dispo = all('input[name="dispo"]:checked').map(function (i) {
      return LABELS.dispo[i.value] || i.value;
    });
    var niveauValue = $("#f-niveau").value;
    var p = profil();

    return {
      prenom: $("#f-prenom").value.trim(),
      email: $("#f-email").value.trim().toLowerCase(),
      profil: LABELS.profil[p] || p,
      niveau: p === "joueur" ? (LABELS.niveau[niveauValue] || "Non précisé") : "",
      creneaux: p === "joueur" ? (dispo.join(", ") || "Non précisé") : "",
      message: $("#f-mot").value.trim(),
      variante_titre: document.documentElement.getAttribute("data-variant") || "a",
      page: location.href,
      envoye_le: new Date().toISOString()
    };
  }

  function setState(kind, message) {
    stateBox.className = "state state--" + kind;
    stateBox.textContent = message;
    stateBox.hidden = false;
  }

  function track(name, data) {
    // Plausible ou équivalent, s'il est chargé. Silencieux sinon.
    if (typeof window.plausible === "function") window.plausible(name, { props: data });
  }

  function mailtoFallback(payload) {
    var lines = [
      "Prénom : " + payload.prenom,
      "E-mail : " + payload.email,
      "Profil : " + payload.profil
    ];
    if (payload.niveau) lines.push("Niveau : " + payload.niveau);
    if (payload.creneaux) lines.push("Créneaux : " + payload.creneaux);
    if (payload.message) lines.push("", "Message :", payload.message);
    lines.push("", "— envoyé depuis " + payload.page);

    var href = "mailto:" + CONTACT_EMAIL
      + "?subject=" + encodeURIComponent("SportSub — inscription : " + payload.prenom)
      + "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
  }

  /* ---------- envoi ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Piège à robots : un humain ne remplit jamais ce champ.
    var honeypot = $("#f-site");
    if (honeypot && honeypot.value) return;

    if (!validate()) {
      setState("ko", "Il manque une ou deux choses juste au-dessus.");
      return;
    }

    var payload = collect();
    submit.disabled = true;
    var originalLabel = submit.textContent;
    submit.textContent = "Envoi…";

    function finish(success, message) {
      submit.disabled = false;
      submit.textContent = originalLabel;
      setState(success ? "ok" : "ko", message);
      if (success) {
        form.reset();
        syncConditionalFields();
        track("Inscription", { profil: payload.profil, variante: payload.variante_titre });
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
        finish(true, "C'est noté, " + payload.prenom + ". Tu es sur la liste du 17e. "
                   + "On te prévient dès que les premières parties s'ouvrent.");
      })
      .catch(function () {
        finish(false, "L'envoi a échoué. Réessaie dans un instant, ou écris directement à " + CONTACT_EMAIL + ".");
      });
  });

  /* ---------- année courante dans le pied de page, si présente ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
