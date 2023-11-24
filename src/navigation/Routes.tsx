
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from '../screens/HomeScreen'
import SplashScreen from '../screens/SplashScreen'
import EditScreen from '../screens/EditScreen'
import DropdownScreen from '../screens/DropdownScreen'


const Stack = createNativeStackNavigator()

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='SplashScreen' component={SplashScreen} />
                <Stack.Screen name='HomeScreen' component={HomeScreen} />
                <Stack.Screen name='EditScreen' component={EditScreen} />
                <Stack.Screen name='DropdownScreen' component={DropdownScreen} />
            </Stack.Navigator>
        </NavigationContainer >
    )
}

export default Routes 