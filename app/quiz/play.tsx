import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Answer {
    id: number;
    text: string;
    // is_correct: boolean;
}

interface Question {
    id: number;
    text: string;
    answers: Answer[];
}

export default function QuizGame() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [quizId, setQuizId] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [blockInteraction, setBlockInteraction] = useState(false);

  useEffect(() => {
    async function initGame() {
        if (!user || !teamId) return;

        try {
            const gameRes = await api.get(`/game/play/team/${teamId}`);
            if (!gameRes.data || gameRes.data.length === 0) {
                Alert.alert("Ops", "Sem perguntas para este time.");
                return router.back();
            }
            setQuestions(gameRes.data);

            const quizRes = await api.get(`/quiz/team/${teamId}`);
            const qId = quizRes.data[0]?.id || quizRes.data?.id;
            setQuizId(qId);

            if (qId) {
                const startRes = await api.post(`/start_quiz/${user.id}/${qId}`);

                setSessionId(startRes.data.session_id);
                console.log("Sessão iniciada:", startRes.data.session_id);

                setIsTimerRunning(true);
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Falha ao iniciar o quiz.");
            router.back();
        } finally {
            setLoading(false);
        }
    }
    initGame();
  }, [teamId, user]);

  useEffect(() => {
    if (!isTimerRunning) return;
    if (timeLeft === 0) {
        handleAnswer(null);
        return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const handleAnswer = async (selectedAnswer: Answer | null) => {
    if (blockInteraction) return;
    setBlockInteraction(true);
    setIsTimerRunning(false);

    try {
        if (selectedAnswer && sessionId) {
            await api.post(`/submit_answer/${questions[currentIndex].id}`, null, {
                params: {
                    session_id: sessionId,
                    answer: selectedAnswer.id
                }
            });
            console.log("Resposta enviada:", selectedAnswer.id);
        }
    } catch (error) {
        console.log("Erro ao enviar resposta (pode ser timeout ou erro de rede)", error);
    }

    setTimeout(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(15);
            setIsTimerRunning(true);
            setBlockInteraction(false);
        } else {
            finishQuiz();
        }
    }, 500);
  };

  const finishQuiz = async () => {
    if (!sessionId) return;

    try {
        setLoading(true);

        const response = await api.post(`/finish_quiz/${sessionId}`);
        const finalScore = response.data;

        router.replace({
            pathname: '/quiz/result',
            params: {
                score: finalScore,
                total: questions.length,
                quizId: quizId
            }
        });

    } catch (error) {
        console.error("Erro ao finalizar:", error);
        Alert.alert("Erro", "Não foi possível calcular sua nota.");
        router.replace('/(app)/home');
    }
  };

  if (loading) {
      return (
          <ScreenWrapper>
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="white" />
                <Text className="text-white mt-4 font-bold">Carregando...</Text>
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