import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface PrivacyPolicyScreenProps {
  onBack?: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          Your privacy is important to us. This Privacy Policy explains how the Italy English Sinhala Dictionary App handles user information.
        </Text>

        <Text style={styles.subheading}>Information Collection</Text>
        <Text style={styles.paragraph}>
          We do not collect, store, or share any personally identifiable information such as your name, email address, phone number, or location.
        </Text>

        <Text style={styles.subheading}>App Usage Data</Text>
        <Text style={styles.paragraph}>
          The App may collect *non-personal and anonymous data* (such as app performance or crash reports) only to improve app stability and user experience.
        </Text>

        <Text style={styles.subheading}>Internet Access</Text>
        <Text style={styles.paragraph}>
          The App may require internet access for features such as updates, pronunciation audio, or ads (if applicable). No personal data is transmitted.
        </Text>

        <Text style={styles.subheading}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          The App may use third-party services (such as analytics or advertising providers) that may collect anonymous usage data in accordance with their own privacy policies.
        </Text>

        <Text style={styles.subheading}>Children’s Privacy</Text>
        <Text style={styles.paragraph}>
          We take reasonable measures to protect the App from unauthorized access or misuse.
        </Text>

        <Text style={styles.subheading}>Data Security</Text>
        <Text style={styles.paragraph}>
          This App is safe for all ages. We do not knowingly collect any data from children under 13.
        </Text>

        <Text style={styles.subheading}>Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          This Privacy Policy may be updated from time to time. Any changes will be reflected within the App.
        </Text>

        <Text style={styles.subheading}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us via the app support page.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;

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
    marginTop: 10,
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
    marginBottom: SPACING.XXL,
  },
});