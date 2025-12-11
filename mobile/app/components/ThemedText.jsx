import { StyleSheet, Text, View, useColorScheme} from 'react-native'
import React from 'react'

import { Colors } from '../constants/Colors';

const ThemedText = ({style, title=false, ...props}) => {
    const scheme = useColorScheme();
    const theme = Colors[scheme] ?? Colors.light;

    
    return (
        <Text style={[title ? styles.title : null, style]} {...props} />
    )
}

export default ThemedText

const styles = StyleSheet.create({
    title: {
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
})