import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { api } from '../../services/api';

interface Team { id: number; name: string; }

export default function CreateQuestion() {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [questionText, setQuestionText] = useState('');

  const [answers, setAnswers] = useState([
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
  ]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/team/all')
       .then(res => setTeams(res.data))
       .catch(() => Alert.alert("Erro", "Falha ao carregar times"));
  }, []);

  const handleAddAnswer = () => {
    if (answers.length >= 6) {
        Alert.alert("Limite", "Máximo de 6 respostas por pergunta.");
        return;
    }
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const handleRemoveAnswer = (indexToRemove: number) => {
    if (answers.length <= 2) {
        Alert.alert("Atenção", "O quiz precisa ter pelo menos 2 opções.");
        return;
    }

    const newAnswers = answers.filter((_, index) => index !== indexToRemove);

    if (answers[indexToRemove].isCorrect) {
        newAnswers[0].isCorrect = true;
    }

    setAnswers(newAnswers);
  };

  const setCorrect = (index: number) => {
      const newAns = answers.map((a, i) => ({ ...a, isCorrect: i === index }));
      setAnswers(newAns);
  };

  const updateAnsText = (text: string, index: number) => {
      const newAns = [...answers];
      newAns[index].text = text;
      setAnswers(newAns);
  };

  const handleSave = async () => {
    if (!selectedTeam || !questionText.trim()) return Alert.alert("Ops", "Selecione o time e digite a pergunta.");
    if (answers.some(a => !a.text.trim())) return Alert.alert("Ops", "Preencha todas as respostas.");
    if (answers.length < 2) return Alert.alert("Ops", "Adicione pelo menos 2 respostas.");

    try {
      setSaving(true);

      const quizRes = await api.get(`/quiz/team/${selectedTeam.id}`);
      const quizId = quizRes.data[0]?.id || quizRes.data?.id;

      if (!quizId) {
          Alert.alert("Erro", "Este time não tem Quiz ativo.");
          return;
      }

      const questionRes = await api.post('/question', {
        quiz_id: quizId,
        text: questionText,
        is_active: true
      });

      const questionId = questionRes.data?.id || questionRes.data?.inserted_primary_key?.[0] || questionRes.data;

      if (!questionId) throw new Error("Falha ao gerar ID da pergunta");

      const promises = answers.map(a => api.post('/answer', {
          question_id: questionId,
          text: a.text,
          is_correct: a.isCorrect
      }));

      await Promise.all(promises);

      Alert.alert("Sucesso!", "Pergunta cadastrada.", [
          { text: "OK", onPress: () => router.back() }
      ]);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

            <View className="flex-row items-center mb-6 mt-2">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Feather name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-3xl font-bold">Criar Questão</Text>
            </View>

            <View className="bg-white rounded-[32px] p-6 shadow-xl">

                <Text className="text-gray-700 font-bold mb-2 ml-1">Time Relacionado</Text>
                <TouchableOpacity
                    className="bg-gray-50 border border-gray-200 h-14 rounded-xl justify-center px-4 mb-2"
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <View className="flex-row justify-between items-center">
                        <Text className={selectedTeam ? "text-gray-900 text-base" : "text-gray-400 text-base"}>
                            {selectedTeam?.name || "Selecione..."}
                        </Text>
                        <Feather name="chevron-down" size={20} color="gray" />
                    </View>
                </TouchableOpacity>

                {isDropdownOpen && (
                    <View className="bg-white border border-gray-100 rounded-xl shadow-lg mb-4 max-h-40">
                        <ScrollView nestedScrollEnabled className="max-h-40">
                            {teams.map(t => (
                                <TouchableOpacity key={t.id} className="p-3 border-b border-gray-50" onPress={() => { setSelectedTeam(t); setIsDropdownOpen(false); }}>
                                    <Text className="text-gray-800">{t.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <Text className="text-gray-700 font-bold mb-2 ml-1 mt-2">Enunciado</Text>
                <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 h-24 text-base text-gray-800"
                    placeholder="Ex: Em que ano o time foi fundado?"
                    multiline
                    textAlignVertical="top"
                    value={questionText}
                    onChangeText={setQuestionText}
                />

                <Text className="text-gray-700 font-bold mb-3 ml-1">Respostas (Toque na correta)</Text>

                {answers.map((ans, idx) => (
                    <View key={idx} className="flex-row items-center mb-3 gap-2">
                        <TouchableOpacity onPress={() => setCorrect(idx)}>
                            <Feather
                                name={ans.isCorrect ? "check-circle" : "circle"}
                                size={26}
                                color={ans.isCorrect ? "#22c55e" : "#d1d5db"}
                            />
                        </TouchableOpacity>

                        <TextInput
                            className={`flex-1 border rounded-xl px-4 h-12 bg-white text-base ${ans.isCorrect ? 'border-green-500 text-green-700 font-medium' : 'border-gray-200 text-gray-800'}`}
                            placeholder={`Opção ${idx + 1}`}
                            value={ans.text}
                            onChangeText={(t) => updateAnsText(t, idx)}
                        />

                        <TouchableOpacity
                            onPress={() => handleRemoveAnswer(idx)}
                            className="w-10 h-10 items-center justify-center bg-red-50 rounded-xl border border-red-100"
                        >
                            <Feather name="trash-2" size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    onPress={handleAddAnswer}
                    className="flex-row items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-12 mb-4 bg-gray-50"
                >
                    <Feather name="plus" size={20} color="#6b7280" />
                    <Text className="text-gray-500 font-bold ml-2">Adicionar Opção</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className={`bg-[#1a1a1a] h-14 rounded-2xl items-center justify-center mt-4 shadow-lg ${saving ? 'opacity-70' : ''}`}
                >
                    {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Salvar Tudo</Text>}
                </TouchableOpacity>

            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}