import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from './components/ThemedView'
import { Ionicons } from '@expo/vector-icons'

const index = () => {
  return (
    <ThemedView safe={true} style={{flex:1, alignItems: "stretch"} }>
      <Text>index</Text>
    </ThemedView>
  )
}

export default index

const styles = StyleSheet.create({

})