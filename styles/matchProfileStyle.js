import {
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  I18nManager,
} from "react-native";
import COLORS from "../constants/colors";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const createMatchProfileStyles = (isRTL = I18nManager.isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      overflow: "hidden",
    },
    headerGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 100,
    },
    headerContent: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
      paddingHorizontal: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      alignItems: "center",
      justifyContent: "center",
      transform: [{ scaleX: isRTL ? -1 : 1 }],
    },
    imageIndicators: {
      flexDirection: "row",
      gap: 8,
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      justifyContent: "center",
    },
    imageIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    imageIndicatorActive: {
      backgroundColor: COLORS.white,
      width: 20,
    },
    scrollView: {
      flex: 1,
      marginTop: HEADER_HEIGHT - 50,
      zIndex: 900,
    },
    scrollContent: {
      paddingTop: HEADER_HEIGHT,
    },
    content: {
      padding: 20,
      paddingTop: 0,
    },
    profileHeader: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: 20,
      marginTop: 30,
      shadowColor: COLORS.text,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
    likedProfileHeader: {
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    dislikedProfileHeader: {
      borderWidth: 2,
      borderColor: COLORS.error,
      opacity: 0.9,
    },
    nameContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
    },
    likedNameContainer: {
      backgroundColor: "rgba(237, 64, 102, 0.05)",
      borderRadius: 10,
      padding: 8,
      marginLeft: isRTL ? -8 : -8,
      marginRight: isRTL ? -8 : -8,
    },
    dislikedNameContainer: {
      backgroundColor: "rgba(255, 59, 48, 0.05)",
      borderRadius: 10,
      padding: 8,
      marginLeft: isRTL ? -8 : -8,
      marginRight: isRTL ? -8 : -8,
    },
    name: {
      fontSize: 24,
      fontWeight: "700",
      color: COLORS.text,
      textAlign: isRTL ? "right" : "left",
    },
    location: {
      fontSize: 16,
      color: COLORS.text,
      opacity: 0.7,
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    matchPercentage: {
      alignSelf: isRTL ? "flex-end" : "flex-start",
    },
    matchBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    matchText: {
      color: COLORS.white,
      fontSize: 14,
      fontWeight: "600",
    },
    actions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 12,
      marginVertical: 20,
    },
    actionButton: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 16,
      gap: 8,
      shadowColor: COLORS.text,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    primaryButton: {
      backgroundColor: COLORS.primary,
    },
    secondaryButton: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.primary,
    },
    dislikeButton: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.error,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.primary,
    },
    dislikeButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.error,
    },
    primaryButtonText: {
      color: COLORS.white,
    },
    alreadyLikedButton: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 16,
      gap: 8,
      backgroundColor: "#E0E0E0",
      overflow: "hidden",
    },
    alreadyLikedText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#9E9E9E",
    },
    alreadyDislikedButton: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 16,
      gap: 8,
      backgroundColor: COLORS.error,
      overflow: "hidden",
    },
    alreadyDislikedText: {
      fontSize: 16,
      fontWeight: "600",
      color: COLORS.white,
    },
    infoCard: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      shadowColor: COLORS.text,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
    infoCardHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    infoCardIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.primary + "20",
      alignItems: "center",
      justifyContent: "center",
    },
    infoCardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.text,
      textAlign: isRTL ? "right" : "left",
    },
    bio: {
      fontSize: 16,
      color: COLORS.text,
      lineHeight: 24,
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    basicInfo: {
      gap: 8,
    },
    infoRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
    },
    infoText: {
      fontSize: 15,
      color: COLORS.text,
      textAlign: isRTL ? "right" : "left",
    },
    interests: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: isRTL ? "flex-end" : "flex-start",
    },
    interestTag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: COLORS.primary + "15",
      borderWidth: 1,
      borderColor: COLORS.primary + "30",
    },
    interestText: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: "600",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: isRTL ? "flex-end" : "flex-start",
    },
    statItem: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
      width: "45%",
    },
    statIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: COLORS.primary + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    statContent: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: COLORS.text,
      opacity: 0.7,
      textAlign: isRTL ? "right" : "left",
    },
    statValue: {
      fontSize: 14,
      color: COLORS.text,
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    verifiedBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    premiumBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: COLORS.white,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: COLORS.primary,
    },
    likedBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    likedBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: COLORS.white,
    },
    dislikedBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: COLORS.error,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    dislikedBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: COLORS.white,
    },
    reportContainer: {
      marginTop: 20,
      marginBottom: 40,
      alignItems: "center",
    },
    reportButton: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
    },
    reportText: {
      fontSize: 14,
      color: COLORS.text,
      opacity: 0.7,
    },
    scrollableHeaderContent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: COLORS.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: COLORS.text,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.background,
      padding: 20,
    },
    errorText: {
      marginTop: 16,
      fontSize: 18,
      color: COLORS.error,
      textAlign: "center",
    },
    retryButton: {
      marginTop: 20,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: COLORS.primary,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    retryButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: COLORS.white,
      borderRadius: 20,
      padding: 20,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: COLORS.text,
      textAlign: "center",
    },
    modalText: {
      fontSize: 16,
      lineHeight: 24,
      color: COLORS.text,
      marginBottom: 20,
      textAlign: "center",
    },
    modalActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      gap: 10,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    modalCancelButton: {
      backgroundColor: "#F5F5F5",
    },
    modalConfirmButton: {
      backgroundColor: COLORS.primary,
      overflow: "hidden",
    },
    dislikeConfirmButton: {
      backgroundColor: COLORS.error,
      overflow: "hidden",
    },
    modalCancelText: {
      fontWeight: "600",
      color: COLORS.text,
    },
    modalConfirmText: {
      fontWeight: "600",
      color: COLORS.white,
    },
    successBanner: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: COLORS.success,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      gap: 12,
    },
    successBannerIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    successBannerText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.white,
      fontWeight: "500",
      textAlign: isRTL ? "right" : "left",
    },
    dislikeBanner: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: COLORS.error,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      gap: 12,
    },
    dislikeBannerIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    dislikeBannerText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.white,
      fontWeight: "500",
      textAlign: isRTL ? "right" : "left",
    },
    dislikeConfirmationContainer: {
      position: "absolute",
      top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
      left: 20,
      right: 20,
      zIndex: 1000,
    },
    dislikeConfirmationContent: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 10,
      borderLeftWidth: isRTL ? 0 : 4,
      borderRightWidth: isRTL ? 4 : 0,
      borderLeftColor: COLORS.error,
      borderRightColor: COLORS.error,
    },
    dislikeConfirmationHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    dislikeConfirmationTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: COLORS.text,
      textAlign: isRTL ? "right" : "left",
    },
    dislikeConfirmationText: {
      fontSize: 14,
      lineHeight: 20,
      color: COLORS.text,
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    dislikeConfirmationActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: isRTL ? "flex-start" : "flex-end",
      gap: 10,
    },
    dislikeConfirmationButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    dislikeConfirmationCancelButton: {
      backgroundColor: "#F5F5F5",
    },
    dislikeConfirmationConfirmButton: {
      backgroundColor: COLORS.error,
    },
    dislikeConfirmationCancelText: {
      fontWeight: "600",
      color: COLORS.text,
    },
    dislikeConfirmationConfirmText: {
      fontWeight: "600",
      color: COLORS.white,
    },
    blurryBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
    },
    reportContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    reportButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    reportButtonRTL: {
      flexDirection: "row-reverse",
    },
    reportText: {
      marginLeft: 6,
      fontSize: 14,
      color: COLORS.text,
    },
    reportTextRTL: {
      marginLeft: 0,
      marginRight: 6,
    },
    // Add these styles to your createMatchProfileStyles function
    // These are enhanced styles for your match banner

    matchedActions: {
      width: "100%", // Make it full width
      marginVertical: 20,
      padding: 24,
      borderRadius: 20,
      backgroundColor: COLORS.white,
      borderLeftWidth: isRTL ? 0 : 4,
      borderRightWidth: isRTL ? 4 : 0,
      borderLeftColor: COLORS.primary,
      borderRightColor: COLORS.primary,
      shadowColor: COLORS.text,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 8,
      overflow: "hidden", // For the confetti pattern
    },
    matchedHeaderContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    matchedHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 30,
      backgroundColor: COLORS.primary + "10", // Light tint of primary
    },
    matchedText: {
      fontSize: 22,
      fontWeight: "700",
      color: COLORS.primary,
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
      letterSpacing: 0.2,
    },
    matchedSubtext: {
      fontSize: 16,
      lineHeight: 24,
      color: COLORS.text,
      textAlign: "center",
      opacity: 0.8,
      marginTop: 10,
      marginHorizontal: 16,
    },
    confettiDot: {
      position: "absolute",
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: COLORS.primary + "30",
    },
    matchBanner: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
    },
    matchBannerGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
    },
    matchBannerText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });

export default createMatchProfileStyles;
