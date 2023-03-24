import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { cityData, provinceData } from "../components/data";

const Account = ({ route }) => {
  const [modalProvince, setModalProvince] = useState(false);
  const [modalCity, setModalCity] = useState(false);
  const [modalName, setNameModal] = useState(false);
  const [modalAddress, setAddressModal] = useState(false);
  const [name, setName] = useState("");
  const [isDoctor, setDoctor] = useState(true);
  const [province, setProvince] = useState("");
  const [openProvince, setOpenProvince] = useState(false);
  const [provinceItems, setProvinceItems] = useState(provinceData);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(null);
  const [openCity, setOpenCity] = useState(false);
  const [cityItems, setCityItems] = useState(cityData);
  const userId = route.params.userId;

  useEffect(() => {
    axios
      .get(`http://192.168.100.22:5000/user1/${userId}`)
      .then((response) => {
        setDoctor(response.data.doctor);
        if (response.data.doctor) {
          axios
            .get(`http://192.168.100.22:5000/doctor/${userId}`)
            .then((response) => {
              setCity(response.data.city);
              setAddress(response.data.address);
              setProvince(response.data.province);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setProvince("");
        }
        setName(response.data.name);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleName = () => {
    axios
      .put(`http://192.168.100.22:5000/user1/${userId}`, { name: name })
      .then((response) => {
        console.log(response.data.name);
        setNameModal(false);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log(error.response.data);
          // that falls out of the range of 2xx
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });
  };
  const handleProvince = () => {
    axios
      .put(`http://192.168.100.22:5000/user1/${userId}`, { province: province })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setModalProvince(false);
  };

  const handleCity = () => {
    axios
      .put(`http://192.168.100.22:5000/user1/${userId}`, { city: city })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setModalCity(false);
  };

  const handleAddress = () => {
    axios
      .put(`http://192.168.100.22:5000/user1/${userId}`, { address: address })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setAddressModal(false);
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <TouchableOpacity
            style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}
            onPress={() => {
              setNameModal(!modalName);
            }}>
            <Icon name="pencil-box" color="black" size={25} />
          </TouchableOpacity>
          <Text style={{ marginBottom: 10, fontSize: 15 }}>Name</Text>
          <Text style={{ fontWeight: "500", fontSize: 18 }}>{name}</Text>

          {modalName ? (
            <View style={styles.rowWrapper}>
              <Text style={{ marginBottom: 10, fontSize: 15 }}>New Name</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor="#003f5c"
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                  handleName();
                }}>
                <Text style={styles.loginText}>Update</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {isDoctor ? (
          <View>
            {/*Province*/}
            <View style={styles.row}>
              <TouchableOpacity
                style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}
                onPress={() => {
                  setModalProvince(!modalProvince);
                }}>
                <Icon name="pencil-box" color="black" size={25} />
              </TouchableOpacity>
              <Text style={{ marginBottom: 10, fontSize: 15 }}>Province</Text>
              <Text style={{ fontWeight: "500", fontSize: 18 }}>
                {province}
              </Text>

              {modalProvince ? (
                <View style={styles.rowWrapper}>
                  <View style={openProvince ? { zIndex: 10 } : ""}>
                    <DropDownPicker
                      open={openProvince}
                      value={province}
                      items={provinceItems}
                      setOpen={setOpenProvince}
                      setValue={setProvince}
                      setItems={setProvinceItems}
                      style={styles.dropdown}
                      placeholder="Select Province"
                      listMode="SCROLLVIEW"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => {
                      handleProvince();
                    }}>
                    <Text style={styles.loginText}>Update</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/*City*/}

            <View style={styles.row}>
              <TouchableOpacity
                style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}
                onPress={() => {
                  setModalCity(!modalCity);
                }}>
                <Icon name="pencil-box" color="black" size={25} />
              </TouchableOpacity>
              <Text style={{ marginBottom: 10, fontSize: 15 }}>City</Text>
              <Text style={{ fontWeight: "500", fontSize: 18 }}>{city}</Text>

              {modalCity ? (
                <View style={styles.rowWrapper}>
                  <View style={openCity ? { zIndex: 10 } : ""}>
                    <DropDownPicker
                      open={openCity}
                      value={city}
                      items={cityItems}
                      setOpen={setOpenCity}
                      setValue={setCity}
                      setItems={setCityItems}
                      style={styles.dropdown}
                      placeholder="Select City"
                      listMode="SCROLLVIEW"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => {
                      handleCity();
                    }}>
                    <Text style={styles.loginText}>Update</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/*Address*/}

            <View style={styles.row}>
              <TouchableOpacity
                style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}
                onPress={() => {
                  setAddressModal(!modalAddress);
                }}>
                <Icon name="pencil-box" color="black" size={25} />
              </TouchableOpacity>
              <Text style={{ marginBottom: 10, fontSize: 15 }}>Address</Text>
              <Text style={{ fontWeight: "500", fontSize: 18 }}>{address}</Text>

              {modalAddress ? (
                <View style={styles.rowWrapper}>
                  <View style={styles.inputView}>
                    <TextInput
                      style={styles.TextInput}
                      placeholderTextColor="#003f5c"
                      value={address}
                      onChangeText={(value) => {
                        setAddress(value);
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => {
                      handleAddress();
                    }}>
                    <Text style={styles.loginText}>Update</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          ""
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    marginBottom: 20,
    elevation: 3,
    backgroundColor: "#FAF9F6",
  },
  rowWrapper: {
    marginTop: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    marginBottom: 20,
    elevation: 3,
    backgroundColor: "#FAF9F6",
  },
  heading: {
    flexDirection: "row",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  inputView: {
    backgroundColor: "rgb(210, 210, 210)",
    width: "100%",
    height: 45,
    marginBottom: 10,
    borderRadius: 5,
    // alignItems: "center",
    marginTop: 10,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  modalText: {
    fontSize: 15,
  },
  loginBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  loginText: {
    color: "white",
  },
  dropdown: {
    backgroundColor: "#C5C5C5",
    borderRadius: 30,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 0,
  },
});
export default Account;
