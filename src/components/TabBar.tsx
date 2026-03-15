/**
 * TabBar Component
 * Bottom navigation tab bar
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface TabItem {
  id: string;
  label: string;
  icon: ImageSourcePropType;
}

interface TabBarProps {
  items: TabItem[];
  activeTabId: string;
  onTabPress: (tabId: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ items, activeTabId, onTabPress }) => {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = item.id === activeTabId;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tabItem}
            onPress={() => onTabPress(item.id)}
            activeOpacity={0.8}
          >
            <Image
              source={item.icon}
              style={[styles.icon, isActive && styles.iconActive]}
            />
            <Text style={[styles.text, isActive && styles.textActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginBottom: SPACING.xs,
    resizeMode: 'contain',
    tintColor: '#888',
  },
  iconActive: {
    tintColor: '#2D79D6',
  },
  text: {
    fontSize: FONT_SIZES.sm,
    color: '#888',
    fontWeight: FONT_WEIGHTS.normal,
  },
  textActive: {
    color: '#2D79D6',
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default TabBar;
