import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation as PaperBottomNavigation, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BottomNavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const theme = useTheme();

  const routes = [
    {
      key: 'Dashboard',
      title: 'Dashboard',
      focusedIcon: 'view-dashboard',
      unfocusedIcon: 'view-dashboard-outline',
    },
    {
      key: 'Projects',
      title: 'Projetos',
      focusedIcon: 'folder',
      unfocusedIcon: 'folder-outline',
    },
    {
      key: 'CreateProject',
      title: 'Criar',
      focusedIcon: 'plus-circle',
      unfocusedIcon: 'plus-circle-outline',
    },
    {
      key: 'Settings',
      title: 'Config',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ];

  const renderIcon = ({ route, focused }: { route: any; focused: boolean }) => {
    const iconName = focused ? route.focusedIcon : route.unfocusedIcon;
    return (
      <MaterialCommunityIcons
        name={iconName as any}
        size={24}
        color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant}
      />
    );
  };

  const renderLabel = ({ route, focused }: { route: any; focused: boolean }) => {
    return (
      <PaperBottomNavigation.Label
        focused={focused}
        color={focused ? theme.colors.primary : theme.colors.onSurfaceVariant}
      >
        {route.title}
      </PaperBottomNavigation.Label>
    );
  };

  return (
    <PaperBottomNavigation
      navigationState={{
        index: routes.findIndex(route => route.key === currentRoute),
        routes,
      }}
      onIndexChange={(index) => {
        const route = routes[index];
        onNavigate(route.key);
      }}
      renderScene={PaperBottomNavigation.SceneMap({
        Dashboard: () => null,
        Projects: () => null,
        CreateProject: () => null,
        Settings: () => null,
      })}
      renderIcon={renderIcon}
      renderLabel={renderLabel}
      barStyle={styles.barStyle}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
    />
  );
};

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
