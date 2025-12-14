import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';

interface Team {
  id: number;
  name: string;
}

export default function TeamsList() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await api.get('/team/all');
        setTeams(response.data);
      } catch (error) {
        console.error("Erro ao buscar times:", error);
        Alert.alert("Erro", "Não foi possível carregar os times. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  const handleSelectTeam = (teamId: number) => {
    router.push(`/quiz/play?teamId=${teamId}`);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          <Text className="text-white text-3xl font-bold text-center mb-2 mt-4">
            Escolha seu time
          </Text>
          <Text className="text-gray-200 text-center mb-8">
            Mostre que você sabe tudo sobre seu clube!
          </Text>

          {loading ? (
            <View className="flex-1 justify-center items-center mt-20">
              <ActivityIndicator size="large" color="#fbbf24" />
              <Text className="text-white mt-4 font-bold">Carregando times...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {teams.length === 0 ? (
                <Text className="text-white text-center w-full mt-10">Nenhum time encontrado.</Text>
              ) : (
                teams.map((team) => {
                    return (
                      <TouchableOpacity
                        key={team.id}
                        onPress={() => handleSelectTeam(team.id)}
                        activeOpacity={0.7}
                        className="w-[48%] aspect-square rounded-[30px] items-center justify-center border-2 border-white/10 bg-white/10 p-4 shadow-lg active:bg-white/20 active:scale-95"
                      >
                        <Text className="text-white font-bold text-lg text-center drop-shadow-md">
                          {team.name}
                        </Text>
                      </TouchableOpacity>
                    );
                })
              )}
            </View>
          )}
      </ScrollView>
    </ScreenWrapper>
  );
}