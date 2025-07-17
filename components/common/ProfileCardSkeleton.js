import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 30;
const CARD_HEIGHT = 140;

const ProfileCardSkeleton = ({ style = {} }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.cardInner}>
        {/* Profile Image Skeleton */}
        <View style={styles.imageContainer}>
          <SkeletonLoader
            width="100%"
            height="100%"
            borderRadius={18}
          />
        </View>

        {/* Content Skeleton */}
        <View style={styles.contentContainer}>
          <View style={styles.userInfo}>
            {/* Name */}
            <SkeletonLoader
              width="70%"
              height={20}
              borderRadius={4}
              style={styles.nameSkeleton}
            />
            
            {/* Age and Location */}
            <SkeletonLoader
              width="50%"
              height={14}
              borderRadius={3}
              style={styles.detailsSkeleton}
            />
          </View>

          {/* Action Button */}
          <SkeletonLoader
            width="100%"
            height={36}
            borderRadius={12}
            style={styles.buttonSkeleton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: CARD_HEIGHT - 24,
    height: CARD_HEIGHT - 24,
    borderRadius: 18,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  nameSkeleton: {
    marginBottom: 8,
  },
  detailsSkeleton: {
    marginBottom: 4,
  },
  buttonSkeleton: {
    marginTop: 8,
  },
});

export default ProfileCardSkeleton;