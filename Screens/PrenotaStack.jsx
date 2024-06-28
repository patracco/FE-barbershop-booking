import { createStackNavigator } from '@react-navigation/stack';
import Prenota from './Prenota';
import TimeSlots from './TimeSlots';
import Payment from './Payment';
import SuccessPayment from './SuccessPayment';

const Stack = createStackNavigator();

export default function PrenotaStack({}) {
  return (
    <Stack.Navigator initalRoutName='Prenota'>
      <Stack.Screen
        name='PrenotaScreen'
        component={Prenota}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TimeSlots'
        component={TimeSlots}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Payment'
        component={Payment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='SuccessPayment'
        component={SuccessPayment}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
