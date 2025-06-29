import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchProfileCompletionData } from "../../store/slices/profileCompletionSlice";
import { COLORS } from "../../constants/colors";
import {
  isApiProfileComplete,
  isProfileEmpty,
  checkProfileCompletion,
} from "../common/profileHelpers";
import HomeScreen from "../home/HomeScreen";

const wrappedScreen = (WrappedComponent, ProfileCompletionScreen = null) => {
  return (props) => {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.profile);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      dispatch(fetchProfileCompletionData());
    }, [dispatch]);

    const isProfileComplete = () => {
      if (!data) {
        console.log("No profile data available in wrappedScreen");
        return false;
      }

      console.log("Checking profile completion in wrappedScreen...");

      const apiComplete = isApiProfileComplete(data);
      console.log("apiComplete result:", apiComplete);

      const serverProfileIsEmpty = isProfileEmpty(data);
      console.log("serverProfileIsEmpty result:", serverProfileIsEmpty);

      const { isProfileComplete: completeCheck } = checkProfileCompletion(data);
      console.log("completeCheck result:", completeCheck);

      const profileComplete =
        apiComplete ||
        completeCheck ||
        (!serverProfileIsEmpty && completeCheck);

      console.log("Final profileComplete result:", profileComplete);
      console.log(
        "Breakdown: apiComplete=",
        apiComplete,
        "completeCheck=",
        completeCheck,
        "!serverProfileIsEmpty=",
        !serverProfileIsEmpty
      );

      return profileComplete;
    };

    useEffect(() => {
      setIsLoading(false);
    }, [data]);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    if (!isProfileComplete()) {
      if (ProfileCompletionScreen) {
        return <ProfileCompletionScreen {...props} />;
      }

      return (
        <View style={styles.incompleteProfileContainer}>
          <HomeScreen />
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  incompleteProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  incompleteProfileText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.primary,
  },
});

export default wrappedScreen;
