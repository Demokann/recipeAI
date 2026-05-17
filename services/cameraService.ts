import * as ImagePicker from 'expo-image-picker';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
  base64: true,
};

function extractBase64(result: ImagePicker.ImagePickerResult): string {
  if (result.canceled || !result.assets?.[0]) {
    throw new Error('iptal');
  }
  const base64 = result.assets[0].base64;
  if (!base64) {
    throw new Error('Fotoğraf işlenemedi. Lütfen tekrar deneyin.');
  }
  return base64;
}

export const cameraService = {
  requestPermission: async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  },

  // Opens the device camera and returns base64-encoded JPEG data.
  captureFood: async (): Promise<string> => {
    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    return extractBase64(result);
  },

  // Opens the photo library and returns base64-encoded JPEG data.
  pickFromGallery: async (): Promise<string> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Galeri erişim izni verilmedi. Lütfen ayarlardan izin verin.');
    }
    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    return extractBase64(result);
  },
};
