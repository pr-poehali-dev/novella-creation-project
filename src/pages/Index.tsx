import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Choice {
  text: string;
  nextScene: string;
  affectionChange: number;
}

interface Scene {
  id: string;
  background: string;
  character: string;
  dialogue: string;
  speaker: string;
  choices?: Choice[];
  isEnding?: boolean;
}

const gameData: Scene[] = [
  {
    id: 'start',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Зимний ветер воет за окнами тронного зала. Снег не прекращается уже много дней. Я смотрю на заснеженные горы через высокие окна, когда слышу знакомые шаги.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Обернуться и поприветствовать Аффогато', nextScene: 'greet', affectionChange: 5 },
      { text: 'Продолжить смотреть в окно', nextScene: 'ignore', affectionChange: -5 }
    ]
  },
  {
    id: 'greet',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'О, Ваше Величество... Как внимательны вы сегодня. Я принёс вам отчёты о состоянии казны. Снежные бури затруднили торговлю с соседними королевствами.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Спросить о его самочувствии', nextScene: 'care', affectionChange: 10 },
      { text: 'Сразу перейти к делам', nextScene: 'business', affectionChange: 0 }
    ]
  },
  {
    id: 'ignore',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Ваше Величество... погружены в свои мысли? Может быть, вас что-то беспокоит? Я всегда готов выслушать.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Поделиться своими мыслями о королевстве', nextScene: 'share', affectionChange: 5 },
      { text: 'Сказать, что всё в порядке', nextScene: 'dismiss', affectionChange: -10 }
    ]
  },
  {
    id: 'care',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Я... я в порядке, Ваше Величество. Хотя холода действительно становятся всё суровее. Но ваша забота согревает.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Предложить ему тёплый напиток', nextScene: 'warmth', affectionChange: 15 },
      { text: 'Вернуться к обсуждению дел', nextScene: 'business', affectionChange: -5 }
    ]
  },
  {
    id: 'business',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Конечно, Ваше Величество. Дела превыше всего. Мне нравится ваша... решительность.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Заметить странную интонацию в его голосе', nextScene: 'notice', affectionChange: 5 },
      { text: 'Продолжить как обычно', nextScene: 'routine', affectionChange: 0 }
    ]
  },
  {
    id: 'share',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы доверяете мне свои мысли... Это большая честь, Ваше Величество. Знаете, иногда я думаю, что между нами может быть нечто большее, чем просто отношения короля и советника.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Согласиться с ним осторожно', nextScene: 'agree', affectionChange: 20 },
      { text: 'Перевести разговор на другую тему', nextScene: 'deflect', affectionChange: -5 }
    ]
  },
  {
    id: 'dismiss',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Как скажете, Ваше Величество. Хотя... закрытость не всегда идёт на пользу королю. Но кто я такой, чтобы давать советы?',
    speaker: 'Аффогато',
    choices: [
      { text: 'Извиниться перед ним', nextScene: 'apologize', affectionChange: 10 },
      { text: 'Остаться при своём мнении', nextScene: 'stubborn', affectionChange: -15 }
    ]
  },
  {
    id: 'warmth',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы... сами приготовили для меня какао? Ваше Величество, я не ожидал такого... внимания. Это очень приятно.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признаться, что беспокоитесь о нём', nextScene: 'confession_good', affectionChange: 25 },
      { text: 'Сказать, что это просто жест вежливости', nextScene: 'polite', affectionChange: -10 }
    ]
  },
  {
    id: 'notice',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Его голос звучит как-то странно сегодня. Мягче обычного. Или мне это только кажется? Сердце бьётся быстрее, когда я смотрю на него.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Спросить прямо, что происходит', nextScene: 'direct', affectionChange: 10 },
      { text: 'Промолчать и наблюдать', nextScene: 'observe', affectionChange: 5 }
    ]
  },
  {
    id: 'routine',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Всё как обычно, да? Иногда мне кажется, что вы даже не замечаете меня, Ваше Величество. Но ничего... я терпелив.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать, что замечаете', nextScene: 'notice_him', affectionChange: 15 },
      { text: 'Промолчать', nextScene: 'ending_neutral', affectionChange: -20 }
    ]
  },
  {
    id: 'deflect',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Как скажете, Ваше Величество. Я понимаю. Некоторые темы... слишком деликатны.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Попытаться исправить ситуацию', nextScene: 'apologize', affectionChange: 5 },
      { text: 'Оставить всё как есть', nextScene: 'ending_neutral', affectionChange: -10 }
    ]
  },
  {
    id: 'apologize',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы извиняетесь передо мной? Как неожиданно... и приятно. Может быть, вы не так холодны, как кажетесь, Ваше Величество.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признать его правоту', nextScene: 'agree', affectionChange: 15 },
      { text: 'Сменить тему', nextScene: 'ending_neutral', affectionChange: 0 }
    ]
  },
  {
    id: 'stubborn',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Понятно. Я вижу, что вы твёрдо стоите на своём. Что ж... каждый делает свой выбор.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Оставить всё как есть', nextScene: 'ending_bad', affectionChange: -20 }
    ]
  },
  {
    id: 'polite',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Просто вежливость... Да, конечно. Глупо было думать иначе.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Сказать правду', nextScene: 'confession_good', affectionChange: 20 },
      { text: 'Промолчать', nextScene: 'ending_missed', affectionChange: -15 }
    ]
  },
  {
    id: 'direct',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Что происходит? А вы прямолинейны, Ваше Величество. Хорошо... возможно, я испытываю к вам нечто большее, чем просто лояльность советника.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признаться во взаимности', nextScene: 'ending_perfect', affectionChange: 40 },
      { text: 'Отступить', nextScene: 'ending_missed', affectionChange: -25 }
    ]
  },
  {
    id: 'observe',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '👑',
    dialogue: 'Я молча наблюдаю за ним. Его движения, голос, взгляд... Всё это значит больше, чем я готов признать.',
    speaker: 'Дарк Какао',
    choices: [
      { text: 'Сделать шаг навстречу', nextScene: 'agree', affectionChange: 15 },
      { text: 'Остаться наблюдателем', nextScene: 'ending_neutral', affectionChange: -5 }
    ]
  },
  {
    id: 'notice_him',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы... замечаете меня? Это... это меняет всё, Ваше Величество.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Продолжить откровенный разговор', nextScene: 'agree', affectionChange: 20 },
      { text: 'Вернуться к делам', nextScene: 'ending_neutral', affectionChange: -5 }
    ]
  },
  {
    id: 'agree',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Ваше Величество... вы удивляете меня. Возможно, эта зима действительно приносит с собой нечто новое. Что-то... тёплое.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Шагнуть ближе к нему', nextScene: 'ending_good', affectionChange: 30 },
      { text: 'Сохранить дистанцию', nextScene: 'ending_neutral', affectionChange: 0 }
    ]
  },
  {
    id: 'confession_good',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🎭',
    dialogue: 'Вы... беспокоитесь обо мне? Ваше Величество, я всегда думал, что вы видите во мне лишь советника. Но, может быть... может быть, я ошибался.',
    speaker: 'Аффогато',
    choices: [
      { text: 'Признаться в своих чувствах', nextScene: 'ending_perfect', affectionChange: 50 },
      { text: 'Отступить', nextScene: 'ending_missed', affectionChange: -20 }
    ]
  },
  {
    id: 'ending_perfect',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '💜',
    dialogue: 'Аффогато замирает, его глаза широко раскрываются. Впервые я вижу его искренним, без маски манипулятора. "Я... я не знал, что королевское сердце может так биться ради простого советника," - шепчет он. За окном метель утихает, и первые лучи рассвета пробиваются сквозь тучи.',
    speaker: 'Финал: Растаявшее Сердце',
    isEnding: true
  },
  {
    id: 'ending_good',
    background: 'linear-gradient(to bottom, #2D2433 0%, #3D2B47 100%)',
    character: '💙',
    dialogue: 'Между вами возникает что-то новое, нечто большее, чем просто отношения короля и советника. Аффогато смотрит на вас с интересом, который раньше вы не замечали. Зима в королевстве ещё долгая, но, возможно, она станет теплее.',
    speaker: 'Финал: Первые Шаги',
    isEnding: true
  },
  {
    id: 'ending_neutral',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #2D2433 100%)',
    character: '🤝',
    dialogue: 'Вы остаётесь королём, он остаётся советником. Возможно, однажды между вами что-то изменится. Или нет. Зима продолжается, холодная и безмолвная.',
    speaker: 'Финал: Замороженные Чувства',
    isEnding: true
  },
  {
    id: 'ending_missed',
    background: 'linear-gradient(to bottom, #1A1F2C 0%, #1A1A2E 100%)',
    character: '💔',
    dialogue: 'Аффогато кивает, его лицо снова становится маской. "Понимаю, Ваше Величество. Я был глуп, думая, что между нами может быть что-то ещё." Он уходит, и вы остаётесь один в холодном тронном зале.',
    speaker: 'Финал: Упущенный Шанс',
    isEnding: true
  },
  {
    id: 'ending_bad',
    background: 'linear-gradient(to bottom, #1A1A2E 0%, #0D0D1A 100%)',
    character: '🖤',
    dialogue: 'Холод между вами становится непреодолимым. Аффогато больше не смотрит на вас тем особым взглядом. Что-то сломалось безвозвратно. Королевство тонет в вечной зиме, как и ваше сердце.',
    speaker: 'Финал: Вечная Зима',
    isEnding: true
  }
];

const Index = () => {
  const [currentSceneId, setCurrentSceneId] = useState('start');
  const [affection, setAffection] = useState(50);
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
    setCurrentSceneId(choice.nextScene);
  };

  const restartGame = () => {
    setCurrentSceneId('start');
    setAffection(50);
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
        <div className="flex justify-between items-center px-4">
          <div className="text-sm font-montserrat text-muted-foreground">
            Глава {gameData.findIndex(s => s.id === currentSceneId) + 1}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-montserrat text-muted-foreground">Расположение Аффогато:</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-destructive via-accent to-primary transition-all duration-500"
                style={{ width: `${affection}%` }}
              />
            </div>
            <span className="text-sm font-montserrat text-foreground">{affection}%</span>
          </div>
        </div>

        <Card className="bg-card/95 backdrop-blur-md border-primary/20 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="flex items-start gap-6">
              <div className="text-7xl">{currentScene.character}</div>
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
                    {choice.text}
                  </Button>
                ))}
              </div>
            )}

            {!isTyping && currentScene.isEnding && (
              <div className="flex gap-3 pt-4 animate-fade-in">
                <Button
                  onClick={restartGame}
                  className="flex-1 font-montserrat bg-primary hover:bg-primary/90"
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
