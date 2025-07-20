import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/colors";
import { useRouter } from "expo-router";
import { matchesService } from "../../services/matchesService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useDispatch } from "react-redux";
import { likeUser } from "../../store/slices/userProfileSlice";
import {
  fetchUserLikes,
  setActiveTab,
} from "../../store/slices/userMatchesSlice";
import { showMessage } from "react-native-flash-message";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.14;
const HEADER_HEIGHT = Platform.OS === "ios" ? 100 : 80;

const LikedMeScreen = () => {
  const { isRTL } = useContext(LanguageContext);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const dispatch = useDispatch();

  const rtlStyles = useMemo(
    () => ({
      headerContent: {
        alignItems: isRTL ? "flex-end" : "flex-start",
        width: "100%",
      },
      cardInner: {
        flexDirection: isRTL ? "row-reverse" : "row",
      },
      cardImageContainer: {
        borderTopLeftRadius: isRTL ? 0 : 16,
        borderBottomLeftRadius: isRTL ? 0 : 16,
        borderTopRightRadius: isRTL ? 16 : 0,
        borderBottomRightRadius: isRTL ? 16 : 0,
      },
      profileImage: {
        borderTopLeftRadius: isRTL ? 0 : 16,
        borderBottomLeftRadius: isRTL ? 0 : 16,
        borderTopRightRadius: isRTL ? 16 : 0,
        borderBottomRightRadius: isRTL ? 16 : 0,
      },
      imageGradient: {
        borderBottomLeftRadius: isRTL ? 0 : 16,
        borderBottomRightRadius: isRTL ? 16 : 0,
      },
      likedBadge: {
        left: isRTL ? null : 8,
        right: isRTL ? 8 : null,
      },
      modalButtons: {
        flexDirection: isRTL ? "row-reverse" : "row",
      },
      cancelButton: {
        marginRight: isRTL ? 0 : 10,
        marginLeft: isRTL ? 10 : 0,
      },
      confirmButton: {
        marginLeft: isRTL ? 0 : 10,
        marginRight: isRTL ? 10 : 0,
      },
      textAlign: {
        textAlign: isRTL ? "right" : "left",
      },
    }),
    [isRTL]
  );

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const lang = (await AsyncStorage.getItem("userLanguage")) || "en";
        setCurrentLanguage(lang);
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, []);

  const fetchLikesData = useCallback(async () => {
    try {
      setError(null);
      const likesData = await matchesService.getLikes();

      const validLikes = Array.isArray(likesData)
        ? likesData.filter((item) => item && item.user)
        : [];

      setLikes(validLikes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      setError(error.message || "Error fetching likes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLikesData();
  }, [fetchLikesData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLikesData();
  }, [fetchLikesData]);

  const headerOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0.9],
        extrapolate: "clamp",
      }),
    [scrollY]
  );

  const headerTranslate = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -10],
        extrapolate: "clamp",
      }),
    [scrollY]
  );

  const handleCardPress = useCallback(
    (user) => {
      if (!user || !user.id) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({
        pathname: "/(profile)/matchProfile",
        params: {
          userId: String(user.id), // FIX: Ensure userId is a string
          fromTab: "likes",
        },
      });
    },
    [router]
  );

  const handleLikeBack = useCallback((user) => {
    if (!user || !user.id) return;

    setSelectedUser(user);
    setShowLikeModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleLikeConfirm = useCallback(async () => {
    if (!selectedUser) {
      setShowLikeModal(false);
      return;
    }

    try {
      setLikeLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const likeResponse = await dispatch(likeUser(selectedUser.id)).unwrap();

      setShowLikeModal(false);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const isMatch = likeResponse?.is_match === true;

      if (isMatch) {
        router.push({
          pathname: "/(profile)/matchProfile",
          params: {
            userId: String(selectedUser.id), // FIX: Ensure userId is a string
            fromTab: "matches",
          },
        });
      } else {
        showMessage({
          message: "Success",
          description: `You liked ${selectedUser.first_name}!`,
          type: "success",
        });

        dispatch(setActiveTab("Liked"));
        fetchLikesData();
      }
    } catch (error) {
      console.error("Error liking user:", error);

      showMessage({
        message: "Error",
        description:
          currentLanguage === "ar"
            ? "حدثت مشكلة في الإعجاب بهذا الملف الشخصي"
            : "There was a problem liking this profile",
        type: "danger",
      });
    } finally {
      setLikeLoading(false);
      setSelectedUser(null);
    }
  }, [dispatch, selectedUser, router, currentLanguage, fetchLikesData]);

  const renderProfileCard = useCallback(
    ({ item, index }) => {
      if (!item || !item.user) {
        return null;
      }

      const user = item.user;

      const gradientDirection =
        index % 3 === 0
          ? ["#8A2387", "#E94057"]
          : index % 3 === 1
          ? ["#4568DC", "#B06AB3"]
          : ["#0F2027", "#2C5364"];

      let imageUrl = "https://via.placeholder.com/500x500";
      if (user.photos && Array.isArray(user.photos) && user.photos.length > 0) {
        const mainPhoto =
          user.photos.find((photo) => photo && photo.is_main === 1) ||
          user.photos[0];
        if (mainPhoto && mainPhoto.url) {
          if (mainPhoto.url.startsWith("http")) {
            imageUrl = mainPhoto.url;
          } else {
            const baseUrl = "https://proposals.world";
            const photoPath = mainPhoto.url.startsWith("/")
              ? mainPhoto.url
              : `/${mainPhoto.url}`;
            imageUrl = `${baseUrl}${photoPath}`;
          }
        }
      }

      return (
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [-100, 0, 150 * index, 150 * (index + 1)],
                    outputRange: [1, 1, 1, 0.98],
                    extrapolate: "clamp",
                  }),
                },
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-100, 0, 150 * index, 150 * (index + 1)],
                    outputRange: [0, 0, 0, -5],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleCardPress(user)}
            activeOpacity={0.9}
            style={styles.cardTouchable}
          >
            <View style={[styles.cardInner, rtlStyles.cardInner]}>
              <View
                style={[
                  styles.cardImageContainer,
                  rtlStyles.cardImageContainer,
                ]}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={[styles.profileImage, rtlStyles.profileImage]}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={[styles.imageGradient, rtlStyles.imageGradient]}
                />
                <View style={[styles.likedBadge, rtlStyles.likedBadge]}>
                  <LinearGradient
                    colors={["#FF4D67", "#FF8A9B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.likedBadgeGradient}
                  >
                    <Text style={styles.likedBadgeText}>
                      {currentLanguage === "ar" ? "معجب بك" : "Liked You"}
                    </Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.userInfoContainer}>
                  <Text
                    style={[styles.name, rtlStyles.textAlign]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {user.first_name} {user.last_name || ""}
                  </Text>
                  {(user.age ||
                    user.location ||
                    user.city_of_residence ||
                    user.country_of_residence) && (
                    <Text
                      style={[styles.userDetails, rtlStyles.textAlign]}
                      numberOfLines={1}
                    >
                      {user.age ? `${user.age}, ` : ""}
                      {user.city_of_residence || user.location || ""}
                      {user.city_of_residence && user.country_of_residence
                        ? ", "
                        : ""}
                      {user.country_of_residence || ""}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.likeBackButton}
                  onPress={() => handleCardPress(user)}
                >
                  <LinearGradient
                    colors={gradientDirection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.likeBackGradient}
                  >
                    <Text style={styles.likeBackText}>
                      {currentLanguage === "ar"
                        ? "اذهب الى التفاصيل"
                        : "See Full Profile"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [handleCardPress, currentLanguage, scrollY]
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="dark-content"
        />

        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslate }],
            },
          ]}
        >
          <View style={[styles.headerContent, rtlStyles.headerContent]}>
            <Text
              style={[
                styles.headerTitle,
                {
                  textAlign: isRTL ? "right" : "left",
                  alignSelf: isRTL ? "flex-end" : "flex-start",
                  width: "100%",
                },
              ]}
            >
              {currentLanguage === "ar" ? "معجبون بك" : "Likes You"}
            </Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          contentContainerStyle={[
            styles.centerContent,
            {
              paddingTop: HEADER_HEIGHT + 30,
              paddingBottom: 100,
              minHeight: height * 1.1,
            },
          ]}
          showsVerticalScrollIndicator={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
              size="large" // FIX: Use string instead of number
              progressViewOffset={80}
            />
          }
        >
          {refreshing ? (
            <View
              style={{
                height: 100,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ marginTop: 10, color: "#718096", fontSize: 14 }}>
                {currentLanguage === "ar" ? "جاري التحديث..." : "Refreshing..."}
              </Text>
            </View>
          ) : null}

          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLikesData}>
            <Text style={styles.retryButtonText}>
              {currentLanguage === "ar" ? "إعادة المحاولة" : "Retry"}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              height: 80,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ color: "#718096", fontSize: 14 }}>
              {currentLanguage === "ar"
                ? "اسحب للأسفل للتحديث"
                : "Pull down to refresh"}
            </Text>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  if (!likes || likes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="dark-content"
        />

        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslate }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Text
              style={[
                styles.headerTitle,
                {
                  textAlign: isRTL ? "right" : "left",
                  alignSelf: isRTL ? "flex-end" : "flex-start",
                  width: "100%",
                },
              ]}
            >
              {currentLanguage === "ar" ? "معجبون بك" : "Likes You"}
            </Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          contentContainerStyle={[
            styles.emptyContainer,
            {
              paddingTop: HEADER_HEIGHT + 30,
              minHeight: height * 0.9,
            },
          ]}
          showsVerticalScrollIndicator={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
              size="large" // FIX: Use string instead of number
              progressViewOffset={80}
            />
          }
        >
          {refreshing ? (
            <View
              style={{
                height: 100,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ marginTop: 10, color: "#718096", fontSize: 14 }}>
                {currentLanguage === "ar" ? "جاري التحديث..." : "Refreshing..."}
              </Text>
            </View>
          ) : null}

          <View style={styles.emptyStateCard}>
            <View style={styles.emptyStateImageContainer}>
              <Image
                source={require("../../assets/images/like.png")}
                style={styles.emptyStateImage}
                resizeMode="contain"
              />
            </View>

            <Text style={[styles.emptyStateTitle, rtlStyles.textAlign]}>
              {currentLanguage === "ar"
                ? "لم يعجب بك أحد بعد"
                : "No One Liked You Yet"}
            </Text>

            <Text style={[styles.emptyStateDescription, rtlStyles.textAlign]}>
              {currentLanguage === "ar"
                ? "لا تقلق! استمر في استكشاف الملفات الشخصية واظهر شخصيتك الرائعة"
                : "Don't worry! Keep exploring profiles and showing your amazing personality"}
            </Text>

            <TouchableOpacity
              style={styles.emptyStateButton}
              // onPress={() => router.push("(tabs)/Partner")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.emptyStateButtonGradient}
              >
                <Text style={styles.emptyStateButtonText}>
                  {currentLanguage === "ar" ? "استكشف الآن" : "Start Exploring"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 80,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ color: "#718096", fontSize: 14 }}>
              {currentLanguage === "ar"
                ? "اسحب للأسفل للتحديث"
                : "Pull down to refresh"}
            </Text>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text
            style={[
              styles.headerTitle,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {currentLanguage === "ar" ? "معجبون بك" : "Likes You"}
          </Text>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={likes}
        renderItem={renderProfileCard}
        keyExtractor={
          (item) =>
            item && item.id ? String(item.id) : Math.random().toString() // FIX: Ensure key is always a string
        }
        contentContainerStyle={[
          styles.listContainer,
          { paddingTop: HEADER_HEIGHT + 30 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            size="large" // FIX: Use string instead of number
            progressViewOffset={70}
            progressBackgroundColor="#ffffff"
          />
        }
      />

      <Modal
        visible={showLikeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLikeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, rtlStyles.textAlign]}>
              {currentLanguage === "ar" ? "إعجاب متبادل" : "Like Back"}
            </Text>
            <Text style={[styles.modalText, rtlStyles.textAlign]}>
              {currentLanguage === "ar"
                ? `هل أنت متأكد أنك تريد الإعجاب بـ ${
                    selectedUser?.first_name || ""
                  }؟`
                : `Are you sure you want to like ${
                    selectedUser?.first_name || ""
                  } back?`}
            </Text>
            <View style={[styles.modalButtons, rtlStyles.modalButtons]}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  rtlStyles.cancelButton,
                ]}
                onPress={() => setShowLikeModal(false)}
                disabled={likeLoading}
              >
                <Text style={styles.cancelButtonText}>
                  {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  rtlStyles.confirmButton,
                ]}
                onPress={handleLikeConfirm}
                disabled={likeLoading}
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                {likeLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {currentLanguage === "ar" ? "نعم" : "Yes"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
    zIndex: 10,
    position: "absolute",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  headerTitle: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  card: {
    marginTop: 20,
    overflow: "visible",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0,
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardInner: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "COLORS.white",
    borderRadius: 16,
  },
  cardImageContainer: {
    width: CARD_HEIGHT,
    height: CARD_HEIGHT,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 16,
  },
  likedBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  likedBadgeGradient: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  likedBadgeText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 11,
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  userInfoContainer: {
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 3,
  },
  userDetails: {
    fontSize: 13,
    color: "#718096",
  },
  likeBackButton: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 6,
  },
  likeBackGradient: {
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  likeBackText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 13,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error || "#ff0000",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyStateContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    width: "100%",
  },
  noLikesText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
    textAlign: "center",
  },
  noLikesSubtext: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
    marginRight: 10,
  },
  confirmButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#4A5568",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyStateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  emptyStateImageContainer: {
    width: 180,
    height: 180,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateImage: {
    width: "100%",
    height: "100%",
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 12,
  },
  emptyStateDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#718096",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  emptyStateButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyStateButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
  },
  emptyStateButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});

export default memo(LikedMeScreen);
