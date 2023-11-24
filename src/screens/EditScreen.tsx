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

