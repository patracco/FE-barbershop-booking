import React, { useContext } from 'react';
import {
  View,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserContext } from '../context/UserContext';
import { useAuth } from '../api/hooks/useAuth';

// Validation schema using zod
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = ({ navigation }) => {
  const auth = useAuth();
  const { setUser } = useContext(UserContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values) => {
    try {
      const res = await auth.login(values.email, values.password);
      if (res && res.data) {
        setUser(res.data.user);
        navigation.navigate('Prenota');
      }
    } catch (error) {
      Alert.alert('Invalid email or password');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View>
          <Image style={styles.logo} source={require('../assets/Barber.png')} />
          <View>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  textAlign={'center'}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Email'
                  maxLength={254}
                  placeholderTextColor={'white'}
                  autoCapitalize='none'
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errors}>{errors.email.message}</Text>
            )}
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholderTextColor={'white'}
                  secureTextEntry={true}
                  placeholder='Password'
                  maxLength={32}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errors}>{errors.password.message}</Text>
            )}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.login}
              textAlign={'center'}
            >
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
            <Pressable style={styles.registerLink}>
              <Text
                style={styles.registerText}
                onPress={() => navigation.navigate('Register')}
              >
                Not Registered?
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 30,
  },
  input: {
    padding: 5,
    height: 40,
    width: 240,
    borderWidth: 2,
    borderRadius: 25,
    marginBottom: 15,
    borderColor: 'white',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  login: {
    height: 40,
    borderWidth: 2,
    borderRadius: 25,
    marginBottom: 15,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    backgroundColor: 'white',
  },
  loginText: {
    fontSize: 20,
  },
  registerLink: {
    bottom: -100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
  },
  errors: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    marginTop: -10,
    textAlign: 'center',
    width: 240,
  },
});

export default Login;
