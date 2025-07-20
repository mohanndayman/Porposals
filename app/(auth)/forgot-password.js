import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { LanguageContext } from "../../contexts/LanguageContext";
import COLORS from "../../constants/colors";
import api from "../../services/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("email"); // "email" or "success"

  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);

  const validateEmail = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = t("validation.email.required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("validation.email.invalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendResetLink = async () => {
    if (!validateEmail()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const response = await api.post("/password/email", {
        email: email.trim(),
      });

      if (response.data.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setStep("success");
      } else {
        throw new Error(response.data.message || "Failed to send reset link");
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      if (error.response?.data?.errors?.email) {
        setErrors({
          email: error.response.data.errors.email[0],
        });
      } else {
        Alert.alert(
          t("auth.reset_password"),
          error.response?.data?.message || error.message || "Network error occurred"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    changeLanguage(locale === "en" ? "ar" : "en");
  };

  const inputStyle = [
    styles.input,
    isRTL && styles.inputRTL,
    errors.email && styles.inputError,
  ];

  if (step === "success") {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <LinearGradient
          colors={[COLORS.primary + "10", COLORS.secondary + "10"]}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Language Toggle */}
          <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
            <MaterialIcons name="language" size={20} color={COLORS.text} />
            <Text style={styles.languageText}>
              {locale === "en" ? "العربية" : "English"}
            </Text>
          </TouchableOpacity>

          {/* Success Content */}
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <MaterialIcons name="check-circle" size={80} color={COLORS.primary} />
            </View>
            
            <Text style={[styles.successTitle, isRTL && styles.textRTL]}>
              {t("auth.reset_link_sent")}
            </Text>
            
            <Text style={[styles.successMessage, isRTL && styles.textRTL]}>
              {t("auth.reset_password_success")}
            </Text>
            
            <Text style={[styles.emailText, isRTL && styles.textRTL]}>
              {email}
            </Text>

            {/* Action Buttons */}
            <View style={styles.successButtons}>
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(auth)/login");
                }}
              >
                <MaterialIcons name="login" size={20} color={COLORS.primary} />
                <Text style={[styles.backToLoginText, isRTL && styles.textRTL]}>
                  {t("auth.login")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetOtpButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(auth)/reset-password-otp");
                }}
              >
                <MaterialIcons name="security" size={20} color="#FFFFFF" />
                <Text style={styles.resetOtpText}>
                  {t("auth.reset_password")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[COLORS.primary + "10", COLORS.secondary + "10"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
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

        {/* Language Toggle */}
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <MaterialIcons name="language" size={20} color={COLORS.text} />
          <Text style={styles.languageText}>
            {locale === "en" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="lock-reset" size={60} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("auth.reset_password")}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t("auth.reset_password_instructions")}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t("auth.email")}
            </Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="email"
                size={20}
                color={COLORS.textSecondary}
                style={isRTL ? styles.iconRTL : styles.icon}
              />
              <TextInput
                style={inputStyle}
                placeholder={t("auth.email_placeholder")}
                value={email}
                onChangeText={(text) => {
                  setEmail(text.trim());
                  if (errors.email) setErrors({});
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textAlign={isRTL ? "right" : "left"}
                placeholderTextColor={COLORS.textSecondary}
                editable={!loading}
              />
            </View>
            {errors.email && (
              <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Send Reset Link Button */}
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendResetLink}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.sendButtonText}>
                  {t("auth.reset_link_sent")}
                </Text>
                <MaterialIcons name="send" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLoginLink}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(auth)/login");
            }}
            disabled={loading}
          >
            <MaterialIcons 
              name={isRTL ? "arrow-forward" : "arrow-back"} 
              size={16} 
              color={COLORS.primary} 
            />
            <Text style={[styles.backToLoginLinkText, isRTL && styles.textRTL]}>
              {t("auth.login")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 20,
    gap: 8,
  },
  languageText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 48,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: COLORS.text,
  },
  inputRTL: {
    textAlign: "right",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  icon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  iconRTL: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
  fieldError: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  sendButton: {
    flexDirection: "row",
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backToLoginLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  backToLoginLinkText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  emailText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
  },
  successButtons: {
    width: "100%",
    gap: 12,
  },
  backToLoginButton: {
    flexDirection: "row",
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  backToLoginText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  resetOtpButton: {
    flexDirection: "row",
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  resetOtpText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  textRTL: {
    textAlign: "right",
  },
});