import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendToken = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Por favor, digite seu e-mail.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/forgot-password`, { email });

      Alert.alert(
        "Email Enviado",
        "Verifique seu e-mail (ou console do backend) para pegar o token.",
        [
            {
                text: "Digitar Token",
                onPress: () => router.push('/(auth)/reset-password')
            }
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o email. Verifique se o endereço está correto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0a2e0a', '#00b300', '#22c55e']}
      locations={[0, 0.7, 1]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>

          <View className="bg-white rounded-[32px] p-6 shadow-2xl">

            <TouchableOpacity onPress={() => router.back()} className="mb-4 -ml-2 w-10">
               <Feather name="arrow-left" size={26} color="#1f2937" />
            </TouchableOpacity>

            <Text className="text-3xl font-extrabold text-gray-900 mb-2">
              Redefinir Senha
            </Text>

            <Text className="text-gray-500 mb-8">
              Informe o e-mail para o qual deseja alterar a sua senha. Enviaremos um código de verificação.
            </Text>

            <View className="mb-6">
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 h-14 bg-white">
                <Feather name="mail" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                <TextInput
                  className="flex-1 text-gray-900 text-base"
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              className={`bg-[#1a1a1a] h-14 rounded-2xl items-center justify-center shadow-lg mb-6 ${loading ? 'opacity-80' : ''}`}
              onPress={handleSendToken}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Enviar Código</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/(auth)/reset-password')}
                className="items-center py-2"
            >
                <Text className="text-blue-600 font-bold">Já tenho um código</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}