import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AnxtrackApp() {
  const [step, setStep] = useState("home");
  const [customPlan, setCustomPlan] = useState("");
  const [supportResult, setSupportResult] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [breathingStarted, setBreathingStarted] = useState(false);
  const [selfTalkText, setSelfTalkText] = useState("");
  const [thoughtText, setThoughtText] = useState("");
  const [microTimer, setMicroTimer] = useState(60);
  const [microStarted, setMicroStarted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    let timer;
    if (breathingStarted && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [breathingStarted, countdown]);

  useEffect(() => {
    let timer;
    if (microStarted && microTimer > 0) {
      timer = setTimeout(() => setMicroTimer((prev) => {
        if (prev === 1) {
          setMicroStarted(false);
          setMicroTimer(60);
        }
        return prev - 1;
      }), 1000);
    }
    return () => clearTimeout(timer);
  }, [microStarted, microTimer]);

  const handleBack = () => {
    if (step === "micro_timer") {
      setMicroStarted(false);
      setMicroTimer(60);
    }
    setStep("support");
  };
  const updateSelfTalk = (text) => setSelfTalkText(text);

  if (step === "support") {
    return (
      <div className="p-6 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Хочешь немного поддержки?</h2>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button variant="outline" onClick={() => setStep("breathing")}>Подышать 60 секунд</Button>
          <Button variant="outline" onClick={() => setStep("microplan")}>Сделать микро-план</Button>
          <Button variant="outline" onClick={() => setStep("selftalk")}>Сказать себе поддерживающее сообщение</Button>
        </div>
        <Button variant="link" onClick={() => setStep("home")}>Нет, просто зафиксировать тревогу</Button>
      </div>
    );
  }

  if (step === "breathing") {
    return (
      <div className="p-6 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Подышим 60 секунд</h2>
        <div className="rounded-full w-48 h-48 bg-purple-200 flex items-center justify-center text-3xl">
          {countdown}
        </div>
        <p className="text-sm text-gray-500 text-center">Следуй ритму: 4 секунды вдыхаем носом, 7 секунд задерживаем дыхание, 8 секунд выдыхаем ртом</p>
        {!breathingStarted ? (
          <Button onClick={() => setBreathingStarted(true)}>Начать дыхание</Button>
        ) : (
          <Button onClick={() => {
            setCountdown(60);
            setBreathingStarted(false);
            setActivityLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), text: "Завершено дыхание" }]);
            setStep("result");
          }}>Завершить</Button>
        )}
        <Button variant="link" onClick={handleBack}>Назад</Button>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="p-6 flex flex-col gap-4 items-center">
        <h2 className="text-xl font-bold">Как ты себя сейчас чувствуешь?</h2>
        <div className="flex gap-4">
          <Button onClick={() => {
            setSupportResult("good");
            setStep("home");
          }}>👍 Помогло</Button>
          <Button onClick={() => {
            setSupportResult("bad");
            setStep("home");
          }}>👎 Не очень</Button>
        </div>
        <Button onClick={() => setStep("home")} className="mt-4">На главный экран</Button>
      </div>
    );
  }

  if (step === "microplan") {
    return (
      <div className="p-6 flex flex-col items-center gap-6">
        <h2 className="text-xl font-bold">Сделай микро-план</h2>
        <p className="text-sm text-gray-500">Выбери действие</p>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <Button onClick={() => setStep("micro_thought")}>Написать 1 мысль, которая тревожит</Button>
          <Button onClick={() => setStep("micro_timer")}>Выйти на балкон и подышать</Button>
          <Button onClick={() => setStep("micro_timer")}>Сделать себе чай</Button>
          <Button onClick={() => setStep("micro_timer")}>Протереть стол</Button>
          <Button onClick={() => setStep("micro_timer")}>Включить спокойную музыку</Button>
        </div>
        <Input className="mt-4" placeholder="Свой вариант..." value={customPlan} onChange={(e) => setCustomPlan(e.target.value)} />
        {customPlan.trim() !== "" && <Button className="mt-2" onClick={() => setStep("result")}>Дальше</Button>}
        <Button variant="link" onClick={handleBack}>Назад</Button>
      </div>
    );
  }

  if (step === "micro_thought") {
    return (
      <div className="p-6 flex flex-col gap-6 items-center">
        <h2 className="text-xl font-bold text-center">Напиши эту мысль прямо сейчас</h2>
        <Textarea
          placeholder="Что тебя тревожит?"
          className="w-full max-w-sm"
          value={thoughtText}
          onChange={(e) => setThoughtText(e.target.value)}
        />
        <Button onClick={() => {
          setActivityLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), text: "Записана тревожная мысль" }]);
          setStep("micro_thought_done");
        }}>Готово</Button>
        <Button variant="link" onClick={() => setStep("microplan")}>Назад</Button>
      </div>
    );
  }

  if (step === "micro_thought_done") {
    return (
      <div className="p-6 flex flex-col items-center text-center gap-4">
        <p className="text-lg">Иногда просто дать ей место — уже облегчение.</p>
        <Button onClick={() => setStep("result")}>Дальше</Button>
      </div>
    );
  }

  if (step === "micro_timer") {
    return (
      <div className="p-6 flex flex-col gap-4 items-center text-center">
        <h2 className="text-xl font-bold">Супер. Сделай это прямо сейчас. Мы подождём ✨</h2>
        {!microStarted ? (
          <Button onClick={() => {
            setMicroStarted(true);
            setMicroTimer(60);
          }}>Начать</Button>
        ) : (
          <>
            <div className="text-4xl font-bold text-purple-600">{microTimer}</div>
            <Button onClick={() => {
              setMicroTimer(1);
              setActivityLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), text: "Выполнен микро-план" }]);
              setStep("result");
            }} className="mt-2">Завершить</Button>
          </>
        )}
        {microTimer === 0 && (
          <>
            <p className="text-sm mt-4">Удалось ли тебе это сделать?</p>
            <div className="flex gap-4">
              <Button onClick={() => setStep("result")}>Да</Button>
              <Button onClick={() => setStep("result")}>Нет</Button>
            </div>
          </>
        )}
        <Button variant="link" onClick={() => setStep("microplan")}>Назад</Button>
      </div>
    );
  }

  if (step === "selftalk") {
    return (
      <div className="p-6 flex flex-col gap-4 items-center">
        <h2 className="text-xl font-bold">Скажи себе что-то доброе</h2>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <Button variant="outline" onClick={() => setSelfTalkText("Мне тяжело — и это нормально")}>Мне тяжело — и это нормально</Button>
          <Button variant="outline" onClick={() => setSelfTalkText("Я не обязан всё решать прямо сейчас")}>Я не обязан всё решать прямо сейчас</Button>
          <Button variant="outline" onClick={() => setSelfTalkText("Я чувствую тревогу, но это не вся я")}>Я чувствую тревогу, но это не вся я</Button>
          <Button variant="outline" onClick={() => setSelfTalkText("Я делаю, что могу, и этого достаточно")}>Я делаю, что могу, и этого достаточно</Button>
          <Textarea
            placeholder="Свой текст..."
            className="mt-2"
            value={selfTalkText}
            onChange={(e) => setSelfTalkText(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          setActivityLog((prev) => [...prev, { time: new Date().toLocaleTimeString(), text: "Сохранено поддерживающее сообщение" }]);
          setStep("result");
        }}>Сохранить</Button>
        <Button variant="link" onClick={handleBack}>Назад</Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {activityLog.length > 0 && (
        <div className="text-left w-full max-w-sm text-sm overflow-y-auto max-h-40 pr-2">
          <h3 className="font-semibold mb-2">Сегодня:</h3>
          <ul className="space-y-1">
            {activityLog.map((item, index) => (
              <li key={index}>
                • [{item.time}] {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Добро пожаловать в AnxTrack</h1>
        <p className="text-gray-500 mt-2">Это твой личный трекер тревоги.<br/>Нажми на кнопку, если чувствуешь тревогу.</p>
      </div>

      <Button className="w-full max-w-xs h-12 text-lg" onClick={() => setStep("support")}>Мне тревожно</Button>

      <Button variant="outline" className="mt-10 w-full max-w-xs">Моя тревога</Button>
    </div>
  );
}
