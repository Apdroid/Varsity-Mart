import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const ThemedView = ({style, safe=false,...props}) => {
    const scheme = useColorScheme();
    const theme = Colors[scheme] ?? Colors.light;
    
    if (!safe) return (
    <View 
        style={[{backgroundColor: theme.backgroundColor}, style]}
        {...props} 
    /> 
  )

  const inset = useSafeAreaInsets();
  return (
    <View 
        style={[{backgroundColor: theme.backgroundColor, 
            paddingTop: inset.top,
            paddingBottom: inset.bottom
        }, 
            style]}
        {...props} 
    /> 
  )
}

export default ThemedView

const styles = StyleSheet.create({})