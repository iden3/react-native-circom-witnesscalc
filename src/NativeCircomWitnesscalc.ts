import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  calculateWitness: (inputs: string, graph: string) => Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CircomWitnesscalc');
