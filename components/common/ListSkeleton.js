import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const ListItemSkeleton = ({ showAvatar = true, showSecondaryText = true }) => {
  return (
    <View style={styles.listItem}>
      {showAvatar && (
        <SkeletonLoader
          width={50}
          height={50}
          borderRadius={25}
          style={styles.avatar}
        />
      )}
      
      <View style={styles.content}>
        <SkeletonLoader
          width="70%"
          height={16}
          borderRadius={4}
          style={styles.primaryText}
        />
        
        {showSecondaryText && (
          <SkeletonLoader
            width="50%"
            height={14}
            borderRadius={3}
            style={styles.secondaryText}
          />
        )}
      </View>
      
      <SkeletonLoader
        width={20}
        height={20}
        borderRadius={4}
        style={styles.actionIcon}
      />
    </View>
  );
};

const ListSkeleton = ({ 
  itemCount = 5, 
  showAvatar = true, 
  showSecondaryText = true,
  style = {} 
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <ListItemSkeleton
          key={index}
          showAvatar={showAvatar}
          showSecondaryText={showSecondaryText}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  primaryText: {
    marginBottom: 4,
  },
  secondaryText: {
    marginBottom: 0,
  },
  actionIcon: {
    marginLeft: 12,
  },
});

export default ListSkeleton;