import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { api } from '../../../services/api';

interface Question { id: number; text: string; }

export default function TeamDetails() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const quizRes = await api.get(`/quiz/team/${id}`);
      const qId = quizRes.data[0]?.id || quizRes.data?.id;

      if (qId) {
          setQuizId(qId);
          const questRes = await api.get(`/question/quiz/${qId}`);
          setQuestions(questRes.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDeleteQuestion = async (qId: number) => {
      Alert.alert("Apagar", "Deseja apagar esta pergunta?", [
          { text: "Cancelar" },
          { text: "Apagar", style: 'destructive', onPress: async () => {
              try {
                  await api.delete(`/question/id/${qId}`);
                  loadData();
              } catch (e) { Alert.alert("Erro", "Não foi possível apagar."); }
          }}
      ]);
  };

  return (
    <ScreenWrapper scrollable={false}>
      <View className="flex-row items-center mb-2 mt-2 px-1 justify-between">
         <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <Feather name="arrow-left" size={28} color="white" />
            </TouchableOpacity>
            <View>
                <Text className="text-gray-300 text-xs font-bold uppercase">Editando Time</Text>
                <Text className="text-white text-2xl font-bold">{name}</Text>
            </View>
         </View>

         <TouchableOpacity
            onPress={() => router.push(`/(admin)/create-question`)}
            className="bg-white/20 p-2 rounded-xl"
         >
            <Feather name="plus" size={24} color="white" />
         </TouchableOpacity>
      </View>

      <Text className="text-white/80 px-2 mb-4 text-sm">
         {questions.length} perguntas cadastradas
      </Text>

      <View className="bg-white rounded-t-[32px] flex-1 p-6 shadow-xl">
        {loading ? (
            <ActivityIndicator color="#006437" size="large" className="mt-10" />
        ) : (
            <FlatList
                data={questions}
                keyExtractor={item => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={({ item }) => (
                    <View className="bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-3 flex-row items-center justify-between">
                        <View className="flex-1 mr-2">
                            <Text className="text-gray-800 font-medium" numberOfLines={2}>{item.text}</Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <TouchableOpacity
                                onPress={() => router.push(`/(admin)/question-editor/${item.id}`)}
                                className="bg-blue-100 p-2 rounded-lg"
                            >
                                <Feather name="edit-2" size={18} color="#2563eb" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDeleteQuestion(item.id)}
                                className="bg-red-100 p-2 rounded-lg"
                            >
                                <Feather name="trash-2" size={18} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">Nenhuma pergunta encontrada.</Text>}
            />
        )}
      </View>
    </ScreenWrapper>
  );
}