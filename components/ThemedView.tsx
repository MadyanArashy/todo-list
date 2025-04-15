import { View, type ViewProps, useColorScheme } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  transparent?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, transparent, ...otherProps }: ThemedViewProps) {
  if(!transparent)
  {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
  else
  {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? darkColor : lightColor;
    return <View style={[{ borderColor: colors, borderWidth: 2, backgroundColor: 'rgba(0, 0, 0, 0)' }, style]} {...otherProps} />;
  }
}
