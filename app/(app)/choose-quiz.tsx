import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export default function ChooseQuiz() {
  const router = useRouter();

  return (
    <ScreenWrapper>

      <Text className="text-white text-4xl font-medium text-center mb-12 mt-4">
        Escolha o seu quiz
      </Text>

      <TouchableOpacity
        onPress={() => console.log('')}
        className="flex-row items-center p-6 rounded-[30px] mb-6 h-40 bg-gray-100 shadow-xl"
      >
        <View className="mr-6 ml-2 bg-gray-200 p-4 rounded-full">
           <Feather name="search" size={40} color="black" />
        </View>
        <View>
          <Text className="text-black font-extrabold text-2xl">Quiz Geral</Text>
          <Text className="text-gray-600 font-medium text-base">Todas as perguntas</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/(app)/teams')}
        className="flex-row items-center p-6 rounded-[30px] mb-8 h-40 bg-gray-100 shadow-xl"
      >
        <View className="mr-6 ml-2 bg-gray-200 p-4 rounded-full">
           <Ionicons name="football" size={40} color="black" />
        </View>
        <View>
          <Text className="text-black font-extrabold text-2xl">Quiz por time</Text>
          <Text className="text-gray-600 font-medium text-base">Filtrar perguntas por</Text>
        </View>
      </TouchableOpacity>

    </ScreenWrapper>
  );
}