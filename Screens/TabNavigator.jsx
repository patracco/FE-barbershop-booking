import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginStack from './LoginStack';
import RegisterStack from './RegisterStack';
import PrenotaStack from './PrenotaStack';
import AppointmentStack from './AppointmentStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as React from 'react';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext.js';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useContext(UserContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: {
          backgroundColor: 'black',
          paddingTop: 5,
        },
        tabBarActiveTintColor: 'white',
      }}
    >
      {user ? (
        <>
          <Tab.Screen
            name='Prenota'
            component={PrenotaStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name='calendar-month'
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name='Appointments'
            component={AppointmentStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name='clipboard-text-search-outline'
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name='Logout'
            component={LoginStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name='logout'
                  color={color}
                  size={size}
                />
              ),
              tabBarStyle: { display: 'none' },
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name='Login/Register'
            component={LoginStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name='login'
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name='Register'
            component={RegisterStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ size, color }) => (
                <MaterialCommunityIcons
                  name='account-plus'
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
