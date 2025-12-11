import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from './constants/Colors' 

const RootLayout = () => {
    const scheme = useColorScheme();
    const theme = Colors[scheme] ?? Colors.light;
  return (
    <>
        <StatusBar value = "auto"/>
        <Stack screenOptions={{
            headerStyle:{  backgroundColor:theme.backgroundColor},  
            headerTintColor: theme.textColor,
        }}>
            <Stack.Screen name="(dashboard)" options={{headerShown:false}}/>


        </Stack>

    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})