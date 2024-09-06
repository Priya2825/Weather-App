import MapView, { UrlTile, Marker } from "react-native-maps";
import { View, Text } from "react-native";

function MapTile({ coordinates, temperature }) {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
          }}
        >
          <View>
            <Text style={{}}>Temperature: {temperature}</Text>
          </View>
        </Marker>
        <UrlTile
          /**
           * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
           * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
           */
          urlTemplate={
            "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=24f40166e842079cad21bf954642b936"
          }
          /**
           * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
           * MKTileOverlay. iOS only.
           */
          maximumZ={19}
          /**
           * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
           * to be used. Its default value is false.
           */
          flipY={false}
        />
      </MapView>
    </View>
  );
}
export default MapTile;
