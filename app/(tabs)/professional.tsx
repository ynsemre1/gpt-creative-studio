import { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { useStyleData } from "../../src/context/StyleDataProvider";
import StyleBox from "../../src/components/StyleBox";
import { useTheme } from "../../src/context/ThemeContext";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

export default function ProfessionalScreen() {
  const router = useRouter();
  const styleData = useStyleData();
  const { colors, scheme } = useTheme();
  const professionalList = styleData?.professional || [];

  const [visibleCount, setVisibleCount] = useState(16);

  const loadMore = () => {
    if (visibleCount < professionalList.length) {
      setVisibleCount((prev) => prev + 16);
    }
  };

  const handlePress = (value: string) => {
    router.push({ pathname: "/upload-image", params: { value } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.DEFAULT }]}>
      <LinearGradient
        colors={
          scheme === "dark"
            ? [colors.bg.DEFAULT, colors.primary[900]]
            : [colors.bg.DEFAULT, colors.primary[50]]
        }
        style={{ flex: 1 }}
      >
        <Animated.View entering={FadeIn.duration(250)} style={styles.headerContainer}>
          <Text style={[styles.headerText, { color: colors.text.primary }]}>
            Professional Styles
          </Text>
          <Text style={[styles.headerSubtext, { color: colors.text.secondary }]}>
            Transform your photos with professional looks
          </Text>
        </Animated.View>

        {professionalList.length > 0 ? (
          <FlatList
            data={professionalList.slice(0, visibleCount)}
            renderItem={({ item }) => (
              <StyleBox uri={item.uri} value={item.value} onPress={handlePress} />
            )}
            keyExtractor={(item, index) => `pro-${index}`}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            initialNumToRender={12}
            maxToRenderPerBatch={16}
            windowSize={7}
            removeClippedSubviews={true}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="image" size={60} color={colors.text.secondary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No professional styles available
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtext: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
  gridContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
  },
});