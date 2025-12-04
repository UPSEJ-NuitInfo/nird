/**
 * Module de calculs pour NIRD Navigator
 * Calcule les économies financières, l'impact carbone et le score d'autonomie
 */

/**
 * Constantes de calcul (à ajuster selon données réelles)
 */
const CONSTANTS = {
  // Licences annuelles (€)
  WINDOWS_LICENSE: 150,
  OFFICE_LICENSE: 100,
  GOOGLE_WORKSPACE: 72, // 6€/mois

  // Support & Formation
  TECH_SUPPORT_YEAR: 3000,
  TRAINING_ONE_TIME: 2000,
  LOCAL_SERVER_OPTIONAL: 5000,

  // Matériel
  PC_RENEWAL_COST: 600,
  CO2_PER_PC_KG: 200, // kg CO2 fabrication

  // Durée projection
  YEARS: 5,
};

/**
 * Calcule les économies et impacts d'un passage à NIRD
 * @param {Object} data - Données du formulaire
 * @returns {Object} - Résultats des calculs
 */
function calculateEconomies(data) {
  const {
    nbMachines = 0,
    nbUsers = 0,
    hasWindows = true,
    hasOffice = true,
    hasGoogleWorkspace = false,
    nbObsoleteMachines = 0,
    logicielsLibres = 0,
    logicielsTotal = 1,
    materielLinux = 0,
    donneesLocales = false,
    competencesInternes = false,
  } = data;

  // COÛTS BIG TECH (5 ans)
  const windowsCost = hasWindows
    ? CONSTANTS.WINDOWS_LICENSE * nbMachines * CONSTANTS.YEARS
    : 0;
  const officeCost = hasOffice
    ? CONSTANTS.OFFICE_LICENSE * nbUsers * CONSTANTS.YEARS
    : 0;
  const googleCost = hasGoogleWorkspace
    ? CONSTANTS.GOOGLE_WORKSPACE * nbUsers * CONSTANTS.YEARS
    : 0;
  const renewalCost = nbObsoleteMachines * CONSTANTS.PC_RENEWAL_COST;

  const totalBigTech = windowsCost + officeCost + googleCost + renewalCost;

  // COÛTS NIRD (5 ans)
  const supportCost = CONSTANTS.TECH_SUPPORT_YEAR * CONSTANTS.YEARS;
  const trainingCost = CONSTANTS.TRAINING_ONE_TIME;
  const serverCost = 0; // Optionnel, non compté par défaut

  const totalNIRD = supportCost + trainingCost + serverCost;

  // ÉCONOMIES
  const savings = totalBigTech - totalNIRD;
  const savingsPercent =
    totalBigTech > 0 ? Math.round((savings / totalBigTech) * 100) : 0;

  // IMPACT CARBONE
  const machinesSaved = nbObsoleteMachines;
  const co2Avoided = machinesSaved * CONSTANTS.CO2_PER_PC_KG;
  const treesEquivalent = Math.round(co2Avoided / 22); // 1 arbre = 22kg CO2/an

  // SCORE D'AUTONOMIE (0-100)
  const softwareScore = (logicielsLibres / logicielsTotal) * 40;
  const hardwareScore = nbMachines > 0 ? (materielLinux / nbMachines) * 30 : 0;
  const dataScore = donneesLocales ? 20 : 0;
  const skillsScore = competencesInternes ? 10 : 0;

  const autonomyScore = Math.round(
    softwareScore + hardwareScore + dataScore + skillsScore,
  );

  // ROADMAP (phases suggérées)
  const roadmap = generateRoadmap(autonomyScore, nbMachines);

  return {
    costs: {
      bigTech: {
        windows: windowsCost,
        office: officeCost,
        google: googleCost,
        renewal: renewalCost,
        total: totalBigTech,
      },
      nird: {
        support: supportCost,
        training: trainingCost,
        server: serverCost,
        total: totalNIRD,
      },
    },
    savings: {
      amount: savings,
      percent: savingsPercent,
    },
    carbon: {
      machinesSaved,
      co2Avoided,
      treesEquivalent,
    },
    autonomy: {
      score: autonomyScore,
      level: getAutonomyLevel(autonomyScore),
    },
    roadmap,
  };
}

/**
 * Génère une roadmap personnalisée selon le score
 */
function generateRoadmap(score, nbMachines) {
  const phases = [];

  // Phase 1 : Toujours nécessaire
  phases.push({
    name: 'Sensibilisation',
    duration: '1-2 mois',
    actions: [
      "Présenter NIRD à l'équipe éducative",
      'Identifier les besoins et freins',
      'Former un groupe pilote',
    ],
  });

  // Phase 2 : Selon le score
  if (score < 30) {
    phases.push({
      name: 'Découverte',
      duration: '3-6 mois',
      actions: [
        'Tester alternatives libres (LibreOffice, Firefox...)',
        'Installer Linux sur 2-3 machines pilotes',
        "Documenter l'expérience",
      ],
    });
  }

  // Phase 3 : Déploiement progressif
  phases.push({
    name: 'Expérimentation',
    duration: '6-12 mois',
    actions: [
      `Déployer Linux sur ${Math.min(10, Math.ceil(nbMachines * 0.2))} machines`,
      'Former les utilisateurs clés',
      'Mettre en place support technique',
    ],
  });

  // Phase 4 : Généralisation
  phases.push({
    name: 'Déploiement',
    duration: '1-2 ans',
    actions: [
      'Généraliser Linux sur toutes les machines compatibles',
      'Migrer stockage vers solutions locales',
      'Rejoindre la communauté NIRD',
    ],
  });

  return phases;
}

/**
 * Détermine le niveau d'autonomie
 */
function getAutonomyLevel(score) {
  if (score >= 80) return 'Expert - Village Résistant';
  if (score >= 60) return 'Avancé - En bonne voie';
  if (score >= 40) return 'Intermédiaire - Premiers pas';
  if (score >= 20) return 'Débutant - Prise de conscience';
  return 'Dépendant - Empire numérique';
}

// Export pour Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateEconomies,
    compute: calculateEconomies, // Alias pour compatibilité
    CONSTANTS,
  };
}
