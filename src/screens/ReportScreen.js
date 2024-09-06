import { Text, View, StyleSheet, FlatList } from "react-native";
import HorizontalFlatlist from "../../components/HorizontalFlatlist";
import NextForecastCard from "../../components/NextForecastCard";
import weatherData from "../../assets/weatherData";

export default function ReportScreen({ route, navigation }) {
  const { data, name } = route.params;

  return (
    <View style={styles.container}>
      {/* Forecast Report Header */}
      <Text style={styles.headerText}>Forecast report</Text>

      {/* Today Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Today</Text>
        <HorizontalFlatlist
          testID="listitem"
          hourlyForecast={data.slice(0, 7)}
        />
      </View>

      {/* Next Forecast Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Next forecast: {name}</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <NextForecastCard
              testID="listitem"
              dt_txt={new Date(item.dt * 1000).toISOString().split("T")[0]}
              temperature={item.main.temp}
              currentWeather={item.weather[0].main}
              // handleOnPress={(color, weatherIcon) => {
              //   navigation.push('Detail', { backgroundColor: color, weatherIcon: weatherIcon, ...item });
              // }}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  separator: {
    height: 16,
  },
});
