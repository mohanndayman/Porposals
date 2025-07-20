import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { LanguageContext } from "../../contexts/LanguageContext";
import COLORS from "../../constants/colors";
import api from "../../services/api";

export default function ResetPasswordOTPScreen() {
  const [step, setStep] = useState("otp"); // "otp" or "password"
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetToken, setResetToken] = useState("");
  
  const inputRefs = useRef([]);
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);

  const handleOTPChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (errors.otp) {
      setErrors({});
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOTP = () => {
    const newErrors = {};
    const otpString = otp.join("");

    if (!email.trim()) {
      newErrors.email = t("validation.email.required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("validation.email.invalid");
    }

    if (otpString.length !== 6) {
      newErrors.otp = t("verification.valid_code");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = t("validation.password.required");
    } else if (password.length < 8) {
      newErrors.password = t("validation.password.minLength");
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = t("validation.passwordConfirmation.required");
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = t("validation.passwordConfirmation.match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const otpString = otp.join("");
      
      const response = await api.post("/password/verify-otp", {
        email: email.trim(),
        otp: otpString,
      });

      if (response.data.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setResetToken(response.data.reset_token || otpString);
        setStep("password");
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          otp: error.response?.data?.message || error.message || "Verification failed",
        });
      }
      
      setOTP(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const response = await api.post("/password/reset", {
        email: email.trim(),
        reset_token: resetToken,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        Alert.alert(
          t("auth.reset_password"),
          "Password reset successfully! Please login with your new password.",
          [
            {
              text: t("auth.login"),
              onPress: () => router.push("/(auth)/login"),
            },
          ]
        );
      } else {
        throw new Error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        Alert.alert(
          t("error.error"),
          error.response?.data?.message || error.message || "Password reset failed"
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

  const isOTPComplete = otp.every(digit => digit !== "");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={[COLORS.primary + "10", COLORS.secondary + "10"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (step === "password") {
              setStep("otp");
            } else {
              router.back();
            }
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

        {step === "otp" ? (
          <>
            {/* OTP Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="security" size={60} color={COLORS.primary} />
              </View>
              <Text style={[styles.title, isRTL && styles.textRTL]}>
                {t("auth.reset_password")}
              </Text>
              <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
                Enter the 6-digit code and your email to verify your identity
              </Text>
            </View>

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
                  style={[
                    styles.input,
                    isRTL && styles.inputRTL,
                    errors.email && styles.inputError,
                  ]}
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

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              <Text style={[styles.label, isRTL && styles.textRTL]}>
                Verification Code
              </Text>
              <View style={[styles.otpInputContainer, isRTL && styles.otpInputContainerRTL]}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={[
                      styles.otpInput,
                      errors.otp && styles.otpInputError,
                      digit && styles.otpInputFilled,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOTPChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    autoFocus={index === 0}
                    selectTextOnFocus
                    editable={!loading}
                  />
                ))}
              </View>
              {errors.otp && (
                <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                  {errors.otp}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                (!isOTPComplete || !email || loading) && styles.verifyButtonDisabled
              ]}
              onPress={handleVerifyOTP}
              disabled={!isOTPComplete || !email || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>Verify & Continue</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Password Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="lock-reset" size={60} color={COLORS.primary} />
              </View>
              <Text style={[styles.title, isRTL && styles.textRTL]}>
                Create New Password
              </Text>
              <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
                Enter your new password below
              </Text>
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
                  style={[
                    styles.input,
                    isRTL && styles.inputRTL,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="Enter new password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({});
                  }}
                  secureTextEntry={!showPassword}
                  textAlign={isRTL ? "right" : "left"}
                  placeholderTextColor={COLORS.textSecondary}
                  editable={!loading}
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isRTL && styles.textRTL]}>
                {t("auth.password_confirmation")}
              </Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={isRTL ? styles.iconRTL : styles.icon}
                />
                <TextInput
                  style={[
                    styles.input,
                    isRTL && styles.inputRTL,
                    errors.passwordConfirmation && styles.inputError,
                  ]}
                  placeholder="Confirm new password"
                  value={passwordConfirmation}
                  onChangeText={(text) => {
                    setPasswordConfirmation(text);
                    if (errors.passwordConfirmation) setErrors({});
                  }}
                  secureTextEntry={!showConfirmPassword}
                  textAlign={isRTL ? "right" : "left"}
                  placeholderTextColor={COLORS.textSecondary}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={isRTL ? styles.eyeIconRTL : styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.passwordConfirmation && (
                <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                  {errors.passwordConfirmation}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.resetButton, loading && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.resetButtonText}>Reset Password</Text>
                  <MaterialIcons name="check" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
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
    marginBottom: 30,
    marginTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
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
  otpContainer: {
    marginBottom: 30,
  },
  otpInputContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  otpInputContainerRTL: {
    flexDirection: "row-reverse",
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "05",
  },
  otpInputError: {
    borderColor: COLORS.error,
  },
  verifyButton: {
    flexDirection: "row",
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    flexDirection: "row",
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  textRTL: {
    textAlign: "right",
  },
});