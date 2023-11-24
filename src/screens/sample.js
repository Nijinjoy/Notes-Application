import { Alert, Image, Pressable, Text, TextInput, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderComponent from '../components/HeaderComponent'
import { backArrow, downArrow } from '../assets/images'
import { HEIGHT, WIDTH } from '../constants/Dimension'
import { Navigation } from 'react-native-navigation'
import SelectDropdown from 'react-native-select-dropdown'
import Realm from "realm";

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

const DropdownScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const realm = new Realm(realmConfig);
        const productList = realm.objects('Product');
        setProducts([...productList]);
    }, []);

    const productNames = products.map((product) => product.product_name)

    const handleSelect = (item, index) => {
        setSelectedItem(item);
        setProductCount(0);
    };

    const handleProductCount = (prod) => {
        const newCount = prod ? productCount + 1 : Math.max(productCount - 1, 0)
        setProductCount(newCount)
    }

    const onPurchase = () => {
        const realm = new Realm(realmConfig);
        const selectedProduct = realm.objects('Product').find((product) => product.product_name === selectedItem);
        if (selectedProduct) {
            if (productCount > selectedProduct.count) {
                Alert.alert('Warning', 'Please select a valid quantity');
            } else {
                realm.write(() => {
                    selectedProduct.count -= productCount;
                });
                const remainingQuantity = selectedProduct.count;
                navigation.navigate('HomeScreen', { selectedProduct: selectedItem, remainingQuantity });
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <HeaderComponent title="Purchase" headerIcon={backArrow} navigation={() => navigation.goBack()} tintColor="white" />
            <SelectDropdown
                data={productNames}
                onSelect={(selectedItem, index) => handleSelect(selectedItem, index)}
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                defaultButtonText="Select a Product from List"
                buttonStyle={{ borderWidth: 1, width: WIDTH * 0.7, alignSelf: "center", margin: HEIGHT * 0.03, padding: HEIGHT * 0.02, flexDirection: "row", borderRadius: WIDTH * 0.1 }}
                buttonTextStyle={{ color: 'black' }}
                dropdownStyle={{ width: WIDTH * 0.55, alignSelf: "center", margin: HEIGHT * 0.05, borderRadius: WIDTH * 0.1 }}
                rowStyle={{ padding: HEIGHT * 0.02, borderBottomWidth: 1, borderColor: 'lightgray' }}
            />
            <View style={{ flexDirection: "row", borderWidth: 1, padding: WIDTH * 0.02, borderRadius: WIDTH * 0.02, justifyContent: "space-between", width: WIDTH * 0.55, margin: HEIGHT * 0.02, alignSelf: "center", borderColor: 'red' }}>
                <Text style={{ alignSelf: "center", fontWeight: 'bold' }}>QUANTITY</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable style={{ marginRight: WIDTH * 0.04 }} onPress={() => handleProductCount(true)}>
                        <Text style={{ fontSize: 20 }}>+</Text>
                    </Pressable>
                    <Text style={{ fontSize: 20 }}>{productCount}</Text>
                    <Pressable style={{ marginLeft: WIDTH * 0.04 }} onPress={() => handleProductCount(false)}>
                        <Text style={{ fontSize: 20, color: 'black' }}>-</Text>
                    </Pressable>
                </View>
            </View>
            <Pressable onPress={onPurchase} style={{ padding: WIDTH * 0.03, borderRadius: WIDTH * 0.02, width: WIDTH * 0.4, alignSelf: "center", backgroundColor: "green" }}>
                <Text style={{ textAlign: 'center', color: 'white', fontWeight: "bold" }}>Purchase Now</Text>
            </Pressable>
        </View >
    )
}

export default DropdownScreen



//edit screen
import { View, Text, SafeAreaView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { HEIGHT, WIDTH } from '../constants/Dimension'
import Realm from "realm";
import HeaderComponent from '../components/HeaderComponent';
import { backArrow } from '../assets/images';

class Product extends Realm.Object {
    static schema = {
        name: 'Product',
        properties: {
            _id: 'objectId',
            product_name: 'string',
            price: 'double',
            count: 'int',
            description: 'string'
        },
        primaryKey: '_id',
    };
}

const realmConfig = {
    schema: [Product],
};

const EditScreen = ({ navigation, route }) => {
    const [productId, setProductId] = useState(null);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [count, setCount] = useState('');

    useEffect(() => {
        const { productId } = route.params || {};
        if (productId) {
            setProductId(productId);
            fetchProductDetails(productId);
        }
    }, [route.params]);

    const fetchProductDetails = (productId) => {
        Realm.open(realmConfig)
            .then((realm) => {
                const existingProduct = realm.objectForPrimaryKey('Product', productId);
                if (existingProduct) {
                    setProductName(existingProduct.product_name);
                    setPrice(existingProduct.price.toString());
                    setDescription(existingProduct.description);
                    setCount(existingProduct.count.toString());
                }
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
            });
    };



    const saveProduct = () => {
        if (!productName || !price || !description || !count) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }

        Realm.open(realmConfig)
            .then((realm) => {
                realm.write(() => {
                    if (productId) {
                        const existingProduct = realm.objectForPrimaryKey('Product', productId);
                        if (existingProduct) {
                            existingProduct.product_name = productName;
                            existingProduct.price = parseFloat(price);
                            existingProduct.count = parseInt(count);
                            existingProduct.description = description;
                        }
                    } else {
                        const newProduct = realm.create('Product', {
                            _id: new Realm.BSON.ObjectId(),
                            product_name: productName,
                            price: parseFloat(price),
                            count: parseInt(count),
                            description,
                        });
                        navigation.navigate('', { product: newProduct });
                    }
                });
                navigation.goBack();
            })
            .catch((error) => {
                console.error('Error opening Realm:', error);
            });
    };

    return (
        <View >
            <HeaderComponent title='Add Screen' headerIcon={backArrow} navigation={() => navigation.goBack()} tintColor="white" />
            <View style={{ marginHorizontal: WIDTH * 0.05, gap: HEIGHT * 0.03 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: HEIGHT * 0.03 }}>Enter product details</Text>
                <TextInput
                    value={productName}
                    onChangeText={(text) => setProductName(text)}
                    placeholder='Enter product name'
                    style={{ borderWidth: 1, padding: WIDTH * 0.04, borderRadius: WIDTH * 0.02 }}
                />
                <TextInput
                    value={price}
                    onChangeText={(text) => setPrice(text)}
                    keyboardType="numeric"
                    placeholder='Enter price of product'
                    style={{ borderWidth: 1, padding: WIDTH * 0.04, borderRadius: WIDTH * 0.02 }}
                />
                <TextInput
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    placeholder='Description of product'
                    style={{ borderWidth: 1, padding: WIDTH * 0.04, borderRadius: WIDTH * 0.02 }}
                />
                <TextInput
                    value={count}
                    onChangeText={(text) => setCount(text)}
                    keyboardType="numeric"
                    placeholder='Count'
                    style={{ borderWidth: 1, padding: WIDTH * 0.04, borderRadius: WIDTH * 0.02 }}
                />

                <Pressable style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: WIDTH * 0.02, borderRadius: WIDTH * 0.02 }} onPress={saveProduct}>
                    <Text style={{ fontSize: 17 }}>{productId ? 'Update Product' : 'Save Product'}</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default EditScreen


//homescreen

import { View, Text, FlatList, Image, Pressable } from 'react-native'
import Realm from "realm";
import React, { useEffect, useState } from 'react'
import { createRealmContext } from '@realm/react';
import HeaderComponent from '../components/HeaderComponent';
import { HEIGHT, WIDTH } from '../constants/Dimension';
import { cartIcon, emptyCart, flipkart, pencil } from '../assets/images';
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
        <View style={{ flex: 1 }}>
            <HeaderComponent title="HOME" headerIcon={flipkart} cart={cartIcon} navigate={() => navigation.navigate('DropdownScreen')} />
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
                        <View style={{ borderWidth: 1, marginHorizontal: WIDTH * 0.05, paddingHorizontal: WIDTH * 0.035, margin: WIDTH * 0.02, borderRadius: 8, padding: HEIGHT * 0.01, flexDirection: "row", borderColor: item.count === 0 ? 'red' : item.count < 5 ? 'blue' : 'green' }}>
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
                        </View>
                    )}
                />
            )
            }
            <Pressable style={{ position: 'absolute', bottom: HEIGHT * 0.05, right: WIDTH * 0.07, borderWidth: 0, padding: HEIGHT * 0.02, borderRadius: WIDTH * 0.4, backgroundColor: "#fc031c" }} onPress={() => navigation.navigate('EditScreen')}>
                <Text style={{ fontSize: 25, color: 'white' }}>+</Text>
            </Pressable>
        </View >
    )
}

export default HomeScreen