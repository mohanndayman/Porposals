import React, { useState } from "react";
import { View, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { Feather } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { ActivityIndicator } from "react-native";
import {
  fetchProfile,
  updateProfilePhoto,
} from "../../store/slices/profile.slice";
import { isSuccessfulResponse } from "../../utils/profile-validation";
import CircularProgress from "./CircularProgress";
const PhotoUploader = ({ currentPhotoUrl, onPhotoUpdate, onError }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localImageUri, setLocalImageUri] = useState(null);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant access to your photo library to upload photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleUpload = async (uri) => {
    setUploading(true);
    setUploadProgress(0);
    setLocalImageUri(uri);

    try {
      const formData = new FormData();
      formData.append("profile_photo", {
        uri,
        type: "image/jpeg",
        name: "profile_photo.jpg",
      });

      const response = await dispatch(
        updateProfilePhoto({
          formData,
          onProgress: (progress) => {
            setUploadProgress(progress);
          },
        })
      ).unwrap();

      if (response.success) {
        await updateProfileAndPhoto();
        Alert.alert(
          "Photo Updated",
          "Your profile photo has been successfully updated."
        );
      } else {
        setLocalImageUri(null);
        throw new Error(response.message || "Failed to update profile photo");
      }
    } catch (error) {
      setLocalImageUri(null);
      console.error("Upload error:", error);
      Alert.alert(
        "Update Failed",
        error.message || "Unable to update photo. Please try again."
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  const updateProfileAndPhoto = async () => {
    try {
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={uploading}
      style={styles.photoContainer}
      accessibilityLabel="Update profile photo"
      accessibilityHint="Double tap to choose a new profile photo"
    >
      <Image
        source={
          localImageUri
            ? { uri: localImageUri }
            : currentPhotoUrl
            ? { uri: currentPhotoUrl }
            : require("../../assets/images/avatar.jpg")
        }
        style={[styles.avatar, uploading && styles.uploadingImage]}
      />
      <View style={styles.editContainer}>
        <View style={styles.editButton}>
          <Feather name="camera" size={14} color={COLORS.white} />
        </View>
      </View>
      {uploading && (
        <View style={styles.uploadingOverlay}>
          <CircularProgress progress={uploadProgress} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    position: "relative",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  editContainer: {
    position: "absolute",
    bottom: 5,
    right: 0,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 80,
  },
  uploadingImage: {
    opacity: 0.7,
  },
});
export default PhotoUploader;
