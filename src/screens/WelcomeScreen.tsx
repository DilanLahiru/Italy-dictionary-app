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
  Platform,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

/**
 * Calculate responsive dimensions based on screen size
 */
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const isSmallDevice = screenWidth < 375
const isTablet = screenWidth >= 768

/**
 * Responsive scaling function
 * Scales values proportionally based on screen width
 */
const responsiveScale = (baseValue: number): number => {
  const scale = screenWidth / 375 // Base scale at iPhone 8 width
  return Math.round(baseValue * scale)
}

const slides = [
  {
    id: '1',
    image: require('../assets/images/logo.png'),
    title: 'Welcome to\nthe ItalianGo Dictionary',
    description:
      "Learn Italian with Confidence - Your Ultimate Language Companion.",
  },
  {
    id: '2',
    image: require('../assets/images/slideTwo.png'),
    title: 'Learn Italian\nwith Confidence',
    description:
      "Practice words, meanings and pronunciation step by step.",
  },
  {
    id: '3',
    image: require('../assets/images/slideThree.png'),
    title: 'Improve Every Day',
    description:
      "Build your vocabulary with smart lessons and repetition.",
  },
]

type Props = {
  onGetStart?: () => void
}

const WelcomeSlider = ({ onGetStart }: Props) => {
  const { width: deviceWidth } = useWindowDimensions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / deviceWidth)
    setCurrentIndex(index)
  }

  return (
    <LinearGradient colors={['#FFF6E5', '#E3F2FD']} style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: deviceWidth }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onGetStart}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#1565C0', '#42A5F5']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Get Start</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  )
}

export default WelcomeSlider

// ============================================================================
// RESPONSIVE STYLES
// ============================================================================

const getResponsiveStyles = () => {
  const imgSize = isTablet ? 300 : isSmallDevice ? 140 : 180
  const titleSize = isTablet ? 32 : isSmallDevice ? 20 : 24
  const descSize = isTablet ? 16 : isSmallDevice ? 13 : 14
  const paddingTop = isTablet ? 80 : isSmallDevice ? 50 : 100
  const marginBottom = responsiveScale(30)
  const buttonHeight = responsiveScale(50)

  return {
    imgSize,
    titleSize,
    descSize,
    paddingTop,
    marginBottom,
    buttonHeight,
  }
}

const responsiveStyles = getResponsiveStyles()

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    paddingTop: responsiveStyles.paddingTop,
    paddingHorizontal: responsiveScale(15),
    justifyContent: 'flex-start',
  },
  image: {
    width: responsiveStyles.imgSize,
    height: responsiveStyles.imgSize,
    marginBottom: responsiveStyles.marginBottom,
  },
  title: {
    fontSize: responsiveStyles.titleSize,
    color: '#2986F5',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsiveScale(16),
    lineHeight: responsiveStyles.titleSize * 1.3,
  },
  description: {
    fontSize: responsiveStyles.descSize,
    color: '#222',
    textAlign: 'center',
    marginHorizontal: responsiveScale(20),
    marginBottom: responsiveScale(32),
    lineHeight: responsiveStyles.descSize * 1.5,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: responsiveScale(30),
    paddingHorizontal: responsiveScale(15),
  },
  dot: {
    width: responsiveScale(24),
    height: responsiveScale(6),
    borderRadius: responsiveScale(3),
    backgroundColor: '#E0E0E0',
    marginHorizontal: responsiveScale(4),
  },
  activeDot: {
    backgroundColor: '#111',
  },
  button: {
    width: '85%',
    alignSelf: 'center',
    borderRadius: responsiveScale(24),
    overflow: 'hidden',
    marginVertical: responsiveScale(30),
  },
  buttonGradient: {
    paddingVertical: responsiveScale(14),
    paddingHorizontal: responsiveScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: responsiveStyles.buttonHeight,
  },
  buttonText: {
    color: '#fff',
    fontSize: responsiveScale(18),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
})
