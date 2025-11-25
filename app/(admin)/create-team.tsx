import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export default function CreateTeam() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do time.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Time criado com sucesso!", [
            { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Erro", "Não foi possível criar o time.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

          <View className="flex-row items-center mb-8 mt-4">
             <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <Feather name="arrow-left" size={28} color="white" />
             </TouchableOpacity>
             <Text className="text-white text-3xl font-bold">Novo Time</Text>
          </View>

          <View className="bg-white rounded-[32px] p-6 shadow-xl">

            <View className="items-center mb-6">
                <View className="bg-green-100 p-4 rounded-full mb-2">
                    <Feather name="shield" size={40} color="#006437" />
                </View>
                <Text className="text-gray-500 text-center">
                    Adicione um novo clube ao banco de dados do Quiz.
                </Text>
            </View>

            <Text className="text-gray-700 font-bold text-base mb-2 ml-1">Nome do Clube</Text>

            <View className="flex-row items-center border border-gray-200 rounded-2xl bg-gray-50 px-4 h-14 mb-8">
                <Feather name="flag" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                <TextInput
                    className="flex-1 text-gray-800 text-lg"
                    placeholder="Ex: Bahia"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className={`bg-[#1a1a1a] h-14 mb-3 rounded-2xl flex-row items-center justify-center shadow-lg ${loading ? 'opacity-80' : ''}`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Feather name="check" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text className="text-white font-bold text-lg">Salvar Time</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => setName('')}
                        className="flex-1 bg-gray-100 h-12 rounded-xl items-center justify-center border border-gray-200"
                    >
                        <Text className="text-gray-600 font-semibold">Limpar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 bg-transparent h-12 rounded-xl items-center justify-center border border-gray-300"
                    >
                        <Text className="text-gray-600 font-semibold">Cancelar</Text>
                    </TouchableOpacity>
                </View>

            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}