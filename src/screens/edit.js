import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import Realm from 'realm';
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
            description: 'string',
        },
        primaryKey: '_id',
    };
}

const realmConfig = {
    schema: [Product],
};

const EditScreen = ({ navigation, route }) => {
    const [productId, setProductId] = useState(null);
    const [formFields, setFormFields] = useState([
        { key: 'productName', value: '', placeholder: 'Enter product name' },
        { key: 'price', value: '', placeholder: 'Enter price of product', keyboardType: 'numeric' },
        { key: 'description', value: '', placeholder: 'Description of product' },
        { key: 'count', value: '', placeholder: 'Count', keyboardType: 'numeric' },
    ]);

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
                    const updatedFormFields = formFields.map((field) => ({
                        ...field,
                        value: existingProduct[field.key].toString(),
                    }));
                    setFormFields(updatedFormFields);
                }
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
            });
    };


    const handleTextInputChange = (key, text) => {
        const updatedFormFields = formFields.map((field) =>
            field.key === key ? { ...field, value: text } : field
        );
        setFormFields(updatedFormFields);
    };


    const saveProduct = () => {
        const areAllFieldsFilled = formFields.every((field) => field.value.trim() !== '');
        if (!areAllFieldsFilled) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }

        Realm.open(realmConfig)
            .then((realm) => {
                realm.write(() => {
                    if (productId) {
                        const existingProduct = realm.objectForPrimaryKey('Product', productId);
                        if (existingProduct) {
                            formFields.forEach((field) => {
                                existingProduct[field.key] = field.key === 'price' || field.key === 'count' ? parseFloat(field.value) : field.value;
                            });
                        }
                    } else {
                        const newProduct = realm.create('Product', {
                            _id: new Realm.BSON.ObjectId(),
                            ...formFields.reduce((acc, field) => {
                                acc[field.key] = field.key === 'price' || field.key === 'count' ? parseFloat(field.value) : field.value;
                                return acc;
                            }, {}),
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
        <View>
            <HeaderComponent title='Add Screen' headerIcon={backArrow} navigation={() => navigation.goBack()} tintColor='white' />
            <View style={{ marginHorizontal: WIDTH * 0.05, gap: HEIGHT * 0.03 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: HEIGHT * 0.03 }}>Enter product details</Text>

                {formFields.map((field) => (
                    <TextInput
                        key={field.key}
                        value={field.value}
                        onChangeText={(text) => handleTextInputChange(field.key, text)}
                        placeholder={field.placeholder}
                        keyboardType={field.keyboardType}
                        style={{ borderWidth: 1, padding: WIDTH * 0.04, borderRadius: WIDTH * 0.02, marginTop: HEIGHT * 0.02 }}
                    />
                ))}

                <Pressable style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: WIDTH * 0.02, borderRadius: WIDTH * 0.02 }} onPress={saveProduct}>
                    <Text style={{ fontSize: 17 }}>{productId ? 'Update Product' : 'Save Product'}</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default EditScreen;
