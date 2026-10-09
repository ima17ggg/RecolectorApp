import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Signature from 'react-native-signature-canvas';

export default function App() {
  const [photo1, setPhoto1] = useState(null); // uri para previsualizar
  const [photo2, setPhoto2] = useState(null); // uri para previsualizar
  const [photo1B64, setPhoto1B64] = useState(null); // data URL para enviar
  const [photo2B64, setPhoto2B64] = useState(null); // data URL para enviar
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef(null);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const API_BASE = 'http://192.168.100.101:4000';

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
      if (step === 1) {
        setPhoto1(photo.uri);
        if (photo.base64) setPhoto1B64(`data:image/jpeg;base64,${photo.base64}`);
        setStep(2);
      } else {
        setPhoto2(photo.uri);
        if (photo.base64) setPhoto2B64(`data:image/jpeg;base64,${photo.base64}`);
        setStep(3);
      }
    }
  };

  if (!permission) return <Text style={styles.infoText}>Verificando permiso...</Text>;
  if (!permission.granted) return <Text style={styles.infoText}>Permiso para cámara denegado.</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      {step === 3 ? (
        <View style={[styles.container, { flex: 1 }]}>
          <Text style={styles.title}>Recolector de Fotos y Firma</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, step >= 1 && styles.progressActive]} />
            <View style={[styles.progressStep, step >= 2 && styles.progressActive]} />
            <View style={[styles.progressStep, step >= 3 && styles.progressActive]} />
            <View style={[styles.progressStep, step === 4 && styles.progressActive]} />
          </View>
          <View style={styles.signatureContainer}>
            <Text style={styles.subtitle}>Por favor, firma abajo:</Text>
            <View style={{ width: 320, height: 200, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' }}>
              <Signature
                ref={signatureRef}
                onOK={sig => {
                  setSignature(sig);
                  setStep(4);
                }}
                backgroundColor="#fff"
                penColor="#222"
                autoClear={false}
                style={{ width: 320, height: 200 }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.button, { marginRight: 10 }]}
                onPress={() => signatureRef.current?.readSignature()}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => signatureRef.current?.clearSignature()}
              >
                <Text style={styles.buttonText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Recolector de Fotos y Firma</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, step >= 1 && styles.progressActive]} />
            <View style={[styles.progressStep, step >= 2 && styles.progressActive]} />
            <View style={[styles.progressStep, step >= 3 && styles.progressActive]} />
            <View style={[styles.progressStep, step === 4 && styles.progressActive]} />
          </View>
          {step <= 2 && (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                ref={cameraRef}
              />
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.buttonText}>Tomar foto {step}</Text>
              </TouchableOpacity>
              <View style={styles.previewRow}>
                {photo1 && <Image source={{ uri: photo1 }} style={styles.thumb} />}
                {photo2 && <Image source={{ uri: photo2 }} style={styles.thumb} />}
              </View>
            </View>
          )}
          {step === 4 && (
            <View style={styles.resultContainer}>
              <Text style={styles.subtitle}>¡Fotos y firma completas!</Text>
              <Image source={{ uri: photo1 }} style={styles.preview} />
              <Image source={{ uri: photo2 }} style={styles.preview} />
              {signature && (
                <Image source={{ uri: signature }} style={styles.preview} />
              )}
              <TouchableOpacity style={styles.button} onPress={() => {
                setPhoto1(null);
                setPhoto2(null);
                setSignature(null);
                setStep(1);
              }}>
                <Text style={styles.buttonText}>Reiniciar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={async () => {
                try {
                  if (!photo1 || !photo2 || !signature) {
                    alert('Falta capturar foto(s) o firma');
                    return;
                  }
                  if (!photo1B64 || !photo2B64) {
                    alert('No se pudo obtener base64 de las fotos. Intenta volver a tomarlas.');
                    return;
                  }
                  const payload = {
                    Foto1: photo1B64,
                    Foto2: photo2B64,
                    Firma: signature.startsWith('data:') ? signature : `data:image/png;base64,${signature}`
                  };
                  const response = await fetch(`${API_BASE}/api/registros`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  const data = await response.json();
                  if (!response.ok) {
                    throw new Error(data?.error || data?.message || 'Error de servidor');
                  }
                  alert('Subido correctamente ✅');
                } catch (error) {
                  alert('Error al subir: ' + error.message);
                }
              }}>
  <Text style={styles.buttonText}>Subir Datos</Text>
</TouchableOpacity>

            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Diseño
const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#f7f7f7' },
  title: { fontSize: 26, fontWeight: 'bold', marginVertical: 20, color: '#2a2a2a' },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 10, color: '#444' },
  infoText: { marginTop: 50, fontSize: 18, color: '#888', textAlign: 'center' },
  cameraContainer: { width: '100%', alignItems: 'center', marginBottom: 20 },
  camera: { width: 320, height: 400, borderRadius: 16, overflow: 'hidden', marginBottom: 15, backgroundColor: '#000' },
  button: { backgroundColor: '#007bff', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 25, marginTop: 10, marginBottom: 10, elevation: 2 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  preview: { width: 320, height: 200, borderRadius: 12, marginVertical: 10, borderWidth: 1, borderColor: '#ddd' },
  thumb: { width: 60, height: 40, borderRadius: 6, marginHorizontal: 5, borderWidth: 1, borderColor: '#bbb' },
  previewRow: { flexDirection: 'row', marginTop: 10 },
  signatureContainer: { width: '100%', alignItems: 'center', marginVertical: 10 },
  resultContainer: { alignItems: 'center', width: '100%' },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  progressStep: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#ddd', marginHorizontal: 8 },
  progressActive: { backgroundColor: '#007bff' },
});