export class Role {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.team = config.team;
    this.emoji = config.emoji || '';
    this.photo = config.photo || '';
    this.description = config.description;
    this.ability = config.ability;
    this.nightOrder = config.nightOrder ?? null;
    this.wakeUp = config.wakeUp ?? false;
    this.nightMessage = config.nightMessage || '';
    this.defaultCount = config.defaultCount || 1;
    this.minCount = config.minCount || 0;
    this.maxCount = config.maxCount || 99;
  }

  get photoUrl() {
    return this.photo || `images/${this.id}.png`;
  }

  get initial() {
    return this.name.charAt(0).toUpperCase();
  }

  static teamLabel(team) {
    const labels = { village: 'Village', werewolf: 'Loup-Garou', solo: 'Solo' };
    return labels[team] || team;
  }

  static teamColor(team) {
    const colors = { village: '#4a90d9', werewolf: '#d94a4a', solo: '#9b59b6' };
    return colors[team] || '#888';
  }
}

export const ROLES = [
  new Role({
    id: 'werewolf',
    name: 'Loup-Garou',
    team: 'werewolf',
    emoji: '🌕',
    description: 'Loup sauvage qui égorge les villageois chaque nuit.',
    ability: 'Chaque nuit, choisissez une victime avec les autres loups.',
    nightOrder: 1,
    wakeUp: true,
    nightMessage: 'Loups-Garous, ouvrez les yeux et désignez votre victime au narrateur.',
    defaultCount: 2,
  }),
  new Role({
    id: 'blackwolf',
    name: 'Loup-Noir',
    team: 'werewolf',
    emoji: '⚫',
    description: 'Loup mystérieux qui réduit ses ennemis au silence.',
    ability: 'Chaque nuit, désignez un joueur qui ne pourra pas parler au jour.',
    nightOrder: 1.2,
    wakeUp: true,
    nightMessage: 'Loup-Noir, ouvrez les yeux. Qui doit être réduit au silence demain ?',
    defaultCount: 1,
  }),
  new Role({
    id: 'infectedwolf',
    name: 'Loup Infect',
    team: 'werewolf',
    emoji: '☣️',
    description: 'Peut infecter un joueur pour qu\'il devienne loup (une fois).',
    ability: 'Infectez un joueur pour qu\'il devienne loup-garou.',
    nightOrder: 1,
    wakeUp: true,
    nightMessage: 'Loup Infect, ouvrez les yeux. Qui voulez-vous infecter ?',
    defaultCount: 1,
  }),
  new Role({
    id: 'villager',
    name: 'Villageois',
    team: 'village',
    emoji: '👤',
    description: 'Habitant ordinaire du village, sans pouvoir spécial.',
    ability: 'Vous votez le jour pour éliminer un suspect.',
    defaultCount: 4,
    wakeUp: false,
  }),
  new Role({
    id: 'idiot',
    name: 'Villageois Idiot',
    team: 'village',
    emoji: '🤤',
    description: 'Un peu lent, mais ne peut pas être éliminé par vote.',
    ability: 'La 1ʳᵉ fois qu\'on vote contre vous, vous survivez (mais ne votez plus).',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'elder',
    name: 'Ancien',
    team: 'village',
    emoji: '👴',
    description: 'Ancien respecté, a survécu à plusieurs guerres.',
    ability: 'Vous possédez 2 vies. Les loups doivent vous tuer deux fois.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'seer',
    name: 'Voyante',
    team: 'village',
    emoji: '🔮',
    description: 'Dotée de voyance, elle peut percer les secrets.',
    ability: 'Chaque nuit, le narrateur vous montre la carte d\'un joueur.',
    nightOrder: 2,
    wakeUp: true,
    nightMessage: 'Voyante, ouvrez les yeux. Qui voulez-vous sonder ? Montrez-le au narrateur.',
    defaultCount: 1,
  }),
  new Role({
    id: 'witch',
    name: 'Sorcière',
    team: 'village',
    emoji: '🧙‍♀️',
    description: 'Guérisseuse aux potions, peut sauver ou tuer.',
    ability: 'Une potion de vie et une potion de mort, chacune utilisable une fois.',
    nightOrder: 3,
    wakeUp: true,
    nightMessage: 'Sorcière, ouvrez les yeux. Voici la victime des loups. Potion de vie ou de mort ?',
    defaultCount: 1,
  }),
  new Role({
    id: 'barber',
    name: 'Barbier',
    team: 'village',
    emoji: '✂️',
    description: 'Artisan de la mort, offre une dernière coupe.',
    ability: 'Quand vous êtes éliminé, vous pouvez éliminer un joueur avec vous.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'retro',
    name: 'Rétro',
    team: 'solo',
    emoji: '🔄',
    description: 'Vole le rôle d\'un autre et le transforme en villageois.',
    ability: 'Échangez votre rôle avec un autre joueur. Il devient villageois, vous prenez son rôle.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
];
