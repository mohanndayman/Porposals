import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { LanguageContext } from '../../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === "ios" ? 520 : 280;

const MatchProfileSkeleton = ({ style = {} }) => {
  const { isRTL } = useContext(LanguageContext);

  return (
    <View style={[styles.container, style]}>
      {/* Header Image Skeleton */}
      <View style={styles.headerContainer}>
        <SkeletonLoader
          width="100%"
          height={HEADER_HEIGHT}
          borderRadius={0}
          style={styles.headerImage}
        />
        
        {/* Back Button Skeleton */}
        <View style={[styles.backButtonContainer, { left: isRTL ? null : 20, right: isRTL ? 20 : null }]}>
          <SkeletonLoader
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="rgba(255,255,255,0.2)"
            highlightColor="rgba(255,255,255,0.4)"
          />
        </View>

        {/* Image Indicators Skeleton */}
        <View style={styles.indicatorsContainer}>
          <SkeletonLoader width={60} height={8} borderRadius={4} backgroundColor="rgba(255,255,255,0.3)" />
        </View>

        {/* Profile Header Info Skeleton */}
        <View style={styles.profileHeaderContainer}>
          <SkeletonLoader
            width="60%"
            height={32}
            borderRadius={6}
            style={styles.nameSkeleton}
            backgroundColor="rgba(255,255,255,0.9)"
            highlightColor="rgba(255,255,255,1)"
          />
          <SkeletonLoader
            width="40%"
            height={18}
            borderRadius={4}
            style={styles.locationSkeleton}
            backgroundColor="rgba(255,255,255,0.7)"
            highlightColor="rgba(255,255,255,0.9)"
          />
          <SkeletonLoader
            width="30%"
            height={24}
            borderRadius={12}
            style={styles.matchSkeleton}
            backgroundColor="rgba(255,255,255,0.8)"
            highlightColor="rgba(255,255,255,1)"
          />
        </View>
      </View>

      {/* Content Skeleton */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Action Buttons Skeleton */}
        <View style={styles.actionButtonsContainer}>
          <SkeletonLoader
            width={120}
            height={50}
            borderRadius={25}
            style={styles.actionButton}
          />
          <SkeletonLoader
            width={120}
            height={50}
            borderRadius={25}
            style={styles.actionButton}
          />
        </View>

        {/* Info Cards Skeleton */}
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.infoCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <SkeletonLoader
                width={24}
                height={24}
                borderRadius={12}
                style={styles.cardIcon}
              />
              <SkeletonLoader
                width="40%"
                height={20}
                borderRadius={4}
                style={styles.cardTitle}
              />
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              {index === 0 && (
                // About section - paragraph text
                <>
                  <SkeletonLoader width="100%" height={16} borderRadius={3} style={styles.textLine} />
                  <SkeletonLoader width="85%" height={16} borderRadius={3} style={styles.textLine} />
                  <SkeletonLoader width="70%" height={16} borderRadius={3} style={styles.textLine} />
                  <View style={styles.infoRow}>
                    <SkeletonLoader width={16} height={16} borderRadius={8} style={styles.infoIcon} />
                    <SkeletonLoader width="60%" height={16} borderRadius={3} style={styles.infoText} />
                  </View>
                  <View style={styles.infoRow}>
                    <SkeletonLoader width={16} height={16} borderRadius={8} style={styles.infoIcon} />
                    <SkeletonLoader width="50%" height={16} borderRadius={3} style={styles.infoText} />
                  </View>
                </>
              )}
              
              {index === 1 && (
                // Interests section - chips
                <View style={styles.interestsContainer}>
                  <SkeletonLoader width={80} height={32} borderRadius={16} style={styles.interestChip} />
                  <SkeletonLoader width={90} height={32} borderRadius={16} style={styles.interestChip} />
                  <SkeletonLoader width={70} height={32} borderRadius={16} style={styles.interestChip} />
                  <SkeletonLoader width={85} height={32} borderRadius={16} style={styles.interestChip} />
                  <SkeletonLoader width={75} height={32} borderRadius={16} style={styles.interestChip} />
                </View>
              )}
              
              {index > 1 && (
                // Stats grid
                <View style={styles.statsGrid}>
                  {[1, 2, 3, 4].map((_, statIndex) => (
                    <View key={statIndex} style={styles.statItem}>
                      <SkeletonLoader width={16} height={16} borderRadius={8} style={styles.statIcon} />
                      <View style={styles.statTextContainer}>
                        <SkeletonLoader width="80%" height={14} borderRadius={3} style={styles.statLabel} />
                        <SkeletonLoader width="60%" height={16} borderRadius={3} style={styles.statValue} />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerContainer: {
    height: HEADER_HEIGHT,
    position: 'relative',
    backgroundColor: '#E1E9EE',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    zIndex: 10,
  },
  indicatorsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    alignSelf: 'center',
    zIndex: 10,
  },
  profileHeaderContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  nameSkeleton: {
    marginBottom: 8,
  },
  locationSkeleton: {
    marginBottom: 12,
  },
  matchSkeleton: {
    alignSelf: 'flex-start',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  actionButton: {
    marginHorizontal: 8,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    marginRight: 12,
  },
  cardTitle: {
    marginLeft: 4,
  },
  cardContent: {
    marginTop: 8,
  },
  textLine: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    marginBottom: 4,
  },
  statValue: {
    marginBottom: 2,
  },
});

export default MatchProfileSkeleton;