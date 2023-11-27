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

    console.log("products==>", products);

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
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 0.2 }}>
                                    <Image source={burgerIcon} resizeMode="contain" style={{ width: WIDTH * 0.2, height: HEIGHT * 0.08 }} />
                                </View>
                                <View style={{ flex: 0.5, marginLeft: WIDTH * 0.08 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500" }}>{item.product_name}</Text>
                                    <Text style={{ opacity: 0.5, fontSize: 15 }}>{item.description}</Text>
                                    <Text style={{ fontWeight: '600', marginTop: HEIGHT * 0.01 }}>$ {item.price}</Text>
                                </View>
                                <View style={{ marginTop: HEIGHT * 0.04, flex: 0.3, flexDirection: "row" }}>
                                    <Text style={{ fontWeight: 'bold', opacity: 0.5, fontSize: 13, color: item.count === 0 ? 'red' : item.count < 5 ? 'green' : '#1a6110', marginLeft: WIDTH * 0.04 }}>
                                        {item.count > 0 ? ` Qty:${item.count}` : 'Stock Out'}
                                    </Text>
                                </View>
                                <Pressable style={{ borderRadius: WIDTH * 0.01, borderWidth: 1, width: WIDTH * 0.03, height: HEIGHT * 0.03, justifyContent: "center", alignItems: "center", padding: WIDTH * 0.025, borderColor: 'grey' }} onPress={() => navigation.navigate('EditScreen', { productId: item._id })}>
                                    <Image source={pencil} style={{ width: WIDTH * 0.1, height: HEIGHT * 0.02, tintColor: 'black' }} resizeMode='contain' />
                                </Pressable>
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
