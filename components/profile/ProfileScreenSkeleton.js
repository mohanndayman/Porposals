import React, { useContext } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SkeletonLoader from '../common/SkeletonLoader';
import { LanguageContext } from '../../contexts/LanguageContext';

const ProfileScreenSkeleton = () => {
  const { isRTL } = useContext(LanguageContext);

  const renderSkeletonSection = (itemCount = 5) => (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <SkeletonLoader
          width="40%"
          height={20}
          borderRadius={4}
          style={styles.sectionTitleSkeleton}
        />
        <SkeletonLoader
          width={30}
          height={14}
          borderRadius={3}
          style={styles.progressSkeleton}
        />
      </View>

      {/* Section Items */}
      {Array.from({ length: itemCount }, (_, index) => (
        <View key={index} style={styles.profileItem}>
          <View style={[styles.itemContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <SkeletonLoader
              width={24}
              height={24}
              borderRadius={12}
              style={[styles.itemIcon, { marginRight: isRTL ? 0 : 15, marginLeft: isRTL ? 15 : 0 }]}
            />
            <View style={styles.itemTextContainer}>
              <SkeletonLoader
                width="60%"
                height={16}
                borderRadius={3}
                style={styles.itemLabel}
              />
              <SkeletonLoader
                width="80%"
                height={14}
                borderRadius={3}
                style={styles.itemValue}
              />
            </View>
            <SkeletonLoader
              width={16}
              height={16}
              borderRadius={8}
              style={styles.checkIcon}
            />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#e1e9ee', '#f0f4f7']}
          style={styles.header}
        >
          {/* Profile Dropdown Menu Skeleton */}
          <View style={[styles.topButtons, { right: isRTL ? null : 20, left: isRTL ? 20 : null }]}>
            <SkeletonLoader
              width={24}
              height={24}
              borderRadius={12}
              style={styles.dropdownSkeleton}
            />
            <SkeletonLoader
              width={24}
              height={24}
              borderRadius={12}
              style={styles.viewProfileSkeleton}
            />
          </View>

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            {/* Profile Photo */}
            <SkeletonLoader
              width={120}
              height={120}
              borderRadius={60}
              style={styles.profilePhoto}
            />
            
            {/* User Name */}
            <SkeletonLoader
              width="60%"
              height={24}
              borderRadius={4}
              style={styles.userName}
            />
            
            {/* Status Container */}
            <View style={styles.statusContainer}>
              <SkeletonLoader
                width={12}
                height={12}
                borderRadius={6}
                style={styles.statusDot}
              />
              <SkeletonLoader
                width="40%"
                height={16}
                borderRadius={3}
                style={styles.statusText}
              />
            </View>
            
            {/* Bio */}
            <SkeletonLoader
              width="80%"
              height={14}
              borderRadius={3}
              style={styles.userBio}
            />
          </View>

          {/* Progress Container */}
          <View style={styles.progressContainer}>
            <SkeletonLoader
              width="50%"
              height={18}
              borderRadius={4}
              style={styles.progressText}
            />
            <SkeletonLoader
              width="100%"
              height={8}
              borderRadius={4}
              style={styles.progressBar}
            />
          </View>
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.content}>
          {/* Basic Information */}
          {renderSkeletonSection(5)}
          
          {/* Demographics */}
          {renderSkeletonSection(6)}
          
          {/* Professional Information */}
          {renderSkeletonSection(5)}
          
          {/* Personal Details */}
          {renderSkeletonSection(7)}
          
          {/* Appearance */}
          {renderSkeletonSection(3)}
          
          {/* Lifestyle */}
          {renderSkeletonSection(6)}
          
          {/* Contact */}
          {renderSkeletonSection(1)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : -50,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    zIndex: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dropdownSkeleton: {
    marginBottom: 16,
  },
  viewProfileSkeleton: {
    opacity: 0.7,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePhoto: {
    marginBottom: 16,
  },
  userName: {
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    marginRight: 8,
  },
  statusText: {
    marginLeft: 4,
  },
  userBio: {
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  progressText: {
    marginBottom: 8,
  },
  progressBar: {
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleSkeleton: {
    flex: 1,
  },
  progressSkeleton: {
    marginLeft: 8,
    opacity: 0.7,
  },
  profileItem: {
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  itemContent: {
    alignItems: 'center',
  },
  itemIcon: {
    width: 24,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemLabel: {
    marginBottom: 4,
  },
  itemValue: {
    marginBottom: 2,
  },
  checkIcon: {
    width: 16,
    opacity: 0.6,
  },
});

export default ProfileScreenSkeleton;