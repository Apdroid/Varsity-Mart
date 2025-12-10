import { StyleSheet, View, Pressable, TextInput, useColorScheme, Text } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constants/Colors'
import ThemedView from './ThemedView'

const Header = () => {
    const scheme = useColorScheme()
    const theme = Colors[scheme] ?? Colors.light
    const [searchText, setSearchText] = useState('')

    const toggleTheme = () => {
        // Theme toggle functionality can be implemented with context/state management
        console.log('Toggle theme')
    }

    return (
        <ThemedView safe={true} style={styles.headerContainer}>
            {/* Top Navigation Bar */}
            <View style={styles.topNav}>
                <Text style={[styles.appName, { color: theme.textColor }]}>
                    VarsityMart
                </Text>

                <View style={styles.iconRow}>
                    <Pressable onPress={toggleTheme}>
                        <Ionicons 
                            name={scheme === 'light' ? 'moon-outline' : 'sunny'} 
                            size={24} 
                            color={theme.textColor}
                        />
                    </Pressable>
                    
                    <Pressable>
                        <Ionicons 
                            name="notifications-outline" 
                            size={24} 
                            color={theme.textColor}
                        />
                    </Pressable>
                    
                    <Pressable>
                        <Ionicons 
                            name="cart-outline" 
                            size={24} 
                            color={theme.textColor}
                        />
                    </Pressable>
                </View>
            </View>

            {/* Search Container */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons 
                        name="search" 
                        size={20} 
                        color="#6B7280"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[styles.searchInput, { color: theme.textColor }]}
                        placeholder="Search..."
                        placeholderTextColor="#9CA3AF"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>
            </View>
        </ThemedView>
    )
}

export default Header

const styles = StyleSheet.create({
    headerContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    topNav: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 17,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    searchContainer: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 17,
    },
    searchBox: {
        flexDirection: 'row',
        width: '100%',
        height: 48,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 24,
    },
})
