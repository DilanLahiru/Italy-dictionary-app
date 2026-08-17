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
  icon: ImageSourcePropType | string;
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
        const isTextIcon = typeof item.icon === 'string';

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tabItem}
            onPress={() => onTabPress(item.id)}
            activeOpacity={0.85}
          >
            {isTextIcon ? (
              <Text style={[styles.textIcon, isActive && styles.textIconActive]}>{item.icon}</Text>
            ) : (
              <Image
                source={item.icon}
                style={[styles.icon, isActive && styles.iconActive]}
              />
            )}
            <Text style={[styles.text, isActive && styles.textActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 86,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: SPACING.sm,
  },
  icon: {
    width: 25,
    height: 25,
    marginBottom: SPACING.xs,
    resizeMode: 'contain',
    tintColor: '#7A8898',
  },
  iconActive: {
    tintColor: '#2D7BF6',
  },
  textIcon: {
    fontSize: 28,
    lineHeight: 30,
    color: '#7A8898',
    marginBottom: SPACING.xs,
  },
  textIconActive: {
    color: '#2D7BF6',
  },
  text: {
    fontSize: FONT_SIZES.sm,
    color: '#6D7A88',
    fontWeight: FONT_WEIGHTS.medium,
  },
  textActive: {
    color: '#2D7BF6',
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default TabBar;
