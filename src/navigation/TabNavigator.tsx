import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { DashboardScreen } from '@/screens/dashboard/DashboardScreen';
import { ScreenTimeScreen } from '@/screens/screentime/ScreenTimeScreen';
import { LocationScreen } from '@/screens/location/LocationScreen';
import { TasksScreen } from '@/screens/tasks/TasksScreen';
import { AppsScreen } from '@/screens/apps/AppsScreen';
import { ContentFilterScreen } from '@/screens/contentfilter/ContentFilterScreen';
import { ReportingScreen } from '@/screens/reporting/ReportingScreen';
import { theme } from '@/theme';
import { TabParamList } from '@/types';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'ScreenTime':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'Location':
              iconName = focused ? 'location' : 'location-outline';
              break;
            case 'Tasks':
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              break;
            case 'Apps':
              iconName = focused ? 'apps' : 'apps-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.card,
          borderTopColor: theme.colors.border.primary,
          borderTopWidth: 1,
          height: theme.components.tabBar.height,
          paddingBottom: theme.components.tabBar.paddingBottom,
          paddingTop: theme.components.tabBar.paddingTop,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSizes.xs,
          fontWeight: theme.typography.fontWeights.medium,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
          borderBottomColor: theme.colors.border.primary,
          borderBottomWidth: 1,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontSize: theme.typography.fontSizes.lg,
          fontWeight: theme.typography.fontWeights.semibold,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ScreenTime"
        component={ScreenTimeScreen}
        options={{
          title: 'Screen Time',
        }}
      />
      <Tab.Screen
        name="Location"
        component={LocationScreen}
        options={{
          title: 'Location',
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: 'Tasks',
        }}
      />
      <Tab.Screen
        name="Apps"
        component={AppsScreen}
        options={{
          title: 'Apps',
        }}
      />
      <Tab.Screen
        name="Filter"
        component={ContentFilterScreen}
        options={{
          title: 'Filter',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? 'shield' : 'shield-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportingScreen}
        options={{
          title: 'Reports',
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? 'bar-chart' : 'bar-chart-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
