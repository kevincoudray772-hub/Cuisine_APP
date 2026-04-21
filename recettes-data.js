const RECETTES = [
  {
    id: 1,
    emoji: '🍳',
    nom: 'Oeufs brouillés au fromage',
    temps: '10 min',
    personnes: 2,
    ingredients: [
      { name: 'oeufs', quantity: 3, unit: 'unités' },
      { name: 'fromage râpé', quantity: 50, unit: 'g' },
      { name: 'beurre', quantity: 15, unit: 'g' },
      { name: 'sel', quantity: 1, unit: 'pincée' }
    ],
    etapes: [
      'Cassez les oeufs dans un bol et battez-les légèrement avec une pincée de sel.',
      'Faites fondre le beurre dans une poêle à feu doux.',
      'Versez les oeufs et remuez doucement avec une spatule en formant de grands mouvements.',
      'Avant que les oeufs soient complètement pris, ajoutez le fromage râpé.',
      'Retirez du feu quand les oeufs sont encore légèrement coulants. Servez immédiatement.'
    ]
  },
  {
    id: 2,
    emoji: '🍝',
    nom: 'Pâtes carbonara',
    temps: '20 min',
    personnes: 2,
    ingredients: [
      { name: 'pâtes', quantity: 200, unit: 'g' },
      { name: 'lardons', quantity: 100, unit: 'g' },
      { name: 'oeufs', quantity: 2, unit: 'unités' },
      { name: 'parmesan', quantity: 50, unit: 'g' },
      { name: 'poivre', quantity: 1, unit: 'pincée' }
    ],
    etapes: [
      'Faites cuire les pâtes al dente dans une grande casserole d\'eau bouillante salée.',
      'Pendant ce temps, faites revenir les lardons dans une poêle sans matière grasse.',
      'Dans un bol, mélangez les oeufs entiers avec le parmesan râpé et le poivre.',
      'Égouttez les pâtes en gardant une tasse d\'eau de cuisson.',
      'Hors du feu, mélangez les pâtes chaudes avec les lardons, puis ajoutez le mélange oeuf-parmesan.',
      'Remuez rapidement en ajoutant un peu d\'eau de cuisson pour créer une sauce crémeuse. Servez aussitôt.'
    ]
  },
  {
    id: 3,
    emoji: '🥗',
    nom: 'Salade niçoise',
    temps: '15 min',
    personnes: 2,
    ingredients: [
      { name: 'salade verte', quantity: 1, unit: 'unité' },
      { name: 'thon en boîte', quantity: 1, unit: 'boîte' },
      { name: 'tomates', quantity: 2, unit: 'unités' },
      { name: 'oeufs', quantity: 2, unit: 'unités' },
      { name: 'olives noires', quantity: 50, unit: 'g' },
      { name: 'huile d\'olive', quantity: 3, unit: 'c.s.' }
    ],
    etapes: [
      'Faites cuire les oeufs durs (10 min dans l\'eau bouillante), puis écalez-les et coupez-les en quartiers.',
      'Lavez et essorez la salade, coupez les tomates en quartiers.',
      'Disposez la salade dans les assiettes, répartissez le thon égoutté, les tomates, les oeufs et les olives.',
      'Assaisonnez avec l\'huile d\'olive, sel et poivre. Servez immédiatement.'
    ]
  },
  {
    id: 4,
    emoji: '🍲',
    nom: 'Soupe de légumes',
    temps: '30 min',
    personnes: 4,
    ingredients: [
      { name: 'carottes', quantity: 3, unit: 'unités' },
      { name: 'pommes de terre', quantity: 3, unit: 'unités' },
      { name: 'poireau', quantity: 1, unit: 'unité' },
      { name: 'oignon', quantity: 1, unit: 'unité' },
      { name: 'bouillon de légumes', quantity: 1, unit: 'cube' }
    ],
    etapes: [
      'Épluchez et coupez tous les légumes en petits morceaux.',
      'Dans une grande casserole, faites revenir l\'oignon émincé avec un filet d\'huile.',
      'Ajoutez les carottes, les pommes de terre et le poireau. Faites revenir 3 min.',
      'Ajoutez 1 litre d\'eau chaude et le cube de bouillon. Portez à ébullition.',
      'Laissez mijoter 20 minutes à feu moyen jusqu\'à ce que les légumes soient tendres.',
      'Mixez le tout avec un mixeur plongeant. Ajustez le sel et le poivre. Servez chaud.'
    ]
  },
  {
    id: 5,
    emoji: '🍌',
    nom: 'Pancakes banane',
    temps: '15 min',
    personnes: 2,
    ingredients: [
      { name: 'banane', quantity: 2, unit: 'unités' },
      { name: 'oeufs', quantity: 2, unit: 'unités' },
      { name: 'farine', quantity: 80, unit: 'g' },
      { name: 'lait', quantity: 100, unit: 'ml' },
      { name: 'sucre', quantity: 20, unit: 'g' }
    ],
    etapes: [
      'Écrasez les bananes à la fourchette jusqu\'à obtenir une purée lisse.',
      'Ajoutez les oeufs, le sucre et mélangez.',
      'Incorporez la farine progressivement, puis le lait. Mélangez jusqu\'à obtenir une pâte homogène.',
      'Faites chauffer une poêle antiadhésive à feu moyen avec un peu de beurre.',
      'Versez une petite louche de pâte par pancake. Cuisez 2 min de chaque côté jusqu\'à dorure.',
      'Servez avec du miel, du sirop d\'érable ou des fruits frais.'
    ]
  },
  {
    id: 6,
    emoji: '🍗',
    nom: 'Poulet rôti aux herbes',
    temps: '50 min',
    personnes: 4,
    ingredients: [
      { name: 'cuisses de poulet', quantity: 4, unit: 'unités' },
      { name: 'ail', quantity: 3, unit: 'gousses' },
      { name: 'huile d\'olive', quantity: 3, unit: 'c.s.' },
      { name: 'thym', quantity: 1, unit: 'branche' },
      { name: 'citron', quantity: 1, unit: 'unité' }
    ],
    etapes: [
      'Préchauffez le four à 200°C.',
      'Mélangez l\'huile d\'olive, l\'ail écrasé, le jus de citron, le thym, sel et poivre.',
      'Badigeonnez généreusement les cuisses de poulet avec la marinade.',
      'Disposez dans un plat allant au four. Enfournez 40 à 45 minutes.',
      'Arrosez le poulet avec le jus de cuisson toutes les 15 minutes pour qu\'il reste juteux.',
      'Vérifiez la cuisson : le jus doit être clair lorsqu\'on pique la viande. Servez avec des légumes rôtis.'
    ]
  },
  {
    id: 7,
    emoji: '🧀',
    nom: 'Croque-monsieur',
    temps: '10 min',
    personnes: 2,
    ingredients: [
      { name: 'pain de mie', quantity: 4, unit: 'tranches' },
      { name: 'jambon', quantity: 2, unit: 'tranches' },
      { name: 'fromage râpé', quantity: 60, unit: 'g' },
      { name: 'beurre', quantity: 20, unit: 'g' }
    ],
    etapes: [
      'Beurrez une face de chaque tranche de pain.',
      'Posez 2 tranches côté beurré vers le bas dans une poêle chaude.',
      'Déposez une tranche de jambon sur chaque pain, puis parsemez de fromage râpé.',
      'Recouvrez des tranches de pain restantes, côté beurré vers le haut.',
      'Faites cuire 3 min à feu moyen, retournez délicatement et poursuivez 2 min.',
      'Le croque-monsieur est prêt quand le pain est doré et le fromage fondu. Servez chaud.'
    ]
  },
  {
    id: 8,
    emoji: '🍚',
    nom: 'Riz sauté aux légumes',
    temps: '20 min',
    personnes: 2,
    ingredients: [
      { name: 'riz cuit', quantity: 300, unit: 'g' },
      { name: 'oeufs', quantity: 2, unit: 'unités' },
      { name: 'carottes', quantity: 1, unit: 'unité' },
      { name: 'oignon', quantity: 1, unit: 'unité' },
      { name: 'sauce soja', quantity: 3, unit: 'c.s.' }
    ],
    etapes: [
      'Épluchez et coupez la carotte et l\'oignon en petits dés.',
      'Dans un wok ou grande poêle, faites chauffer un filet d\'huile à feu vif.',
      'Faites revenir l\'oignon 2 min, ajoutez les carottes et cuisez 5 min en remuant.',
      'Poussez les légumes sur le côté, cassez les oeufs dans le wok et brouilllez-les rapidement.',
      'Ajoutez le riz cuit et mélangez tout ensemble à feu vif pendant 3 min.',
      'Arrosez de sauce soja, remuez encore 1 min. Servez immédiatement.'
    ]
  }
];
