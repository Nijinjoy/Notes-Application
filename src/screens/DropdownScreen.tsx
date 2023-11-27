import { Alert, Image, Pressable, Text, TextInput, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderComponent from '../components/HeaderComponent'
import { backArrow, downArrow } from '../assets/images'
import { HEIGHT, WIDTH } from '../constants/Dimension'
import { Navigation } from 'react-native-navigation'
import SelectDropdown from 'react-native-select-dropdown'
import Realm, { index } from "realm";

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

const DropdownScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [productCount, setProductCount] = useState(0)

    useEffect(() => {
        const realm = new Realm(realmConfig);
        const productList = realm.objects('Product');
        setProducts([...productList]);
    }, []);

    const productNames = products.map((product) => product.product_name)

    const handleSelect = (item, index) => {
        setSelectedItem(item)
        const selectedProduct = products.find((product) => product.product_name === item)
        if (selectedProduct) {
            setProductCount(selectedProduct.count)
        } else {
            setProductCount(0)
        }
    }

    const handleProductCount = (prod) => {
        const newCount = prod ? productCount + 1 : Math.max(productCount - 1, 0)
        setProductCount(newCount)
    }

    const onPurchase = () => {
        const realm = new Realm(realmConfig);
        const selectedProduct = realm.objects('Product').find((product) => product.product_name === selectedItem);
        if (selectedProduct) {
            if (productCount > selectedProduct.count) {
                Alert.alert('Warning', 'Please select a valid quantity')
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
                dropdownStyle={{ width: WIDTH * 0.6, alignSelf: "center", margin: HEIGHT * 0.05, borderRadius: WIDTH * 0.1 }}
                rowStyle={{ padding: HEIGHT * 0.02, borderBottomWidth: 1, borderColor: 'lightgray' }}
            />
            <View style={{ flexDirection: "row", borderWidth: 1, padding: WIDTH * 0.02, borderRadius: WIDTH * 0.02, justifyContent: "space-between", width: WIDTH * 0.55, margin: HEIGHT * 0.02, alignSelf: "center", borderColor: 'red' }}>
                <Text style={{ alignSelf: "center", fontWeight: 'bold' }}>QUANTITY</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable style={{ marginRight: WIDTH * 0.04 }} onPress={() => handleProductCount(false)}>
                        <Text style={{ fontSize: 20, color: 'black' }}>-</Text>
                    </Pressable>
                    <Text style={{ fontSize: 20 }}>{productCount}</Text>
                    <Pressable style={{ marginLeft: WIDTH * 0.04, }} onPress={() => handleProductCount(true)}>
                        <Text style={{ fontSize: 20 }}>+</Text>
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

