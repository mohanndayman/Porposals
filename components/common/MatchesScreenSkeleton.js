import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import ProfileCardSkeleton from './ProfileCardSkeleton';

const { width, height } = Dimensions.get('window');

const FilterSkeleton = () => {
  return (
    <View style={styles.filterContainer}>
      <SkeletonLoader
        width="100%"
        height={50}
        borderRadius={12}
        style={styles.searchBar}
      />
      
      <View style={styles.filterRow}>
        <SkeletonLoader width={80} height={36} borderRadius={18} />
        <SkeletonLoader width={90} height={36} borderRadius={18} style={styles.filterChip} />
        <SkeletonLoader width={70} height={36} borderRadius={18} style={styles.filterChip} />
        <SkeletonLoader width={85} height={36} borderRadius={18} style={styles.filterChip} />
      </View>
    </View>
  );
};

const HeaderSkeleton = () => {
  return (
    <View style={styles.headerContainer}>
      <SkeletonLoader
        width="60%"
        height={28}
        borderRadius={6}
        style={styles.headerTitle}
      />
      
      <SkeletonLoader
        width="40%"
        height={16}
        borderRadius={4}
        style={styles.headerSubtitle}
      />
    </View>
  );
};

const MatchesScreenSkeleton = ({ showFilters = true, cardCount = 3 }) => {
  return (
    <View style={styles.container}>
      <HeaderSkeleton />
      
      {showFilters && <FilterSkeleton />}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: cardCount }).map((_, index) => (
          <ProfileCardSkeleton key={index} />
        ))}
        
        <View style={styles.bottomSpacing} />
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
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    marginBottom: 8,
  },
  headerSubtitle: {
    marginBottom: 0,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default MatchesScreenSkeleton;