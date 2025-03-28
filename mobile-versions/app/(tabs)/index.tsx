import {Image, StyleSheet, Platform, View, Button} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {useRouter} from "expo-router";

export default function HomeScreen() {
    const router = useRouter();
  return (
    <View style={{flex: 1, backgroundColor:'black'}}>
        <View style={{flex:1, backgroundColor:'black', marginTop:100}}>
            <Button title="Login" onPress={() => {router.push('/login')}} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
