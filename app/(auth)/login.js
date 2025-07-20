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
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { login } from "../../store/slices/auth.slice";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useBiometric } from "../../hooks/useBiometric";
import COLORS from "../../constants/colors";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);
  const { isBiometricEnabled, handleBiometricAuth } = useBiometric();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t("validation.email.required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("validation.email.invalid");
    }

    if (!formData.password.trim()) {
      newErrors.password = t("validation.password.required");
    } else if (formData.password.length < 6) {
      newErrors.password = t("validation.password.minLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await dispatch(login(formData)).unwrap();

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)/home");
      } else {
        throw new Error(result.message || t("auth.invalid_credentials"));
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrors({
        general: error.message || t("auth.invalid_credentials"),
      });
    }
  };

  const handleForgotPassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/forgot-password");
  };

  const toggleLanguage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    changeLanguage(locale === "en" ? "ar" : "en");
  };

  const inputStyle = (fieldName) => [
    styles.input,
    isRTL && styles.inputRTL,
    errors[fieldName] && styles.inputError,
  ];

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
        {/* Language Toggle */}
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={toggleLanguage}
        >
          <MaterialIcons name="language" size={20} color={COLORS.text} />
          <Text style={styles.languageText}>
            {locale === "en" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="favorite" size={50} color={COLORS.primary} />
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("auth.welcome_title")}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t("auth.welcome_subtitle")}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* General Error */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={16} color={COLORS.error} />
              <Text style={[styles.errorText, isRTL && styles.textRTL]}>
                {errors.general}
              </Text>
            </View>
          )}

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
                style={inputStyle("email")}
                placeholder={t("auth.email_placeholder")}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text.trim() })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textAlign={isRTL ? "right" : "left"}
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
            {errors.email && (
              <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isRTL && styles.textRTL]}>
              {t("auth.password")}
            </Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock"
                size={20}
                color={COLORS.textSecondary}
                style={isRTL ? styles.iconRTL : styles.icon}
              />
              <TextInput
                style={inputStyle("password")}
                placeholder={t("auth.password_placeholder")}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry={!showPassword}
                textAlign={isRTL ? "right" : "left"}
                placeholderTextColor={COLORS.placeholder}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={isRTL ? styles.eyeIconRTL : styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={[styles.forgotPassword, isRTL && styles.forgotPasswordRTL]}
            onPress={handleForgotPassword}
          >
            <Text style={[styles.forgotPasswordText, isRTL && styles.textRTL]}>
              {t("auth.forgot_password")}
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                {t("auth.continue_journey")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Biometric Login */}
          {isBiometricEnabled && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricAuth}
              disabled={loading}
            >
              <MaterialIcons
                name="fingerprint"
                size={24}
                color={COLORS.primary}
              />
              <Text style={[styles.biometricText, isRTL && styles.textRTL]}>
                {t("auth.sign_in_with_face_id")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sign Up Link */}
        <TouchableOpacity
          style={styles.signUpContainer}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(auth)/register");
          }}
        >
          <Text style={[styles.signUpText, isRTL && styles.textRTL]}>
            {t("auth.new_user")}{" "}
            <Text style={styles.signUpTextBold}>{t("auth.sign_up")}</Text>
          </Text>
        </TouchableOpacity>
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
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 25,
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "10",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
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
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 48,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: COLORS.text,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    transition: "all 0.2s ease",
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
  eyeIcon: {
    position: "absolute",
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  eyeIconRTL: {
    position: "absolute",
    left: 16,
    zIndex: 1,
    padding: 4,
  },
  fieldError: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordRTL: {
    alignSelf: "flex-start",
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    gap: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  biometricText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  signUpContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  signUpText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  signUpTextBold: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  textRTL: {
    textAlign: "right",
  },
});
