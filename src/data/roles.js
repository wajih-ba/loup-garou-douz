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
    photo: 'images/loup-garou.webp',
    description: 'ذيب متوحش يقتل واحد من أهل البلاد كل ليلة.',
    ability: 'كل ليلة، يختار ضحية مع بقية الذباب.',
    nightOrder: 1,
    wakeUp: true,
    nightMessage: 'الذباب، فتحوا العيون واختاروا الضحية.',
    defaultCount: 2,
  }),
  new Role({
    id: 'blackwolf',
    name: 'Loup-Noir',
    team: 'werewolf',
    emoji: '⚫',
    photo: 'images/loup-noire.jpg',
    description: 'ذيب غامض يخلي أعداءه يصمتوا.',
    ability: 'كل ليلة، يختار واحد وما يعودش يقدر يتكلم النهار.',
    nightOrder: 1.2,
    wakeUp: true,
    nightMessage: 'الذيب الأسود، فتح عينك. مين لازم يصمت بكرة؟',
    defaultCount: 1,
  }),
  new Role({
    id: 'infectedwolf',
    name: 'Loup Infect',
    team: 'werewolf',
    emoji: '☣️',
    photo: 'images/pere infect.webp',
    description: 'يقدر يعدّي واحد ويولّيه ذيب (مرة برك).',
    ability: 'يعدّي واحد ويولّي ذيب.',
    nightOrder: 1,
    wakeUp: true,
    nightMessage: 'الذيب المعدّي، فتح عينك. مين تحب تعدي؟',
    defaultCount: 1,
  }),
  new Role({
    id: 'loup-blanc',
    name: 'Loup-Blanc',
    team: 'werewolf',
    emoji: '🤍',
    photo: 'images/loup-blanc.webp',
    description: 'ذيب أبيض يقتل بروحه من غير ما يعاونو الحد.',
    ability: 'كل ليلة، يختار ضحية بروحه حتا لو الذباب اختارو واحد آخر.',
    nightOrder: 1.5,
    wakeUp: true,
    nightMessage: 'الذيب الأبيض، فتح عينك. مين تحب تاكل بروحك؟',
    defaultCount: 1,
  }),
  new Role({
    id: 'villager',
    name: 'Villageois',
    team: 'village',
    emoji: '👤',
    photo: 'images/simple villagoit.webp',
    description: 'واحد عادي من أهل البلاد، ما عندو حتى قوة.',
    ability: 'ينتخب النهار باش يخلصو من المشبوهين.',
    defaultCount: 4,
    wakeUp: false,
  }),
  new Role({
    id: 'idiot',
    name: 'Villageois Idiot',
    team: 'village',
    emoji: '🤤',
    photo: 'images/idiot.webp',
    description: 'شوية بطيء، لكن ما ينجموش يخلصو عليه بالانتخاب.',
    ability: 'أول مرة ينتخبو عليه، يتنجّا (ما يعودش ينتخب).',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'elder',
    name: 'Ancien',
    team: 'village',
    emoji: '👴',
    photo: 'images/ancien.webp',
    description: 'كبير محترم، عاش برشا حروب.',
    ability: 'عندو حياتين. الذباب لازم يقتلوه مرتين باش يموت.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'seer',
    name: 'Voyante',
    team: 'village',
    emoji: '🔮',
    photo: 'images/voyante.webp',
    description: 'عندها كرافة، تقدر تشوف الأسرار.',
    ability: 'كل ليلة، الراوي يوريها كارت واحد.',
    nightOrder: 2,
    wakeUp: true,
    nightMessage: 'العرّافة، فتحي عينك. مين تحب تكتشف؟ وريها للراوي.',
    defaultCount: 1,
  }),
  new Role({
    id: 'witch',
    name: 'Sorcière',
    team: 'village',
    emoji: '🧙‍♀️',
    photo: 'images/sorciere.webp',
    description: 'عندها دوا الحياة ودوا الموت، تقدر تنجّي ولا تقتل.',
    ability: 'عندها دوا حياة ودوا موت، كل واحد تستعملو مرة برك.',
    nightOrder: 3,
    wakeUp: true,
    nightMessage: 'الساحرة، فتحي عينك. هاي ضحية الذباب. دوا حياة ولا دوا موت؟',
    defaultCount: 1,
  }),
  new Role({
    id: 'barber',
    name: 'Barbier',
    team: 'village',
    emoji: '✂️',
    photo: 'images/barbier.jpg',
    description: 'صانع الموت، يأخذ واحد معاه.',
    ability: 'ملي يخلصو عليه، يقدر يخلص على واحد معاه.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'retro',
    name: 'Rétro',
    team: 'solo',
    emoji: '🔄',
    photo: 'images/retro.webp',
    description: 'يسرق دور واحد ويولّيه أهلي.',
    ability: 'يبدّل دورو مع واحد آخر. يولّي أهلي وهو يأخذ دورو.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
];
