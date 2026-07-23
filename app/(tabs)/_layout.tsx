import clsx from "clsx";
import { Tabs } from "expo-router";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabs } from "../../constants/data";
import { icons } from "../../constants/icons";
import { colors, components } from "../../constants/theme";

const tabBar = components.tabBar;

const TabLayout = () => {
  const insets = useSafeAreaInsets();

  const TabIcon = ({
    focused,
    icon,
    label,
  }: TabIconProps & { label: string }) => {
    const [hasImageError, setHasImageError] = useState(false);
    const resolvedIcon = icon || icons.home;
    const fallbackGlyph = label.charAt(0).toUpperCase() || "H";

    return (
      <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          {hasImageError || !icon ? (
            <Text className="tabs-glyph text-center text-xs font-sans-bold text-white">
              {fallbackGlyph}
            </Text>
          ) : (
            <Image
              source={resolvedIcon}
              resizeMode="contain"
              className="tabs-glyph"
              onError={() => setHasImageError(true)}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} label={tab.title} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};
export default TabLayout;
