import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface RankingPosition {
    position: number;
    username: string;
    score: number;
    total_time_seconds: number;
}

export default function QuizResult() {
  const router = useRouter();
  const { score, total, quizId } = useLocalSearchParams();
  const { user } = useAuth();

  const finalScore = Number(score || 0);
  const totalQuestions = Number(total || 10);
  const percentage = Math.round((finalScore / totalQuestions) * 100);

  const [ranking, setRanking] = useState<RankingPosition[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  useEffect(() => {
      async function fetchRanking() {
          if (!quizId) return;
          try {
              const res = await api.get(`/ranking/quiz/${quizId}`);
              setRanking(res.data);
          } catch (error) {
              console.log("Erro ao buscar ranking", error);
          } finally {
              setLoadingRanking(false);
          }
      }
      fetchRanking();
  }, [quizId]);

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View className="items-center pt-6">

            <Text className="text-white text-3xl font-bold mb-6">Resultado</Text>

            <View className="bg-[#1a1a1a] w-full rounded-[30px] p-6 mb-8 items-center border border-white/10 shadow-xl">
                <Text className="text-gray-400 text-sm mb-2 font-bold uppercase tracking-widest">Sua Pontuação</Text>
                <Text className="text-white text-7xl font-extrabold mb-4 text-shadow">
                    {finalScore}<Text className="text-3xl text-gray-500">/{totalQuestions}</Text>
                </Text>

                <View className="flex-row gap-4">
                    <View className="bg-white/5 px-4 py-2 rounded-xl flex-row items-center">
                         <Feather name="target" size={16} color="#fbbf24" style={{marginRight: 6}} />
                         <Text className="text-white font-bold">{percentage}% Acertos</Text>
                    </View>
                </View>
            </View>

            <Text className="text-white text-xl font-bold self-start mb-4 ml-2">Ranking da Rodada 🏆</Text>

            <View className="w-full bg-white/5 rounded-3xl p-4 mb-8">
                {loadingRanking ? (
                    <ActivityIndicator color="#fbbf24" />
                ) : (
                    ranking.slice(0, 5).map((item, index) => {
                        const isMe = item.username === user?.username;
                        return (
                            <View key={index} className={`flex-row items-center p-3 mb-2 rounded-xl ${isMe ? 'bg-yellow-500/20 border border-yellow-500/50' : 'border-b border-white/5'}`}>
                                <Text className={`font-bold w-8 text-lg ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                    #{item.position}
                                </Text>
                                <View className="flex-1">
                                    <Text className={`font-bold text-base ${isMe ? 'text-yellow-100' : 'text-white'}`}>
                                        {item.username} {isMe && '(Você)'}
                                    </Text>
                                    <Text className="text-xs text-gray-400">{item.total_time_seconds.toFixed(1)}s</Text>
                                </View>
                                <Text className="text-white font-bold text-lg">{item.score} pts</Text>
                            </View>
                        )
                    })
                )}
            </View>

            <View className="w-full gap-y-3">
                <TouchableOpacity
                className="bg-[#1a1a1a] py-4 rounded-2xl items-center border border-gray-700 active:bg-gray-800"
                onPress={() => router.replace('/(app)/teams')}
                >
                <Text className="text-white font-bold text-lg">Jogar Novamente</Text>
                </TouchableOpacity>

                <TouchableOpacity
                className="py-4 rounded-2xl items-center"
                onPress={() => router.replace('/(app)/home')}
                >
                <Text className="text-gray-400 font-bold text-lg">Voltar ao Início</Text>
                </TouchableOpacity>
            </View>

          </View>
      </ScrollView>
    </ScreenWrapper>
  );
}