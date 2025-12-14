import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';

export default function CreateTeam() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Atenção", "Digite o nome do time.");

    try {
      setLoading(true);

      const teamRes = await api.post('/team', { name });

      const teamId = teamRes.data?.id || teamRes.data?.inserted_primary_key?.[0] || teamRes.data;

      if (!teamId) throw new Error("ID do time não retornado pelo servidor.");

      await api.post('/quiz', {
        team_id: teamId,
        is_active: true
      });

      Alert.alert("Sucesso", "Time criado e Quiz ativado!", [
          { text: "OK", onPress: () => router.back() }
      ]);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao criar o time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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
                    Ao salvar, um Quiz será criado automaticamente vinculado a este time.
                </Text>
            </View>

            <Text className="text-gray-700 font-bold text-base mb-2 ml-1">Nome do Clube</Text>
            <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 mb-8 text-gray-800 text-lg"
                placeholder="Ex: Bahia"
                value={name}
                onChangeText={setName}
            />

            <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                className={`bg-[#1a1a1a] h-14 rounded-2xl items-center justify-center shadow-lg ${loading ? 'opacity-80' : ''}`}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Salvar Time</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}