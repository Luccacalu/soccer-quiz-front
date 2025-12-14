import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';

export default function QuizResult() {
  const router = useRouter();

  const { score, total, sessionId, startTime } = useLocalSearchParams();

  const finalScore = Number(score || 0);
  const totalQuestions = Number(total || 10);

  const [durationString, setDurationString] = useState("00s");

  useEffect(() => {
      const formatDuration = (start: number) => {
          if (!start) return "0s";
          const end = Date.now();
          const diff = end - start;

          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);

          if (minutes > 0) {
              return `${minutes}m ${seconds}s`;
          }
          return `${seconds}s`;
      };

      setDurationString(formatDuration(Number(startTime)));

      async function endSession() {
          if (sessionId) {
              try {
                  await api.patch(`/session/id/${sessionId}`);
              } catch (error) { console.error(error); }
          }
      }
      endSession();
  }, [sessionId, startTime]);

  const percentage = Math.round((finalScore / totalQuestions) * 100);

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center pt-10">

        <Text className="text-white text-4xl font-bold mb-10">
          Quiz Encerrado
        </Text>

        <Text className="text-gray-200 text-lg font-medium mb-2">
          Você fez
        </Text>

        <Text className="text-white text-8xl font-extrabold mb-12 shadow-sm shadow-black">
          {finalScore}/{totalQuestions}
        </Text>

        <View className="bg-[#1a1a1a] w-full rounded-3xl flex-row p-8 mb-12 items-center justify-between shadow-xl border border-white/5">

          <View className="flex-1 items-center justify-center">
             <FontAwesome5 name="clock" size={28} color="#fbbf24" style={{ marginBottom: 8 }} />

             <Text className="text-yellow-400 font-bold text-xl">
                 {durationString}
             </Text>

             <Text className="text-gray-500 text-xs mt-1">Tempo Total</Text>
          </View>

          <View className="w-[1px] h-16 bg-gray-700 mx-2" />

          <View className="flex-1 items-center justify-center">
             <Text className="text-white font-bold text-3xl mb-1">{percentage}%</Text>
             <Text className="text-gray-400 text-sm">de acertos</Text>
          </View>

        </View>

        <Text className="text-white text-4xl font-bold mb-12 text-center drop-shadow-md">
          {percentage > 50 ? "Parabéns!" : "Tente de novo!"}
        </Text>

        <View className="w-full gap-y-4 mt-auto mb-6">
            <TouchableOpacity
              className="bg-[#1a1a1a] py-4 rounded-2xl items-center border border-gray-700 shadow-lg active:bg-gray-800"
              onPress={() => router.replace('/(app)/home')}
            >
              <Text className="text-white font-bold text-lg">Voltar ao Início</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#1a1a1a] py-4 rounded-2xl items-center border border-gray-700 shadow-lg active:bg-gray-800"
              onPress={() => router.replace('/(app)/teams')}
            >
              <Text className="text-white font-bold text-lg">Jogar Novamente</Text>
            </TouchableOpacity>
        </View>

      </View>
    </ScreenWrapper>
  );
}