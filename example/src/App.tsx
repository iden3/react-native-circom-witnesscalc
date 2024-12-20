import { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { calculateWitness } from 'react-native-circom-witnesscalc';

export default function App() {
  const [result, setResult] = useState<string | undefined>('Witness is empty');

  return (
    <View style={styles.container}>
      <Button
        title="Calculate Witness"
        onPress={async () => {
          const base64Witness = await calculateWitness('', '');
          const witness = Buffer.from(base64Witness, 'base64');

          setResult('Witness length: ' + witness.length);
        }}
      />
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
