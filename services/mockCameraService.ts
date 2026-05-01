import { delay } from '../utils/delay';

/**
 * Kamera işlemlerini simüle eden servis.
 * Gerçek implementasyonda expo-camera ve expo-image-picker kullanılacaktır.
 */
export const mockCameraService = {
  /**
   * Kamera izni ister.
   */
  requestPermission: async (): Promise<boolean> => {
    await delay(500);
    return true;
  },

  /**
   * Fotoğraf çekme işlemini simüle eder ve geçici bir URI döner.
   */
  captureFood: async (): Promise<string> => {
    await delay(1000);
    return 'mock://food-image-captured-uri';
  },
};
