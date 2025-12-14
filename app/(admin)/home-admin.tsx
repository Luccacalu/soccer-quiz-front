import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminHome() {
  const router = useRouter();

  const StatsCard = ({ icon, label, value, color }: any) => (
    <View className="bg-white/10 p-4 rounded-2xl flex-1 mx-1 backdrop-blur-sm border border-white/20">
      <View className={`w-8 h-8 rounded-full items-center justify-center mb-2 ${color}`}>
        <Feather name={icon} size={16} color="white" />
      </View>
      <Text className="text-white text-2xl font-bold">{value}</Text>
      <Text className="text-gray-300 text-xs">{label}</Text>
    </View>
  );

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <View className="mb-8 mt-2">
           <Text className="text-gray-300 text-lg">Bem-vindo, Chefe 👋</Text>
           <Text className="text-white text-3xl font-extrabold">Painel de Controle</Text>
        </View>

        <View className="flex-row justify-between mb-8">
            <StatsCard icon="users" label="Jogadores" value="1.2k" color="bg-blue-500" />
            <StatsCard icon="shield" label="Times" value="24" color="bg-green-500" />
            <StatsCard icon="help-circle" label="Perguntas" value="150" color="bg-purple-500" />
        </View>

        <Text className="text-white font-bold text-xl mb-4">Gerenciamento</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(admin)/create-team')}
          className="mb-4"
        >
          <LinearGradient
            colors={['#ffffff', '#f3f4f6']}
            className="p-6 rounded-[24px] flex-row items-center shadow-lg border border-white/50"
          >
            <View className="bg-green-100 w-16 h-16 rounded-full items-center justify-center mr-5 shadow-sm">
               <MaterialIcons name="sports-soccer" size={32} color="#006437" />
            </View>
            <View className="flex-1">
               <Text className="text-xl font-extrabold text-gray-900">Novo Time</Text>
               <Text className="text-gray-500 text-sm mt-1">Cadastrar clube no banco de dados</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#9ca3af" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(admin)/create-question')}
          className="mb-4"
        >
          <LinearGradient
            colors={['#ffffff', '#f3f4f6']}
            className="p-6 rounded-[24px] flex-row items-center shadow-lg border border-white/50"
          >
            <View className="bg-blue-100 w-16 h-16 rounded-full items-center justify-center mr-5 shadow-sm">
               <Feather name="file-plus" size={30} color="#1d4ed8" />
            </View>
            <View className="flex-1">
               <Text className="text-xl font-extrabold text-gray-900">Nova Pergunta</Text>
               <Text className="text-gray-500 text-sm mt-1">Criar desafio para um time</Text>
            </View>
             <Feather name="chevron-right" size={24} color="#9ca3af" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/(admin)/manage-teams')}
          className="mb-4"
        >
          <LinearGradient
            colors={['#ffffff', '#f3f4f6']}
            className="p-6 rounded-[24px] flex-row items-center shadow-lg border border-white/50"
          >
            <View className="bg-purple-100 w-16 h-16 rounded-full items-center justify-center mr-5 shadow-sm">
               <Feather name="edit-3" size={28} color="#7e22ce" />
            </View>
            <View className="flex-1">
               <Text className="text-xl font-extrabold text-gray-900">Gerenciar Dados</Text>
               <Text className="text-gray-500 text-sm mt-1">Editar times, perguntas e respostas</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#9ca3af" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          className="mb-4 opacity-60"
          onPress={() => {}}
        >
          <LinearGradient
            colors={['#ffffff', '#f3f4f6']}
            className="p-6 rounded-[24px] flex-row items-center shadow-lg border border-white/50"
          >
            <View className="bg-purple-100 w-16 h-16 rounded-full items-center justify-center mr-5 shadow-sm">
               <Feather name="trello" size={28} color="#7e22ce" />
            </View>
            <View className="flex-1">
               <Text className="text-xl font-extrabold text-gray-900">Dashboard</Text>
               <Text className="text-gray-500 text-sm mt-1">Em breve...</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>
  );
}