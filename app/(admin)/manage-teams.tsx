import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';

interface Team { id: number; name: string; }

export default function ManageTeams() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const res = await api.get('/team/all');
      setTeams(res.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os times.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTeams(); }, []);

  const handleDelete = async (id: number, name: string) => {
    Alert.alert("Excluir Time", `Tem certeza que deseja excluir o ${name}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            try {
                await api.delete(`/team/id/${id}`);
                loadTeams();
            } catch (e) {
                Alert.alert("Erro", "Falha ao excluir.");
            }
        }}
    ]);
  };

  return (
    <ScreenWrapper scrollable={false}>
      <View className="flex-row items-center mb-6 mt-2 px-1">
         <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Feather name="arrow-left" size={28} color="white" />
         </TouchableOpacity>
         <Text className="text-white text-3xl font-bold">Gerenciar Times</Text>
      </View>

      <View className="bg-white rounded-t-[32px] flex-1 p-6 shadow-xl">
        {loading ? (
            <ActivityIndicator color="#006437" size="large" className="mt-10" />
        ) : (
            <FlatList
                data={teams}
                keyExtractor={item => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-3 flex-row items-center justify-between"
                        onPress={() => router.push(`/(admin)/team-details/${item.id}?name=${item.name}`)}
                    >
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                                <Feather name="shield" size={18} color="#006437" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <Feather name="chevron-right" size={24} color="#9ca3af" />
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">Nenhum time encontrado.</Text>}
            />
        )}
      </View>
    </ScreenWrapper>
  );
}