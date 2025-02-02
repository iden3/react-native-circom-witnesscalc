import React from 'react';
import RNFS from 'react-native-fs';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {calculateWitness} from '@iden3/react-native-circom-witnesscalc';
import {groth16Prove, groth16Verify} from '@iden3/react-native-rapidsnark';
import Clipboard from '@react-native-clipboard/clipboard';
// import Share from 'react-native-share';

export default function App() {
  const [witnesscalcTime, setWitnesscalcTime] = React.useState(0);

  const [proofResult, setProofResult] = React.useState('');
  const [publicResult, setPublicResult] = React.useState('');
  const [verificationResult, setVerificationResult] = React.useState<
    boolean | null
  >(null);
  const [execTime, setExecTime] = React.useState(0);

  var witness = 'Witness is empty';

  const runWitnesscalc = async () => {
    console.log('Calling calculateWitness');

    const inputs = await getInputsFile();
    const graph = await getGraphFile();

    const startTime = performance.now();
    try {
      const witnessBase64 = await calculateWitness(inputs, graph);
      console.log('Witness: ', witnessBase64.substring(0, 64));
      const diff = performance.now() - startTime;
      setWitnesscalcTime(diff);
      witness = witnessBase64;
    } catch (e) {
      console.error('Error calculating witness', e);
      throw e;
    }
  };

  const runGroth16Prover = async () => {
    console.log('Calling useGroth16FileProver');

    const startTime = performance.now();
    try {
      const proverResult = await groth16Prove(zkeyPath, witness!);
      const diff = performance.now() - startTime;
      setExecTime(diff);
      return proverResult;
    } catch (e) {
      console.error('Error creating proof', e);
      throw e;
    }
  };

  const runExampleFlow = React.useCallback(async () => {
    console.log('Running example flow');

    // Copy assets to documents directory on Android
    if (Platform.OS === 'android') {
      await writeAssetFilesToDocumentsDirectory();
    }

    try {
      await runWitnesscalc();
    } catch (error: any) {
      console.error(
        'Error calculating witness, code: ',
        error.code,
        ', err:',
        error.message
      );
      return;
    }

    let proverResult: {proof: string; pub_signals: string};

    // Generate proof
    try {
      proverResult = await runGroth16Prover();

      logProof(proverResult);
      setProofResult(proverResult.proof);
      setPublicResult(proverResult.pub_signals);
    } catch (error: any) {
      console.error(
        'Error proving circuit, code: ',
        error.code,
        ', err:',
        error.message
      );
      return;
    }

    // Verify proof
    try {
      const verificationKey = await getVerificationKeyFile();

      const result = await groth16Verify(
        proverResult.proof,
        proverResult.pub_signals,
        verificationKey
      );

      setVerificationResult(result);
      console.log('verification result proof valid:' + result);
    } catch (error) {
      console.error('Error verifying proof', error);
    }
  }, []);

  const shareWitness = async () => {
    await RNFS.writeFile(
      RNFS.CachesDirectoryPath + '/witness.wtns',
      witness!,
      'base64'
    );

    const shareOptions = {
      title: 'Share file',
      url: 'file://' + RNFS.CachesDirectoryPath + '/witness.wtns',
      failOnCancel: false,
    };

    try {
      // const shareResponse = await Share.open(shareOptions);
      // console.log('Shared =>', shareResponse);
    } catch (error) {
      // console.log('Error =>', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={{height: 40}} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => runExampleFlow()}>
          <Text style={styles.buttonText}>Run</Text>
        </TouchableOpacity>

        <View style={{height: 20}} />

        <Text style={styles.resultText}>
          Witness calculation time: {witnesscalcTime}ms
        </Text>

        <Text style={styles.resultText}>
          Proof calculation time: {execTime}ms
        </Text>
        <Text style={styles.resultText}>
          Proof valid: {verificationResult?.toString() ?? 'checking'}
        </Text>

        <View style={{height: 20}} />

        <TouchableOpacity style={styles.button} onPress={() => shareWitness()}>
          <Text style={styles.buttonText}>Share witness</Text>
        </TouchableOpacity>

        <View style={{height: 20}} />

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Clipboard.setString(proofResult + '\n' + publicResult)
          }>
          <Text style={styles.buttonText}>Copy proof to clipboard</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Proof:</Text>

        <View style={styles.resultBox}>
          <Text style={styles.resultText} selectable={true}>
            {proofResult}
          </Text>
        </View>
        <Text style={styles.title}>Public inputs:</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText} selectable={true}>
            {publicResult}
          </Text>
        </View>

        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
}

function writeAssetFilesToDocumentsDirectory(): Promise<any> {
  return Promise.all([
    RNFS.copyFileAssets(
      'circuit.zkey',
      RNFS.DocumentDirectoryPath + '/circuit.zkey'
    ),
    RNFS.copyFileAssets(
      'inputs.json',
      RNFS.DocumentDirectoryPath + '/inputs.json'
    ),
    RNFS.copyFileAssets(
      'verification_key.json',
      RNFS.DocumentDirectoryPath + '/verification_key.json'
    ),
    RNFS.copyFileAssets('graph.wcd', RNFS.DocumentDirectoryPath + '/graph.wcd'),
  ]);
}

function getInputsFile(): Promise<string> {
  const path =
    (Platform.OS === 'android'
      ? RNFS.DocumentDirectoryPath
      : RNFS.MainBundlePath) + '/inputs.json';
  return RNFS.readFile(path, 'utf8');
}

function getGraphFile(): Promise<string> {
  const path =
    (Platform.OS === 'android'
      ? RNFS.DocumentDirectoryPath
      : RNFS.MainBundlePath) + '/graph.wcd';
  return RNFS.readFile(path, 'base64');
}

const zkeyPath =
  (Platform.OS === 'android'
    ? RNFS.DocumentDirectoryPath
    : RNFS.MainBundlePath) + '/circuit.zkey';

function getVerificationKeyFile(): Promise<string> {
  const path =
    (Platform.OS === 'android'
      ? RNFS.DocumentDirectoryPath
      : RNFS.MainBundlePath) + '/verification_key.json';
  return RNFS.readFile(path, 'utf8');
}

const logProof = ({
                    proof,
                    pub_signals,
                  }: {
  proof: string;
  pub_signals: string;
}) => {
  console.log('proofResult: ', proof);
  console.log('publicResult: ', pub_signals);

  const formattedProof = JSON.stringify(JSON.parse(proof), null, '\t');
  const formattedSignals = JSON.stringify(JSON.parse(pub_signals), null, '\t');

  console.log('formattedProof: ', formattedProof);
  console.log('formattedSignals: ', formattedSignals);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  resultBox: {
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  resultText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
