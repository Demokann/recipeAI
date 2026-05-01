
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Feather } from '@expo/vector-icons';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import AnimatedPressable from '../shared/AnimatedPressable';

interface CameraCaptureProps {
  onPictureTaken: (uri: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPictureTaken }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = React.useRef<Camera>(null);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onPictureTaken(photo.uri);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Kamerayı kullanmak için izin vermeniz gerekiyor.</Text>
        <AnimatedPressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>İzin Ver</Text>
        </AnimatedPressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <AnimatedPressable style={styles.captureButton} onPress={handleTakePicture}>
            <Feather name="camera" size={32} color={colors.dark} />
          </AnimatedPressable>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.accent,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  permissionText: {
    ...typography.body,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  permissionButtonText: {
    ...typography.body,
    color: colors.light,
    fontWeight: 'bold',
  },
});

export default CameraCapture;
