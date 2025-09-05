import Home from '@/pages/Home';
import User from '@/pages/User';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const BottomRoutes = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={User} />
    </Tab.Navigator>
  );
}
export default BottomRoutes