import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';

interface Team {
  id: number;
  name: string;
}

export default function CreateQuestion() {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [saving, setSaving] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch(`${API_URL}/team/all`);
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          Alert.alert("Erro", "Falha ao carregar times.");
        }
      } catch (error) {
        console.error("Erro fetch teams:", error);
      } finally {
        setLoadingTeams(false);
      }
    }
    fetchTeams();
  }, []);

  const handleSave = async () => {
    if (!selectedTeam) return Alert.alert("Atenção", "Selecione um time para esta pergunta.");
    if (!questionText.trim()) return Alert.alert("Atenção", "Escreva o enunciado da pergunta.");

    try {
      setSaving(true);

      const payload = {
        id: Date.now(),
        quiz_id: selectedTeam.id,
        is_active: true,
        text: questionText
      };

      const response = await fetch(`${API_URL}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Pergunta cadastrada!", [
            { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Erro", "Não foi possível salvar a pergunta.");
      }

    } catch (error) {
      Alert.alert("Erro", "Falha na conexão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

          <View className="flex-row items-center mb-6 mt-2">
             <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <Feather name="arrow-left" size={28} color="white" />
             </TouchableOpacity>
             <Text className="text-white text-3xl font-bold">Nova Pergunta</Text>
          </View>

          <View className="bg-white rounded-[32px] p-6 shadow-xl min-h-[400px]">

            <Text className="text-gray-700 font-bold text-base mb-2 ml-1">Time Relacionado</Text>

            <TouchableOpacity
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-gray-50 border border-gray-200 rounded-2xl h-14 flex-row items-center justify-between px-4 mb-6"
            >
                {loadingTeams ? (
                    <ActivityIndicator color="#006437" />
                ) : (
                    <Text className={`text-base ${selectedTeam ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {selectedTeam ? selectedTeam.name : "Selecione um time"}
                    </Text>
                )}
                <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#6b7280" />
            </TouchableOpacity>

            {isDropdownOpen && (
                <View className="bg-white border border-gray-100 rounded-2xl shadow-lg max-h-48 mb-6 overflow-hidden">
                    <FlatList
                        data={teams}
                        keyExtractor={(item) => String(item.id)}
                        nestedScrollEnabled
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-4 border-b border-gray-50 active:bg-gray-50"
                                onPress={() => {
                                    setSelectedTeam(item);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <Text className="text-gray-800">{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <Text className="text-gray-700 font-bold text-base mb-2 ml-1">Enunciado da Pergunta</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-8 h-40">
                <TextInput
                    className="text-gray-800 text-base flex-1"
                    placeholder="Ex: Em que ano o Bahia ganhou o primeiro título?"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    value={questionText}
                    onChangeText={setQuestionText}
                />
            </View>

            <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className={`bg-[#1a1a1a] h-14 rounded-2xl flex-row items-center justify-center shadow-lg mt-auto ${saving ? 'opacity-70' : ''}`}
            >
                {saving ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <>
                        <Feather name="save" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white font-bold text-lg">Salvar Pergunta</Text>
                    </>
                )}
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}