import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface SupportScreenProps {
  onBack?: () => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const handleContact = async () => {
    const email = 'support@italydictionaryapp.com';
    const subject = encodeURIComponent('Support Request');
    const url = `mailto:${email}?subject=${subject}`;
    await Linking.openURL(url);
  };

  const handleReportBug = async () => {
    const email = 'bugs@italydictionaryapp.com';
    const subject = encodeURIComponent('Bug Report');
    const url = `mailto:${email}?subject=${subject}`;
    await Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Need help? We're here to assist with any issues or questions about the Italy Dictionary App. Use the contact options below to reach our support team.
        </Text>

        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleContact}>
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={handleReportBug}>
          <Text style={styles.secondaryButtonText}>Report a Bug</Text>
        </TouchableOpacity>

        <Text style={styles.subheading}>Frequently Asked Questions</Text>
        <Text style={styles.paragraph}>
          For common questions and troubleshooting tips, check the FAQ section in the app documentation or reach out to support.
        </Text>

        <Text style={styles.smallNote}>Support hours: Mon–Fri, 9:00–18:00</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.MEDIUM,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: FONT_SIZES.XXL,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  content: {
    paddingHorizontal: SPACING.LARGE,
    paddingBottom: SPACING.XXXL,
  },
  paragraph: {
    color: COLORS.textDark,
    fontSize: FONT_SIZES.MEDIUM,
    marginBottom: SPACING.MEDIUM,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  buttonText: {
    color: COLORS.backgroundWhite,
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
  },
  subheading: {
    color: COLORS.textDark,
    fontSize: FONT_SIZES.LARGE,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    marginTop: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
  },
  smallNote: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZES.SMALL,
    marginTop: SPACING.LARGE,
  },
});