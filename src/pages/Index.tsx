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
  location?: string;
  choices?: Choice[];
  isEnding?: boolean;
  endingType?: 'perfect' | 'good' | 'neutral' | 'bad' | 'manipulation' | 'power' | 'truth' | 'trapped' | 'resistance';
}

const gameData: Scene[] = [
  {
    id: 'start',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Зимний ветер воет за окнами тронного зала. Снег не прекращается уже много дней. Я смотрю на заснеженные горы через высокие окна, когда слышу знакомые шаги.',
    speaker: 'Дарк Какао',
    location: '🏛️ Тронный зал',
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
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Спросить о его самочувствии', nextScene: 'care', affectionChange: 5, trustChange: -5, vulnerabilityChange: 10 },
      { text: 'Сразу перейти к делам', nextScene: 'business', affectionChange: -5, trustChange: 10, vulnerabilityChange: -5 },
      { text: 'Предложить обсудить в более удобном месте', nextScene: 'suggest_location', affectionChange: 5, trustChange: 5, vulnerabilityChange: 5 }
    ]
  },
  {
    id: 'suggest_location',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Более удобное место? *приподнимает бровь* Как интригующе. Что вы предлагаете, Ваше Величество?',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Пригласить в свои покои', nextScene: 'invite_chambers', affectionChange: 15, trustChange: -10, vulnerabilityChange: 25 },
      { text: 'Предложить прогуляться по дворцу', nextScene: 'palace_walk', affectionChange: 5, trustChange: 10, vulnerabilityChange: 5 },
      { text: 'Пойти в библиотеку', nextScene: 'library_scene', affectionChange: 0, trustChange: 15, vulnerabilityChange: 0 },
      { text: 'Выйти в сад', nextScene: 'garden_scene', affectionChange: 10, trustChange: 5, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'invite_chambers',
    background: 'linear-gradient(to bottom, #2D1B3D 0%, #1A1F2C 100%)',
    character: '🎭',
    dialogue: 'В ваши покои? *его глаза блестят* Какая честь, Ваше Величество. Или... это больше чем просто удобство?',
    speaker: 'Аффогато',
    location: '🚪 Покои короля',
    choices: [
      { text: 'Смутиться и не ответить', nextScene: 'chambers_embarrassed', affectionChange: 20, trustChange: -15, vulnerabilityChange: 35 },
      { text: 'Сказать, что там можно говорить откровеннее', nextScene: 'chambers_honest', affectionChange: 10, trustChange: 20, vulnerabilityChange: 15 },
      { text: 'Объяснить что это просто удобнее', nextScene: 'chambers_practical', affectionChange: -5, trustChange: 10, vulnerabilityChange: -5 }
    ]
  },
  {
    id: 'chambers_embarrassed',
    background: 'linear-gradient(to bottom, #2D1B3D 0%, #1A1F2C 100%)',
    character: '🎭',
    dialogue: '*закрывает дверь за собой* Ваша смущение... восхитительно. Вы пригласили меня в самое личное пространство. Это многое говорит.',
    speaker: 'Аффогато',
    location: '🚪 Покои короля',
    choices: [
      { text: 'Позволить ему доминировать в разговоре', nextScene: 'chambers_submit', affectionChange: 25, trustChange: -25, vulnerabilityChange: 45 },
      { text: 'Восстановить контроль', nextScene: 'chambers_control', affectionChange: 5, trustChange: 15, vulnerabilityChange: 10 },
      { text: 'Признаться что чувствуете', nextScene: 'chambers_confess', affectionChange: 30, trustChange: -20, vulnerabilityChange: 50 }
    ]
  },
  {
    id: 'chambers_submit',
    background: 'linear-gradient(to bottom, #2D1B3D 0%, #1A1F2C 100%)',
    character: '🎭',
    dialogue: '*подходит ближе* Вы дрожите? От холода... или от моей близости? *его рука касается вашего плеча* Позвольте мне согреть вас.',
    speaker: 'Аффогато',
    location: '🚪 Покои короля',
    choices: [
      { text: 'Поддаться его прикосновению', nextScene: 'chambers_trap', affectionChange: 35, trustChange: -35, vulnerabilityChange: 60 },
      { text: 'Осознать опасность', nextScene: 'chambers_realize', affectionChange: 10, trustChange: 20, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'chambers_trap',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #1A1A2E 100%)',
    character: '🎭',
    dialogue: '*обнимает вас сзади* Вот так... просто расслабьтесь. Доверьтесь мне. Я позабочусь о всём. О вас. О королевстве. Вам не нужно больше нести это бремя одному.',
    speaker: 'Аффогато',
    location: '🚪 Покои короля',
    choices: [
      { text: 'Полностью довериться', nextScene: 'ending_intimate_cage', affectionChange: 45, trustChange: -50, vulnerabilityChange: 80 },
      { text: 'Последняя попытка вырваться', nextScene: 'chambers_break_free', affectionChange: 15, trustChange: 25, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'palace_walk',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Прогулка по дворцу... *идёт рядом с вами* Знаете, я много лет хожу по этим коридорам. Но с вами они кажутся... другими.',
    speaker: 'Аффогато',
    location: '🏰 Коридоры дворца',
    choices: [
      { text: 'Спросить, что он имеет в виду', nextScene: 'palace_question', affectionChange: 10, trustChange: 10, vulnerabilityChange: 10 },
      { text: 'Завести разговор о прошлом дворца', nextScene: 'palace_history', affectionChange: 0, trustChange: 15, vulnerabilityChange: 0 },
      { text: 'Молча идти рядом', nextScene: 'palace_silence', affectionChange: 5, trustChange: 5, vulnerabilityChange: 5 }
    ]
  },
  {
    id: 'palace_question',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Что я имею в виду? *останавливается у окна* Обычно я иду по этим коридорам с целью. Манипулировать. Контролировать. Но сейчас... я просто иду. С вами.',
    speaker: 'Аффогато',
    location: '🏰 Коридоры дворца',
    choices: [
      { text: 'Это признание или манипуляция?', nextScene: 'palace_suspect', affectionChange: 0, trustChange: 25, vulnerabilityChange: -10 },
      { text: 'Взять его за руку', nextScene: 'palace_hand', affectionChange: 25, trustChange: -5, vulnerabilityChange: 30 },
      { text: 'Предложить показать любимое место', nextScene: 'secret_place', affectionChange: 15, trustChange: 15, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'secret_place',
    background: 'linear-gradient(to bottom, #2D2433 0%, #1A2332 100%)',
    character: '👑',
    dialogue: 'Я привожу его в небольшую башню на краю дворца. Мало кто знает об этом месте. Отсюда видно всё королевство.',
    speaker: 'Дарк Какао',
    location: '🗼 Секретная башня',
    choices: [
      { text: 'Рассказать почему это место особенное', nextScene: 'tower_share', affectionChange: 20, trustChange: 25, vulnerabilityChange: 25 },
      { text: 'Просто стоять вместе молча', nextScene: 'tower_silence', affectionChange: 15, trustChange: 20, vulnerabilityChange: 15 }
    ]
  },
  {
    id: 'tower_share',
    background: 'linear-gradient(to bottom, #2D2433 0%, #1A2332 100%)',
    character: '👑',
    dialogue: '"Я прихожу сюда, когда мне тяжело. Когда нужно вспомнить, зачем я правлю." *смотрю на него* "Никому не показывал это место."',
    speaker: 'Дарк Какао',
    location: '🗼 Секретная башня',
    choices: [
      { text: 'Ждать его реакции', nextScene: 'tower_reaction', affectionChange: 10, trustChange: 30, vulnerabilityChange: 30 }
    ]
  },
  {
    id: 'tower_reaction',
    background: 'linear-gradient(to bottom, #2D2433 0%, #1A2332 100%)',
    character: '🎭',
    dialogue: '*смотрит на вас, и на мгновение его маска спадает* Вы... показали мне свою слабость. Своё убежище. Это либо глупость... либо доверие.',
    speaker: 'Аффогато',
    location: '🗼 Секретная башня',
    choices: [
      { text: 'Это доверие', nextScene: 'tower_trust', affectionChange: 30, trustChange: 40, vulnerabilityChange: 35 },
      { text: 'Возможно и то и другое', nextScene: 'tower_both', affectionChange: 20, trustChange: 35, vulnerabilityChange: 30 },
      { text: 'Спросить что он выберет делать с этим', nextScene: 'tower_test', affectionChange: 15, trustChange: 40, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'tower_test',
    background: 'linear-gradient(to bottom, #2D2433 0%, #1A2332 100%)',
    character: '🎭',
    dialogue: 'Что я выберу? *долгая пауза* Я мог бы использовать это. Мог бы превратить ваше убежище в ловушку. Но... *поворачивается к вам* Но я не хочу.',
    speaker: 'Аффогато',
    location: '🗼 Секретная башня',
    choices: [
      { text: 'Почему не хочешь?', nextScene: 'tower_why', affectionChange: 25, trustChange: 45, vulnerabilityChange: 30 },
      { text: 'Верю тебе', nextScene: 'tower_believe', affectionChange: 35, trustChange: 35, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'tower_why',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Почему? *смеётся тихо* Потому что... с вами я тоже хочу иметь убежище. Место, где не нужны маски.',
    speaker: 'Аффогато',
    location: '🗼 Секретная башня',
    choices: [
      { text: 'Предложить делить это место', nextScene: 'ending_shared_haven', affectionChange: 60, trustChange: 70, vulnerabilityChange: 40 },
      { text: 'Обнять его', nextScene: 'ending_tower_embrace', affectionChange: 65, trustChange: 75, vulnerabilityChange: 45 }
    ]
  },
  {
    id: 'library_scene',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Библиотека... *осматривает полки* Интересный выбор. Здесь можно узнать многое. О королевстве. О людях. О... королях.',
    speaker: 'Аффогато',
    location: '📚 Королевская библиотека',
    choices: [
      { text: 'Показать ему древние хроники', nextScene: 'library_chronicles', affectionChange: 5, trustChange: 20, vulnerabilityChange: 5 },
      { text: 'Спросить что он ищет в книгах', nextScene: 'library_ask', affectionChange: 10, trustChange: 15, vulnerabilityChange: 10 },
      { text: 'Сесть читать вместе', nextScene: 'library_together', affectionChange: 15, trustChange: 10, vulnerabilityChange: 15 }
    ]
  },
  {
    id: 'library_ask',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Что я ищу? *достаёт старую книгу* Ответы. Как люди находят счастье. Как они любят без страха. Как перестают быть одинокими.',
    speaker: 'Аффогато',
    location: '📚 Королевская библиотека',
    choices: [
      { text: 'Ответы не в книгах', nextScene: 'library_wisdom', affectionChange: 20, trustChange: 30, vulnerabilityChange: 20 },
      { text: 'Предложить искать ответы вместе', nextScene: 'library_search_together', affectionChange: 30, trustChange: 40, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'library_wisdom',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: '"Аффогато. Ответы не в книгах. Они в том, чтобы позволить кому-то быть рядом. По-настоящему."',
    speaker: 'Дарк Какао',
    location: '📚 Королевская библиотека',
    choices: [
      { text: 'Протянуть руку', nextScene: 'library_hand', affectionChange: 35, trustChange: 45, vulnerabilityChange: 30 }
    ]
  },
  {
    id: 'library_hand',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: '*смотрит на вашу руку, затем в глаза* Вы... предлагаете быть этим "кем-то"? *его голос дрожит* Даже зная, кто я?',
    speaker: 'Аффогато',
    location: '📚 Королевская библиотека',
    choices: [
      { text: 'Именно поэтому', nextScene: 'ending_library_love', affectionChange: 70, trustChange: 80, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'garden_scene',
    background: 'linear-gradient(to bottom, #1A2332 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Зимний сад покрыт снегом, но теплицы сохраняют несколько цветущих растений. Единственное место во дворце, где есть жизнь среди зимы.',
    speaker: 'Дарк Какао',
    location: '🌹 Зимний сад',
    choices: [
      { text: 'Показать редкие цветы', nextScene: 'garden_flowers', affectionChange: 10, trustChange: 10, vulnerabilityChange: 10 },
      { text: 'Рассказать о значении сада', nextScene: 'garden_meaning', affectionChange: 15, trustChange: 15, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'garden_meaning',
    background: 'linear-gradient(to bottom, #1A2332 0%, #2D2433 100%)',
    character: '👑',
    dialogue: '"Этот сад... напоминание что даже в самую суровую зиму жизнь продолжается. Что красота возможна даже в холоде."',
    speaker: 'Дарк Какао',
    location: '🌹 Зимний сад',
    choices: [
      { text: 'Посмотреть на Аффогато', nextScene: 'garden_look', affectionChange: 20, trustChange: 20, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'garden_look',
    background: 'linear-gradient(to bottom, #1A2332 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*касается цветка* Вы пытаетесь сказать мне что-то? Что даже холодное сердце может... расцвести?',
    speaker: 'Аффогато',
    location: '🌹 Зимний сад',
    choices: [
      { text: 'Именно это', nextScene: 'garden_confirm', affectionChange: 25, trustChange: 30, vulnerabilityChange: 30 },
      { text: 'Сорвать цветок и дать ему', nextScene: 'garden_flower_gift', affectionChange: 30, trustChange: 25, vulnerabilityChange: 35 }
    ]
  },
  {
    id: 'garden_flower_gift',
    background: 'linear-gradient(to bottom, #1A2332 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: '*берёт цветок дрожащими руками* Никто... никто никогда не дарил мне цветы. Обычно я тот, кто дарит. Чтобы манипулировать. Но это... это искреннее?',
    speaker: 'Аффогато',
    location: '🌹 Зимний сад',
    choices: [
      { text: 'Абсолютно искреннее', nextScene: 'ending_garden_bloom', affectionChange: 65, trustChange: 70, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'ignore',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Ваше Величество погружены в свои мысли? Позвольте угадать... вы думаете о том, кому можно доверять в этом холодном дворце?',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Признать, что доверие - редкость', nextScene: 'trust_talk', affectionChange: 0, trustChange: 10, vulnerabilityChange: 5 },
      { text: 'Спросить, почему он задаёт такие вопросы', nextScene: 'question_motives', affectionChange: 0, trustChange: 15, vulnerabilityChange: 0 },
      { text: 'Предложить прогуляться', nextScene: 'walk_proposal', affectionChange: 5, trustChange: 10, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'walk_proposal',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Прогуляться? В такую метель? *усмехается* Или вы имеете в виду прогулку по дворцу?',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Пройтись по коридорам', nextScene: 'palace_walk', affectionChange: 5, trustChange: 10, vulnerabilityChange: 5 },
      { text: 'Выйти в метель', nextScene: 'blizzard_walk', affectionChange: 15, trustChange: 15, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'blizzard_walk',
    background: 'linear-gradient(to bottom, #0D1821 0%, #1A1F2C 100%)',
    character: '👑',
    dialogue: 'Холодный ветер бьёт в лицо. Снег слепит глаза. Но мы идём вместе по стенам крепости.',
    speaker: 'Дарк Какао',
    location: '❄️ Стены крепости',
    choices: [
      { text: 'Молча идти рядом', nextScene: 'blizzard_silence', affectionChange: 10, trustChange: 20, vulnerabilityChange: 15 },
      { text: 'Заговорить о зиме', nextScene: 'blizzard_talk', affectionChange: 5, trustChange: 15, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'blizzard_silence',
    background: 'linear-gradient(to bottom, #0D1821 0%, #1A1F2C 100%)',
    character: '🎭',
    dialogue: '*его рука случайно касается вашей* Извините. Холод... *но он не убирает руку*',
    speaker: 'Аффогато',
    location: '❄️ Стены крепости',
    choices: [
      { text: 'Взять его руку', nextScene: 'blizzard_hand', affectionChange: 30, trustChange: 25, vulnerabilityChange: 30 },
      { text: 'Притянуть его ближе', nextScene: 'blizzard_close', affectionChange: 35, trustChange: 20, vulnerabilityChange: 40 },
      { text: 'Не реагировать', nextScene: 'blizzard_ignore_touch', affectionChange: -5, trustChange: 10, vulnerabilityChange: -5 }
    ]
  },
  {
    id: 'blizzard_hand',
    background: 'linear-gradient(to bottom, #0D1821 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*замирает* Ваше Величество... *смотрит на ваши соединённые руки* В такой холод... это кажется правильным.',
    speaker: 'Аффогато',
    location: '❄️ Стены крепости',
    choices: [
      { text: 'Согласиться', nextScene: 'blizzard_agree', affectionChange: 25, trustChange: 30, vulnerabilityChange: 30 },
      { text: 'Поцеловать его руку', nextScene: 'blizzard_kiss_hand', affectionChange: 40, trustChange: 25, vulnerabilityChange: 45 }
    ]
  },
  {
    id: 'blizzard_agree',
    background: 'linear-gradient(to bottom, #0D1821 0%, #3D2B47 100%)',
    character: '👑',
    dialogue: '"Правильным." Я повторяю его слово. Впервые за долгое время что-то кажется правильным.',
    speaker: 'Дарк Какао',
    location: '❄️ Стены крепости',
    choices: [
      { text: 'Остаться в этом моменте', nextScene: 'ending_blizzard_moment', affectionChange: 55, trustChange: 65, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'observe_start',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Я замечаю... он идёт медленнее обычного. Устал? Или нарочно даёт мне время подготовиться к разговору? С Аффогато никогда не знаешь наверняка.',
    speaker: 'Дарк Какао',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Спросить напрямую о его состоянии', nextScene: 'direct_care', affectionChange: 0, trustChange: 20, vulnerabilityChange: 5 },
      { text: 'Продолжить наблюдение молча', nextScene: 'silent_observe', affectionChange: 0, trustChange: 15, vulnerabilityChange: -5 },
      { text: 'Предложить ему отдохнуть', nextScene: 'offer_rest', affectionChange: 10, trustChange: 15, vulnerabilityChange: 15 }
    ]
  },
  {
    id: 'offer_rest',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Отдохнуть? *удивлённо* Ваше Величество заботится о моём комфорте? Где бы вы предложили мне отдохнуть?',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'В гостевых покоях', nextScene: 'guest_chambers', affectionChange: 0, trustChange: 10, vulnerabilityChange: 0 },
      { text: 'В своих покоях', nextScene: 'invite_chambers', affectionChange: 20, trustChange: -10, vulnerabilityChange: 30 },
      { text: 'В саду за чашкой чая', nextScene: 'tea_garden', affectionChange: 10, trustChange: 15, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'tea_garden',
    background: 'linear-gradient(to bottom, #1A2332 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Я лично завариваю чай. Горячий шоколад с пряностями - старый рецепт королевства.',
    speaker: 'Дарк Какао',
    location: '🍵 Чайная беседка',
    choices: [
      { text: 'Протянуть ему чашку', nextScene: 'tea_offer', affectionChange: 15, trustChange: 20, vulnerabilityChange: 15 },
      { text: 'Сесть рядом', nextScene: 'tea_sit', affectionChange: 20, trustChange: 15, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'tea_offer',
    background: 'linear-gradient(to bottom, #1A2332 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*берёт чашку, пальцы касаются ваших* Вы сами приготовили... для меня? *делает глоток* Это... невероятно.',
    speaker: 'Аффогато',
    location: '🍵 Чайная беседка',
    choices: [
      { text: 'Наблюдать за его реакцией', nextScene: 'tea_watch', affectionChange: 10, trustChange: 25, vulnerabilityChange: 10 },
      { text: 'Спросить нравится ли', nextScene: 'tea_ask', affectionChange: 15, trustChange: 20, vulnerabilityChange: 20 }
    ]
  },
  {
    id: 'tea_watch',
    background: 'linear-gradient(to bottom, #1A2332 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*замечает ваш взгляд* Вы изучаете меня? Или... просто смотрите? *его маска начинает таять* С вами я не знаю как себя вести.',
    speaker: 'Аффогато',
    location: '🍵 Чайная беседка',
    choices: [
      { text: 'Просто будь собой', nextScene: 'tea_be_yourself', affectionChange: 35, trustChange: 45, vulnerabilityChange: 30 },
      { text: 'Признаться что любуешься', nextScene: 'tea_admire', affectionChange: 40, trustChange: 30, vulnerabilityChange: 45 }
    ]
  },
  {
    id: 'tea_be_yourself',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Собой? *смеётся тихо* Я не уверен, кто я без масок. Но... *смотрит в вашу чашку* С вами я хочу попробовать узнать.',
    speaker: 'Аффогато',
    location: '🍵 Чайная беседка',
    choices: [
      { text: 'Узнаем вместе', nextScene: 'ending_tea_discovery', affectionChange: 60, trustChange: 70, vulnerabilityChange: 35 }
    ]
  },
  {
    id: 'care',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О, как мило... король беспокоится о своём советнике. *его глаза блестят с интересом* Простите мой цинизм, Ваше Величество, но я знаю цену таким вопросам. Или... может быть, на этот раз всё иначе?',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Настоять, что беспокойство искреннее', nextScene: 'prove_sincerity', affectionChange: 5, trustChange: 10, vulnerabilityChange: 15 },
      { text: 'Признать его правоту и перейти к делам', nextScene: 'admit_game', affectionChange: -10, trustChange: 20, vulnerabilityChange: -10 },
      { text: 'Смутиться и отвести взгляд', nextScene: 'embarrassed', affectionChange: 10, trustChange: -5, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'embarrassed',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О? Неужели я смутил могущественного короля? *шаг ближе* Как... интересно. И как полезно знать.',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Восстановить самообладание', nextScene: 'recover_composure', affectionChange: -5, trustChange: 10, vulnerabilityChange: -10 },
      { text: 'Признаться, что он действительно важен', nextScene: 'early_confession', affectionChange: 20, trustChange: -15, vulnerabilityChange: 40 }
    ]
  },
  {
    id: 'early_confession',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Важен... *его улыбка становится теплее, но в глазах появляется расчётливый блеск* Ваше Величество, вы не представляете, как приятно слышать это. Позвольте мне... позаботиться о вас в ответ.',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Принять его заботу', nextScene: 'accept_manipulation', affectionChange: 15, trustChange: -20, vulnerabilityChange: 30 },
      { text: 'Почувствовать что-то неладное', nextScene: 'sense_danger', affectionChange: 5, trustChange: 15, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'sense_danger',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Что-то не так. Его улыбка слишком идеальна. Слова слишком правильные. Это... это не настоящая забота. Это игра.',
    speaker: 'Дарк Какао',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Противостоять ему напрямую', nextScene: 'confront_manipulation', affectionChange: -5, trustChange: 30, vulnerabilityChange: -20 },
      { text: 'Играть в его игру осторожно', nextScene: 'play_careful', affectionChange: 0, trustChange: 25, vulnerabilityChange: 0 }
    ]
  },
  {
    id: 'confront_manipulation',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: '*его маска моментально меняется - от тёплой к холодной* Ах. Вы поняли. Как... неудобно. Что ж, Ваше Величество, вы оказались проницательнее, чем я думал.',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Спросить, почему он так поступает', nextScene: 'why_manipulate', affectionChange: 0, trustChange: 20, vulnerabilityChange: 5 },
      { text: 'Предложить начать честно', nextScene: 'offer_honesty', affectionChange: 10, trustChange: 35, vulnerabilityChange: 10 }
    ]
  },
  {
    id: 'why_manipulate',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Почему? *смеётся горько* Потому что это всё, что у меня есть. Манипуляция - это контроль. А контроль - это безопасность. Если я не контролирую - меня контролируют другие.',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Сказать, что понимаете', nextScene: 'understand_him', affectionChange: 15, trustChange: 30, vulnerabilityChange: 10 },
      { text: 'Предложить другой путь', nextScene: 'offer_different_way', affectionChange: 20, trustChange: 35, vulnerabilityChange: 15 }
    ]
  },
  {
    id: 'understand_him',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Вы... понимаете? *его маска даёт трещину* Даже зная, что я пытался манипулировать вами?',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Да, потому что я вижу причину', nextScene: 'see_reason', affectionChange: 40, trustChange: 50, vulnerabilityChange: 25 }
    ]
  },
  {
    id: 'see_reason',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '👑',
    dialogue: '"Я вижу человека, который так боится быть отвергнутым, что отвергает первым. Который так боится потерять контроль, что не позволяет себе чувствовать."',
    speaker: 'Дарк Какао',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Протянуть руку', nextScene: 'extend_hand_final', affectionChange: 50, trustChange: 60, vulnerabilityChange: 30 }
    ]
  },
  {
    id: 'extend_hand_final',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '🎭',
    dialogue: '*смотрит на вашу руку, слёзы на глазах* Вы... вы всё ещё хотите? После всего? *его рука дрожит, но тянется к вашей*',
    speaker: 'Аффогато',
    location: '🏛️ Тронный зал',
    choices: [
      { text: 'Взять его руку', nextScene: 'ending_redemption_love', affectionChange: 70, trustChange: 80, vulnerabilityChange: 35 }
    ]
  },
  {
    id: 'ending_redemption_love',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '💜',
    dialogue: 'Его рука в вашей. Тёплая. Дрожащая. Настоящая. "Я не обещаю, что будет легко," - говорит он. "Я столько лет был... другим." "Тогда будем учиться вместе," - отвечаете вы. За окном впервые за недели показывается солнце.',
    speaker: 'Финал: Любовь через Искупление',
    location: '🏛️ Тронный зал',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_shared_haven',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '🗼💙',
    dialogue: 'Башня становится вашим общим убежищем. Местом, где нет масок, нет игр, нет страха. Просто вы двое, смотрящие на королевство вместе. "Спасибо," - шепчет он каждый раз. "За то, что позволил мне быть собой."',
    speaker: 'Финал: Общее Убежище',
    location: '🗼 Секретная башня',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_tower_embrace',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '💜',
    dialogue: 'В объятиях, высоко над королевством, вы оба находите то, что искали. Не силу. Не контроль. Просто тепло другого человека. "Я люблю тебя," - говорит он впервые без расчёта. Просто потому что это правда.',
    speaker: 'Финал: Объятия на Вершине',
    location: '🗼 Секретная башня',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_library_love',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '📚💙',
    dialogue: 'Библиотека становится вашим особым местом. Где между книг о любви вы находите свою собственную историю. Не написанную кем-то, а созданную вами. Аффогато больше не ищет ответы в страницах - он нашёл их в вас.',
    speaker: 'Финал: Написанная Любовь',
    location: '📚 Королевская библиотека',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_garden_bloom',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '🌹💜',
    dialogue: 'Цветок, который вы дали ему, Аффогато хранит как сокровище. Первый подарок, данный без цели манипуляции. "Вы показали мне, что холодное сердце может расцвести," - говорит он. И в зимнем саду, среди метели, между вами распускается настоящая любовь.',
    speaker: 'Финал: Цветение Среди Зимы',
    location: '🌹 Зимний сад',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_blizzard_moment',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '❄️💙',
    dialogue: 'В холоде метели, держа его за руку, вы понимаете - любовь не всегда должна быть тёплой и мягкой. Иногда она суровая, как зима. Но настоящая. Аффогато прижимается ближе, и вы вдвоём противостоите буре. Вместе.',
    speaker: 'Финал: Двое в Метели',
    location: '❄️ Стены крепости',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_tea_discovery',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '🍵💚',
    dialogue: 'За чашками горячего шоколада, день за днём, вы открываете друг друга. Маленькие моменты. Тихие разговоры. Аффогато медленно снимает маски, одну за другой. "С тобой я наконец могу быть просто... Аффогато," - улыбается он. И это настоящая улыбка.',
    speaker: 'Финал: Открытие За Чаем',
    location: '🍵 Чайная беседка',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_intimate_cage',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #000000 100%)',
    character: '💔⛓️',
    dialogue: 'В ваших покоях, в самом личном пространстве, вы отдали ему контроль. Теперь каждую ночь он приходит. Заботливый. Нежный. Манипулирующий. "Я люблю тебя," - шепчет он, и это правда. Но его любовь - это клетка. Красивая, интимная клетка.',
    speaker: 'Финал: Интимная Клетка',
    location: '🚪 Покои короля',
    isEnding: true,
    endingType: 'trapped'
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
              Аффогато - мастер манипуляций. Он не верит в любовь.<br/>
              Признаетесь слишком рано - станете марионеткой.<br/>
              Но распознайте его игру, противостойте ей... и, возможно, найдёте настоящую любовь.<br/>
              <span className="text-primary">Множество локаций. Множество путей. Множество концовок.</span>
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
          <div className="flex flex-col gap-1">
            <div className="text-sm font-montserrat text-muted-foreground">
              Глава {gameData.findIndex(s => s.id === currentSceneId) + 1}
            </div>
            {currentScene.location && (
              <div className="text-xs font-cormorant text-primary/80">
                {currentScene.location}
              </div>
            )}
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
                    {currentScene.endingType === 'resistance' && '🛡️ Вы устояли'}
                  </div>
                  <div className="text-sm font-cormorant text-muted-foreground mb-2">
                    Привязанность: {affection}% | Доверие: {trust}% | Уязвимость: {vulnerability}%
                  </div>
                  {currentScene.location && (
                    <div className="text-xs font-cormorant text-primary/60">
                      Завершено в локации: {currentScene.location}
                    </div>
                  )}
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
