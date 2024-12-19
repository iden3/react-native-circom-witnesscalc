# react-native-circom-witnesscalc

React native wrapper for circom-witnesscalc library intended for zero knowledge proof witness calculation.

## Installation

```sh
npm install react-native-circom-witnesscalc
```

## Usage

```js
import {calculateWitness} from 'react-native-circom-witnesscalc';

// ...

const inputs = RNFS.readFile('path/to/inputs.json', 'utf8');
const graph = RNFS.readFile('path/to/graph.wcd', "base64");

const result = await calculateWitness(inputs, graph);

const bytes = base64ToArrayBuffer(result);
```

## License

CircomWitnesscalc is part of the iden3 project and licensed under MIT and APACHE 2.0 licences. Please check
the [LICENSE-MIT](./LICENSE-MIT.txt) and [LICENSE-APACHE](./LICENSE-APACHE.txt) files for more details.
