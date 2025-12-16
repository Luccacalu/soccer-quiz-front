import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const CREDIT_PACKAGES = [
  { coins: 200, price: 'R$10,00' },
  { coins: 300, price: 'R$15,00' },
  { coins: 400, price: 'R$20,00' },
  { coins: 500, price: 'R$25,00' },
  { coins: 800, price: 'R$40,00' },
  { coins: 1000, price: 'R$50,00' },
];

export default function Credits() {
  const router = useRouter();
  const { user } = useAuth();

  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPkgIndex, setSelectedPkgIndex] = useState<number | null>(null);

  const fetchBalance = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get(`/credits/user_id/${user.id}`);
      setBalance(response.data);
    } catch (error) {
      console.log("Erro ao buscar saldo:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
    }, [user])
  );

  const handleBuyCredits = async () => {
    if (selectedPkgIndex === null) {
      Alert.alert("Selecione um pacote", "Por favor, escolha quantos créditos quer comprar.");
      return;
    }

    const packageData = CREDIT_PACKAGES[selectedPkgIndex];

    Alert.alert(
      "Confirmar Compra",
      `Deseja comprar ${packageData.coins} créditos por ${packageData.price}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar (Simular Pix)",
          onPress: async () => {
            try {
              setPurchasing(true);

              await api.post(`/credits/buy/user_id/${user.id}`, {
                amount: packageData.coins
              });

              Alert.alert("Sucesso! 💰", "Seus créditos foram adicionados.");

              await fetchBalance();
              setSelectedPkgIndex(null);

            } catch (error) {
              console.log(error);
              Alert.alert("Erro", "Falha ao processar a compra.");
            } finally {
              setPurchasing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper>
          <View className="flex-row items-end justify-between mb-8 mt-2">
            <Text className="text-white text-4xl font-medium">Créditos</Text>
            <View className="flex-row items-center pb-1 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <Text className="text-gray-200 text-sm mr-2 font-bold">
                Saldo: {loading ? "..." : balance}
              </Text>
              <FontAwesome5 name="coins" size={14} color="#fbbf24" />
            </View>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between gap-y-6">
              {CREDIT_PACKAGES.map((pkg, index) => {
                const isSelected = selectedPkgIndex === index;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPkgIndex(index)}
                    activeOpacity={0.7}
                    className={`w-[30%] aspect-square rounded-2xl items-center justify-center border
                      ${isSelected ? 'bg-green-600/20 border-green-500' : 'bg-white/10 border-white/10'}
                    `}
                  >
                    <View className="w-12 h-12 bg-yellow-400 rounded-full items-center justify-center mb-2 shadow-sm border-2 border-yellow-200">
                        <Text className="text-yellow-700 font-bold text-xl">$</Text>
                    </View>

                    <Text className="text-white font-bold text-lg">{pkg.coins}</Text>
                    <Text className="text-gray-200 text-xs font-medium">{pkg.price}</Text>

                    {isSelected && (
                        <View className="absolute top-2 right-2">
                            <Feather name="check-circle" size={16} color="#4ade80" />
                        </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View className="absolute bottom-6 left-5 right-5">
            <TouchableOpacity
              className={`py-4 rounded-2xl items-center shadow-lg border border-white/10
                ${selectedPkgIndex !== null ? 'bg-[#1a1a1a]' : 'bg-gray-500 opacity-50'}
              `}
              onPress={handleBuyCredits}
              disabled={purchasing || selectedPkgIndex === null}
            >
              {purchasing ? (
                 <ActivityIndicator color="white" />
              ) : (
                 <Text className="text-white font-bold text-lg">
                    {selectedPkgIndex !== null
                      ? `Pagar ${CREDIT_PACKAGES[selectedPkgIndex].price} com Pix`
                      : 'Selecione um pacote'}
                 </Text>
              )}
            </TouchableOpacity>
          </View>

    </ScreenWrapper>
  );
}