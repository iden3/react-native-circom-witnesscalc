import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { calculateWitness } from 'react-native-circom-witnesscalc';

export default function App() {
  const [result, setResult] = useState<string | undefined>();

  useEffect(() => {
    calculateWitness('', '').then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
