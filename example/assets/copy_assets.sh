echo "Copying zkey, verification key and witness files to assets folder"

DIST=$(pwd)
INPUTS=$DIST/inputs.json
GRAPH=$DIST/graph.wcd
ZKEY=$DIST/circuit.zkey
VERIFICATION_KEY=$DIST/verification_key.json

mkdir -p ../android/app/src/main/assets

echo "--------------------"

if [[ -f $ZKEY ]]; then
  cp $ZKEY ../ios
  cp $ZKEY ../android/app/src/main/assets
  echo "zkey copied"
else
  echo "zkey not found"
fi

echo "--------------------"

if [[ -f $VERIFICATION_KEY ]]; then
  cp $VERIFICATION_KEY ../ios
  cp $VERIFICATION_KEY ../android/app/src/main/assets
  echo "verification key copied"
else
  echo "verification key not found"
fi

echo "--------------------"

if [[ -f $INPUTS ]]; then
  cp $INPUTS ../ios
  cp $INPUTS ../android/app/src/main/assets
  echo "witness copied"
else
  echo "witness not found"
fi

echo "--------------------"

if [[ -f $GRAPH ]]; then
  cp $GRAPH ../ios
  cp $GRAPH ../android/app/src/main/assets
  echo "witness copied"
else
  echo "witness not found"
fi
