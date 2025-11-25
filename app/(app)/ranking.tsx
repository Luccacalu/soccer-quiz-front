import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';

const RANKING_DATA = [
  { id: '1', name: 'Pedro', score: 4800, position: 1 },
  { id: '2', name: 'Maria', score: 2400, position: 2 },
  { id: '3', name: 'João', score: 1200, position: 3 },
  { id: '4', name: 'Ana', score: 800, position: 4 },
];

export default function Ranking() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Geral');

  const tabs = ['Geral', 'Por Time', 'Por Quiz'];

  return (
    <ScreenWrapper>

          <Text className="text-white text-4xl font-bold text-center mb-6">
            Ranking
          </Text>

          <View className="flex-row bg-[#1a1a1a] rounded-xl p-1 mb-6">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 items-center py-2 rounded-lg ${activeTab === tab ? '' : ''}`}
              >
                <Text className={`font-bold ${activeTab === tab ? 'text-yellow-400' : 'text-white'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={RANKING_DATA}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 flex-row items-center justify-between shadow-md">

                <View className="flex-row items-center gap-4">
                  <Text className="text-yellow-400 font-bold text-xl w-6 text-center">
                    {item.position}
                  </Text>

                  <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                    <FontAwesome name="user" size={20} color="#6b7280" />
                  </View>

                  <Text className="text-white font-medium text-lg">
                    {item.name}
                  </Text>
                </View>

                <Text className="text-white font-bold text-lg">
                  {item.score}
                </Text>

              </View>
            )}
          />

        </ScreenWrapper>
  );
}