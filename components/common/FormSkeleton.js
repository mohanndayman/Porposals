import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';

const FormFieldSkeleton = ({ showLabel = true, fieldHeight = 48 }) => {
  return (
    <View style={styles.fieldContainer}>
      {showLabel && (
        <SkeletonLoader
          width="30%"
          height={14}
          borderRadius={3}
          style={styles.label}
        />
      )}
      
      <SkeletonLoader
        width="100%"
        height={fieldHeight}
        borderRadius={8}
        style={styles.field}
      />
    </View>
  );
};

const FormSkeleton = ({ 
  fieldCount = 4, 
  showLabels = true,
  showButton = true,
  style = {} 
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: fieldCount }).map((_, index) => (
        <FormFieldSkeleton
          key={index}
          showLabel={showLabels}
          fieldHeight={index === fieldCount - 1 ? 80 : 48} // Last field taller (textarea)
        />
      ))}
      
      {showButton && (
        <SkeletonLoader
          width="100%"
          height={50}
          borderRadius={12}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  field: {
    marginBottom: 0,
  },
  button: {
    marginTop: 10,
  },
});

export default FormSkeleton;