import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/ScreenWrapper';

interface Team {
  id: number;
  name: string;
}

export default function TeamsList() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchTeams() {
      try {
        console.log("Buscando times em:", `${API_URL}/team/all`);

        const response = await fetch(`${API_URL}/team/all`);

        if (!response.ok) {
          throw new Error('Falha na requisição');
        }

        const data = await response.json();
        setTeams(data);

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
      router.push({
        pathname: '/quiz/1',
        params: {
          score: 0,
          teamId: teamId
        }
      });
    };

  return (
    <ScreenWrapper>
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
        <View className="flex-row flex-wrap justify-between gap-y-4 pb-10">
          {teams.length === 0 ? (
             <Text className="text-white text-center w-full mt-10">Nenhum time encontrado.</Text>
          ) : (
             teams.map((team) => {
                return (
                  <TouchableOpacity
                    key={team.id}
                    onPress={() => handleSelectTeam(team.id)}
                    className="w-[48%] aspect-square rounded-[30px] items-center justify-center border-2 border-white/10 bg-white/10 p-4 shadow-lg"
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
    </ScreenWrapper>
  );
}