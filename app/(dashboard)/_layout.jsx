import { StyleSheet, Text, View , useColorScheme} from 'react-native'
import { Stack, Tabs } from 'expo-router'
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../components/ThemedView';

const AppLayout = () => {
    const scheme = useColorScheme();
    const theme = Colors[scheme] ?? Colors.light;
    

  return (
        <>
            <StatusBar value = "auto"/>
                <Tabs 
                    screenOptions={{
                    tabBarStyle: {
                        backgroundColor: theme.backgroundColor,
                        paddingTop: 14,
                        paddingBottom: 14,
                        paddingLeft: 8,
                        paddingRight: 8,
                        height: 90,
                    },
                    headerShown:false,
                    tabBarActiveTintColor: theme.buttonColor,
                    tabBarInactiveTintColor: theme.inactivetabcolor,
                }}>
                    <Tabs.Screen name="index" options={{title:'Shop', tabBarIcon:({focused}, headerShown=false)=>(
                        <Ionicons size={24} 
                            name={focused?"home":"home-outline"} 
                            color={focused?theme.buttonColor:theme.inactivetabcolor}
                        
                        />
                    )}}/>
                    <Tabs.Screen name="food" options={{ title:'Food', tabBarIcon:({focused})=>(
                        <Ionicons size={24} 
                            name={focused?"restaurant":"restaurant-outline"} 
                            color={focused?theme.buttonColor:theme.inactivetabcolor}
                        />
                    )}}/>
                    <Tabs.Screen name="cart" options={{ title:'Cart', tabBarIcon:({focused})=>(
                        <Ionicons size={24} 
                            name={focused?"cart":"cart-outline"} 
                            color={focused?theme.buttonColor:theme.inactivetabcolor}
                        />
                    )}}/>
                    <Tabs.Screen name="messages" options={{ title:'Messages', tabBarIcon:({focused})=>(
                        <Ionicons size={24} 
                            name={focused?"chatbox":"chatbox-outline"} 
                            color={focused?theme.buttonColor:theme.inactivetabcolor}
                        />
                    ) }}/>
                    <Tabs.Screen name="profile" options={{ title:'Profile', tabBarIcon:({focused})=>(
                        <Ionicons size={24} 
                            name={focused?"person":"person-outline"} 
                            color={focused?theme.buttonColor:theme.inactivetabcolor}
                        />
                    ) }} />
                </Tabs>
            
            
          
        </>
  )
}

export default AppLayout

const styles = StyleSheet.create({})