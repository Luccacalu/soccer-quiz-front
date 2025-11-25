import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export default function Home() {
  const router = useRouter();

  return (

        <ScreenWrapper>
          <View className="bg-gray-100 rounded-2xl p-5 mb-8 shadow-lg">
            <Text className="text-gray-900 font-bold text-lg mb-1">Novo Quiz Disponível!</Text>
            <Text className="text-gray-600 text-sm mb-4">Quiz do Bahia começa em 5 min</Text>

            <TouchableOpacity
              className="bg-[#1a1a1a] py-2 px-6 rounded-full self-start"
              onPress={() => router.push('/quiz/1')}
            >
              <Text className="text-white font-bold text-xs">Participar agora</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">

            <MenuButton
              title="Jogar Quiz"
              icon={<MaterialCommunityIcons name="puzzle" size={28} color="#fbbf24" />}
              onPress={() => router.push('/(app)/choose-quiz')}
            />

            <MenuButton
              title="Ranking"
              icon={<Feather name="bar-chart-2" size={28} color="#f87171" />}
              onPress={() => router.push('/ranking')}
            />

            <MenuButton
              title="Convidar Amigos"
              subtitle="Amigos"
              icon={<Feather name="mail" size={28} color="#fb923c" />}
              onPress={() => router.push('/(app)/invite')}
            />

            <MenuButton
              title="Comprar Créditos"
              subtitle="Créditos"
              icon={<FontAwesome5 name="coins" size={24} color="#fbbf24" />}
              onPress={() => router.push('/(app)/credits')}
            />
          </View>

          <Text className="text-gray-900 font-extrabold text-xl mb-4 ml-1">
            Seu Progresso
          </Text>

          <View className="flex-row justify-between mb-8 px-2">
            <ProgressStat value="15" label="Quizzes jogados" />
            <ProgressStat value="15%" label="Taxa de acertos" />
            <ProgressStat value="204º" label="Posição no ranking" />
          </View>

          <Text className="text-gray-900 font-extrabold text-xl mb-4 ml-1">
            Quiz em Destaque
          </Text>

          <View className="bg-gray-200 rounded-2xl p-5 flex-row items-center justify-between shadow-md">
            <View className="flex-1 mr-2">
               <Text className="text-gray-800 font-bold text-base">Quiz mais jogado da semana</Text>
            </View>
            <TouchableOpacity className="bg-[#1a1a1a] py-2 px-4 rounded-lg">
              <Text className="text-white font-bold text-xs">Jogar agora</Text>
            </TouchableOpacity>
          </View>

        </ScreenWrapper>
  );
}

function MenuButton({ title, subtitle, icon, onPress }: any) {
  return (
    <TouchableOpacity
      className="bg-[#1a1a1a]/90 w-[48%] h-24 rounded-2xl p-3 flex-row items-center justify-between shadow-lg"
      onPress={onPress}
    >
      <View className="flex-1">
         <View className="mb-2">{icon}</View>
         <Text className="text-white font-bold text-sm leading-4">
            {title.replace(' Amigos', '').replace(' Créditos', '')}
         </Text>
         {subtitle && (
            <Text className="text-white font-bold text-sm leading-4">{subtitle}</Text>
         )}
         {!subtitle && title.includes(' ') && (
            <Text className="text-white font-bold text-sm leading-4">
              {title.split(' ').slice(1).join(' ')}
            </Text>
         )}
      </View>
    </TouchableOpacity>
  );
}

function ProgressStat({ value, label }: { value: string, label: string }) {
  return (
    <View className="items-center w-1/3">
      <Text className="text-white font-bold text-2xl mb-1">{value}</Text>
      <Text className="text-gray-200 text-[10px] text-center font-medium opacity-80 leading-3">
        {label.replace(' ', '\n')}
      </Text>
    </View>
  );
}