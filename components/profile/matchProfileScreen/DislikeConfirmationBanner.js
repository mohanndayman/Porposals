import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";

const DislikeConfirmationBanner = ({
  visible,
  onConfirm,
  onCancel,
  nickname,
}) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(); // Call the provided confirm function
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Feather name="x-circle" size={28} color={COLORS.danger} />
            <Text style={styles.modalTitle}>{t("match_profile.dislike_confirmation.title")}</Text>
          </View>

          <Text style={styles.modalText}>
            {t("match_profile.dislike_confirmation.message", { name: nickname })}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.modalCancelText}>{t("match_profile.dislike_confirmation.cancel")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={handleConfirm}
              disabled={loading}
            >
              <LinearGradient
                colors={COLORS.dangerGradient || ["#ff6b6b", "#ff4d4d"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.modalConfirmText}>{t("match_profile.dislike_confirmation.confirm")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DislikeConfirmationBanner;
