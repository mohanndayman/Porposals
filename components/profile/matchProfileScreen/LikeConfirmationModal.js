import React, { useContext } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { StyleSheet } from "react-native";

const LikeConfirmationModal = ({ visible, onConfirm, onCancel, nickname }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);
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
            <Feather name="heart" size={28} color={COLORS.primary} />
            <Text style={styles.modalTitle}>{t("match_profile.like_confirmation.title")}</Text>
          </View>

          <Text style={styles.modalText}>
            {t("match_profile.like_confirmation.message", { name: nickname })}
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.modalCancelText}>{t("match_profile.like_confirmation.cancel")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={onConfirm}
            >
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={styles.modalConfirmText}>{t("match_profile.like_confirmation.confirm")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LikeConfirmationModal;
