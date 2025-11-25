import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState('Pelé da Silva');
  const [email, setEmail] = useState('pelesilva1000@gmail.com');
  const [birthDate, setBirthDate] = useState('18/03/2024');
  const [phone, setPhone] = useState('(55) 71 98826-0592');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient
      colors={['#0a2e0a', '#00b300', '#22c55e']}
      locations={[0, 0.7, 1]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
        >
          <View className="bg-white mx-5 mt-10 rounded-[30px] p-6 shadow-2xl">

            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-4 w-10 h-10 justify-center -ml-2"
            >
               <Feather name="arrow-left" size={26} color="#1f2937" />
            </TouchableOpacity>

            <Text className="text-3xl font-extrabold text-gray-900 mb-2">
              Cadastre-se
            </Text>

            <View className="flex-row mb-6">
               <Text className="text-gray-500 text-sm">Já possui uma conta? </Text>
               <TouchableOpacity onPress={() => router.back()}>
                 <Text className="text-blue-600 font-bold text-sm ml-1">Login</Text>
               </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Nome Completo</Text>
              <TextInput
                className="border border-gray-200 rounded-2xl px-4 h-14 text-gray-900 text-base bg-white"
                placeholder="Ex: João da Silva"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Email</Text>
              <TextInput
                className="border border-gray-200 rounded-2xl px-4 h-14 text-gray-900 text-base bg-white"
                placeholder="Ex: email@teste.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Data de Nascimento</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 h-14 bg-white">
                <TextInput
                  className="flex-1 text-gray-900 text-base"
                  placeholder="DD/MM/AAAA"
                  value={birthDate}
                  onChangeText={setBirthDate}
                  keyboardType="numeric"
                />
                <Feather name="calendar" size={20} color="#9ca3af" />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Telefone</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl h-14 overflow-hidden bg-white">
                 <View className="w-14 h-full items-center justify-center border-r border-gray-200 bg-gray-50/50">
                    <Feather name="chevron-down" size={20} color="#6b7280" />
                 </View>
                <TextInput
                  className="flex-1 px-4 text-gray-900 text-base"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-gray-500 text-xs ml-1 mb-2">Senha</Text>
              <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 h-14 bg-white">
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
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

            <TouchableOpacity
              className="bg-[#1a1a1a] h-14 rounded-2xl items-center justify-center shadow-lg"
              onPress={() => router.replace('/(app)/home')}
            >
              <Text className="text-white font-bold text-lg">Cadastro</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}