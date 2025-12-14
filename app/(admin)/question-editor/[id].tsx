import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { api } from '../../../services/api';

interface Answer {
    id?: number;
    text: string;
    is_correct: boolean;
}

export default function QuestionEditor() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [questionText, setQuestionText] = useState('');
  const [quizId, setQuizId] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [originalAnswerIds, setOriginalAnswerIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
        try {
            const qRes = await api.get(`/question/qid/${id}`);
            const question = qRes.data[0] || qRes.data;
            setQuestionText(question.text);
            setQuizId(question.quiz_id);

            const aRes = await api.get(`/answer/qid/${id}`);
            setAnswers(aRes.data);

            setOriginalAnswerIds(aRes.data.map((a: any) => a.id));
        } catch (e) {
            Alert.alert("Erro", "Falha ao carregar dados.");
            router.back();
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [id]);

  const handleUpdateAnswer = (text: string, idx: number) => {
      const newAns = [...answers];
      newAns[idx].text = text;
      setAnswers(newAns);
  };

  const handleSetCorrect = (idx: number) => {
      const newAns = answers.map((a, i) => ({ ...a, is_correct: i === idx }));
      setAnswers(newAns);
  };

  const handleAddAnswer = () => {
      if (answers.length >= 6) return Alert.alert("Limite atingido");
      setAnswers([...answers, { text: '', is_correct: false }]);
  };

  const handleRemoveAnswer = (idx: number) => {
      if (answers.length <= 2) return Alert.alert("Mínimo de 2 respostas.");
      const newAns = answers.filter((_, i) => i !== idx);
      if (answers[idx].is_correct) newAns[0].is_correct = true;
      setAnswers(newAns);
  };

  const handleSave = async () => {
      try {
          setSaving(true);

          await api.patch(`/question/id/${id}`, {
              text: questionText,
              quiz_id: quizId,
              is_active: true
          });

          const currentIds = new Set(answers.map(a => a.id).filter(id => id !== undefined));

          const toDelete = originalAnswerIds.filter(oid => !currentIds.has(oid));
          await Promise.all(toDelete.map(delId => api.delete(`/answer/id/${delId}`)));

          const upsertPromises = answers.map(ans => {
              if (ans.id) {
                  return api.patch(`/answer/id/${ans.id}`, {
                      question_id: Number(id),
                      text: ans.text,
                      is_correct: ans.is_correct
                  });
              } else {
                  return api.post(`/answer`, {
                      question_id: Number(id),
                      text: ans.text,
                      is_correct: ans.is_correct
                  });
              }
          });

          await Promise.all(upsertPromises);

          Alert.alert("Sucesso", "Pergunta atualizada!", [{ text: "OK", onPress: () => router.back() }]);

      } catch (e) {
          console.log(e);
          Alert.alert("Erro", "Falha ao salvar alterações.");
      } finally {
          setSaving(false);
      }
  };

  if (loading) return <ScreenWrapper><ActivityIndicator className="mt-20" color="white" /></ScreenWrapper>;

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

            <View className="flex-row items-center mb-6 mt-2">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Feather name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold">Editar Questão</Text>
            </View>

            <View className="bg-white rounded-[32px] p-6 shadow-xl">

                <Text className="text-gray-700 font-bold mb-2 ml-1">Enunciado</Text>
                <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 h-24 text-base text-gray-800"
                    multiline
                    textAlignVertical="top"
                    value={questionText}
                    onChangeText={setQuestionText}
                />

                <Text className="text-gray-700 font-bold mb-3 ml-1">Respostas (Toque na correta)</Text>

                {answers.map((ans, idx) => (
                    <View key={idx} className="flex-row items-center mb-3 gap-2">
                        <TouchableOpacity onPress={() => handleSetCorrect(idx)}>
                            <Feather
                                name={ans.is_correct ? "check-circle" : "circle"}
                                size={26}
                                color={ans.is_correct ? "#22c55e" : "#d1d5db"}
                            />
                        </TouchableOpacity>
                        <TextInput
                            className={`flex-1 border rounded-xl px-4 h-12 bg-white text-base ${ans.is_correct ? 'border-green-500 text-green-700' : 'border-gray-200'}`}
                            value={ans.text}
                            onChangeText={(t) => handleUpdateAnswer(t, idx)}
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
                    {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Salvar Alterações</Text>}
                </TouchableOpacity>

            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}