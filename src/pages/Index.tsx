import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Choice {
  text: string;
  nextScene: string;
  affectionChange: number;
  trustChange?: number;
}

interface Scene {
  id: string;
  background: string;
  character: string;
  dialogue: string;
  speaker: string;
  choices?: Choice[];
  isEnding?: boolean;
  endingType?: 'perfect' | 'good' | 'neutral' | 'bad' | 'manipulation' | 'power' | 'truth';
}

const gameData: Scene[] = [
  {
    id: 'start',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Зимний ветер воет за окнами тронного зала. Снег не прекращается уже много дней. Я смотрю на заснеженные горы через высокие окна, когда слышу знакомые шаги.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Обернуться и поприветствовать Аффогато', nextScene: 'greet', affectionChange: 0, trustChange: 5 },
      { text: 'Продолжить смотреть в окно', nextScene: 'ignore', affectionChange: 0, trustChange: -5 },
      { text: 'Заметить изменения в его походке', nextScene: 'observe_start', affectionChange: 0, trustChange: 10 }
    ]
  },
  {
    id: 'greet',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О, Ваше Величество... Как внимательны вы сегодня. Я принёс вам отчёты о состоянии казны. Снежные бури затруднили торговлю с соседними королевствами.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить о его самочувствии', nextScene: 'care', affectionChange: 5, trustChange: -5 },
      { text: 'Сразу перейти к делам', nextScene: 'business', affectionChange: -5, trustChange: 10 },
      { text: 'Заметить, что он что-то скрывает', nextScene: 'suspicious', affectionChange: 0, trustChange: 15 }
    ]
  },
  {
    id: 'ignore',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Ваше Величество погружены в свои мысли? Позвольте угадать... вы думаете о том, кому можно доверять в этом холодном дворце?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признать, что доверие - редкость', nextScene: 'trust_talk', affectionChange: 0, trustChange: 10 },
      { text: 'Спросить, почему он задаёт такие вопросы', nextScene: 'question_motives', affectionChange: 0, trustChange: 15 },
      { text: 'Сказать, что всё в порядке', nextScene: 'dismiss', affectionChange: -10, trustChange: -10 }
    ]
  },
  {
    id: 'observe_start',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Я замечаю... он идёт медленнее обычного. Устал? Или нарочно даёт мне время подготовиться к разговору? С Аффогато никогда не знаешь наверняка.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Спросить напрямую о его состоянии', nextScene: 'direct_care', affectionChange: 0, trustChange: 20 },
      { text: 'Продолжить наблюдение молча', nextScene: 'silent_observe', affectionChange: 0, trustChange: 15 }
    ]
  },
  {
    id: 'care',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О, как мило... король беспокоится о своём советнике. Простите мой цинизм, Ваше Величество, но я знаю цену таким вопросам. Обычно за ними следует просьба.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Настоять, что беспокойство искреннее', nextScene: 'prove_sincerity', affectionChange: 5, trustChange: 10 },
      { text: 'Признать его правоту', nextScene: 'admit_game', affectionChange: -10, trustChange: 20 },
      { text: 'Обидеться на его слова', nextScene: 'offended', affectionChange: -15, trustChange: -15 }
    ]
  },
  {
    id: 'business',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Прямо к делу. Практично. Я ценю это, Ваше Величество. В отличие от пустых любезностей, дела дают реальную власть. А власть... власть дороже любви.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить, почему он так думает о любви', nextScene: 'philosophy_love', affectionChange: 0, trustChange: 15 },
      { text: 'Согласиться с его мировоззрением', nextScene: 'agree_power', affectionChange: -20, trustChange: 25 },
      { text: 'Поспорить, что любовь тоже сила', nextScene: 'debate_love', affectionChange: 10, trustChange: 5 }
    ]
  },
  {
    id: 'suspicious',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Ах... проницательность. Опасное качество, Ваше Величество. Да, я скрываю многое. Но разве не все мы носим маски? Даже вы за своей королевской холодностью.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить снять маски вместе', nextScene: 'unmask_together', affectionChange: 10, trustChange: 25 },
      { text: 'Потребовать честности', nextScene: 'demand_truth', affectionChange: -10, trustChange: 15 },
      { text: 'Признать, что маски нужны', nextScene: 'accept_masks', affectionChange: -5, trustChange: 20 }
    ]
  },
  {
    id: 'trust_talk',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Доверие... иллюзия для слабых. Но знаете что? Иногда я думаю, что хочу верить в эту иллюзию. Особенно глядя на вас.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить, что он имеет в виду', nextScene: 'what_mean', affectionChange: 5, trustChange: 15 },
      { text: 'Предложить доверять друг другу', nextScene: 'mutual_trust', affectionChange: 10, trustChange: 20 },
      { text: 'Сказать, что доверие нужно заслужить', nextScene: 'earn_trust', affectionChange: 0, trustChange: 25 }
    ]
  },
  {
    id: 'question_motives',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Почему я задаю такие вопросы? Потому что мне интересно, Ваше Величество. Вы - загадка. Король-воин, который правит железной рукой, но иногда... иногда я вижу в ваших глазах одиночество.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признаться в одиночестве', nextScene: 'confess_lonely', affectionChange: 15, trustChange: 20 },
      { text: 'Отрицать это', nextScene: 'deny_lonely', affectionChange: -15, trustChange: -10 },
      { text: 'Спросить, одинок ли он сам', nextScene: 'ask_his_lonely', affectionChange: 10, trustChange: 25 }
    ]
  },
  {
    id: 'dismiss',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Всё в порядке... Конечно. Как скажете, Ваше Величество. Я вижу, что стена между нами остаётся непробиваемой. Возможно, так и должно быть.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Попытаться исправить ситуацию', nextScene: 'fix_situation', affectionChange: 5, trustChange: 10 },
      { text: 'Оставить как есть', nextScene: 'ending_frozen_wall', affectionChange: -30, trustChange: -30 }
    ]
  },
  {
    id: 'direct_care',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы... заметили? Как неожиданно. Я немного устал, да. Игра в интриги отнимает много сил. Но почему вас это волнует?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что он важен для королевства', nextScene: 'important_kingdom', affectionChange: -5, trustChange: 5 },
      { text: 'Признать, что он важен лично для вас', nextScene: 'important_personally', affectionChange: 20, trustChange: 25 },
      { text: 'Уклониться от ответа', nextScene: 'evade', affectionChange: -10, trustChange: -15 }
    ]
  },
  {
    id: 'silent_observe',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы молчите и смотрите на меня. Пытаетесь понять мои мотивы? Забавно... обычно это я изучаю других.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что хотите понять его', nextScene: 'want_understand', affectionChange: 15, trustChange: 30 },
      { text: 'Продолжить молчать', nextScene: 'continue_silence', affectionChange: 5, trustChange: 20 }
    ]
  },
  {
    id: 'prove_sincerity',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Искреннее? Докажите. Докажите, что ваши слова не пустой звук. Все говорят о заботе, но никто не готов рискнуть ради неё.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить ему отдых от дел', nextScene: 'offer_rest', affectionChange: 15, trustChange: 20 },
      { text: 'Спросить, что он считает доказательством', nextScene: 'ask_proof', affectionChange: 10, trustChange: 25 },
      { text: 'Признать, что не знаете как доказать', nextScene: 'admit_dont_know', affectionChange: 20, trustChange: 30 }
    ]
  },
  {
    id: 'philosophy_love',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Почему? Потому что любовь - это слабость, Ваше Величество. Она делает людей уязвимыми. Она позволяет другим манипулировать вами. Я видел, как любовь разрушала королевства.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить о его личном опыте', nextScene: 'his_experience', affectionChange: 10, trustChange: 30 },
      { text: 'Сказать, что любовь может быть силой', nextScene: 'love_strength', affectionChange: 15, trustChange: 15 },
      { text: 'Предложить показать ему другую сторону любви', nextScene: 'show_love', affectionChange: 25, trustChange: 20 }
    ]
  },
  {
    id: 'unmask_together',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Снять маски вместе... Опасное предложение. Вы уверены, что готовы увидеть настоящего Аффогато? И показать себя настоящего?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Настоять на своём предложении', nextScene: 'insist_unmask', affectionChange: 30, trustChange: 40 },
      { text: 'Отступить от идеи', nextScene: 'retreat_unmask', affectionChange: -20, trustChange: -15 }
    ]
  },
  {
    id: 'mutual_trust',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Доверять друг другу... Вы понимаете, что просите? Доверие - это отказ от контроля. Это значит позволить кому-то ранить вас.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что готовы рискнуть', nextScene: 'ready_risk', affectionChange: 35, trustChange: 45 },
      { text: 'Признать, что это страшно', nextScene: 'admit_scary', affectionChange: 25, trustChange: 40 },
      { text: 'Передумать', nextScene: 'change_mind', affectionChange: -25, trustChange: -20 }
    ]
  },
  {
    id: 'confess_lonely',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы... признаётесь в одиночестве? Мне? Знаете, Ваше Величество... я тоже одинок. Всегда был. Манипуляции, интриги - это всё, что у меня есть.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить изменить это вместе', nextScene: 'change_together', affectionChange: 40, trustChange: 50 },
      { text: 'Обнять его', nextScene: 'hug_him', affectionChange: 45, trustChange: 45 },
      { text: 'Просто сказать "я понимаю"', nextScene: 'understand', affectionChange: 30, trustChange: 40 }
    ]
  },
  {
    id: 'ask_his_lonely',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Одинок ли я? *долгая пауза* Да. Более одинок, чем вы можете себе представить. Когда всё, что у тебя есть - это маски, ты забываешь, кто ты на самом деле.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить помочь найти себя', nextScene: 'help_find', affectionChange: 40, trustChange: 50 },
      { text: 'Сказать, что хотите узнать настоящего его', nextScene: 'know_real', affectionChange: 35, trustChange: 45 },
      { text: 'Признаться, что боитесь то же самое', nextScene: 'fear_same', affectionChange: 45, trustChange: 55 }
    ]
  },
  {
    id: 'important_personally',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Важен... лично для вас? *его маска на мгновение даёт трещину* Почему? Я манипулятор. Интриган. Вы должны видеть это.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что видите больше, чем это', nextScene: 'see_more', affectionChange: 40, trustChange: 50 },
      { text: 'Признать, что не можете это объяснить', nextScene: 'cant_explain', affectionChange: 35, trustChange: 45 },
      { text: 'Сказать, что всем нужен второй шанс', nextScene: 'second_chance', affectionChange: 30, trustChange: 40 }
    ]
  },
  {
    id: 'want_understand',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Понять меня... Никто никогда не хотел меня понять. Только использовать. Вы... вы действительно серьёзно?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Абсолютно серьёзно', nextScene: 'absolutely_serious', affectionChange: 50, trustChange: 60 },
      { text: 'Протянуть ему руку', nextScene: 'extend_hand', affectionChange: 45, trustChange: 55 }
    ]
  },
  {
    id: 'his_experience',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Мой опыт? *смеётся горько* Меня любили за красоту, за ум, за полезность. Но никогда - просто за меня. Когда понимаешь это... любовь становится просто инструментом.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что это была не настоящая любовь', nextScene: 'not_real_love', affectionChange: 40, trustChange: 50 },
      { text: 'Пообещать показать настоящую любовь', nextScene: 'promise_real', affectionChange: 50, trustChange: 55 },
      { text: 'Обнять его без слов', nextScene: 'wordless_embrace', affectionChange: 55, trustChange: 60 }
    ]
  },
  {
    id: 'show_love',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Показать мне... другую сторону любви? Вы понимаете, что значат ваши слова? Это звучит как... как обещание.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Подтвердить, что это обещание', nextScene: 'confirm_promise', affectionChange: 55, trustChange: 65 },
      { text: 'Просто шагнуть ближе', nextScene: 'step_closer', affectionChange: 50, trustChange: 60 }
    ]
  },
  {
    id: 'insist_unmask',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы настаиваете... Хорошо. Я боюсь, Ваше Величество. Боюсь того, что если сниму маску - меня отвергнут. Боюсь, что настоящий я... никому не нужен.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что он нужен вам', nextScene: 'need_him', affectionChange: 60, trustChange: 70 },
      { text: 'Снять сначала свою маску', nextScene: 'remove_own', affectionChange: 55, trustChange: 65 }
    ]
  },
  {
    id: 'ready_risk',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Готовы рискнуть... ради меня? *его голос дрожит* Тогда... тогда я тоже. Я устал быть один. Устал играть роль.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Обнять его', nextScene: 'ending_true_love', affectionChange: 70, trustChange: 80 },
      { text: 'Взять его за руку', nextScene: 'ending_new_beginning', affectionChange: 65, trustChange: 75 }
    ]
  },
  {
    id: 'change_together',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Изменить... вместе? Вы предлагаете мне... будущее? Не пустые обещания, а настоящий шанс?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Настоящий шанс на счастье', nextScene: 'ending_true_love', affectionChange: 75, trustChange: 85 },
      { text: 'Шанс быть собой', nextScene: 'ending_acceptance', affectionChange: 70, trustChange: 80 }
    ]
  },
  {
    id: 'help_find',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Помочь найти себя... *слеза стекает по его щеке* Никто... никто никогда не предлагал мне этого. Всем нужна была только моя маска.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Стереть его слезу', nextScene: 'ending_true_love', affectionChange: 80, trustChange: 90 },
      { text: 'Сказать "начнём прямо сейчас"', nextScene: 'ending_new_path', affectionChange: 75, trustChange: 85 }
    ]
  },
  {
    id: 'fear_same',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Вы... боитесь того же? Король, который правит целым королевством, боится потеряться? Тогда... тогда давайте искать себя вместе.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Согласиться и обнять его', nextScene: 'ending_soul_mates', affectionChange: 85, trustChange: 95 },
      { text: 'Поцеловать его руку', nextScene: 'ending_true_love', affectionChange: 80, trustChange: 90 }
    ]
  },
  {
    id: 'see_more',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Видите больше... Что же вы видите, Ваше Величество? Кого вы видите, когда смотрите на меня?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Человека, достойного любви', nextScene: 'ending_true_love', affectionChange: 85, trustChange: 95 },
      { text: 'Того, кто нужен мне', nextScene: 'ending_confession', affectionChange: 90, trustChange: 100 }
    ]
  },
  {
    id: 'absolutely_serious',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Тогда... позвольте показать вам. Позвольте показать настоящего Аффогато. Того, кто боится, мечтает... и любит.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать "я готов"', nextScene: 'ending_soul_mates', affectionChange: 90, trustChange: 100 },
      { text: 'Притянуть его к себе', nextScene: 'ending_true_love', affectionChange: 95, trustChange: 100 }
    ]
  },
  {
    id: 'promise_real',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Обещаете... показать настоящую любовь? Я... я хочу верить. Хочу так сильно верить в это.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Поцеловать его', nextScene: 'ending_true_love', affectionChange: 100, trustChange: 100 },
      { text: 'Прижать к сердцу', nextScene: 'ending_soul_mates', affectionChange: 95, trustChange: 100 }
    ]
  },
  {
    id: 'confirm_promise',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Обещание короля... это священно. И вы обещаете это... мне? Манипулятору, интригану... просто Аффогато?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Именно тебе', nextScene: 'ending_true_love', affectionChange: 100, trustChange: 100 },
      { text: 'Каждой части тебя', nextScene: 'ending_soul_mates', affectionChange: 100, trustChange: 100 }
    ]
  },
  {
    id: 'need_him',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Я... нужен вам? *его маска падает полностью* Я не знал... я даже мечтать не смел...',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признаться в любви', nextScene: 'ending_true_love', affectionChange: 100, trustChange: 100 }
    ]
  },
  {
    id: 'agree_power',
    background: 'linear-gradient(to bottom, #1A1A2E 0%, #0D0D1A 100%)',
    character: '🎭',
    dialogue: 'Вы согласны, что власть превыше всего? Тогда мы с вами... просто партнёры в этой игре. Ничего больше. Как жаль...',
    speaker: 'Аффогато',
    choices: [
      { text: 'Принять это', nextScene: 'ending_power_alliance', affectionChange: -50, trustChange: 50 }
    ]
  },
  {
    id: 'admit_game',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы признаёте, что это игра? Интересно. Честность... редкое качество. Может быть, вы не так просты, как кажетесь.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить играть вместе', nextScene: 'partners_in_game', affectionChange: 10, trustChange: 30 },
      { text: 'Сказать, что устали от игр', nextScene: 'tired_games', affectionChange: 20, trustChange: 35 }
    ]
  },
  {
    id: 'tired_games',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Устали от игр... Я тоже, знаете ли. Так устал. Но не знаю другого способа существовать.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить научиться вместе', nextScene: 'learn_together', affectionChange: 40, trustChange: 50 },
      { text: 'Просто быть рядом', nextScene: 'just_be_near', affectionChange: 35, trustChange: 45 }
    ]
  },
  {
    id: 'learn_together',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🎭',
    dialogue: 'Научиться... жить без игр? С вами? Это звучит как... как начало чего-то нового.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Начать прямо сейчас', nextScene: 'ending_new_path', affectionChange: 70, trustChange: 80 }
    ]
  },
  {
    id: 'ending_true_love',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '💜',
    dialogue: 'В тронном зале наступает тишина. Впервые за много лет Аффогато плачет - не от боли, а от счастья. "Я думал, что любовь - это слабость," - шепчет он. "Но с вами... с вами это сила, которая даёт мне смелость быть собой." За окном рассвет окрашивает снег в золотые тона. Зима отступает.',
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
    id: 'ending_new_beginning',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '💙',
    dialogue: 'Это только начало. Ваши руки соединены, и впереди долгий путь. Аффогато ещё учится доверять, а вы учитесь открываться. Но вы идёте этим путём вместе. "Спасибо," - шепчет он, - "за то, что не сдались на мне."',
    speaker: 'Финал: Новое Начало',
    isEnding: true,
    endingType: 'good'
  },
  {
    id: 'ending_acceptance',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '💚',
    dialogue: 'Аффогато улыбается - настоящей улыбкой, без намёка на манипуляцию. "Вы принимаете меня таким, какой я есть," - говорит он удивлённо. "Со всеми моими недостатками и страхами." Это принятие - первый шаг к чему-то большему.',
    speaker: 'Финал: Принятие',
    isEnding: true,
    endingType: 'good'
  },
  {
    id: 'ending_new_path',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '🌟',
    dialogue: 'Вы начинаете новый путь вместе. Путь, где не нужны игры и манипуляции. Аффогато осторожно берёт вашу руку. "Я не обещаю, что будет легко," - говорит он. "Но я обещаю пытаться. Ради нас."',
    speaker: 'Финал: Новый Путь',
    isEnding: true,
    endingType: 'good'
  },
  {
    id: 'ending_confession',
    background: 'linear-gradient(to bottom, #3D2B47 0%, #4A3456 100%)',
    character: '❤️',
    dialogue: 'Ваши глаза встречаются, и все слова становятся ненужными. Аффогато прижимается к вам, и вы чувствуете, как его сердце бьётся в унисон с вашим. "Я люблю тебя," - говорите вы. "Я тоже," - отвечает он, и это правда.',
    speaker: 'Финал: Признание',
    isEnding: true,
    endingType: 'perfect'
  },
  {
    id: 'ending_power_alliance',
    background: 'linear-gradient(to bottom, #1A1A2E 0%, #0D0D1A 100%)',
    character: '👑🎭',
    dialogue: 'Вы становитесь партнёрами во власти. Эффективными, успешными, непобедимыми. Но когда ночью вы остаётесь один в своих покоях, вы думаете о том, что могло быть. Аффогато думает о том же в своих.',
    speaker: 'Финал: Союз Силы',
    isEnding: true,
    endingType: 'power'
  },
  {
    id: 'ending_frozen_wall',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #0D0D1A 100%)',
    character: '🧊',
    dialogue: 'Стена между вами становится ледяной. Аффогато уходит, его шаги эхом отдаются в пустом зале. Вы остаётесь королём, одиноким на своём троне. Может быть, так безопаснее. Но точно не счастливее.',
    speaker: 'Финал: Ледяная Стена',
    isEnding: true,
    endingType: 'bad'
  },
  {
    id: 'ending_manipulation',
    background: 'linear-gradient(to bottom, #0D0D1A 0%, #000000 100%)',
    character: '🕷️',
    dialogue: 'Вы не смогли пробиться сквозь его защиту. Аффогато остаётся манипулятором, а вы - его королём и марионеткой. Он контролирует королевство через вас, и вы даже не замечаете. Иногда вы ловите его взгляд и видите в нём... сожаление?',
    speaker: 'Финал: Паутина Манипуляций',
    isEnding: true,
    endingType: 'manipulation'
  }
];

const Index = () => {
  const [currentSceneId, setCurrentSceneId] = useState('start');
  const [affection, setAffection] = useState(0);
  const [trust, setTrust] = useState(0);
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
    setCurrentSceneId(choice.nextScene);
  };

  const restartGame = () => {
    setCurrentSceneId('start');
    setAffection(0);
    setTrust(0);
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
            <div className="text-6xl mb-4">❄️👑</div>
            <h1 className="text-5xl font-bold font-montserrat text-primary mb-4">
              Королевство Тёмного Какао
            </h1>
            <p className="text-xl text-muted-foreground font-cormorant leading-relaxed">
              Зимние горы. Вечная метель. Холодное сердце короля.<br/>
              И советник, чьи намерения темны, как шоколад.
            </p>
            <div className="pt-4 text-sm text-muted-foreground font-cormorant italic">
              Аффогато не верит в любовь. Он видит в ней только слабость.<br/>
              Сможете ли вы доказать ему обратное?
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
              <span className="text-sm font-montserrat text-muted-foreground">Привязанность:</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-destructive via-pink-500 to-primary transition-all duration-500"
                  style={{ width: `${affection}%` }}
                />
              </div>
              <span className="text-sm font-montserrat text-foreground">{affection}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-montserrat text-muted-foreground">Доверие:</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 via-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${trust}%` }}
                />
              </div>
              <span className="text-sm font-montserrat text-foreground">{trust}%</span>
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
                    {choice.affectionChange !== 0 && (
                      <span className="text-xs ml-2 opacity-50">
                        💕 {choice.affectionChange > 0 ? '+' : ''}{choice.affectionChange}
                      </span>
                    )}
                    {choice.trustChange !== 0 && (
                      <span className="text-xs ml-2 opacity-50">
                        🤝 {choice.trustChange > 0 ? '+' : ''}{choice.trustChange}
                      </span>
                    )}
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
                    {currentScene.endingType === 'manipulation' && '🕷️ Концовка манипуляции'}
                    {currentScene.endingType === 'power' && '⚔️ Концовка силы'}
                  </div>
                  <div className="text-sm font-cormorant text-muted-foreground">
                    Привязанность: {affection}% | Доверие: {trust}%
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
