import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('pelesilva1000@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
      // Verifica se é ADMIN
      if (email === 'admin' && password === 'admin') {
        // Redireciona para a pasta (admin)
        router.replace('/(admin)/home-admin');
        return;
      }

      // Verifica se é Usuário Comum (Teste)
      if (password === '123456') {
         router.replace('/(app)/home');
      } else {
         Alert.alert("Erro", "Senha incorreta. (Admin: admin/admin | User: 123456)");
      }
    };

  return (
    <LinearGradient
      colors={['#0a2e0a', '#00b300', '#22c55e']}
      locations={[0, 0.7, 1]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 justify-center">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-[32px] p-6 shadow-2xl my-4">

            <Text className="text-center text-3xl font-extrabold text-gray-900 mb-2 mt-2">
              Login
            </Text>

            <View className="flex-row justify-center mb-8">
               <Text className="text-gray-500 text-sm">Não possui uma conta? </Text>
               <TouchableOpacity onPress={() => router.push('/register')}>
                 <Text className="text-blue-600 font-bold text-sm ml-1">Inscreva-se</Text>
               </TouchableOpacity>
            </View>

            <View className="mb-5">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Email</Text>
              <TextInput
                className="border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 text-base"
                placeholder="Ex: nome@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Senha</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-3.5">
                  <TextInput
                    className="flex-1 text-gray-800 text-base"
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#9ca3af" />
                  </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between items-center mb-8 mt-1">
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => setRememberMe(!rememberMe)}
                >
                   <View className={`w-5 h-5 border rounded mr-2 items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                      {rememberMe && <Feather name="check" size={12} color="white" />}
                   </View>
                   <Text className="text-gray-500 text-sm">Lembre-me</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text className="text-blue-600 font-bold text-sm">Esqueceu a sua senha?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-[#1a1a1a] py-4 rounded-2xl items-center justify-center shadow-md mb-6"
              onPress={handleLogin}
            >
              <Text className="text-white font-bold text-lg">Log In</Text>
            </TouchableOpacity>

            <View className="flex-row items-center mb-6 px-2">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-4 text-gray-400 text-sm font-medium">Or</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

             <TouchableOpacity className="flex-row items-center justify-center border border-gray-200 py-3.5 rounded-2xl mb-3 bg-white">
                 <FontAwesome name="google" size={18} color="#DB4437" />
                 <Text className="font-bold text-gray-700 text-sm ml-3">Continue com Google</Text>
             </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center justify-center border border-gray-200 py-3.5 rounded-2xl bg-white mb-2">
                 <FontAwesome name="facebook" size={18} color="#4267B2" />
                 <Text className="font-bold text-gray-700 text-sm ml-3">Continue com Facebook</Text>
             </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}