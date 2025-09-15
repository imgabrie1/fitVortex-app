import React from 'react'
import Login from '@/pages/Login'
import { createStackNavigator } from '@react-navigation/stack'
import BottomRoutes from './bottom.routes'
import Register from '@/pages/Register'
import StartApp from '@/pages/StartApp'

export const Routes = () => {
    const Stack = createStackNavigator()
  return (
    <Stack.Navigator
    initialRouteName="StartApp"
    screenOptions={{
      headerShown: false,
      cardStyle:{
        backgroundColor: "#fff"
      },
      animation: "fade"
    }}
    >
        <Stack.Screen
        name="StartApp"
        component={StartApp}
        ></Stack.Screen>

        <Stack.Screen
        name="Login"
        component={Login}
        ></Stack.Screen>

        <Stack.Screen
        name="Register"
        component={Register}
        ></Stack.Screen>

        <Stack.Screen
        name="BottomRoutes"
        component={BottomRoutes}
        ></Stack.Screen>

    </Stack.Navigator>
  )
}

export default Routes
