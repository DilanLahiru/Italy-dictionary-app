import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  visible: boolean;
  onClose?: () => void;
};

export default function NotificationModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Notification</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>X</Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.body}>
            <Text style={styles.empty}>No Notifications</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  title: { fontSize: 20, color: '#1565C0', fontWeight: '700' },
  closeBtn: { padding: 6 },
  closeText: { color: '#E53935', fontWeight: '700', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#EEE', marginHorizontal: 12 },
  body: { height: 360, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#999' },
});
