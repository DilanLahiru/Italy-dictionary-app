import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../constants/colors';
import {SPACING, FONT_SIZES, FONT_WEIGHTS} from '../constants/dimensions';

interface TermsAndConditionsScreenProps {
  onBack?: () => void;
}

const TermsAndConditionsScreen: React.FC<TermsAndConditionsScreenProps> = ({
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Conditions</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          By downloading, installing, or using the Italy English Sinhala
          Dictionary App, you agree to these Terms & Conditions. If you do not
          agree, please do not use the App.
        </Text>

        <Text style={styles.subheading}>Use of the App</Text>
        <Text style={styles.paragraph}>
          The App is provided for educational and informational purposes only.
          You may use the App for personal, non-commercial use.
        </Text>

        <Text style={styles.subheading}>Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content in the App, including words, translations, text, design,
          logos, and audio (if any), is the property of the App owner and is
          protected by copyright and intellectual property laws. You may not
          copy, reproduce, distribute, or modify any content without permission.
        </Text>

        <Text style={styles.subheading}>Accuracy of Content</Text>
        <Text style={styles.paragraph}>
          We strive to provide accurate translations and meanings; however, we
          do not guarantee that all content is error-free or complete. The App
          should not be relied upon for legal, medical, or professional
          purposes.
        </Text>

        <Text style={styles.subheading}>User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You agree: Not to misuse the App Not to attempt unauthorized access or
          reverse engineering Not to use the App for illegal or harmful
          activities Internet & Third-Party Services Some features may require
          internet access. The App may include third-party services (such as ads
          or analytics), which are governed by their own terms and policies.
        </Text>

        <Text style={styles.subheading}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          We are not responsible for any direct or indirect damages arising from
          the use or inability to use the App.
        </Text>

        <Text style={styles.subheading}>Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate access to the App at any
          time without notice if these Terms are violated.
        </Text>

        <Text style={styles.subheading}>Changes to Terms</Text>
        <Text style={styles.paragraph}>
          These Terms & Conditions may be updated at any time. Continued use of
          the App means you accept the updated terms.
        </Text>

        <Text style={styles.subheading}>Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and interpreted in accordance with
          the laws of Italy and the European Union, where applicable.
        </Text>

        <Text style={styles.subheading}>Contact</Text>
        <Text style={styles.paragraph}>
          For any questions regarding these Terms & Conditions, please contact
          us via the app support page.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

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
