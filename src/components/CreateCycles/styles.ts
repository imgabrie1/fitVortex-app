import { themas } from '@/global/themes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: themas.Colors.background,
    borderRadius: 10,
    padding: 20,
    gap: 15,
  },
  nameAndBackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontFamily: 'RussoOne',
    color: themas.Colors.text,
  },
});