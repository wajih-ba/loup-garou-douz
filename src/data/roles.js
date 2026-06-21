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
    description: 'ذيب وحشي يقتل أهل البلاد كل ليلة.',
    ability: 'كل ليلة، اختار ضحية مع الذباب الآخرين.',
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
    description: 'ذيب غامبي يخلي أعداهو يصمتوا.',
    ability: 'كل ليلة، اختار واحد ما يقدرش يتكلم نهار.',
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
    description: 'قدر يعدّي واحد يولّي ذيب (مرة وحدة).',
    ability: 'عدّي واحد يولّي ذيب.',
    nightOrder: 1,
    wakeUp: true,
    nightMessage: 'الذيب المعدّي، فتح عينك. مين تحب تعدي؟',
    defaultCount: 1,
  }),
  new Role({
    id: 'villager',
    name: 'Villageois',
    team: 'village',
    emoji: '👤',
    description: 'واحد عادي من أهل البلاد، ما عندهوش قوة خاصة.',
    ability: 'تنتخب نهار باش تخلّص من المشبوه.',
    defaultCount: 4,
    wakeUp: false,
  }),
  new Role({
    id: 'idiot',
    name: 'Villageois Idiot',
    team: 'village',
    emoji: '🤤',
    description: 'شوية بطيء، لكن ما يقدرش يتخلص بالانتخاب.',
    ability: 'أول مرة ينتخبوا عليك، تتنجّو (بش ما تنتخب بعد).',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'elder',
    name: 'Ancien',
    team: 'village',
    emoji: '👴',
    description: 'كبير محتروم، عاش كتير حروب.',
    ability: 'عندك حياتين. الذباب لازم يقتلوك مرتين.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'seer',
    name: 'Voyante',
    team: 'village',
    emoji: '🔮',
    description: 'عندها كرافة، تقدر تكشف الأسرار.',
    ability: 'كل ليلة، الراوي يوريك كارت واحد.',
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
    description: 'طبيبة بالأدوية، تقدر تنجّي أو تقتل.',
    ability: 'دوا حياة ودوا موت، كل واحد يخدم مرة.',
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
    description: 'صانع الموت، يعطي قصة أخيرة.',
    ability: 'متى يتخلصوا منك، تقدر تخلص من واحد معاك.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
  new Role({
    id: 'retro',
    name: 'Rétro',
    team: 'solo',
    emoji: '🔄',
    description: 'يسرق دور واحد ويحوّله أهلي.',
    ability: 'بدّل دورك مع واحد آخر. يولّي أهلي، تأخذ دوره.',
    nightOrder: null,
    wakeUp: false,
    defaultCount: 1,
  }),
];
