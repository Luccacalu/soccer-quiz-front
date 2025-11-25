import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';

const CREDIT_PACKAGES = [
  { coins: '200', price: 'R$10,00' },
  { coins: '300', price: 'R$15,00' },
  { coins: '400', price: 'R$20,00' },
  { coins: '500', price: 'R$25,00' },
  { coins: '800', price: 'R$40,00' },
  { coins: '1000', price: 'R$50,00' },
];

export default function Credits() {
  const router = useRouter();

  return (
    <ScreenWrapper>
          <View className="flex-row items-end justify-between mb-8">
            <Text className="text-white text-4xl font-medium">Créditos</Text>
            <View className="flex-row items-center pb-1">
              <Text className="text-gray-200 text-sm mr-1">Saldo: 5000</Text>
              <FontAwesome5 name="coins" size={14} color="#fbbf24" />
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-6">
            {CREDIT_PACKAGES.map((pkg, index) => (
              <TouchableOpacity
                key={index}
                className="w-[30%] aspect-square bg-white/20 rounded-2xl items-center justify-center border border-white/10"
              >
                <View className="w-12 h-12 bg-yellow-400 rounded-full items-center justify-center mb-2 shadow-sm border-2 border-yellow-200">
                    <Text className="text-yellow-700 font-bold text-xl">$</Text>
                </View>

                <Text className="text-white font-bold text-lg">{pkg.coins}</Text>

                <Text className="text-gray-200 text-xs font-medium">{pkg.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-auto mb-6">
            <TouchableOpacity
              className="bg-[#1a1a1a] py-4 rounded-2xl items-center shadow-lg"
              onPress={() => {}}
            >
              <Text className="text-white font-bold text-lg">Pix</Text>
            </TouchableOpacity>
          </View>

        </ScreenWrapper>
  );
}