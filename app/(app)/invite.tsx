import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../../services/api';

export default function InviteFriend() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, digite o e-mail do seu amigo.");
      return;
    }

    try {
      setLoading(true);

      await api.post('/auth/invite', { email });

      Alert.alert(
        "Convite Enviado! 🚀",
        `Um e-mail foi enviado para ${email} com o link de registro.`,
        [{ text: "OK", onPress: () => router.back() }]
      );

    } catch (error) {
      console.log("Erro ao convidar:", error);
      Alert.alert("Erro", "Não foi possível enviar o convite. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0a2e0a', '#00b300', '#22c55e']}
      locations={[0, 0.5, 1]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-6"
        >

          <View className="items-center mb-10">
            <Text className="text-white text-4xl font-bold mb-3 text-center">
              Convidar amigo
            </Text>
            <Text className="text-gray-200 text-center text-base px-4">
              Informe o e-mail para o qual deseja enviar um convite para o jogo.
            </Text>
          </View>

          <View className="flex-row items-center bg-white rounded-xl px-4 h-14 mb-6 shadow-lg">
            <Feather name="mail" size={20} color="#006437" />
            <TextInput
              className="flex-1 ml-3 text-gray-800 text-base"
              placeholder="Ex: amigo@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            className={`bg-[#1a1a1a] h-14 rounded-xl items-center justify-center shadow-lg border border-gray-800 ${loading ? 'opacity-80' : ''}`}
            onPress={handleInvite}
            disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white font-bold text-lg">Convidar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-6 items-center p-2"
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text className="text-white underline text-base font-medium">Cancelar</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}