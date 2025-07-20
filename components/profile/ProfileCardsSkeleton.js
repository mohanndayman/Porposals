import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonLoader from '../common/SkeletonLoader';
import { LanguageContext } from '../../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const ProfileCardsSkeleton = ({ numberOfCards = 6 }) => {
  const { isRTL } = useContext(LanguageContext);

  const renderSkeletonCard = (index) => (
    <View key={index} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.headerContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* Icon skeleton */}
          <SkeletonLoader
            width={48}
            height={48}
            borderRadius={24}
            style={[styles.iconSkeleton, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]}
          />
          
          {/* Title and progress skeleton */}
          <View style={styles.titleContainer}>
            <SkeletonLoader
              width="60%"
              height={20}
              borderRadius={4}
              style={styles.titleSkeleton}
            />
            <View style={[styles.progressContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <SkeletonLoader
                width={100}
                height={6}
                borderRadius={3}
                style={styles.progressBarSkeleton}
              />
              <SkeletonLoader
                width={30}
                height={12}
                borderRadius={2}
                style={styles.progressTextSkeleton}
              />
            </View>
          </View>
          
          {/* Action button skeleton */}
          <SkeletonLoader
            width={24}
            height={24}
            borderRadius={12}
            style={[styles.actionSkeleton, { marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }]}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerSkeleton}>
        <SkeletonLoader
          width={120}
          height={120}
          borderRadius={60}
          style={styles.profileImageSkeleton}
        />
        <SkeletonLoader
          width="60%"
          height={24}
          borderRadius={4}
          style={styles.nameSkeleton}
        />
        <SkeletonLoader
          width="40%"
          height={16}
          borderRadius={3}
          style={styles.statusSkeleton}
        />
        <SkeletonLoader
          width="80%"
          height={14}
          borderRadius={3}
          style={styles.bioSkeleton}
        />
        <SkeletonLoader
          width="50%"
          height={18}
          borderRadius={4}
          style={styles.progressHeaderSkeleton}
        />
        <SkeletonLoader
          width="100%"
          height={8}
          borderRadius={4}
          style={styles.progressBarHeaderSkeleton}
        />
      </View>
      
      {/* Cards skeleton */}
      <View style={styles.cardsContainer}>
        {Array.from({ length: numberOfCards }, (_, index) => renderSkeletonCard(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerSkeleton: {
    backgroundColor: '#e1e9ee',
    padding: 20,
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
  },
  profileImageSkeleton: {
    marginBottom: 16,
  },
  nameSkeleton: {
    marginBottom: 8,
  },
  statusSkeleton: {
    marginBottom: 8,
  },
  bioSkeleton: {
    marginBottom: 16,
  },
  progressHeaderSkeleton: {
    marginBottom: 8,
  },
  progressBarHeaderSkeleton: {
    marginBottom: 16,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  cardHeader: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconSkeleton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBarSkeleton: {
    marginRight: 8,
  },
  progressTextSkeleton: {
    marginLeft: 4,
  },
  actionSkeleton: {
    opacity: 0.7,
  },
});

export default ProfileCardsSkeleton;