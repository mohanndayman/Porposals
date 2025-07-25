import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";
import COLORS from "../../../constants/colors";
const LikeSuccessBanner = ({ nickname }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);
  return (
    <View style={styles.successBanner}>
      <View style={styles.successBannerIcon}>
        <Feather name="check" size={20} color={COLORS.white} />
      </View>
      <Text style={styles.successBannerText}>
        {t("match_profile.like_success_banner.message", { name: nickname })}
      </Text>
    </View>
  );
};

export default LikeSuccessBanner;
