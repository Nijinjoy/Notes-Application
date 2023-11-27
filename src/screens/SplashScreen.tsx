import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { HEIGHT, WIDTH } from '../constants/Dimension'
import { mainLogo, notes } from '../assets/images'
import { useNavigation } from '@react-navigation/native'
import { Navigation } from 'react-native-navigation'

const SplashScreen = () => {
    const navigation = useNavigation()
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('HomeScreen')
        }, 2000)
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: "#615c4f" }}>
            <Image source={mainLogo} style={{ borderRadius: HEIGHT * 0.2, height: HEIGHT * 0.15, width: WIDTH * 0.25 }} />
            <Text style={{ fontSize: 24, color: 'white' }}>Shopify</Text>
            <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>Create your note at any time</Text>
        </View>
    )
}

export default SplashScreen