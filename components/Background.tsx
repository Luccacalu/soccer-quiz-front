import { LinearGradient } from 'expo-linear-gradient';
import { View, SafeAreaView } from 'react-native';
import { ReactNode } from 'react';

export function Background({ children }: { children: ReactNode }) {
  return (
    <LinearGradient
      colors={['#004d00', '#00b300', '#00ff00']}
      locations={[0.1, 0.5, 0.9]}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-4 pt-4">
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}