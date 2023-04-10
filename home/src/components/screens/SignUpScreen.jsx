import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Card } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Input } from 'react-native-elements';

const API_URL = 'http://192.168.3.101:8070';
const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const handleRegistration = async () => {
    // validate form inputs
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor llene todos los campos');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Por favor, introduzca una dirección de correo electrónico válida.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    const passwordRegex = /^.{4,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        'La contraseña debe de de 6 digitos contener al menos una letra, una mayúscula un número y un carácter especial. (@,#,*)'
      );
      return;
    }

    // send registration data to server
    await axios
      .post(`${API_URL}/signup`, {
        name,
        email,
        password,
      })
      .then((response) => {
        Alert.alert(
          'La cuenta se ha creado correctamente',
          'Ya puedes empezar a utilizar la aplicación',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
          { cancelable: false }
        );
        // navigate to login screen
      })
      .catch((error) => {
        setError('Intente nuevamente. Este correo ya se encuentra registrado');
        console.error(error);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  return (
    <View style={styles.container}>
      <ScrollView>
        <Card>
          <Text style={styles.label}>Nombre Completo</Text>
          <Input
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ingrese su nombre"
            autoCapitalize="words"
            inputContainerStyle={{ borderBottomColor: 'transparent', width: '109%', marginLeft: -10 }}
          />
          <Text style={styles.label}>Correo Electrónico</Text>
          <Input
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese su correo electrónico"
            autoCapitalize="none"
            inputContainerStyle={{ borderBottomColor: 'transparent', width: '109%', marginLeft: -10 }}
          />

          <Text style={styles.label}>Contraseña</Text>
          <Input
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingrese su contraseña"
            secureTextEntry={!showPassword}
            inputContainerStyle={{ borderBottomColor: 'transparent', width: '109%', marginLeft: -10 }}
            rightIcon={
              <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={27} style={{ position: 'absolute', right: 30, bottom: 0 }} onPress={() => setShowPassword(!showPassword)} />

            }
          />
          <Text style={styles.label}>Confirma tu Contraseña</Text>
          <Input
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirme su contraseña"
            secureTextEntry={!showPassword2}
            inputContainerStyle={{ borderBottomColor: 'transparent', width: '109%', marginLeft: -10 }}
            rightIcon={
              <Icon name={showPassword2 ? 'eye-outline' : 'eye-off-outline'} size={27} style={{ position: 'absolute', right: 30, bottom: 0 }} onPress={() => setShowPassword2(!showPassword2)} />

            }
          />
          <Text style={styles.error}>{error}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleRegistration();
            }}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>Al registrarte aceptas nuestros </Text>
            <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
              <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>Terminos de Servicio</Text>
            </TouchableOpacity>
            <Text style={styles.color_textPrivate}> y </Text>
            <Text style={[styles.color_textPrivate, { color: '#e88832' }]}>Politica de Privacidad</Text>
          </View>

          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.navButtonText}>¿Ya tienes una cuenta? Inicia Sesión</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 30,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginVertical: 10,
  },
  formContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 3,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 0,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 25,
    margin: 10,
  },
  button: {
    backgroundColor: '#710193',
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    alignSelf: 'stretch',
    marginHorizontal: 30,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignUpScreen;
