import { View, Text, FlatList, Image, Pressable } from 'react-native'
import Realm from "realm";
import React, { useEffect, useState } from 'react'
import { createRealmContext } from '@realm/react';
import HeaderComponent from '../components/HeaderComponent';
import { HEIGHT, WIDTH } from '../constants/Dimension';
import { burgerIcon, cartIcon, emptyCart, flipkart, mainLogo, pencil } from '../assets/images';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

class Product extends Realm.Object {
    static schema = {
        name: 'Product',
        properties: {
            _id: 'objectId',
            product_name: 'string',
            price: 'double',
            count: 'int',
            description: 'string',
        },
        primaryKey: '_id',
    };
}

const realmConfig = {
    schema: [Product],
};

const HomeScreen = ({ route }) => {
    const navigation = useNavigation()
    const [products, setProducts] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [route.params])
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData()
        });
        return unsubscribe
    }, [navigation])

    const fetchData = async () => {
        try {
            const realm = await Realm.open(realmConfig)
            const productList = realm.objects('Product')
            setProducts([...productList])
        } catch (error) {
            console.log('Error while opening realm', error);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#faf5f2' }}>
            <HeaderComponent title="SHOPIFY" headerIcon={mainLogo} cart={cartIcon} navigate={() => navigation.navigate('DropdownScreen')} />
            {products.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: HEIGHT * 0.15 }
                }>
                    <Text style={{ fontWeight: 'bold', color: 'red', margin: HEIGHT * 0.02, fontSize: 20 }}> WISHLIST EMPTY </Text>
                    <Text style={{ opacity: 0.4, width: WIDTH * 0.6, textAlign: 'center', marginBottom: 10 }}> Add your favourite products in one place.Add now, buy later.</Text>
                    < Pressable style={{ borderWidth: 2, padding: HEIGHT * 0.02, borderColor: '#fc031c', borderRadius: WIDTH * 0.02 }}>
                        <Text style={{ color: "#fc031c" }}> CONTINUE SHOPPING </Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={{ borderWidth: 0.5, borderColor: "grey", marginHorizontal: WIDTH * 0.04, margin: HEIGHT * 0.01, padding: WIDTH * 0.03, borderRadius: WIDTH * 0.03 }}>
                            <View style={{ flexDirection: "row", flex: 0.2 }}>
                                <Image source={burgerIcon} resizeMode="contain" style={{ width: WIDTH * 0.2, height: HEIGHT * 0.08 }} />
                                <View style={{ flex: 0.5 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.product_name}</Text>
                                    <Text style={{ opacity: 0.5, fontSize: 15 }}>{item.description}</Text>
                                    <Text style={{ fontWeight: '600', marginTop: HEIGHT * 0.01 }}>$ {item.price}</Text>
                                </View>
                                <View style={{ /* position: 'absolute', */ right: WIDTH * 0.01, marginTop: HEIGHT * 0.02, flex: 0.6 }}>
                                    <Text style={{ fontWeight: 'bold', opacity: 0.5, fontSize: 13, color: item.count === 0 ? 'red' : item.count < 5 ? 'blue' : '#1a6110' }}>
                                        {item.count > 0 ? `${item.count}X` : 'Stock Out'}
                                    </Text>
                                    <Pressable style={{ marginTop: HEIGHT * 0.04, width: WIDTH * 0.05, borderRadius: HEIGHT, height: HEIGHT * 0.02, right: WIDTH * 0.01, /* position: "absolute" */ }} onPress={() => navigation.navigate('EditScreen', { productId: item._id })}>
                                        <Image source={pencil} style={{ width: WIDTH * 0.1, height: HEIGHT * 0.02, tintColor: 'black' }} resizeMode='contain' />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )
            }
            <Pressable style={{ position: 'absolute', bottom: HEIGHT * 0.05, right: WIDTH * 0.07, backgroundColor: "#fc031c", padding: WIDTH * 0.02, borderRadius: HEIGHT, width: WIDTH * 0.1, justifyContent: 'center', alignItems: "center" }} onPress={() => navigation.navigate('EditScreen')}>
                <Text style={{ fontSize: 25, color: 'white' }}>+</Text>
            </Pressable>
        </View >
    )
}

export default HomeScreen


{/* <View style={{ borderWidth: 1, marginHorizontal: WIDTH * 0.05, paddingHorizontal: WIDTH * 0.035, margin: WIDTH * 0.02, borderRadius: 8, padding: HEIGHT * 0.01, flexDirection: "row", borderColor: item.count === 0 ? 'red' : item.count < 5 ? 'blue' : 'green' }}>
<View>
    <Text style={{ fontSize: 18, fontWeight: '600' }}>Product:{item.product_name} </Text>
    <Text style={{ fontSize: 18, }}>Description:==>{item.description}</Text>
    <Text style={{ fontSize: 18, }}>Product Amount==>{item.price}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Text style={{ fontSize: 18 }}>Product Count:==></Text>
        <View style={{ borderRadius: HEIGHT * 0.015, backgroundColor: 'blue', width: HEIGHT * 0.05, height: HEIGHT * 0.05, alignItems: 'center', justifyContent: 'center', marginLeft: WIDTH * 0.02, backgroundColor: item.count === 0 ? 'red' : item.count < 5 ? 'yellow' : 'green' }}>
            <Text style={{ fontSize: 18 }}>{item.count}</Text>
        </View>
    </View>
</View>
<Pressable style={{ borderWidth: 1, height: HEIGHT * 0.03, justifyContent: "center", alignItems: "center", borderRadius: HEIGHT * 0.01, borderColor: item.count === 0 ? 'red' : item.count < 5 ? 'blue' : 'green', position: "absolute", right: WIDTH * 0.02, margin: WIDTH * 0.03 }} onPress={() => navigation.navigate('EditScreen', { productId: item._id })}>
    <Image source={pencil} style={{ width: WIDTH * 0.05, height: HEIGHT * 0.02 }} resizeMode='contain' />
</Pressable>
</View> */}
