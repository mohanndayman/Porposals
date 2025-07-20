import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { LanguageContext } from "../../contexts/LanguageContext";
import COLORS from "../../constants/colors";

export default function IncompleteProfileMatchesScreen() {
  const { t, isRTL } = useContext(LanguageContext);

  const handleCompleteProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(profile)/fillProfileData");
  };

  const steps = [
    {
      icon: "user",
      title: t("incomplete_matches.steps.basic_info"),
      description: t("incomplete_matches.steps.basic_info_desc"),
    },
    {
      icon: "heart",
      title: t("incomplete_matches.steps.preferences"),
      description: t("incomplete_matches.steps.preferences_desc"),
    },
    {
      icon: "camera",
      title: t("incomplete_matches.steps.photos"),
      description: t("incomplete_matches.steps.photos_desc"),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[COLORS.primary + "10", COLORS.secondary + "10"]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <MaterialIcons 
            name="favorite-border" 
            size={80} 
            color={COLORS.primary} 
          />
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("incomplete_matches.title")}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t("incomplete_matches.subtitle")}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.stepsContainer}>
          <Text style={[styles.stepsTitle, isRTL && styles.textRTL]}>
            {t("incomplete_matches.steps_title")}
          </Text>
          
          {steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepIcon}>
                <Feather name={step.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, isRTL && styles.textRTL]}>
                  {step.title}
                </Text>
                <Text style={[styles.stepDescription, isRTL && styles.textRTL]}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={[styles.benefitsTitle, isRTL && styles.textRTL]}>
            {t("incomplete_matches.benefits_title")}
          </Text>
          
          <View style={styles.benefitItem}>
            <Feather name="check" size={20} color={COLORS.success} />
            <Text style={[styles.benefitText, isRTL && styles.textRTL]}>
              {t("incomplete_matches.benefits.better_matches")}
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Feather name="check" size={20} color={COLORS.success} />
            <Text style={[styles.benefitText, isRTL && styles.textRTL]}>
              {t("incomplete_matches.benefits.more_visibility")}
            </Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Feather name="check" size={20} color={COLORS.success} />
            <Text style={[styles.benefitText, isRTL && styles.textRTL]}>
              {t("incomplete_matches.benefits.trust_safety")}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleCompleteProfile}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {t("incomplete_matches.complete_profile")}
            </Text>
            <Feather 
              name={isRTL ? "arrow-left" : "arrow-right"} 
              size={20} 
              color="#fff" 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  content: {
    padding: 20,
  },
  stepsContainer: {
    marginBottom: 30,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 20,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  benefitsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
  actionButton: {
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  textRTL: {
    textAlign: "right",
  },
});