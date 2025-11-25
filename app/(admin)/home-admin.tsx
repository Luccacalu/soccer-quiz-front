import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';

export default function AdminHome() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center">
        <Text className="text-white text-3xl font-bold text-center mb-10">
          Painel Admin 🛠️
        </Text>

        <TouchableOpacity
          className="bg-gray-100 p-6 rounded-3xl mb-6 flex-row items-center shadow-lg"
          onPress={() => router.push('/(admin)/create-team')}
        >
          <View className="bg-green-600 p-4 rounded-full mr-4">
            <Feather name="shield" size={32} color="white" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">Cadastro de Time</Text>
            <Text className="text-gray-500">Adicionar novo clube</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 p-6 rounded-3xl flex-row items-center shadow-lg"
          onPress={() => router.push('/(admin)/create-question')}
        >
          <View className="bg-blue-600 p-4 rounded-full mr-4">
            <Feather name="help-circle" size={32} color="white" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">Criar Pergunta</Text>
            <Text className="text-gray-500">Adicionar ao quiz</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-12 bg-red-900/80 p-4 rounded-xl items-center"
          onPress={() => router.replace('/login')}
        >
          <Text className="text-white font-bold">Sair do Admin</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}