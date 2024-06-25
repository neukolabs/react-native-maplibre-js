import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import MaplibreMapProvider from 'react-native-maplibre-js';
import MapView from './mapview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <MaplibreMapProvider>
        <MapView />
      </MaplibreMapProvider>
    </View>
  );
}
