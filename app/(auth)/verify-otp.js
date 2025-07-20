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
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { verifyOTP, resendOTP, clearTempEmail, setTempEmail } from "../../store/slices/auth.slice";
import { LanguageContext } from "../../contexts/LanguageContext";
import COLORS from "../../constants/colors";

export default function VerifyOTPScreen() {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [resendCountdown, setResendCountdown] = useState(0);

  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { loading, tempEmail } = useSelector((state) => state.auth);
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);
  const params = useLocalSearchParams();

  // Get email from params or store
  const email = params.email || tempEmail;

  // Set tempEmail from route params if available
  useEffect(() => {
    const routeEmail = params.email;
    if (routeEmail) {
      dispatch(setTempEmail(routeEmail));
    }
  }, [params.email, dispatch]);

  useEffect(() => {
    // Start countdown timer if needed
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    // Auto-verify when all digits are filled
    const otpString = otp.join("");
    if (otpString.length === 6 && !loading) {
      handleVerify();
    }
  }, [otp, loading]);

  const handleOTPChange = (value, index) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors({});
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOTP = () => {
    const otpString = otp.join("");
    const newErrors = {};

    if (otpString.length !== 6) {
      newErrors.otp = t("verification.valid_code");
    }

    if (!email) {
      newErrors.email = t("verification.email_missing");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async () => {
    if (!validateOTP()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const otpString = otp.join("");
      const result = await dispatch(
        verifyOTP({ email, otp: otpString })
      ).unwrap();

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Clear tempEmail after successful verification
        dispatch(clearTempEmail());

        // Handle first time login - redirect to profile completion
        if (result.first_time_login) {
          router.replace("/(profile)/fillProfileData");
        } else {
          router.replace("/(tabs)/home");
        }
      } else {
        throw new Error(result.message || t("verification.failed"));
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrors({
        otp: error.message || t("verification.failed"),
      });
      // Clear OTP on error
      setOTP(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0 || !email) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await dispatch(resendOTP(email)).unwrap();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "✅ " + t("verification.otp_resent"),
        result.message || t("verification.new_code_sent"),
        [
          {
            text: t("common.ok"),
            style: "default",
          },
        ]
      );

      // Start countdown - 30 seconds
      setResendCountdown(30);
      // Clear current OTP
      setOTP(["", "", "", "", "", ""]);
      setErrors({});
      inputRefs.current[0]?.focus();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t("verification.resend_failed"),
        error.message || t("verification.could_not_resend")
      );
    }
  };

  const toggleLanguage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    changeLanguage(locale === "en" ? "ar" : "en");
  };

  const isOTPComplete = otp.every((digit) => digit !== "");

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
          <View style={styles.iconContainer}>
            <MaterialIcons name="verified" size={60} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("verification.verify_email")}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t("verification.enter_code")}
          </Text>
          
          {/* Email Display Card */}
          {email ? (
            <View style={styles.emailCard}>
              <MaterialIcons name="email" size={20} color={COLORS.primary} />
              <Text style={[styles.emailDisplayText, isRTL && styles.textRTL]}>
                {email}
              </Text>
            </View>
          ) : (
            <View style={styles.missingEmailCard}>
              <MaterialIcons name="warning" size={20} color={COLORS.error} />
              <Text style={[styles.missingEmailText, isRTL && styles.textRTL]}>
                {t("verification.email_missing")}
              </Text>
            </View>
          )}
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <View
            style={[
              styles.otpInputContainer,
              isRTL && styles.otpInputContainerRTL,
            ]}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
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
              />
            ))}
          </View>

          {/* Error Message */}
          {(errors.otp || errors.email) && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={16} color={COLORS.error} />
              <Text style={[styles.errorText, isRTL && styles.textRTL]}>
                {errors.otp || errors.email}
              </Text>
            </View>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOTPComplete || loading) && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={!isOTPComplete || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.verifyButtonText}>
                {t("verification.verify_button")}
              </Text>
              <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, isRTL && styles.textRTL]}>
            {t("verification.didnt_receive")}
          </Text>

          {resendCountdown > 0 ? (
            <View style={styles.countdownContainer}>
              <MaterialIcons
                name="timer"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={[styles.countdownText, isRTL && styles.textRTL]}>
                {t("verification.resend_code")} ({resendCountdown}s)
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.resendButton,
                loading && styles.resendButtonDisabled,
              ]}
              onPress={handleResendOTP}
              disabled={loading}
            >
              <Text style={[styles.resendButtonText, isRTL && styles.textRTL]}>
                {t("verification.resend_code")}
              </Text>
              <MaterialIcons name="refresh" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Back to Register */}
        <TouchableOpacity
          style={styles.backToRegister}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(auth)/register");
          }}
        >
          <MaterialIcons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={[styles.backToRegisterText, isRTL && styles.textRTL]}>
            {t("register.form.back")}
          </Text>
        </TouchableOpacity>
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
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
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
    marginTop: 40,
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
  },
  emailText: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  emailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "08",
    borderWidth: 1,
    borderColor: COLORS.primary + "20",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    gap: 10,
    alignSelf: "center",
    minWidth: "80%",
    justifyContent: "center",
  },
  emailDisplayText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
  },
  missingEmailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "08",
    borderWidth: 1,
    borderColor: COLORS.error + "20",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    gap: 10,
    alignSelf: "center",
    minWidth: "80%",
    justifyContent: "center",
  },
  missingEmailText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.error,
    textAlign: "center",
  },
  otpContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  otpInputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "10",
    padding: 12,
    borderRadius: 8,
    gap: 8,
    maxWidth: "100%",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    flex: 1,
  },
  verifyButton: {
    flexDirection: "row",
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    gap: 8,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resendButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 20,
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  backToRegister: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: "auto",
    marginBottom: 20,
  },
  backToRegisterText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  textRTL: {
    textAlign: "right",
  },
});
