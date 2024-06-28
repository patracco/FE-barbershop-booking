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
import { UserContext } from '../context/UserContext.js';
import { useAuth } from '../api/hooks/useAuth';

// Validation schema using zod
const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Email Address is invalid'),
    phone: z.string().min(1, 'Phone is required'),
    dateOfBirth: z.string().min(1, 'Date of Birth is required'), // Date of birth field
    password: z
      .string()
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: "Passwords don't match",
  });

const Signup = ({ navigation }) => {
  const auth = useAuth();
  const { setUser } = useContext(UserContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values) => {
    console.log('Register button clicked with values:', values);
    auth
      .signup(values)
      .then((response) => {
        console.log('Signup successful:', response);
        setUser(values);
        Alert.alert(`User ${values.username} has been created successfully`);
        navigation.navigate('Prenota');
      })
      .catch((error) => {
        console.log('Signup failed:', error);
        Alert.alert('Signup failed. Please try again.');
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View>
          <Image style={styles.logo} source={require('../assets/Barber.png')} />
          <View>
            <Controller
              control={control}
              name='firstName'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.username}
                  textAlign={'center'}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Nome'
                  maxLength={20}
                  placeholderTextColor={'white'}
                />
              )}
            />
            {errors.firstName && (
              <Text style={styles.errors}>{errors.firstName.message}</Text>
            )}
            <Controller
              control={control}
              name='lastName'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.username}
                  textAlign={'center'}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Cognome'
                  maxLength={20}
                  placeholderTextColor={'white'}
                />
              )}
            />
            {errors.lastName && (
              <Text style={styles.errors}>{errors.lastName.message}</Text>
            )}
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.username}
                  textAlign={'center'}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Email'
                  maxLength={254}
                  placeholderTextColor={'white'}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errors}>{errors.email.message}</Text>
            )}
            <Controller
              control={control}
              name='phone'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.username}
                  textAlign={'center'}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Cell'
                  maxLength={15}
                  placeholderTextColor={'white'}
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.errors}>{errors.phone.message}</Text>
            )}
            <Controller
              control={control}
              name='dateOfBirth'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.username}
                  textAlign={'center'}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholder='Date of Birth'
                  maxLength={10}
                  placeholderTextColor={'white'}
                />
              )}
            />
            {errors.dateOfBirth && (
              <Text style={styles.errors}>{errors.dateOfBirth.message}</Text>
            )}
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.password}
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
            <Controller
              control={control}
              name='passwordConfirm'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.password}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  placeholderTextColor={'white'}
                  secureTextEntry={true}
                  placeholder='Conferma Password'
                  maxLength={32}
                />
              )}
            />
            {errors.passwordConfirm && (
              <Text style={styles.errors}>
                {errors.passwordConfirm.message}
              </Text>
            )}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={styles.register}
              textAlign={'center'}
            >
              <Text style={styles.registerText}>Register</Text>
            </Pressable>
            <Pressable style={styles.loginLink}>
              <Text
                style={styles.loginText}
                onPress={() => navigation.navigate('Login')}
              >
                Already Registered?
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  username: {
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
  password: {
    height: 40,
    borderWidth: 2,
    borderRadius: 25,
    marginBottom: 15,
    borderColor: 'white',
    textAlign: 'center',
    color: 'white',
    width: 240,
    fontSize: 20,
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
  },
  register: {
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
  registerText: {
    fontSize: 20,
  },
  loginLink: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
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
