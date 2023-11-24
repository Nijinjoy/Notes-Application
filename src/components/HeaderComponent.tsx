import { View, Text, Image, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { cartIcon, drawerIcon } from '../assets/images'
import { HEIGHT, WIDTH } from '../constants/Dimension'
import { Navigation } from 'react-native-navigation'
import LinearGradient from 'react-native-linear-gradient'

const HeaderComponent = (props) => {
    const { title, headerIcon, navigation, tintColor, navigate, cart } = props
    return (
        <View style={{ backgroundColor: "#795b09" }}>
            <View style={{ flexDirection: "row", alignItems: 'center', height: HEIGHT * 0.1, marginTop: HEIGHT * 0.03, marginHorizontal: WIDTH * 0.04, }}>
                <Pressable onPress={navigation}>
                    <Image source={headerIcon} style={{ width: WIDTH * 0.1, height: HEIGHT * 0.07, borderRadius: HEIGHT * 0.1, tintColor: tintColor }} resizeMode='contain' />
                </Pressable>
                <Text style={{ fontWeight: "bold", fontSize: 23, color: 'white', marginLeft: WIDTH * 0.1 }}>{title}</Text>
                <Pressable style={{ marginLeft: WIDTH * 0.3 }} onPress={navigate}>
                    <Image source={cart} style={{ width: WIDTH * 0.1, height: HEIGHT * 0.04, borderRadius: 20, }} />
                </Pressable>
            </View>
        </View >
    )
}

export default HeaderComponent

{/* <View style={{ backgroundColor: "#795b09" }}>
<View style={{ flexDirection: "row", alignItems: 'center', height: HEIGHT * 0.07, marginTop: HEIGHT * 0.03, marginHorizontal: WIDTH * 0.04, }}>
    <Pressable onPress={navigation}>
        <Image source={headerIcon} style={{ width: WIDTH * 0.09, height: HEIGHT * 0.04, borderRadius: HEIGHT * 0.0, tintColor: tintColor }} resizeMode='contain' />
    </Pressable>
    <Text style={{ fontWeight: "bold", fontSize: 23, color: 'white', marginLeft: WIDTH * 0.1 }}>{title}</Text>
    <Pressable style={{ marginLeft: WIDTH * 0.4 }} onPress={navigate}>
        <Image source={cart} style={{ width: WIDTH * 0.1, height: HEIGHT * 0.04, borderRadius: 20, }} />
    </Pressable>
</View>
</View > */}

{/* <View style={{ backgroundColor: "#795b09", flexDirection: 'row', height: HEIGHT * 0.1 }}>
<Pressable style={{ flex: 0.5, marginHorizontal: WIDTH * 0.05, alignItems: 'center' }}>
    <Text>Back</Text>
</Pressable>
<Text style={{ alignSelf: "center", color: 'white' }}>Shopify</Text>
<Pressable>

</Pressable>
</View > */}
