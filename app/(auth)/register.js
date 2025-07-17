import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Alert,
} from "react-native";
import { scrollViewRtl } from "../../styles/register.styles";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { register } from "../../store/slices/auth.slice";
import { RegisterForm } from "../../components/auth/RegisterForm";
import { StepIndicator } from "../../components/auth/StepIndicator";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { registerStyles } from "../../styles/register.styles";
import { TermsModal } from "../../components/auth/TermsModal";
import { LanguageContext } from "../../contexts/LanguageContext";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import styles from "../../styles/register.styles";
const WelcomeMessage = ({ isRTL, t }) => (
  <View style={registerStyles.welcomeContainer}>
    <Text style={registerStyles.welcomeEmoji}>💝</Text>
    <Text style={[registerStyles.title, isRTL && { textAlign: "right" }]}>
      {t("register.welcome_title")}
    </Text>
    <Text style={[registerStyles.subtitle, isRTL && { textAlign: "right" }]}>
      {t("register.welcome_subtitle")}
    </Text>
  </View>
);

export default function RegisterScreen() {
  const [termsVisible, setTermsVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const form = useRegisterForm();
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);

  const handleValidationError = (error) => {
    setTermsVisible(false);

    if (error.errors) {
      const validationErrors = {};
      Object.entries(error.errors).forEach(([field, messages]) => {
        validationErrors[field] = messages[0];
      });

      form.setValidationErrorsWithAPI(validationErrors);

      // Handle specific validation errors
      if (error.errors.email) {
        const emailError = error.errors.email[0];
        const isEmailTaken =
          emailError.toLowerCase().includes("already been taken") ||
          emailError.toLowerCase().includes("already exists");

        if (isEmailTaken) {
          Alert.alert(
            t("register.registration_error"),
            "This email is already registered. Would you like to go to the login page?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Go to Login",
                onPress: () => {
                  router.push("/(auth)/login");
                },
              },
            ]
          );
        } else {
          Alert.alert(t("register.registration_error"), emailError, [
            {
              text: t("register.ok"),
              onPress: () => {
                form.goToStep(1);
              },
            },
          ]);
        }
      } else if (error.errors.phone_number) {
        const phoneError = error.errors.phone_number[0];
        Alert.alert(t("register.registration_error"), phoneError, [
          {
            text: t("register.ok"),
            onPress: () => {
              form.goToStep(1);
            },
          },
        ]);
      } else {
        // Handle other validation errors
        const firstError = Object.values(error.errors)[0][0];
        Alert.alert(t("register.registration_error"), firstError, [
          { text: t("register.ok") },
        ]);
      }
    } else {
      Alert.alert(
        t("register.registration_error"),
        error.message || t("register.registration_failed"),
        [{ text: t("register.ok") }]
      );
      form.setValidationErrorsWithAPI({
        general: error.message || t("register.registration_failed"),
      });
    }
  };

  const handleAcceptTerms = async () => {
    try {
      // Validate registration data before proceeding
      if (!registrationData || !registrationData.email) {
        console.error(
          "Registration data is missing or invalid:",
          registrationData
        );
        Alert.alert(
          t("register.registration_error"),
          "Invalid registration data. Please try again.",
          [{ text: t("register.ok") }]
        );
        setTermsVisible(false);
        setRegistrationData(null);
        return;
      }

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Registration timeout")), 30000); // 30 seconds
      });

      const registrationPromise = dispatch(register(registrationData)).unwrap();

      const result = await Promise.race([registrationPromise, timeoutPromise]);

      if (result.errors) {
        console.error(
          "Registration failed with validation errors:",
          result.errors
        );
        form.setValidationErrorsWithAPI(result.errors);
        setRegistrationData(null);

        if (result.errors.email || result.errors.phone_number) {
          form.goToStep(1);
        }

        if (result.errors.email) {
          const emailError = result.errors.email[0];
          const isEmailTaken =
            emailError.toLowerCase().includes("already been taken") ||
            emailError.toLowerCase().includes("already exists");

          if (isEmailTaken) {
            Alert.alert(
              t("register.registration_error"),
              t("register.email_already_registered"),
              [
                { text: t("register.cancel"), style: "cancel" },
                {
                  text: t("register.go_to_login"),
                  onPress: () => router.push("/(auth)/login"),
                },
              ]
            );
          } else {
            Alert.alert(t("register.registration_error"), emailError, [
              { text: t("register.ok") },
            ]);
          }
        } else if (result.errors.phone_number) {
          Alert.alert(
            t("register.registration_error"),
            result.errors.phone_number[0],
            [{ text: t("register.ok") }]
          );
        } else {
          const errorValues = Object.values(result.errors);
          const firstError =
            Array.isArray(errorValues[0]) && errorValues[0].length > 0
              ? errorValues[0][0]
              : t("register.unknown_error");

          Alert.alert(t("register.registration_error"), firstError, [
            { text: t("register.ok") },
          ]);
        }
      } else if (result.message) {
        Alert.alert(t("register.registration_error"), result.message, [
          { text: t("register.ok") },
        ]);
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error stack:", error.stack);

      if (error.message === "Registration timeout") {
        Alert.alert(
          t("register.registration_error"),
          "Registration is taking longer than expected. Please check your internet connection and try again.",
          [{ text: t("register.ok") }]
        );
      } else {
        handleValidationError(error);
      }
    }
  };

  useEffect(() => {
    return () => {
      setTermsVisible(false);
      setRegistrationData(null);
    };
  }, []);

  const handleDeclineTerms = () => {
    setTermsVisible(false);
    setRegistrationData(null);
  };

  const handleNextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    form.nextStep();
  };

  const handlePreviousStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    form.previousStep();
  };

  const handleRegister = async () => {
    if (!form.validateStep(2)) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRegistrationData(form.formData);
    setTermsVisible(true);
  };

  const toggleLanguage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    changeLanguage(locale === "en" ? "ar" : "en");
  };

  return (
    <ErrorBoundary>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={registerStyles.container}
        >
          <LinearGradient
            colors={["rgba(65, 105, 225, 0.1)", "rgba(212, 175, 55, 0.1)"]}
            style={StyleSheet.absoluteFill}
          />

          <ScrollView
            style={[registerStyles.scrollView, isRTL]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={registerStyles.scrollContent}
          >
            <WelcomeMessage isRTL={isRTL} t={t} />

            <StepIndicator currentStep={form.step} isRTL={isRTL} />

            <RegisterForm
              form={form}
              loading={loading}
              onNextStep={handleNextStep}
              onPreviousStep={handlePreviousStep}
              onSubmit={handleRegister}
              t={t}
              isRTL={isRTL}
            />

            <TouchableOpacity
              style={[
                registerStyles.loginLink,
                isRTL && { alignSelf: "flex-start" },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(auth)/login");
              }}
            >
              <Text
                style={[
                  registerStyles.loginLinkText,
                  isRTL && { textAlign: "right" },
                ]}
              >
                {t("register.already_member")}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <TermsModal
            visible={termsVisible}
            onAccept={handleAcceptTerms}
            onDecline={handleDeclineTerms}
            t={t}
            isRTL={isRTL}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ErrorBoundary>
  );
}
