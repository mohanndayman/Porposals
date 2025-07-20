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

export default function IncompleteProfileSearchScreen() {
  const { t, isRTL } = useContext(LanguageContext);

  const handleCompleteProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(profile)/fillProfileData");
  };

  const searchFeatures = [
    {
      icon: "search",
      title: t("incomplete_search.features.advanced_search"),
      description: t("incomplete_search.features.advanced_search_desc"),
    },
    {
      icon: "filter",
      title: t("incomplete_search.features.smart_filters"),
      description: t("incomplete_search.features.smart_filters_desc"),
    },
    {
      icon: "target",
      title: t("incomplete_search.features.precise_matching"),
      description: t("incomplete_search.features.precise_matching_desc"),
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
            name="search" 
            size={80} 
            color={COLORS.primary} 
          />
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("incomplete_search.title")}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t("incomplete_search.subtitle")}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.messageCard}>
          <MaterialIcons name="info" size={24} color={COLORS.primary} />
          <Text style={[styles.messageText, isRTL && styles.textRTL]}>
            {t("incomplete_search.message")}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, isRTL && styles.textRTL]}>
            {t("incomplete_search.features_title")}
          </Text>
          
          {searchFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name={feature.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, isRTL && styles.textRTL]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, isRTL && styles.textRTL]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.requirementsContainer}>
          <Text style={[styles.requirementsTitle, isRTL && styles.textRTL]}>
            {t("incomplete_search.requirements_title")}
          </Text>
          
          <View style={styles.requirementItem}>
            <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.error} />
            <Text style={[styles.requirementText, isRTL && styles.textRTL]}>
              {t("incomplete_search.requirements.basic_info")}
            </Text>
          </View>
          
          <View style={styles.requirementItem}>
            <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.error} />
            <Text style={[styles.requirementText, isRTL && styles.textRTL]}>
              {t("incomplete_search.requirements.preferences")}
            </Text>
          </View>
          
          <View style={styles.requirementItem}>
            <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.error} />
            <Text style={[styles.requirementText, isRTL && styles.textRTL]}>
              {t("incomplete_search.requirements.photos")}
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
              {t("incomplete_search.complete_profile")}
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
  messageCard: {
    flexDirection: "row",
    backgroundColor: COLORS.primary + "10",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 20,
  },
  featureCard: {
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  requirementsContainer: {
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
  requirementsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  requirementText: {
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