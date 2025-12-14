import React, { ReactNode } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface ScreenWrapperProps {
  children: ReactNode;
  title?: string;
  scrollable?: boolean;
}

export function ScreenWrapper({ children, scrollable = true }: ScreenWrapperProps) {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut }
    ]);
  };

  const Header = () => (
    <View className="flex-row items-center justify-between mb-6 px-5 pt-2">

      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
          <Image
            source={{ uri: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }}
            className="w-full h-full"
          />
        </View>
        <View>
          <Text className="text-gray-300 text-[10px] font-medium">Nível - 50</Text>
          <Text className="text-white text-lg font-bold">
            {user?.sub || user?.username || 'Jogador'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-4">

        <TouchableOpacity className="relative">
           <Feather name="bell" size={24} color="white" />
           <View className="absolute right-0 top-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0a2e0a]" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
           <Feather name="log-out" size={24} color="#ef4444" />
        </TouchableOpacity>

      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0a2e0a', '#00b300', '#22c55e']}
      locations={[0, 0.4, 1]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <Header />

        {scrollable ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1 px-5">
            {children}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}