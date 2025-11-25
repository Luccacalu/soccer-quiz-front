import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';

interface QuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizQuestion() {
  const router = useRouter();

  const { id, score, total, teamId } = useLocalSearchParams();

  const currentId = Number(id);
  const currentScore = Number(score || 0);
  const totalQuestions = Number(total || 10);
  const currentTeamId = teamId ? Number(teamId) : null;

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setLoading(true);
        setTimeLeft(20);

        let endpoint = `${API_URL}/questions?sequence=${currentId}`;

        if (currentTeamId) {
            endpoint += `&teamId=${currentTeamId}`;
            console.log(`Buscando pergunta ${currentId} do Time ID ${currentTeamId}`);
        } else {
            console.log(`Buscando pergunta ${currentId} (Geral)`);
        }

        // const response = await fetch(endpoint);
        // if (!response.ok) throw new Error('Fim');
        // const data = await response.json();
        // setQuestionData(data);


        // Simula fim do jogo após a pergunta 5
        if (currentId > 5) throw new Error('Fim');

        await new Promise(r => setTimeout(r, 500));

        setQuestionData({
            id: String(currentId),
            question: currentTeamId
                ? `Pergunta ${currentId} sobre o Time ${currentTeamId}?`
                : `Pergunta Geral ${currentId}?`,
            options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
            correctAnswer: 'Alternativa A'
        });

        setIsTimerRunning(true);

      } catch (error) {
        finishQuiz();
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [currentId, currentTeamId]);

  useEffect(() => {
    if (!isTimerRunning) return;
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const handleAnswer = (selectedOption: string | null) => {
    setIsTimerRunning(false);

    let newScore = currentScore;
    if (questionData && selectedOption === questionData.correctAnswer) {
        newScore += 1;
    }

    const nextId = currentId + 1;

    setTimeout(() => {
        router.replace({
            pathname: `/quiz/${nextId}`,
            params: {
                score: newScore,
                total: totalQuestions,
                teamId: teamId
            }
        });
    }, 200);
  };

  const finishQuiz = () => {
    router.replace({
        pathname: '/quiz/result',
        params: { score: currentScore, total: currentId - 1 }
    });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 justify-center items-center mt-20">
            <ActivityIndicator size="large" color="#fff" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!questionData) return null;

  const progressPercentage = (currentId / 5) * 100;

  return (
    <ScreenWrapper>
        <View className="flex-row items-center mb-6 mt-2">
             <TouchableOpacity onPress={() => router.push('/(app)/home')} className="mr-4">
                <Feather name="x" size={30} color="white" />
             </TouchableOpacity>
             <Text className="text-white text-4xl font-bold flex-1 text-center mr-10">
                Quiz
             </Text>
        </View>

        <View className="mb-8">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-medium">
                    Questão {currentId}
                </Text>
                <View className="flex-row items-center bg-white/20 px-3 py-1 rounded-full">
                    <Feather name="clock" size={14} color="white" style={{ marginRight: 6 }} />
                    <Text className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                        {timeLeft}s
                    </Text>
                </View>
            </View>
            <View className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                <View
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                />
            </View>
        </View>

        <View className="min-h-[100px] justify-center mb-8">
            <Text className="text-white text-2xl font-bold text-center leading-8 shadow-black drop-shadow-md">
                {questionData.question}
            </Text>
        </View>

        <View className="gap-y-4 pb-10">
            {questionData.options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleAnswer(option)}
                    activeOpacity={0.7}
                    className="bg-[#1a1a1a] py-5 rounded-2xl items-center shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                >
                    <Text className="text-white text-lg font-bold tracking-wide">
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </ScreenWrapper>
  );
}