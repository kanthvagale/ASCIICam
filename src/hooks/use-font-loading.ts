import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';
import { useFonts } from 'expo-font';

const useFontLoading = () => {
  const [loaded, error] = useFonts({
    'SpaceMono-Bold': require('../assets/fonts/SpaceMono-Bold.ttf'),
    'SpaceMono-BoldItalic': require('../assets/fonts/SpaceMono-BoldItalic.ttf'),
    'SpaceMono-Italic': require('../assets/fonts/SpaceMono-Italic.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
    JetBrainsMono_700Bold,
  });

  return {
    isReady: loaded,
    error,
  }
}

export default useFontLoading;