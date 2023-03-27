import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CategoryTable from "../components/CategoryTable";
import ProductTable from "../components/ProductTable";
import { windowHeight, windowWidth } from "../components/Dimensions";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation, route }) => {
  const [images, setImages] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [username, setUsername] = useState("");
  const userId = route.params.userId;


  useEffect(() => {
    axios
      .get("http://192.168.100.22:5000/medicines")
      .then((response) => {
        const filteredMedicines = response.data.filter(
          (medicine) => medicine.featured === true
        );
        setAllMedicines(filteredMedicines);
        const bannerImages = filteredMedicines.map(
          (medicine) =>
            `http://192.168.100.22:5000/images/${medicine.bannerImage}`
        );
        setImages(bannerImages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(`http://192.168.100.22:5000/user1/${userId}`)
        .then((response) => {
          setUsername(response.data.name);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [])
  );
  const handleBannerPress = (index) => {
    const medicineData = allMedicines[index];
    console.log(medicineData.name);
    navigation.navigate("Product1", { data: medicineData });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={1}
        onPress={() => navigation.navigate("Products", { onFocus: true })}>
        <TextInput
          placeholder="Search by name category or symptoms"
          style={styles.input}
          editable={false}
        />
        <View style={{ marginRight: 20 }}>
          <AntDesign name="search1" size={15} color="#787878" />
        </View>
      </TouchableOpacity>
      <View
        style={{
          marginHorizontal: 10,
        }}>
        <Text style={{ color: "green" }}>Welcome {username}!</Text>
      </View>
      <SliderBox
        images={images}
        onCurrentImagePressed={(index) => handleBannerPress(index)}
        // currentImageEmitter={(index) => console.log(`current pos is: ${index}`)}
        dotColor="#000000"
        autoplay
        loop
      />
      <View style={styles.categories}>
        <Text style={{ fontSize: 20 }}>Categories</Text>
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            navigation.navigate("Categories");
          }}>
          See All
        </Text>
      </View>
      <CategoryTable
        navigation={navigation}
        visible={false}
        height={windowHeight - 600}
      />
      <View style={{ marginTop: 10 }}>
        <View style={styles.categories}>
          <Text style={{ fontSize: 20 }}>Medicines</Text>
          <Text
            style={{ color: "blue" }}
            onPress={() => {
              navigation.navigate("Products", { onFocus: false });
            }}>
            See All
          </Text>
        </View>
        <ProductTable
          navigation={navigation}
          visible={false}
          height={windowHeight - 550}
          onFocus={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  input: {
    padding: 10,
    borderRadius: 5,
  },
  searchBar: {
    margin: 20,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#787878",
  },
  list: {
    marginTop: 20,
  },
  categoryItems: {
    width: "33%",
    paddingHorizontal: 10,
    margin: 2,
    paddingVertical: 40,
    alignItems: "center",
    width: "33%",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#C5C5C5",
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
});

export default Home;
