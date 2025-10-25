import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Choice {
  text: string;
  nextScene: string;
  affectionChange: number;
  trustChange?: number;
  vulnerabilityChange?: number;
}

interface Scene {
  id: string;
  background: string;
  character: string;
  dialogue: string;
  speaker: string;
  choices?: Choice[];
  isEnding?: boolean;
  endingType?: 'perfect' | 'good' | 'neutral' | 'bad' | 'manipulation' | 'power' | 'truth' | 'trapped';
}

const gameData: Scene[] = [
  {
    id: 'start',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Зимний ветер воет за окнами тронного зала. Снег не прекращается уже много дней. Я смотрю на заснеженные горы через высокие окна, когда слышу знакомые шаги.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Обернуться и поприветствовать Аффогато', nextScene: 'greet', affectionChange: 0, trustChange: 5, vulnerabilityChange: 0 },
      { text: 'Продолжить смотреть в окно', nextScene: 'ignore', affectionChange: 0, trustChange: -5, vulnerabilityChange: 0 },
      { text: 'Заметить изменения в его походке', nextScene: 'observe_start', affectionChange: 0, trustChange: 10, vulnerabilityChange: 0 }
    ]
  },
  {
    id: 'greet',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О, Ваше Величество... Как внимательны вы сегодня. Я принёс вам отчёты о состоянии казны. Снежные бури затруднили торговлю с соседними королевствами.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить о его самочувствии', nextScene: 'care', affectionChange: 5, trustChange: -5, vulnerabilityChange: 10 },
      { text: 'Сразу перейти к делам', nextScene: 'business', affectionChange: -5, trustChange: 10, vulnerabilityChange: -5 },
      { text: 'Заметить, что он что-то скрывает', nextScene: 'suspicious', affectionChange: 0, trustChange: 15, vulnerabilityChange: -10 }
    ]
  },
  {
    id: 'ignore',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Ваше Величество погружены в свои мысли? Позвольте угадать... вы думаете о том, кому можно доверять в этом холодном дворце?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признать, что доверие - редкость', nextScene: 'trust_talk', affectionChange: 0, trustChange: 10, vulnerabilityChange: 5 },
      { text: 'Спросить, почему он задаёт такие вопросы', nextScene: 'question_motives', affectionChange: 0, trustChange: 15, vulnerabilityChange: 0 },
      { text: 'Сказать, что всё в порядке', nextScene: 'dismiss', affectionChange: -10, trustChange: -10, vulnerabilityChange: -5 }
    ]
  },
  {
    id: 'observe_start',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Я замечаю... он идёт медленнее обычного. Устал? Или нарочно даёт мне время подготовиться к разговору? С Аффогато никогда не знаешь наверняка.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Спросить напрямую о его состоянии', nextScene: 'direct_care', affectionChange: 0, trustChange: 20, vulnerabilityChange: 5 },
      { text: 'Продолжить наблюдение молча', nextScene: 'silent_observe', affectionChange: 0, trustChange: 15, vulnerabilityChange: -5 }
    ]
  },
  {
    id: 'care',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О, как мило... король беспокоится о своём советнике. *его глаза блестят с интересом* Простите мой цинизм, Ваше Величество, но я знаю цену таким вопросам. Или... может быть, на этот раз всё иначе?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Настоять, что беспокойство искреннее', nextScene: 'prove_sincerity', affectionChange: 5, trustChange: 10, vulnerabilityChange: 15 },
      { text: 'Признать его правоту и перейти к делам', nextScene: 'admit_game', affectionChange: -10, trustChange: 20, vulnerabilityChange: -10 },
      { text: 'Смутиться и отвести взгляд', nextScene: 'embarrassed', affectionChange: 10, trustChange: -5, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'business',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Прямо к делу. Практично. Я ценю это, Ваше Величество. В отличие от пустых любезностей, дела дают реальную власть. А власть... власть дороже любви.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить, почему он так думает о любви', nextScene: 'philosophy_love', affectionChange: 0, trustChange: 15, vulnerabilityChange: 5 },
      { text: 'Согласиться с его мировоззрением', nextScene: 'agree_power', affectionChange: -20, trustChange: 25, vulnerabilityChange: -15 },
      { text: 'Поспорить, что любовь тоже сила', nextScene: 'debate_love', affectionChange: 10, trustChange: 5, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'suspicious',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Ах... проницательность. Опасное качество, Ваше Величество. Да, я скрываю многое. Но разве не все мы носим маски? Даже вы за своей королевской холодностью.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить снять маски вместе', nextScene: 'unmask_together', affectionChange: 10, trustChange: 25, vulnerabilityChange: 20 },
      { text: 'Потребовать честности', nextScene: 'demand_truth', affectionChange: -10, trustChange: 15, vulnerabilityChange: -15 },
      { text: 'Признать, что маски нужны', nextScene: 'accept_masks', affectionChange: -5, trustChange: 20, vulnerabilityChange: -10 }
    ]
  },
  {
    id: 'embarrassed',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О? Неужели я смутил могущественного короля? *шаг ближе* Как... интересно. И как полезно знать.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Восстановить самообладание', nextScene: 'recover_composure', affectionChange: -5, trustChange: 10, vulnerabilityChange: -10 },
      { text: 'Признаться, что он действительно важен', nextScene: 'early_confession', affectionChange: 20, trustChange: -15, vulnerabilityChange: 40 },
      { text: 'Сменить тему резко', nextScene: 'change_topic', affectionChange: -10, trustChange: 5, vulnerabilityChange: 5 }
    ]
  },
  {
    id: 'early_confession',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Важен... *его улыбка становится теплее, но в глазах появляется расчётливый блеск* Ваше Величество, вы не представляете, как приятно слышать это. Позвольте мне... позаботиться о вас в ответ.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Принять его заботу', nextScene: 'accept_manipulation', affectionChange: 15, trustChange: -20, vulnerabilityChange: 30 },
      { text: 'Почувствовать что-то неладное', nextScene: 'sense_danger', affectionChange: 5, trustChange: 15, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'accept_manipulation',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Прекрасно... *касается вашей руки* Вы так долго были одни, Ваше Величество. Позвольте мне быть рядом. Позвольте мне... направлять вас.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Довериться ему полностью', nextScene: 'full_trust_trap', affectionChange: 25, trustChange: -30, vulnerabilityChange: 50 },
      { text: 'Попытаться сохранить контроль', nextScene: 'struggle_control', affectionChange: 10, trustChange: 0, vulnerabilityChange: 25 },
      { text: 'Осознать манипуляцию и отстраниться', nextScene: 'realize_manipulation', affectionChange: -15, trustChange: 30, vulnerabilityChange: -20 }
    ]
  },
  {
    id: 'full_trust_trap',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #000000 100%)',
    character: '🎭',
    dialogue: 'Вы так прекрасны, когда доверяете... *обнимает вас* Не волнуйтесь ни о чём. Я позабочусь обо всём. О королевстве. О решениях. О вас. Просто будьте рядом и любите меня.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Согласиться...', nextScene: 'ending_golden_cage', affectionChange: 30, trustChange: -50, vulnerabilityChange: 70 }
    ]
  },
  {
    id: 'struggle_control',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О, вы пытаетесь сохранить контроль? *смеётся мягко* Как очаровательно. Но зачем бороться, Ваше Величество? Разве не приятнее, когда о вас заботятся?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Поддаться его словам', nextScene: 'give_in_slowly', affectionChange: 20, trustChange: -25, vulnerabilityChange: 45 },
      { text: 'Настоять на равенстве', nextScene: 'demand_equality', affectionChange: 5, trustChange: 15, vulnerabilityChange: 15 },
      { text: 'Разозлиться на его тон', nextScene: 'angry_realization', affectionChange: -10, trustChange: 25, vulnerabilityChange: -15 }
    ]
  },
  {
    id: 'sense_danger',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Что-то не так. Его улыбка слишком идеальна. Слова слишком правильные. Это... это не настоящая забота. Это игра.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Противостоять ему напрямую', nextScene: 'confront_manipulation', affectionChange: -5, trustChange: 30, vulnerabilityChange: -20 },
      { text: 'Играть в его игру осторожно', nextScene: 'play_careful', affectionChange: 0, trustChange: 25, vulnerabilityChange: 0 },
      { text: 'Отступить эмоционально', nextScene: 'emotional_retreat', affectionChange: -15, trustChange: 15, vulnerabilityChange: -25 }
    ]
  },
  {
    id: 'confront_manipulation',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*его маска моментально меняется - от тёплой к холодной* Ах. Вы поняли. Как... неудобно. Что ж, Ваше Величество, вы оказались проницательнее, чем я думал.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить, почему он так поступает', nextScene: 'why_manipulate', affectionChange: 0, trustChange: 20, vulnerabilityChange: 5 },
      { text: 'Приказать ему уйти', nextScene: 'order_leave', affectionChange: -30, trustChange: 10, vulnerabilityChange: -30 },
      { text: 'Предложить начать честно', nextScene: 'offer_honesty', affectionChange: 10, trustChange: 35, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'why_manipulate',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Почему? *смеётся горько* Потому что это всё, что у меня есть. Манипуляция - это контроль. А контроль - это безопасность. Если я не контролирую - меня контролируют другие.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что понимаете', nextScene: 'understand_him', affectionChange: 15, trustChange: 30, vulnerabilityChange: 10 },
      { text: 'Предложить другой путь', nextScene: 'offer_different_way', affectionChange: 20, trustChange: 35, vulnerabilityChange: 15 },
      { text: 'Признать, что вы оба боитесь', nextScene: 'both_afraid', affectionChange: 25, trustChange: 40, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'offer_honesty',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Начать... честно? *долгая пауза* Вы понимаете, что просите? Честность - это уязвимость. А уязвимость...',
    speaker: 'Аффогато',
    choices: [
      { text: '"Уязвимость - это доверие"', nextScene: 'vulnerability_trust', affectionChange: 30, trustChange: 45, vulnerabilityChange: 25 },
      { text: '"Я тоже буду уязвим"', nextScene: 'mutual_vulnerability', affectionChange: 35, trustChange: 50, vulnerabilityChange: 30 }
    ]
  },
  {
    id: 'trust_talk',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Доверие... иллюзия для слабых. Но знаете что? Иногда я думаю, что хочу верить в эту иллюзию. Особенно глядя на вас.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить, что он имеет в виду', nextScene: 'what_mean', affectionChange: 5, trustChange: 15, vulnerabilityChange: 10 },
      { text: 'Признаться, что чувствуете то же', nextScene: 'confess_feelings', affectionChange: 25, trustChange: 5, vulnerabilityChange: 35 },
      { text: 'Сказать, что доверие нужно строить', nextScene: 'build_trust', affectionChange: 10, trustChange: 25, vulnerabilityChange: 5 }
    ]
  },
  {
    id: 'confess_feelings',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы... чувствуете то же? *его глаза расширяются, и вы видите расчёт* Ваше Величество, это так трогательно. Знаете, я всегда мечтал услышать такое.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Поверить ему', nextScene: 'believe_him', affectionChange: 30, trustChange: -20, vulnerabilityChange: 45 },
      { text: 'Заметить фальшь в голосе', nextScene: 'notice_fake', affectionChange: 5, trustChange: 20, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'believe_him',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*обнимает вас нежно* О, мой дорогой король... позвольте мне быть рядом. Я буду заботиться о вас. О всём, что вас беспокоит.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Обнять в ответ', nextScene: 'embrace_trap', affectionChange: 35, trustChange: -30, vulnerabilityChange: 55 },
      { text: 'Что-то насторожило вас', nextScene: 'last_chance_realize', affectionChange: 15, trustChange: 10, vulnerabilityChange: 30 }
    ]
  },
  {
    id: 'embrace_trap',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #1A1A2E 100%)',
    character: '🎭',
    dialogue: 'Вот и хорошо... *гладит вас по спине* Теперь вы мои, Ваше Величество. Не в грубом смысле, конечно. Но ваше сердце, ваша любовь... они дают мне всё, что нужно.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Осознать ловушку слишком поздно', nextScene: 'ending_sweet_poison', affectionChange: 40, trustChange: -60, vulnerabilityChange: 80 }
    ]
  },
  {
    id: 'question_motives',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Почему я задаю такие вопросы? Потому что мне интересно, Ваше Величество. Вы - загадка. Король-воин, который правит железной рукой, но иногда... иногда я вижу в ваших глазах одиночество.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признаться в одиночестве', nextScene: 'confess_lonely', affectionChange: 15, trustChange: 20, vulnerabilityChange: 30 },
      { text: 'Отрицать это', nextScene: 'deny_lonely', affectionChange: -15, trustChange: -10, vulnerabilityChange: -15 },
      { text: 'Спросить, одинок ли он сам', nextScene: 'ask_his_lonely', affectionChange: 10, trustChange: 25, vulnerabilityChange: 5 }
    ]
  },
  {
    id: 'confess_lonely',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы признаётесь в одиночестве... мне? *его выражение смягчается* Знаете, это делает вас... человечнее. Уязвимее. И это... полезная информация.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Не заметить его последних слов', nextScene: 'miss_warning', affectionChange: 20, trustChange: -15, vulnerabilityChange: 40 },
      { text: 'Насторожиться от его тона', nextScene: 'suspicious_tone', affectionChange: 5, trustChange: 20, vulnerabilityChange: 15 },
      { text: 'Спросить, что он имеет в виду', nextScene: 'ask_what_useful', affectionChange: 10, trustChange: 25, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'ask_his_lonely',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Одинок ли я? *долгая пауза* Да. Более одинок, чем вы можете себе представить. Когда всё, что у тебя есть - это маски, ты забываешь, кто ты на самом деле.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить помочь найти себя', nextScene: 'help_find', affectionChange: 40, trustChange: 50, vulnerabilityChange: 20 },
      { text: 'Сказать, что хотите узнать настоящего его', nextScene: 'know_real', affectionChange: 35, trustChange: 45, vulnerabilityChange: 15 },
      { text: 'Признаться, что боитесь того же', nextScene: 'fear_same', affectionChange: 45, trustChange: 55, vulnerabilityChange: 35 }
    ]
  },
  {
    id: 'direct_care',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы... заметили? Как неожиданно. Я немного устал, да. Игра в интриги отнимает много сил. Но почему вас это волнует?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что он важен для королевства', nextScene: 'important_kingdom', affectionChange: -5, trustChange: 5, vulnerabilityChange: 0 },
      { text: 'Признать, что он важен лично для вас', nextScene: 'important_personally_early', affectionChange: 20, trustChange: -10, vulnerabilityChange: 35 },
      { text: 'Уклониться от прямого ответа', nextScene: 'evade', affectionChange: -10, trustChange: 15, vulnerabilityChange: -10 }
    ]
  },
  {
    id: 'important_personally_early',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Важен... лично для вас? *на мгновение вы видите искренне удивление, но оно быстро сменяется чем-то другим* Какое неожиданное признание, Ваше Величество.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Развить эту тему дальше', nextScene: 'develop_confession', affectionChange: 25, trustChange: -20, vulnerabilityChange: 45 },
      { text: 'Почувствовать, что сказали слишком много', nextScene: 'said_too_much', affectionChange: 10, trustChange: 10, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'develop_confession',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*шагает ближе, его улыбка становится мягче* Продолжайте, Ваше Величество. Мне очень интересно слышать, насколько именно я важен для вас.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Рассказать о своих чувствах', nextScene: 'full_confession_trap', affectionChange: 35, trustChange: -35, vulnerabilityChange: 65 },
      { text: 'Остановиться и подумать', nextScene: 'pause_think', affectionChange: 10, trustChange: 15, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'full_confession_trap',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #1A1A2E 100%)',
    character: '🎭',
    dialogue: 'О, как трогательно... *его рука ложится на вашу* Вы открыли мне своё сердце. И я обещаю... заботиться о нём. По-своему.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Довериться ему', nextScene: 'ending_velvet_chains', affectionChange: 45, trustChange: -50, vulnerabilityChange: 85 }
    ]
  },
  {
    id: 'understand_him',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Вы... понимаете? *его маска даёт трещину* Даже зная, что я пытался манипулировать вами?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Да, потому что я вижу причину', nextScene: 'see_reason', affectionChange: 40, trustChange: 50, vulnerabilityChange: 25 },
      { text: 'Протянуть руку помощи', nextScene: 'extend_help', affectionChange: 45, trustChange: 55, vulnerabilityChange: 30 }
    ]
  },
  {
    id: 'both_afraid',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Мы оба... боимся? *смеётся, но в этом смехе есть боль* Может быть, вы правы. Может быть, мы оба прячемся за стенами.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить разрушить стены вместе', nextScene: 'destroy_walls', affectionChange: 50, trustChange: 60, vulnerabilityChange: 35 }
    ]
  },
  {
    id: 'mutual_vulnerability',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Вы тоже будете уязвимы? *слеза стекает по его щеке* Никто... никто никогда не предлагал разделить уязвимость со мной.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Обнять его', nextScene: 'ending_true_love', affectionChange: 70, trustChange: 80, vulnerabilityChange: 40 },
      { text: 'Взять за руку', nextScene: 'ending_healing_together', affectionChange: 65, trustChange: 75, vulnerabilityChange: 35 }
    ]
  },
  {
    id: 'fear_same',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Вы... боитесь того же? Король, который правит целым королевством, боится потеряться? *его голос дрожит* Тогда... тогда давайте искать себя вместе.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Согласиться и обнять его', nextScene: 'ending_soul_mates', affectionChange: 85, trustChange: 95, vulnerabilityChange: 45 },
      { text: 'Поцеловать его руку', nextScene: 'ending_true_love', affectionChange: 80, trustChange: 90, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'help_find',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Помочь найти себя... *его маска полностью падает* Вы действительно... хотите помочь? Не использовать, не контролировать... просто помочь?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Просто помочь', nextScene: 'ending_redemption', affectionChange: 75, trustChange: 85, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'destroy_walls',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '🎭',
    dialogue: 'Разрушить стены вместе... *протягивает руку* Хорошо. Я попробую. Попробую довериться. Попробую... любить по-настоящему.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Принять его руку', nextScene: 'ending_new_dawn', affectionChange: 90, trustChange: 100, vulnerabilityChange: 45 }
    ]
  },
  {
    id: 'ending_true_love',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '💜',
    dialogue: 'В тронном зале наступает тишина. Впервые за много лет Аффогато плачет - не от боли, а от счастья. "Я думал, что любовь - это слабость," - шепчет он. "Но с вами... с вами это сила, которая даёт мне смелость быть собой." За окном рассвет окрашивает снег в золотые тона.',
    speaker: 'Финал: Настоящая Любовь',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_soul_mates',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '💕',
    dialogue: 'Два одиноких сердца нашли друг друга в холодном королевстве. Вы держите Аффогато за руку, чувствуя, как его пальцы переплетаются с вашими. "Мы оба носили маски слишком долго," - говорит он. "Но теперь... теперь у нас есть друг друга." Родственные души, наконец объединившиеся.',
    speaker: 'Финал: Родственные Души',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_healing_together',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '💙',
    dialogue: 'Это только начало долгого пути исцеления. Ваши руки соединены, и впереди много работы. Аффогато учится доверять без манипуляций, а вы учитесь открываться без страха. "Спасибо," - шепчет он, - "за то, что не сдались на мне."',
    speaker: 'Финал: Исцеление Вместе',
    isEnding: true,
    endingType: 'good'
  },
  {
    id: 'ending_redemption',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🌟',
    dialogue: 'Аффогато делает первые шаги к искуплению. Не за прошлые грехи, а к тому, чтобы стать лучше. Вы рядом на каждом шагу, не как судья, а как поддержка. "Я не обещаю, что изменюсь быстро," - говорит он. "Но я обещаю пытаться. Ради нас."',
    speaker: 'Финал: Путь Искупления',
    isEnding: true,
    endingType: 'good'
  },
  {
    id: 'ending_new_dawn',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '🌅',
    dialogue: 'Ваши руки соединены, когда вы смотрите на рассвет. Впервые за годы метель утихла. "Это новое начало," - говорит Аффогато, и в его голосе нет ни капли манипуляции. Только надежда. Только любовь. Только правда.',
    speaker: 'Финал: Новый Рассвет',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_golden_cage',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #000000 100%)',
    character: '🕊️⛓️',
    dialogue: 'Вы живёте в золотой клетке. Аффогато любит вас - по-своему. Он заботится о вас, окружает вниманием, решает все проблемы. Но каждое решение королевства проходит через него. Вы король только по названию. "Я люблю тебя," - шепчет он каждый вечер. И вы верите. Вы должны верить.',
    speaker: 'Финал: Золотая Клетка',
    isEnding: true,
    endingType: 'manipulation'
  },
  {
    id: 'ending_sweet_poison',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #1A1A2E 100%)',
    character: '🍷',
    dialogue: 'Его любовь как сладкий яд. Каждый день вы погружаетесь глубже в зависимость от его одобрения, его улыбок, его прикосновений. Аффогато управляет вами через вашу любовь к нему. И самое страшное - вы счастливы. В своём неведении, в своей слепоте... вы счастливы.',
    speaker: 'Финал: Сладкий Яд',
    isEnding: true,
    endingType: 'manipulation'
  },
  {
    id: 'ending_velvet_chains',
    background: 'linear-gradient(to bottom, #1A1A2E 0%, #0D0D1A 100%)',
    character: '⛓️💜',
    dialogue: 'Бархатные цепи - всё ещё цепи. Аффогато нашёптывает вам на ухо каждое решение, каждый указ. "Доверься мне," - говорит он. И вы доверяете. Ваша любовь к нему стала его самым мощным инструментом. Королевство процветает под его скрытым правлением. А вы... вы просто любите.',
    speaker: 'Финал: Бархатные Цепи',
    isEnding: true,
    endingType: 'trapped'
  },
  {
    id: 'agree_power',
    background: 'linear-gradient(to bottom, #1A1A2E 0%, #0D0D1A 100%)',
    character: '👑🎭',
    dialogue: 'Вы становитесь партнёрами во власти. Эффективными, успешными, непобедимыми. Но когда ночью вы остаётесь один в своих покоях, вы думаете о том, что могло быть. Аффогато думает о том же в своих. Две одинокие души, выбравшие силу вместо любви.',
    speaker: 'Финал: Союз Силы',
    isEnding: true,
    endingType: 'power'
  }
];

const Index = () => {
  const [currentSceneId, setCurrentSceneId] = useState('start');
  const [affection, setAffection] = useState(0);
  const [trust, setTrust] = useState(0);
  const [vulnerability, setVulnerability] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const currentScene = gameData.find(scene => scene.id === currentSceneId);

  useEffect(() => {
    if (currentScene && gameStarted) {
      setIsTyping(true);
      setDisplayedText('');
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(currentScene.dialogue.slice(0, index));
        index++;
        if (index > currentScene.dialogue.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentSceneId, gameStarted, currentScene]);

  const handleChoice = (choice: Choice) => {
    setAffection(prev => Math.max(0, Math.min(100, prev + choice.affectionChange)));
    setTrust(prev => Math.max(0, Math.min(100, prev + (choice.trustChange || 0))));
    setVulnerability(prev => Math.max(0, Math.min(100, prev + (choice.vulnerabilityChange || 0))));
    setCurrentSceneId(choice.nextScene);
  };

  const restartGame = () => {
    setCurrentSceneId('start');
    setAffection(0);
    setTrust(0);
    setVulnerability(0);
    setGameStarted(true);
  };

  if (!currentScene) return null;

  if (!gameStarted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 50%, #3D2B47 100%)' }}
      >
        <Card className="max-w-2xl w-full p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-fade-in">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">❄️👑🎭</div>
            <h1 className="text-5xl font-bold font-montserrat text-primary mb-4">
              Королевство Тёмного Какао
            </h1>
            <p className="text-xl text-muted-foreground font-cormorant leading-relaxed">
              Зимние горы. Вечная метель. Холодное сердце короля.<br/>
              И советник, чьи намерения темны, как шоколад.
            </p>
            <div className="pt-4 px-8 text-sm text-muted-foreground font-cormorant italic leading-relaxed border-l-2 border-primary/30">
              Аффогато не верит в любовь. Он видит в ней только инструмент манипуляции.<br/>
              Если вы откроете сердце слишком рано - он воспользуется этим.<br/>
              Но если заслужите его доверие... может быть, он тоже научится любить.
            </div>
            <div className="pt-6">
              <Button 
                onClick={() => setGameStarted(true)}
                size="lg"
                className="text-lg px-8 py-6 font-montserrat bg-primary hover:bg-primary/90"
              >
                Начать историю
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-1000"
      style={{ background: currentScene.background }}
    >
      <div className="max-w-4xl w-full space-y-4 animate-fade-in">
        <div className="flex justify-between items-center px-4 flex-wrap gap-4">
          <div className="text-sm font-montserrat text-muted-foreground">
            Глава {gameData.findIndex(s => s.id === currentSceneId) + 1}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-montserrat text-muted-foreground">💕</span>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-destructive via-pink-500 to-primary transition-all duration-500"
                  style={{ width: `${affection}%` }}
                />
              </div>
              <span className="text-xs font-montserrat text-foreground">{affection}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-montserrat text-muted-foreground">🤝</span>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 via-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${trust}%` }}
                />
              </div>
              <span className="text-xs font-montserrat text-foreground">{trust}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-montserrat text-muted-foreground" title="Ваша уязвимость - чем выше, тем легче вами манипулировать">⚠️</span>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 transition-all duration-500"
                  style={{ width: `${vulnerability}%` }}
                />
              </div>
              <span className="text-xs font-montserrat text-foreground">{vulnerability}%</span>
            </div>
          </div>
        </div>

        <Card className="bg-card/95 backdrop-blur-md border-primary/20 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="flex items-start gap-6">
              <div className="text-7xl flex-shrink-0">{currentScene.character}</div>
              <div className="flex-1 space-y-4">
                <div className="text-sm font-montserrat font-semibold text-primary uppercase tracking-wider">
                  {currentScene.speaker}
                </div>
                <div className="text-lg font-cormorant leading-relaxed text-foreground min-h-[120px]">
                  {displayedText}
                  {isTyping && <span className="animate-pulse">▌</span>}
                </div>
              </div>
            </div>

            {!isTyping && currentScene.choices && (
              <div className="grid gap-3 pt-4 animate-fade-in">
                {currentScene.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    variant="outline"
                    className="w-full justify-start text-left p-4 h-auto font-cormorant text-base hover:bg-primary/10 hover:border-primary transition-all duration-300"
                  >
                    <span className="flex-1">{choice.text}</span>
                    <span className="flex gap-2 text-xs opacity-50">
                      {choice.affectionChange !== 0 && (
                        <span>💕 {choice.affectionChange > 0 ? '+' : ''}{choice.affectionChange}</span>
                      )}
                      {choice.trustChange !== 0 && (
                        <span>🤝 {choice.trustChange > 0 ? '+' : ''}{choice.trustChange}</span>
                      )}
                      {choice.vulnerabilityChange !== 0 && (
                        <span className={choice.vulnerabilityChange > 0 ? 'text-yellow-500' : 'text-green-500'}>
                          ⚠️ {choice.vulnerabilityChange > 0 ? '+' : ''}{choice.vulnerabilityChange}
                        </span>
                      )}
                    </span>
                  </Button>
                ))}
              </div>
            )}

            {!isTyping && currentScene.isEnding && (
              <div className="space-y-4 pt-4 animate-fade-in">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-montserrat font-bold mb-2">
                    {currentScene.endingType === 'perfect' && '⭐ Идеальная концовка'}
                    {currentScene.endingType === 'good' && '💫 Хорошая концовка'}
                    {currentScene.endingType === 'neutral' && '😐 Нейтральная концовка'}
                    {currentScene.endingType === 'bad' && '😔 Плохая концовка'}
                    {currentScene.endingType === 'manipulation' && '🎭 Вы стали марионеткой'}
                    {currentScene.endingType === 'trapped' && '⛓️ Вы в ловушке любви'}
                    {currentScene.endingType === 'power' && '⚔️ Концовка силы'}
                  </div>
                  <div className="text-sm font-cormorant text-muted-foreground">
                    Привязанность: {affection}% | Доверие: {trust}% | Уязвимость: {vulnerability}%
                  </div>
                </div>
                <Button
                  onClick={restartGame}
                  className="w-full font-montserrat bg-primary hover:bg-primary/90"
                >
                  Начать заново
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
