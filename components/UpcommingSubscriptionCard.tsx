import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Image, Text, View } from "react-native";
const UpcommingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  icon,
  currency,
}: UpcomingSubscription) => {
  return (
    <View className="upcoming-card bg-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <View className="flex-1">
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : "Expires today"}
          </Text>
        </View>
      </View>
      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default UpcommingSubscriptionCard;
