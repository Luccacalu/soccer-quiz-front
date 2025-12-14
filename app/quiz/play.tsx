import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';

interface Answer {
    id: number;
    text: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    text: string;
    answers: Answer[];
}

export default function QuizGame() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [blockInteraction, setBlockInteraction] = useState(false);

  useEffect(() => {
    async function fetchGame() {
        try {
            if (!teamId) return;

            const gameRes = await api.get(`/game/play/team/${teamId}`);

            if (gameRes.data && gameRes.data.length > 0) {
                setQuestions(gameRes.data);

                const quizRes = await api.get(`/quiz/team/${teamId}`);
                const quizId = quizRes.data[0]?.id || quizRes.data?.id;

                if (quizId) {
                    const sessionRes = await api.post('/session', {
                        quiz_id: quizId
                    });

                    setSessionId(sessionRes.data.id);
                    setStartTime(Date.now());
                    console.log("Sessão iniciada ID:", sessionRes.data.id);
                }

                setIsTimerRunning(true);
            } else {
                Alert.alert("Ops", "Este time ainda não tem perguntas cadastradas.", [
                    { text: "Voltar", onPress: () => router.back() }
                ]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Falha ao carregar o jogo. Verifique sua conexão.");
            router.back();
        } finally {
            setLoading(false);
        }
    }
    fetchGame();
  }, [teamId]);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (timeLeft === 0) {
        handleAnswer(null);
        return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const handleAnswer = (selectedAnswer: Answer | null) => {
    if (blockInteraction) return;
    setBlockInteraction(true);
    setIsTimerRunning(false);

    let isCorrect = false;

    if (selectedAnswer?.is_correct) {
        setScore(prev => prev + 1);
        isCorrect = true;
    }

    setTimeout(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(15);
            setIsTimerRunning(true);
            setBlockInteraction(false);
        } else {
            const finalScore = isCorrect ? score + 1 : score;
            finishQuiz(finalScore);
        }
    }, 500);
  };

  const finishQuiz = (finalScore: number) => {
    router.replace({
        pathname: '/quiz/result',
        params: {
            score: finalScore,
            total: questions.length,
            sessionId: sessionId,
            startTime: startTime
        }
    });
  };

  if (loading) {
      return (
          <ScreenWrapper>
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="white" />
                <Text className="text-white mt-4 font-bold">Preparando o campo...</Text>
              </View>
          </ScreenWrapper>
      );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <ScreenWrapper>
        <View className="flex-row items-center mb-6 mt-2">
             <TouchableOpacity onPress={() => router.replace('/(app)/home')} className="mr-4">
                <Feather name="x" size={30} color="white" />
             </TouchableOpacity>
             <Text className="text-white text-xl font-bold flex-1 text-center mr-10">
                Questão {currentIndex + 1}/{questions.length}
             </Text>
        </View>

        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-300 text-xs font-bold uppercase tracking-widest">Tempo Restante</Text>
                <View className={`flex-row items-center px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-500/20' : 'bg-white/20'}`}>
                    <Feather name="clock" size={14} color="white" style={{ marginRight: 6 }} />
                    <Text className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                        {timeLeft}s
                    </Text>
                </View>
            </View>
            <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                <View
                    className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-yellow-400'}`}
                    style={{ width: `${(timeLeft/15)*100}%` }}
                />
            </View>
        </View>

        <View className="min-h-[120px] justify-center mb-8 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-lg">
            <Text className="text-white text-2xl font-bold text-center leading-8 shadow-sm">
                {currentQuestion?.text}
            </Text>
        </View>

        <View className="gap-y-3 pb-10">
            {currentQuestion?.answers.map((answer) => (
                <TouchableOpacity
                    key={answer.id}
                    onPress={() => handleAnswer(answer)}
                    disabled={blockInteraction}
                    activeOpacity={0.7}
                    className="bg-white py-4 px-6 rounded-2xl shadow-lg border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 active:bg-gray-100"
                >
                    <Text className="text-gray-900 text-lg font-bold text-center">
                        {answer.text}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </ScreenWrapper>
  );
}