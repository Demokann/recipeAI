import * as ImagePicker from 'expo-image-picker';

export const cameraService = {
  requestPermission: async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  },

  // Returns base64-encoded JPEG data (without the data: URI prefix)
  captureFood: async (): Promise<string> => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      throw new Error('Fotoğraf çekimi iptal edildi.');
    }

    const base64 = result.assets[0].base64;
    if (!base64) {
      throw new Error('Fotoğraf işlenemedi. Lütfen tekrar deneyin.');
    }

    return base64;
  },
};
