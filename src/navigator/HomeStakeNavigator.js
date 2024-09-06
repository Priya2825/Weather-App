import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import ReportScreen from '../screens/ReportScreen';


const Stake = createStackNavigator();

function HomeStakeNavigator() {
  return (
    <Stake.Navigator>
      <Stake.Screen name="Home" component={HomeScreen} />
      <Stake.Screen name="Detail" component={DetailScreen} />
      <Stake.Screen name="Report" component={ReportScreen} />
    </Stake.Navigator>
  );
}
export default HomeStakeNavigator;
