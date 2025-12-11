import { StyleSheet, Text, View , useColorScheme} from 'react-native'
import ThemedView from '../components/ThemedView'
import ThemedText from '../components/ThemedText'
import Header from '../components/Header'


const index = () => {
   
  return (
    <ThemedView style={{flex:1}} safe={false}>
        <Header />
        <ThemedText title={true}>
          index Page
        </ThemedText>

    </ThemedView>
  )
}

export default index

const styles = StyleSheet.create({
  
})