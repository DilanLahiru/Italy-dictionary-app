import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

const screenWidth = Dimensions.get('window').width
const isSmallDevice = screenWidth < 375
const isTablet = screenWidth >= 768

const responsiveScale = (baseValue: number): number => {
  const scale = screenWidth / 375 // Base scale at iPhone 8 width
  return Math.round(baseValue * scale)
}

// Each slide owns its own accent gradient for a distinct, story-like feel
const slides = [
  {
    id: '1',
    image: require('../assets/images/logo.png'),
    title: 'Welcome to\nItalianGo Dictionary',
    description:
      "Learn Italian with Confidence - Your Ultimate Language Companion.",
    colors: ['#f1f3f7', '#ffffff'],
  },
  {
    id: '2',
    image: require('../assets/images/slideTwo.png'),
    title: 'Learn Italian\nwith Confidence',
    description:
      "Practice words, meanings and pronunciation step by step.",
    colors: ['#f1f3f7', '#ffffff'],
  },
  {
    id: '3',
    image: require('../assets/images/slideThree.png'),
    title: 'Improve\nEvery Day',
    description:
      "Build your vocabulary with smart lessons and repetition.",
    colors: ['#f1f3f7', '#ffffff'],
  },
]

type Props = {
  onGetStart?: () => void
}

const WelcomeSlider = ({ onGetStart }: Props) => {
  const { width: deviceWidth } = useWindowDimensions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const isLastSlide = currentIndex === slides.length - 1
  const activeColors = slides[currentIndex].colors

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / deviceWidth)
    setCurrentIndex(index)
  }

  const handlePrimaryPress = () => {
    if (isLastSlide) {
      onGetStart?.()
      return
    }
    const nextIndex = currentIndex + 1
    flatListRef.current?.scrollToOffset({ offset: nextIndex * deviceWidth, animated: true })
    setCurrentIndex(nextIndex)
  }

  return (
    <LinearGradient colors={activeColors} style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safeArea}>
        {/* Story-style progress segments */}
        <View style={styles.progressRow}>
          {slides.map((_, index) => (
            <View key={index} style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: index <= currentIndex ? '100%' : '0%' },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.topBar}>
          <Text style={styles.brandText}>Italy Go</Text>
          {!isLastSlide && (
            <TouchableOpacity
              onPress={() => onGetStart?.()}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onScrollEnd}
          getItemLayout={(_, index) => ({
            length: deviceWidth,
            offset: deviceWidth * index,
            index,
          })}
          style={styles.flatList}
          renderItem={({ item }) => (
            <View style={[styles.heroZone, { width: deviceWidth }]}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </View>
          )}
        />

        {/* Floating bottom sheet */}
        <View style={styles.sheet}>
          <Text style={styles.title}>{slides[currentIndex].title}</Text>
          <Text style={styles.description}>{slides[currentIndex].description}</Text>

          <View style={styles.sheetFooter}>
            <View style={styles.dotsRow}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && [
                      styles.activeDot,
                    ],
                  ]}
                />
              ))}
            </View>

            {isLastSlide ? (
              <TouchableOpacity
                style={[styles.getStartedPill]}
                onPress={handlePrimaryPress}
                activeOpacity={0.9}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextCircle]}
                onPress={handlePrimaryPress}
                activeOpacity={0.9}
              >
                <Text style={styles.nextArrow}>→</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default WelcomeSlider

// ============================================================================
// RESPONSIVE STYLES
// ============================================================================

const getResponsiveStyles = () => {
  const imgSize = isTablet ? 280 : isSmallDevice ? 250 : 290
  const titleSize = isTablet ? 30 : isSmallDevice ? 20 : 23
  const descSize = isTablet ? 16 : isSmallDevice ? 13 : 14

  return { imgSize, titleSize, descSize }
}

const responsiveStyles = getResponsiveStyles()

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: responsiveScale(20),
    marginTop: responsiveScale(60),
    gap: responsiveScale(6),
  },
  progressTrack: {
    flex: 1,
    height: responsiveScale(4),
    borderRadius: responsiveScale(2),
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1565C0',
    borderRadius: responsiveScale(2),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveScale(20),
    paddingTop: responsiveScale(14),
  },
  brandText: {
    fontSize: responsiveScale(14),
    fontWeight: '700',
    color: '#f1f3f7',
  },
  skipText: {
    fontSize: responsiveScale(14),
    fontWeight: '600',
    color: '#1565C0',
  },
  flatList: {
    flex: 1,
  },
  heroZone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: responsiveStyles.imgSize,
    height: responsiveStyles.imgSize,
  },
  sheet: {
    backgroundColor: '#fefeff',
    borderTopLeftRadius: responsiveScale(32),
    borderTopRightRadius: responsiveScale(32),
    paddingTop: responsiveScale(28),
    paddingHorizontal: responsiveScale(24),
    paddingBottom: responsiveScale(40),
  },
  title: {
    fontSize: responsiveStyles.titleSize,
    color: 'rgba(8, 38, 121, 0.85)',
    fontWeight: 'bold',
    lineHeight: responsiveStyles.titleSize * 1.3,
    marginBottom: responsiveScale(10),
  },
  description: {
    fontSize: responsiveStyles.descSize,
    color: '#46505f',
    lineHeight: responsiveStyles.descSize * 1.5,
    marginBottom: responsiveScale(22),
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: responsiveScale(8),
    height: responsiveScale(8),
    borderRadius: responsiveScale(4),
    backgroundColor: '#a5aab1',
    marginRight: responsiveScale(6),
  },
  activeDot: {
    width: responsiveScale(20),
    backgroundColor: '#1565C0',
  },
  nextCircle: {
    width: responsiveScale(56),
    height: responsiveScale(56),
    borderRadius: responsiveScale(28),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#1565C0',
  },
  nextArrow: {
    color: '#fff',
    fontSize: responsiveScale(25),
    fontWeight: 'bold',
    marginTop: -8,
  },
  getStartedPill: {
    paddingVertical: responsiveScale(14),
    paddingHorizontal: responsiveScale(28),
    borderRadius: responsiveScale(28),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#1565C0',
  },
  getStartedText: {
    color: '#fff',
    fontSize: responsiveScale(16),
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: -2,
  },
})
