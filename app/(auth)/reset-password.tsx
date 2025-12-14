import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token || !newPassword) {
      Alert.alert("Erro", "Preencha o código e a nova senha.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/reset-password`, {
        token: token,
        new_password: newPassword
      });

      Alert.alert(
        "Sucesso!",
        "Sua senha foi alterada.",
        [{ text: "Fazer Login", onPress: () => router.replace('/login') }]
      );

    } catch (error) {
      Alert.alert("Erro", "Token inválido ou expirado.");
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

            <Text className="text-3xl font-extrabold text-gray-900 mb-6">
              Nova Senha
            </Text>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Código de Verificação (Token)</Text>
              <TextInput
                className="border border-gray-200 rounded-2xl px-4 h-14 text-gray-900 text-base bg-white"
                placeholder="Cole o código aqui"
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
              />
            </View>

            <View className="mb-8">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Nova Senha</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 h-14 bg-white">
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    placeholder="********"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9ca3af" />
                  </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className={`bg-[#1a1a1a] h-14 rounded-2xl items-center justify-center shadow-lg ${loading ? 'opacity-80' : ''}`}
              onPress={handleReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Alterar Senha</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}