import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { LanguageContext } from "../../contexts/LanguageContext";
import COLORS from "../../constants/colors";

export default function TermsScreen() {
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);

  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  const handleDecline = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const toggleLanguage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    changeLanguage(locale === "en" ? "ar" : "en");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary + "10", COLORS.secondary + "10"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <MaterialIcons 
            name={isRTL ? "arrow-forward" : "arrow-back"} 
            size={24} 
            color={COLORS.text} 
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
          {t("terms.title")}
        </Text>

        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <MaterialIcons name="language" size={20} color={COLORS.text} />
          <Text style={styles.languageText}>
            {locale === "en" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <MaterialIcons name="favorite" size={48} color={COLORS.primary} />
          <Text style={[styles.welcomeText, isRTL && styles.textRTL]}>
            {t("terms.welcome_text")}
          </Text>
        </View>

        {/* Terms Sections */}
        <View style={styles.termsContainer}>
          {/* Age Requirement */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.age_requirement")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.age_18")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.age_accurate")}
            </Text>
          </View>

          {/* Profile Content */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.profile_content")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.profile_accurate")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.no_impersonation")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.no_explicit")}
            </Text>
          </View>

          {/* User Conduct */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.user_conduct")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.user_respect")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.no_harassment")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.no_sharing")}
            </Text>
          </View>

          {/* Safety Guidelines */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.safety")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.public_meeting")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.no_financial")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.report")}
            </Text>
          </View>

          {/* Privacy and Data Sharing */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.privacy")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.data_collection")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.profile_visible")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.privacy_control")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.data_sharing")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.vendor_partnerships")}
            </Text>
          </View>

          {/* Account Security */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.account_security")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.account_responsibility")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.report_unauthorized")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.no_credential_sharing")}
            </Text>
          </View>

          {/* Matrimonial Services */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.matrimonial_services")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.matchmaking")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.family_involvement")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.background_verification")}
            </Text>
          </View>

          {/* Wedding Planning Services */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.wedding_planning")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.vendor_network")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.third_party_services")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.no_liability")}
            </Text>
          </View>

          {/* Termination */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.termination")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.termination_right")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.delete_account")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.successful_match")}
            </Text>
          </View>

          {/* Updates to Terms */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t("terms.updates")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.periodic_updates")}
            </Text>
            <Text style={[styles.sectionText, isRTL && styles.textRTL]}>
              • {t("terms.continued_acceptance")}
            </Text>
          </View>
        </View>

        {/* Agreement Text */}
        <View style={styles.agreementContainer}>
          <View style={styles.agreementBox}>
            <MaterialIcons name="info" size={24} color={COLORS.primary} />
            <Text style={[styles.agreementText, isRTL && styles.textRTL]}>
              {t("terms.agreement_text")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <MaterialIcons name="close" size={20} color={COLORS.error} />
          <Text style={[styles.declineButtonText, isRTL && styles.textRTL]}>
            {t("terms.decline")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <MaterialIcons name="check" size={20} color="#FFFFFF" />
          <Text style={styles.acceptButtonText}>
            {t("terms.accept")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
  },
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
    padding: 24,
    backgroundColor: COLORS.primary + "05",
    borderRadius: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 16,
  },
  termsContainer: {
    gap: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  agreementContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  agreementBox: {
    flexDirection: "row",
    backgroundColor: COLORS.primary + "10",
    padding: 20,
    borderRadius: 12,
    alignItems: "flex-start",
    gap: 12,
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontWeight: "500",
  },
  bottomContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  declineButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "600",
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  textRTL: {
    textAlign: "right",
  },
});