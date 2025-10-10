import { StyleSheet } from 'react-native';
import { themas } from '@/global/themes';

export const style = StyleSheet.create({
    containerButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: themas.Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    }
});