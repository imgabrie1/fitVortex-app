import Login from '@/pages/Login'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Text } from 'react-native'
import BottomRoutes from './bottom.routes'

export const Routes = () => {
    const Stack = createStackNavigator()
  return (
    <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false,
      cardStyle:{
        backgroundColor: "#fff"
      }
    }}
    >
        <Stack.Screen
        name="Login"
        component={Login}
        >
        </Stack.Screen>

        <Stack.Screen
        name="BottomRoutes"
        component={BottomRoutes}
        >
        </Stack.Screen>
    </Stack.Navigator>
  )
}

export default Routes
