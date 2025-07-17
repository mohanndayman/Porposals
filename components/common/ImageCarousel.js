import React, { useRef, useContext } from "react";
import { FlatList, Image, Dimensions, Platform } from "react-native";
import { LanguageContext } from "../../contexts/LanguageContext";

const { width } = Dimensions.get("window");

const ImageCarousel = ({ 
  photos, 
  onPageChange,
  height = Platform.OS === "ios" ? 520 : 280,
  defaultSource = require("../../assets/images/11.jpg"),
  style = {},
  ...flatListProps
}) => {
  const { isRTL } = useContext(LanguageContext);
  const flatListRef = useRef(null);

  const renderItem = ({ item }) => {
    const imageSource = item.photo_url ? { uri: item.photo_url } : item;

    return (
      <Image
        source={imageSource}
        style={{
          width,
          height,
          resizeMode: "cover",
          ...style,
        }}
        defaultSource={defaultSource}
      />
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && onPageChange) {
      onPageChange(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={photos}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      keyExtractor={(item, index) =>
        (item.photo_url ? item.photo_url : `photo-${index}`) + index.toString()
      }
      {...flatListProps}
    />
  );
};

export default ImageCarousel;