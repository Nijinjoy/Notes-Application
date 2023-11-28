import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { WIDTH } from '../constants/Dimension'

const TextInputComponent = (props) => {
    const { placeholder, value, onChangeText, keyboardType } = props
    return (
        <View style={{ borderWidth: 1, padding: WIDTH * 0.04, borderRadius: WIDTH * 0.02 }}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View>
    )
}

export default TextInputComponent


