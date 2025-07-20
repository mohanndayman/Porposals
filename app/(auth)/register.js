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
  Modal,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";

import { register } from "../../store/slices/auth.slice";
import { LanguageContext } from "../../contexts/LanguageContext";
import COLORS from "../../constants/colors";

// Country codes data
const COUNTRY_CODES = [
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
];

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    date_of_birth: new Date(),
    gender: "",
  });
  const [selectedCountryCode, setSelectedCountryCode] = useState(COUNTRY_CODES[0]); // Default to Jordan +962
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { locale, isRTL, changeLanguage, t } = useContext(LanguageContext);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.first_name.trim()) {
        newErrors.first_name = t("validation.firstName.required");
      } else if (formData.first_name.length < 2) {
        newErrors.first_name = t("validation.firstName.minLength");
      }

      if (!formData.last_name.trim()) {
        newErrors.last_name = t("validation.lastName.required");
      } else if (formData.last_name.length < 2) {
        newErrors.last_name = t("validation.lastName.minLength");
      }

      if (!formData.gender) {
        newErrors.gender = t("validation.gender.required");
      }

      const today = new Date();
      const age = today.getFullYear() - formData.date_of_birth.getFullYear();
      if (age < 18) {
        newErrors.date_of_birth = t("profile.age_requirement_error");
      }
    }

    if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = t("validation.email.required");
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t("validation.email.invalid");
      }

      if (!formData.phone_number.trim()) {
        newErrors.phone_number = t("validation.phoneNumber.required");
      } else if (!/^[\d\s-()]+$/.test(formData.phone_number) || formData.phone_number.length < 8) {
        newErrors.phone_number = t("validation.phoneNumber.invalid");
      }

      if (!formData.password) {
        newErrors.password = t("validation.password.required");
      } else if (formData.password.length < 8) {
        newErrors.password = t("validation.password.minLength");
      }

      if (!formData.password_confirmation) {
        newErrors.password_confirmation = t("validation.passwordConfirmation.required");
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = t("validation.passwordConfirmation.match");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(2);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(1);
    setErrors({});
  };

  const handleRegister = () => {
    if (validateStep(2)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShowTerms(true);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const confirmRegistration = async () => {
    try {
      const registrationData = {
        ...formData,
        phone_number: selectedCountryCode.code + formData.phone_number,
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
      };

      const result = await dispatch(register(registrationData)).unwrap();

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowTerms(false);
        router.push({
          pathname: "/(auth)/verify-otp",
          params: { email: formData.email }
        });
      } else {
        throw new Error(result.message || t("register.registration_failed"));
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setShowTerms(false);
      
      if (error.errors) {
        setErrors(error.errors);
        if (error.errors.email) {
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
        }
      } else {
        Alert.alert(
          t("register.registration_error"),
          error.message || t("register.registration_failed")
        );
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date_of_birth: selectedDate });
    }
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

  const formatDate = (date) => {
    return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US");
  };

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
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <MaterialIcons name="language" size={20} color={COLORS.text} />
          <Text style={styles.languageText}>
            {locale === "en" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="favorite" size={50} color={COLORS.primary} />
          <Text style={[styles.title, isRTL && styles.textRTL]}>
            {t("register.welcome_title")}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
            {t("register.welcome_subtitle")}
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepContainer}>
            <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
              <Text style={[styles.stepText, currentStep >= 1 && styles.stepTextActive]}>
                1
              </Text>
            </View>
            <Text style={[styles.stepLabel, isRTL && styles.textRTL]}>
              {t("register.steps.personal_info")}
            </Text>
          </View>
          <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
          <View style={styles.stepContainer}>
            <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
              <Text style={[styles.stepText, currentStep >= 2 && styles.stepTextActive]}>
                2
              </Text>
            </View>
            <Text style={[styles.stepLabel, isRTL && styles.textRTL]}>
              {t("register.steps.security")}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {currentStep === 1 && (
            <>
              {/* First Name */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.first_name")}
                </Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="person"
                    size={20}
                    color={COLORS.textSecondary}
                    style={isRTL ? styles.iconRTL : styles.icon}
                  />
                  <TextInput
                    style={inputStyle("first_name")}
                    placeholder={t("register.first_name_placeholder")}
                    value={formData.first_name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, first_name: text })
                    }
                    textAlign={isRTL ? "right" : "left"}
                    placeholderTextColor={COLORS.placeholder}
                  />
                </View>
                {errors.first_name && (
                  <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                    {errors.first_name}
                  </Text>
                )}
              </View>

              {/* Last Name */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.last_name")}
                </Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="person-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={isRTL ? styles.iconRTL : styles.icon}
                  />
                  <TextInput
                    style={inputStyle("last_name")}
                    placeholder={t("register.last_name_placeholder")}
                    value={formData.last_name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, last_name: text })
                    }
                    textAlign={isRTL ? "right" : "left"}
                    placeholderTextColor={COLORS.placeholder}
                  />
                </View>
                {errors.last_name && (
                  <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                    {errors.last_name}
                  </Text>
                )}
              </View>

              {/* Gender */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.gender")}
                </Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      formData.gender === "male" && styles.genderButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, gender: "male" })}
                  >
                    <MaterialIcons
                      name="male"
                      size={20}
                      color={formData.gender === "male" ? "#FFFFFF" : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.genderButtonText,
                        formData.gender === "male" && styles.genderButtonTextActive,
                        isRTL && styles.textRTL,
                      ]}
                    >
                      {t("register.form.male")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      formData.gender === "female" && styles.genderButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, gender: "female" })}
                  >
                    <MaterialIcons
                      name="female"
                      size={20}
                      color={formData.gender === "female" ? "#FFFFFF" : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.genderButtonText,
                        formData.gender === "female" && styles.genderButtonTextActive,
                        isRTL && styles.textRTL,
                      ]}
                    >
                      {t("register.form.female")}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.gender && (
                  <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                    {errors.gender}
                  </Text>
                )}
              </View>

              {/* Date of Birth */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.date_of_birth")}
                </Text>
                <TouchableOpacity
                  style={[styles.datePickerButton, isRTL && styles.inputRTL, errors.date_of_birth && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color={COLORS.textSecondary}
                    style={isRTL ? styles.iconRTL : styles.icon}
                  />
                  <Text style={[styles.dateText, isRTL && styles.dateTextRTL]}>
                    {formatDate(formData.date_of_birth)}
                  </Text>
                </TouchableOpacity>
                {errors.date_of_birth && (
                  <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                    {errors.date_of_birth}
                  </Text>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.date_of_birth}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                />
              )}

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>{t("register.form.next")}</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.email")}
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
                    placeholder={t("register.email_placeholder")}
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

              {/* Phone */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.phone")}
                </Text>
                <View style={styles.phoneInputWrapper}>
                  <TouchableOpacity
                    style={[styles.countryCodePicker, errors.phone_number && styles.countryCodePickerError]}
                    onPress={() => setShowCountryPicker(true)}
                  >
                    <Text style={styles.countryFlag}>{selectedCountryCode.flag}</Text>
                    <Text style={[styles.countryCode, isRTL && styles.textRTL]}>
                      {selectedCountryCode.code}
                    </Text>
                    <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  <View style={[styles.phoneInputContainer, errors.phone_number && styles.inputError]}>
                    <TextInput
                      style={[styles.phoneInput, isRTL && styles.phoneInputRTL]}
                      placeholder="XXX XXX XXXX"
                      value={formData.phone_number}
                      onChangeText={(text) => {
                        // Remove any non-digit characters except spaces and dashes
                        const cleaned = text.replace(/[^\d\s-]/g, '');
                        setFormData({ ...formData, phone_number: cleaned });
                      }}
                      keyboardType="phone-pad"
                      textAlign={isRTL ? "right" : "left"}
                      placeholderTextColor={COLORS.placeholder}
                    />
                  </View>
                </View>
                {errors.phone_number && (
                  <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                    {errors.phone_number}
                  </Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.password")}
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
                    placeholder={t("register.password_placeholder")}
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

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isRTL && styles.textRTL]}>
                  {t("register.form.confirm_password")}
                </Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="lock-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={isRTL ? styles.iconRTL : styles.icon}
                  />
                  <TextInput
                    style={inputStyle("password_confirmation")}
                    placeholder={t("register.confirm_password_placeholder")}
                    value={formData.password_confirmation}
                    onChangeText={(text) =>
                      setFormData({ ...formData, password_confirmation: text })
                    }
                    secureTextEntry={!showConfirmPassword}
                    textAlign={isRTL ? "right" : "left"}
                    placeholderTextColor={COLORS.placeholder}
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
                {errors.password_confirmation && (
                  <Text style={[styles.fieldError, isRTL && styles.textRTL]}>
                    {errors.password_confirmation}
                  </Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <MaterialIcons name="arrow-back" size={20} color={COLORS.primary} />
                  <Text style={[styles.backButtonText, isRTL && styles.textRTL]}>
                    {t("register.form.back")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.registerButtonText}>
                      {t("register.start_journey")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Sign In Link */}
        <TouchableOpacity
          style={styles.signInContainer}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(auth)/login");
          }}
        >
          <Text style={[styles.signInText, isRTL && styles.textRTL]}>
            {t("register.already_member")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Terms Modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.termsModalContent}>
            {/* Header */}
            <View style={styles.termsModalHeader}>
              <Text style={[styles.termsModalTitle, isRTL && styles.textRTL]}>
                {t("terms.title")}
              </Text>
              <TouchableOpacity
                style={styles.termsModalCloseButton}
                onPress={() => setShowTerms(false)}
              >
                <MaterialIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Terms Content */}
            <ScrollView 
              style={styles.termsScrollView}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.termsScrollContent}
            >
              {/* Welcome Section */}
              <View style={styles.modernWelcomeContainer}>
                <View style={styles.welcomeIconWrapper}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    style={styles.welcomeIconGradient}
                  >
                    <MaterialIcons name="favorite" size={36} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text style={[styles.modernWelcomeTitle, isRTL && styles.textRTL]}>
                  {t("terms.welcome_message")}
                </Text>
                <Text style={[styles.modernWelcomeSubtitle, isRTL && styles.textRTL]}>
                  {t("terms.welcome_subtitle")}
                </Text>
              </View>

              {/* Modern Terms Sections */}
              <View style={styles.modernTermsContainer}>
                {/* Section 1: Age & Eligibility */}
                <View style={styles.modernTermsSection}>
                  <Text style={[styles.modernSectionTitle, isRTL && styles.textRTL]}>
                    {t("terms.section_1_title")}
                  </Text>
                  <View style={styles.modernSectionItems}>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_1_item_1")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_1_item_2")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Section 2: Profile Information */}
                <View style={styles.modernTermsSection}>
                  <Text style={[styles.modernSectionTitle, isRTL && styles.textRTL]}>
                    {t("terms.section_2_title")}
                  </Text>
                  <View style={styles.modernSectionItems}>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_2_item_1")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_2_item_2")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_2_item_3")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Section 3: Privacy & Data Sharing */}
                <View style={styles.modernTermsSection}>
                  <Text style={[styles.modernSectionTitle, isRTL && styles.textRTL]}>
                    {t("terms.section_3_title")}
                  </Text>
                  <View style={styles.modernSectionItems}>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_3_item_1")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_3_item_2")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_3_item_3")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_3_item_4")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Section 4: Wedding Planning */}
                <View style={styles.modernTermsSection}>
                  <Text style={[styles.modernSectionTitle, isRTL && styles.textRTL]}>
                    {t("terms.section_4_title")}
                  </Text>
                  <View style={styles.modernSectionItems}>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_4_item_1")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_4_item_2")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_4_item_3")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Section 5: Safety Guidelines */}
                <View style={styles.modernTermsSection}>
                  <Text style={[styles.modernSectionTitle, isRTL && styles.textRTL]}>
                    {t("terms.section_5_title")}
                  </Text>
                  <View style={styles.modernSectionItems}>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_5_item_1")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_5_item_2")}
                      </Text>
                    </View>
                    <View style={styles.modernTermItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={[styles.modernTermText, isRTL && styles.textRTL]}>
                        {t("terms.section_5_item_3")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Modern Agreement Section */}
              <View style={styles.modernAgreementContainer}>
                <LinearGradient
                  colors={[COLORS.primary + "08", COLORS.secondary + "08"]}
                  style={styles.modernAgreementBox}
                >
                  <View style={styles.agreementIconWrapper}>
                    <MaterialIcons name="info-outline" size={24} color={COLORS.primary} />
                  </View>
                  <Text style={[styles.modernAgreementText, isRTL && styles.textRTL]}>
                    {t("terms.agreement_message")}
                  </Text>
                </LinearGradient>
              </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.termsModalButtons}>
              <TouchableOpacity
                style={styles.modernDeclineButton}
                onPress={() => setShowTerms(false)}
              >
                <MaterialIcons name="close" size={20} color={COLORS.error} />
                <Text style={[styles.modernDeclineButtonText, isRTL && styles.textRTL]}>
                  {t("terms.decline")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modernAcceptButton}
                onPress={confirmRegistration}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.modernAcceptButtonText}>
                      {t("terms.accept")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.countryPickerModal}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isRTL && styles.textRTL]}>
                Select Country Code
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowCountryPicker(false)}
              >
                <MaterialIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    selectedCountryCode.code === item.code && styles.countryItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCountryCode(item);
                    setShowCountryPicker(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <View style={styles.countryItemContent}>
                    <Text style={[styles.countryItemName, isRTL && styles.textRTL]}>
                      {item.country}
                    </Text>
                    <Text style={[styles.countryItemCode, isRTL && styles.textRTL]}>
                      {item.code}
                    </Text>
                  </View>
                  {selectedCountryCode.code === item.code && (
                    <MaterialIcons name="check" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: 30,
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
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  stepContainer: {
    alignItems: "center",
  },
  step: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  stepTextActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  form: {
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
  },
  inputRTL: {
    textAlign: "right",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  phoneInputWrapper: {
    flexDirection: "row",
    gap: 12,
  },
  countryCodePicker: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    gap: 8,
    minWidth: 120,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  countryCodePickerError: {
    borderColor: COLORS.error,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  phoneInputContainer: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  phoneInput: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    height: "100%",
  },
  phoneInputRTL: {
    textAlign: "right",
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
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    gap: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  genderButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  genderButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  datePickerButton: {
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
    textAlign: "center",
  },
  dateTextRTL: {
    marginLeft: 0,
    marginRight: 12,
    textAlign: "center",
  },
  nextButton: {
    flexDirection: "row",
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  registerButton: {
    flex: 2,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  signInContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  textRTL: {
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  countryPickerModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + "30",
    gap: 12,
  },
  countryItemSelected: {
    backgroundColor: COLORS.primary + "10",
  },
  countryItemFlag: {
    fontSize: 24,
  },
  countryItemContent: {
    flex: 1,
  },
  countryItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 2,
  },
  countryItemCode: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  termsModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    height: "85%",
    overflow: "hidden",
    flex: 1,
  },
  termsModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: "#FFFFFF",
  },
  termsModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
  },
  termsModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  termsScrollView: {
    flex: 1,
    minHeight: 300,
  },
  termsScrollContent: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF",
  },
  modernWelcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  welcomeIconWrapper: {
    marginBottom: 16,
  },
  welcomeIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modernWelcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 32,
  },
  modernWelcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  modernTermsContainer: {
    gap: 20,
    marginBottom: 24,
  },
  modernTermsSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border + "40",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  modernSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  modernSectionItems: {
    gap: 12,
  },
  modernTermItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    flexShrink: 0,
  },
  modernTermText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    flex: 1,
    fontWeight: "400",
  },
  modernAgreementContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  modernAgreementBox: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 16,
    alignItems: "flex-start",
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + "20",
  },
  agreementIconWrapper: {
    marginTop: 2,
  },
  modernAgreementText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontWeight: "500",
  },
  termsModalButtons: {
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
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  declineButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "500",
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modernDeclineButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: COLORS.error,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.error,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  modernDeclineButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "600",
  },
  modernAcceptButton: {
    flex: 2,
    flexDirection: "row",
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  modernAcceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});