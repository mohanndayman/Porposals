import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../constants/colors";
import createMatchProfileStyles from "../../styles/matchProfileStyle";
import { useProfileActions } from "../../components/profile/matchProfileScreen/useProfileActions";
import { useProfileData } from "../../components/profile/matchProfileScreen/useProfileData";
import ImageCarousel from "../../components/common/ImageCarousel";
import InfoCard from "../../components/profile/matchProfileScreen/InfoCard";
import LikeConfirmationModal from "../../components/profile/matchProfileScreen/LikeConfirmationModal";
import DislikeConfirmationBanner from "../../components/profile/matchProfileScreen/DislikeConfirmationBanner";
import ScrollableHeaderContent from "../../components/profile/matchProfileScreen/ScrollableHeaderContent";
import StatItem from "../../components/profile/matchProfileScreen/StatItem";
import ContactInfo from "../../components/profile/matchProfileScreen/ContactInfo";
import ProfileActions from "../../components/profile/matchProfileScreen/ProfileActions";
import MatchBanner from "../../components/profile/matchProfileScreen/MatchBanner";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ReportSection from "../../components/profile/matchProfileScreen/ReportSection";
import { useSelector, useDispatch } from "react-redux";
import { matchesService } from "../../services/matchesService";
import { setActiveTab, addMatch } from "../../store/slices/userMatchesSlice";
import { LanguageContext } from "../../contexts/LanguageContext";
import {
  revealContact,
  selectRevealedContact,
  selectIsRevealingContact,
} from "../../store/slices/subscriptionSlice";
import LikeSuccessBanner from "../../components/profile/matchProfileScreen/LikeSuccessBanner";

const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const MatchProfileScreen = () => {
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const { t, isRTL } = useContext(LanguageContext);
  const createStyles = createMatchProfileStyles;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, fromTab } = params;
  const dispatch = useDispatch();

  const [checkingMatch, setCheckingMatch] = useState(false);
  const [isMatch, setIsMatch] = useState(fromTab === "Matches");

  const revealedContact = useSelector((state) =>
    selectRevealedContact(state, userId)
  );
  const isRevealingContact = useSelector(selectIsRevealingContact);
  const { likedUsers } = useSelector((state) => state.userMatches);

  const isUserLikedInRedux =
    likedUsers && likedUsers.some((user) => user.id === userId);

  const {
    userProfile,
    profile,
    photos,
    loading,
    error,
    isDisliked,
    profileData,
  } = useProfileData(userId);

  const [hasBeenLiked, setHasBeenLiked] = useState(
    fromTab === "Liked" || isUserLikedInRedux
  );

  useEffect(() => {
    if (isUserLikedInRedux) {
      setHasBeenLiked(true);
    }
  }, [isUserLikedInRedux]);

  const {
    likeLoading,
    dislikeLoading,
    showLikeModal,
    showDislikeModal,
    handleLike,
    handleDislike,
    handleLikeConfirm,
    handleDislikeConfirm,
    setShowLikeModal,
    setShowDislikeModal,
  } = useProfileActions(userProfile, isDisliked);

  const handleRevealContact = async () => {
    try {
      await dispatch(revealContact(userId)).unwrap();
    } catch (error) {
      console.error("Error revealing contact:", error);
    }
  };

  const handleLocalLike = () => {
    handleLike();
  };

  const handleLocalLikeConfirm = async () => {
    setShowLikeModal(false);
    setCheckingMatch(true);

    try {
      await handleLikeConfirm();
      setHasBeenLiked(true);

      await matchesService.addLikedUserId(userId);
      const matchResult = await matchesService.checkForMatch(userId);

      if (
        matchResult &&
        matchResult.isMatch === true &&
        matchResult.matchData
      ) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        dispatch(addMatch(matchResult.matchData));
        setIsMatch(true);

        dispatch(setActiveTab("Matches"));
        router.replace({
          pathname: "(tabs)/matches",
          params: {
            showMatchesTab: "true",
            openMatchUserId: userId,
          },
        });

        return;
      }

      dispatch(setActiveTab("Liked"));
    } catch (error) {
      console.error("Error checking for match:", error);
    } finally {
      setCheckingMatch(false);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [HEADER_HEIGHT, 100],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  if (loading.profile && !userProfile) {
    return (
      <View style={createStyles(isRTL).loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={createStyles(isRTL).loadingText}>
          {t("match_profile.loading")}
        </Text>
      </View>
    );
  }

  if (error.profile && !userProfile) {
    return (
      <View style={createStyles(isRTL).errorContainer}>
        <Feather name="alert-circle" size={50} color={COLORS.error} />
        <Text style={createStyles(isRTL).errorText}>
          {t("match_profile.error")}
        </Text>
        <TouchableOpacity
          style={createStyles(isRTL).retryButton}
          onPress={() => dispatch(fetchUserProfile(userId))}
        >
          <Text style={createStyles(isRTL).retryButtonText}>
            {t("match_profile.retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) return null;

  const { firstName, fullName, age, city, bio, interests, stats, nickname } =
    profileData;

  const getStatLabel = (key) => {
    return t(`match_profile.stats.${key}`);
  };

  const translationKeys = {
    phone: t("match_profile.phone"),
    email: t("match_profile.email"),
    revealContact: t("match_profile.reveal_contact"),
    matched: t("match_profile.matched"),
    matchDescription: t("match_profile.match_description"),
    liked: t("match_profile.liked"),
    like: t("match_profile.like"),
    dislike: t("match_profile.dislike"),
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={createStyles(isRTL).container}>
        <LoadingSpinner
          visible={checkingMatch}
          message={t("match_profile.checking_match")}
        />

        <DislikeConfirmationBanner
          visible={showDislikeModal}
          onConfirm={handleDislikeConfirm}
          onCancel={() => setShowDislikeModal(false)}
          nickname={nickname}
          isLoading={dislikeLoading}
        />

        <LikeConfirmationModal
          visible={showLikeModal}
          onConfirm={handleLocalLikeConfirm}
          onCancel={() => setShowLikeModal(false)}
          nickname={nickname}
        />

        <Animated.View
          style={[createStyles(isRTL).header, { height: headerHeight }]}
        >
          <Animated.View style={{ opacity: imageOpacity }}>
            <ImageCarousel
              photos={photos}
              onPageChange={setCurrentImageIndex}
            />
          </Animated.View>

          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "transparent"]}
            style={createStyles(isRTL).headerGradient}
          >
            <View style={createStyles(isRTL).headerContent}>
              <TouchableOpacity
                style={createStyles(isRTL).backButton}
                onPress={handleBack}
              >
                <Feather
                  name={isRTL ? "arrow-right" : "arrow-left"}
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <View style={createStyles(isRTL).imageIndicators}>
                {photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      createStyles(isRTL).imageIndicator,
                      currentImageIndex === index &&
                        createStyles(isRTL).imageIndicatorActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </LinearGradient>

          <ScrollableHeaderContent
            scrollY={scrollY}
            userProfile={userProfile}
          />
        </Animated.View>

        <View
          style={createStyles(isRTL).scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={createStyles(isRTL).content}>
            {isMatch && <MatchBanner userName={firstName} isVisible={true} />}

            {hasBeenLiked && !isMatch && (
              <LikeSuccessBanner nickname={nickname} />
            )}

            <View
              style={[
                createStyles(isRTL).profileHeader,
                hasBeenLiked && createStyles(isRTL).likedProfileHeader,
              ]}
            >
              <View
                style={[
                  createStyles(isRTL).nameContainer,
                  hasBeenLiked && createStyles(isRTL).likedNameContainer,
                ]}
              >
                <Text style={createStyles(isRTL).name}>
                  {nickname}
                  {age ? `, ${age}` : ""}
                </Text>

                {userProfile.verified && (
                  <View style={createStyles(isRTL).verifiedBadge}>
                    <Feather name="check" size={12} color={COLORS.white} />
                  </View>
                )}

                {userProfile.premium && (
                  <View style={createStyles(isRTL).premiumBadge}>
                    <Feather name="star" size={12} color={COLORS.primary} />
                  </View>
                )}

                {hasBeenLiked && !isMatch && (
                  <View style={createStyles(isRTL).likedBadge}>
                    <Feather name="heart" size={12} color={COLORS.white} />
                    <Text style={createStyles(isRTL).likedBadgeText}>
                      {t("match_profile.liked")}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={createStyles(isRTL).location}>{city}</Text>

              {userProfile.match_percentage && (
                <View style={createStyles(isRTL).matchPercentage}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={createStyles(isRTL).matchBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={createStyles(isRTL).matchText}>
                      {userProfile.match_percentage}%{" "}
                      {t("match_profile.match_percentage")}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>

            <ProfileActions
              isMatch={isMatch}
              hasBeenLiked={hasBeenLiked}
              onLike={handleLocalLike}
              onDislike={handleDislike}
              isLikeLoading={likeLoading}
              isDislikeLoading={dislikeLoading}
              translations={translationKeys}
              styles={createStyles(isRTL)}
            />

            <InfoCard title={t("match_profile.about")} icon="user">
              <Text style={createStyles(isRTL).bio}>{bio}</Text>
              <View style={createStyles(isRTL).basicInfo}>
                {profile.job_title && (
                  <View style={createStyles(isRTL).infoRow}>
                    <Feather
                      name="briefcase"
                      size={16}
                      color={COLORS.primary}
                    />
                    <Text style={createStyles(isRTL).infoText}>
                      {profile.job_title}
                      {profile.position_level
                        ? ` (${profile.position_level})`
                        : ""}
                    </Text>
                  </View>
                )}

                {profile.educational_level && (
                  <View style={createStyles(isRTL).infoRow}>
                    <Feather name="book" size={16} color={COLORS.primary} />
                    <Text style={createStyles(isRTL).infoText}>
                      {profile.educational_level}
                      {profile.specialization
                        ? `, ${profile.specialization}`
                        : ""}
                    </Text>
                  </View>
                )}
              </View>
            </InfoCard>

            {interests && interests.length > 0 && (
              <InfoCard title={t("match_profile.interests")} icon="heart">
                <View style={createStyles(isRTL).interests}>
                  {interests.map((interest, index) => (
                    <View key={index} style={createStyles(isRTL).interestTag}>
                      <Text style={createStyles(isRTL).interestText}>
                        {typeof interest === "string"
                          ? interest
                          : interest.name || "Interest"}
                      </Text>
                    </View>
                  ))}
                </View>
              </InfoCard>
            )}

            <InfoCard title={t("match_profile.basic_info")} icon="info">
              <View style={createStyles(isRTL).statsGrid}>
                {Object.entries(stats).map(([key, value]) => {
                  if (!value) return null;

                  const icons = {
                    height: "maximize-2",
                    weight: "cloud",
                    marital_status: "user",
                    children: "users",
                    smoking: "x-circle",
                    drinking: "coffee",
                    employment: "briefcase",
                    education: "book",
                    religion: "heart",
                    zodiac: "star",
                    sports: "activity",
                    sleep: "moon",
                  };

                  return (
                    <StatItem
                      key={key}
                      label={getStatLabel(key)}
                      value={value}
                      icon={icons[key]}
                    />
                  );
                })}

                {profile.pets && profile.pets.length > 0 && (
                  <StatItem
                    label={t("match_profile.stats.pets")}
                    value={profile.pets.join(", ")}
                    icon="github"
                  />
                )}
              </View>
            </InfoCard>

            {/* Additional Personal Details */}
            <InfoCard title={t("match_profile.personal_details")} icon="user">
              <View style={createStyles(isRTL).statsGrid}>
                {profile.nationality && (
                  <StatItem
                    label={t("match_profile.nationality")}
                    value={profile.nationality}
                    icon="flag"
                  />
                )}

                {profile.origin && (
                  <StatItem
                    label={t("match_profile.origin")}
                    value={profile.origin}
                    icon="map-pin"
                  />
                )}

                {profile.language && (
                  <StatItem
                    label={t("match_profile.language")}
                    value={profile.language}
                    icon="message-circle"
                  />
                )}

                {profile.city_location && (
                  <StatItem
                    label={t("match_profile.area")}
                    value={profile.city_location}
                    icon="navigation"
                  />
                )}

                {profile.skin_color && (
                  <StatItem
                    label={t("match_profile.skin_color")}
                    value={profile.skin_color}
                    icon="circle"
                  />
                )}

                {profile.hair_color && (
                  <StatItem
                    label={t("match_profile.hair_color")}
                    value={profile.hair_color}
                    icon="user"
                  />
                )}

                {profile.eye_color && (
                  <StatItem
                    label={t("match_profile.eye_color")}
                    value={profile.eye_color}
                    icon="eye"
                  />
                )}

                {profile.hijab_status !== null && (
                  <StatItem
                    label={t("match_profile.hijab_status")}
                    value={profile.hijab_status ? "Yes" : "No"}
                    icon="user"
                  />
                )}
              </View>
            </InfoCard>

            {/* Religious & Lifestyle Details */}
            <InfoCard
              title={t("match_profile.religious_lifestyle")}
              icon="heart"
            >
              <View style={createStyles(isRTL).statsGrid}>
                {profile.religion_level && (
                  <StatItem
                    label={t("match_profile.religion_level")}
                    value={profile.religion_level}
                    icon="heart"
                  />
                )}

                {profile.religiosity_level && (
                  <StatItem
                    label={t("match_profile.religiosity_level")}
                    value={profile.religiosity_level}
                    icon="star"
                  />
                )}

                {profile.smoking_tools && profile.smoking_tools.length > 0 && (
                  <StatItem
                    label={t("match_profile.smoking_tools")}
                    value={profile.smoking_tools.join(", ")}
                    icon="minus-circle"
                  />
                )}

                {profile.social_media_presence && (
                  <StatItem
                    label={t("match_profile.social_media")}
                    value={profile.social_media_presence}
                    icon="smartphone"
                  />
                )}
              </View>
            </InfoCard>

            {/* Financial & Living Situation */}
            <InfoCard title={t("match_profile.financial_living")} icon="home">
              <View style={createStyles(isRTL).statsGrid}>
                {profile.financial_status && (
                  <StatItem
                    label={t("match_profile.financial_status")}
                    value={profile.financial_status}
                    icon="dollar-sign"
                  />
                )}

                {profile.housing_status && (
                  <StatItem
                    label={t("match_profile.housing_status")}
                    value={profile.housing_status}
                    icon="home"
                  />
                )}

                {profile.car_ownership !== null && (
                  <StatItem
                    label={t("match_profile.car_ownership")}
                    value={profile.car_ownership === 1 ? "Yes" : "No"}
                    icon="truck"
                  />
                )}

                {profile.marriage_budget && (
                  <StatItem
                    label={t("match_profile.marriage_budget")}
                    value={profile.marriage_budget}
                    icon="dollar-sign"
                  />
                )}
              </View>
            </InfoCard>

            {isMatch && (
              <InfoCard title={t("match_profile.contact_info")} icon="phone">
                <ContactInfo
                  isRevealed={!!revealedContact}
                  contactData={{
                    phone: revealedContact?.guardian_contact || "",
                    email: profile.email || "",
                  }}
                  onReveal={handleRevealContact}
                  isLoading={isRevealingContact}
                  style={createStyles(isRTL).contactInfo}
                  translations={translationKeys}
                />
              </InfoCard>
            )}

            <ReportSection
              userName={firstName}
              userId={userId}
              isRTL={isRTL}
              styles={createStyles(isRTL)}
              onReportPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setReportModalVisible(true);
              }}
              reportModalVisible={reportModalVisible}
              onCloseReportModal={() => setReportModalVisible(false)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchProfileScreen;
