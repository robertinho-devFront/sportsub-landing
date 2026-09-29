/**
 * SportSub — génère le questionnaire Google Forms en une exécution.
 *
 * MODE D'EMPLOI (5 minutes, aucune installation)
 * ----------------------------------------------------------------------
 *  1. Va sur script.google.com et clique « Nouveau projet ».
 *  2. Efface le contenu de l'éditeur, colle TOUT ce fichier à la place.
 *  3. Clique « Exécuter ». Google demande une autorisation la première fois :
 *     accepte (le script crée un formulaire dans TON Drive, rien d'autre).
 *  4. Ouvre le menu « Exécution » → le journal affiche deux liens :
 *       - le lien d'ÉDITION du formulaire (pour toi)
 *       - le lien PUBLIC à partager (celui à coller dans le site)
 *  5. Colle le lien public dans assets/js/main.js, variable LINKS.questionnaire.
 *
 * Les réponses arrivent dans l'onglet « Réponses » du formulaire, et
 * s'exportent en feuille de calcul en un clic.
 * ----------------------------------------------------------------------
 */

function creerQuestionnaireSportSub() {
  var form = FormApp.create('SportSub — ta pratique du tennis et du padel');

  form.setDescription(
    "Deux minutes, dix questions. On construit une application pour trouver un partenaire " +
    "de tennis ou de padel dans le 17e arrondissement de Paris. Tes réponses décident des " +
    "premières fonctionnalités.\n\n" +
    "Aucune donnée n'est revendue. L'e-mail est facultatif et ne sert qu'à te prévenir du lancement."
  );

  form.setCollectEmail(false);          // l'e-mail est demandé à la fin, facultatif
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(false);
  form.setConfirmationMessage(
    "Merci ! C'est enregistré.\n\n" +
    "Si tu veux être prévenu du lancement, laisse ton e-mail sur la page d'accueil de SportSub."
  );

  // ─── 1. Qui es-tu ────────────────────────────────────────────────────
  form.addMultipleChoiceItem()
    .setTitle('Tu es…')
    .setRequired(true)
    .setChoiceValues([
      'Joueur ou joueuse',
      'Entraîneur, coach ou éducateur',
      'Responsable d\'un club ou d\'une association',
      'Parent d\'un jeune joueur'
    ]);

  // ─── 2. Sport ────────────────────────────────────────────────────────
  form.addCheckboxItem()
    .setTitle('Tu pratiques…')
    .setRequired(true)
    .setChoiceValues(['Tennis', 'Padel', 'Les deux']);

  // ─── 3. Ancienneté ───────────────────────────────────────────────────
  form.addMultipleChoiceItem()
    .setTitle('Depuis combien de temps tu joues ?')
    .setRequired(true)
    .setChoiceValues([
      'Moins d\'un an',
      'Entre 1 et 3 ans',
      'Entre 3 et 10 ans',
      'Plus de 10 ans',
      'J\'ai arrêté et je veux reprendre'
    ]);

  // ─── 4. Fréquence ────────────────────────────────────────────────────
  form.addMultipleChoiceItem()
    .setTitle('À quelle fréquence tu joues en ce moment ?')
    .setRequired(true)
    .setChoiceValues([
      'Plusieurs fois par semaine',
      'Une fois par semaine',
      'Une à deux fois par mois',
      'Moins souvent',
      'Pas du tout en ce moment'
    ]);

  // ─── 5. Cadre de pratique ────────────────────────────────────────────
  form.addCheckboxItem()
    .setTitle('Comment tu joues aujourd\'hui ?')
    .setHelpText('Plusieurs réponses possibles.')
    .setRequired(true)
    .setChoiceValues([
      'Licencié dans un club',
      'Cours collectifs',
      'Cours particuliers avec un coach',
      'Réservation de courts municipaux (Paris Tennis)',
      'Entre amis, sans structure',
      'Au mur, seul'
    ]);

  // ─── 6. Niveau ───────────────────────────────────────────────────────
  form.addMultipleChoiceItem()
    .setTitle('Tu as un classement ?')
    .setRequired(true)
    .setChoiceValues([
      'Non, je ne suis pas licencié',
      'Licencié, non classé (NC)',
      'De 40 à 30/2',
      'De 30/1 à 15/5',
      '15/4 et mieux'
    ]);

  // ─── 7. Frein principal ──────────────────────────────────────────────
  form.addCheckboxItem()
    .setTitle('Qu\'est-ce qui t\'empêche de jouer plus souvent ?')
    .setHelpText('Deux réponses maximum, les plus vraies.')
    .setRequired(true)
    .setChoiceValues([
      'Trouver quelqu\'un de mon niveau',
      'Trouver un court libre',
      'Le prix',
      'Mes horaires',
      'La motivation quand je suis seul',
      'Rien, je joue autant que je veux'
    ]);

  // ─── 8. Créneaux ─────────────────────────────────────────────────────
  form.addCheckboxItem()
    .setTitle('Tes créneaux habituels')
    .setRequired(true)
    .setChoiceValues([
      'Matin en semaine',
      'Pause déjeuner',
      'Après 18 h',
      'Samedi',
      'Dimanche'
    ]);

  // ─── 9. Territoire ───────────────────────────────────────────────────
  form.addTextItem()
    .setTitle('Tu joues dans quel arrondissement ou quelle commune ?')
    .setHelpText('Exemple : Paris 17e, Levallois, Clichy.')
    .setRequired(true);

  // ─── 10. LA question d'engagement ────────────────────────────────────
  form.addMultipleChoiceItem()
    .setTitle('On organise une partie dans le 17e un samedi matin. Tu viendrais ?')
    .setHelpText('C\'est la question la plus utile du questionnaire : réponds franchement.')
    .setRequired(true)
    .setChoiceValues([
      'Oui, préviens-moi',
      'Peut-être, ça dépend du niveau',
      'Peut-être, ça dépend de l\'horaire',
      'Non'
    ]);

  // ─── 11. Coachs uniquement ───────────────────────────────────────────
  form.addTextItem()
    .setTitle('Si tu es coach ou club : combien de créneaux restent vides chaque semaine ?')
    .setHelpText('Laisse vide si la question ne te concerne pas.')
    .setRequired(false);

  // ─── 12. Contact ─────────────────────────────────────────────────────
  var email = form.addTextItem()
    .setTitle('Ton e-mail (facultatif)')
    .setHelpText('Uniquement pour te prévenir du lancement. Aucune revente, désinscription en un clic.')
    .setRequired(false);
  email.setValidation(
    FormApp.createTextValidation()
      .setHelpText('Cette adresse n\'a pas l\'air valide.')
      .requireTextIsEmail()
      .build()
  );

  form.addParagraphTextItem()
    .setTitle('Un mot libre ?')
    .setHelpText('Un terrain qui manque sur nos cartes, une idée, un reproche : tout est bon à prendre.')
    .setRequired(false);

  Logger.log('══════════════════════════════════════════════');
  Logger.log('LIEN D\'ÉDITION (pour toi) : ' + form.getEditUrl());
  Logger.log('LIEN PUBLIC (à coller dans le site) : ' + form.getPublishedUrl());
  Logger.log('══════════════════════════════════════════════');
}
