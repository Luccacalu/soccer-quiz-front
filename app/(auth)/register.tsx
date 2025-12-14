import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/register`, {
        username: name,
        email: email,
        password: password,
        role: isAdmin ? "admin" : "user"
      });

      if (response.status === 201) {
        Alert.alert(
          "Sucesso! ⚽",
          `Conta de ${isAdmin ? 'ADMIN' : 'JOGADOR'} criada.`,
          [{ text: "Ir para Login", onPress: () => router.back() }]
        );
      }

    } catch (error: any) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível criar a conta.");
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
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View className="bg-white mx-5 mt-10 rounded-[30px] p-6 shadow-2xl">

            <TouchableOpacity onPress={() => router.back()} className="mb-4 w-10 h-10 justify-center -ml-2">
               <Feather name="arrow-left" size={26} color="#1f2937" />
            </TouchableOpacity>

            <Text className="text-3xl font-extrabold text-gray-900 mb-2">Cadastre-se</Text>

            <View className="flex-row mb-6">
               <Text className="text-gray-500 text-sm">Já possui uma conta? </Text>
               <TouchableOpacity onPress={() => router.back()}>
                 <Text className="text-blue-600 font-bold text-sm ml-1">Login</Text>
               </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Nome de Usuário</Text>
              <TextInput className="border border-gray-200 rounded-2xl px-4 h-14 text-gray-900 text-base bg-white" placeholder="Ex: joaosilva" value={name} onChangeText={setName} autoCapitalize="none" />
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Email</Text>
              <TextInput className="border border-gray-200 rounded-2xl px-4 h-14 text-gray-900 text-base bg-white" placeholder="Ex: email@teste.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View className="mb-6">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Senha</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 h-14 bg-white">
                  <TextInput className="flex-1 text-gray-900 text-base" placeholder="********" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9ca3af" />
                  </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setIsAdmin(!isAdmin)}
              className={`flex-row items-center justify-between p-4 rounded-2xl border mb-8 ${isAdmin ? 'bg-gray-900 border-gray-900' : 'bg-gray-50 border-gray-200'}`}
            >
                <View className="flex-row items-center gap-3">
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isAdmin ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                        <Feather name={isAdmin ? "shield" : "user"} size={20} color={isAdmin ? "white" : "gray"} />
                    </View>
                    <View>
                        <Text className={`font-bold ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
                            {isAdmin ? 'Conta Administrador' : 'Conta Jogador'}
                        </Text>
                        <Text className={`text-xs ${isAdmin ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isAdmin ? 'Pode criar times e perguntas' : 'Apenas joga os quizzes'}
                        </Text>
                    </View>
                </View>
                {isAdmin && <Feather name="check-circle" size={20} color="#22c55e" />}
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-[#1a1a1a] h-14 rounded-2xl items-center justify-center shadow-lg ${loading ? 'opacity-80' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Criar Conta</Text>}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}