import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors} from '../../../constants/Colors';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../../components/shared/Loader';
import CustomDialog from '../../../components/shared/CustomDialog';
import {Server} from '../../../constants/Configs';
import {UserContext} from '../../../context/UserContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // "register" or "otp"
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [uregisterId, seturegisterId] = useState('');
  // @ts-ignore
  const {setUser, user} = useContext(UserContext);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setDialogMessage('Please fill in all fields.');
      setDialogVisible(true);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setDialogMessage('Please enter a valid email address.');
      setDialogVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setDialogMessage('Passwords do not match.');
      setDialogVisible(true);
      return;
    }
    setIsLoading(true);
    axios
      .post(`${Server}/auth/uregister`, {email, password})
      .then(async res => {
        if (res.status === 201) {
          setDialogMessage(
            'Registration successful. Please enter the OTP sent to your email.',
          );
          seturegisterId(res.data.URId);
          setDialogVisible(true);
          setStep('otp');
          setIsLoading(false);
        }
      })
      .catch(e => {
        setIsLoading(false);
        setDialogMessage('Registration failed. Please try again.');
        setDialogVisible(true);
        console.error(e);
      });
  };

  const handleVerifyOTP = () => {
    if (!otp) {
      setDialogMessage('Please enter the OTP.');
      setDialogVisible(true);
      return;
    }
    setIsLoading(true);
    axios
      .post(`${Server}/auth/register`, {email, password, uregisterId, otp})
      .then(res => {
        if (res.status === 200) {
          setDialogMessage('OTP verified successfully.');
          setDialogVisible(true);
          setIsLoading(false);
          // Navigate to the main application screen after successful OTP verification
          navigation.navigate('Login');
        }
      })
      .catch(e => {
        setIsLoading(false);
        setDialogMessage('OTP verification failed. Please try again.');
        setDialogVisible(true);
        console.error(e);
      });
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <Loader
          title={step === 'register' ? 'Registering...' : 'Verifying OTP...'}
        />
      )}

      {step === 'register' ? (
        <>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.description}>
            Register now to start your fitness journey and unlock a healthier
            you!
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Login');
              }}>
              <Text style={styles.signupLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.description}>
            Enter the OTP sent to your email.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Custom Dialog */}
      <CustomDialog
        visible={dialogVisible}
        message={dialogMessage}
        onClose={() => setDialogVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.Secondary,
    marginBottom: 10,
  },
  description: {
    color: Colors.TextSecondary,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.CardBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.TextPrimary,
    marginBottom: 20,
    borderColor: Colors.CardBorder,
    borderWidth: 1,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.Blue,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButton: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.Blue, // Different color for the OTP verification button
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.Secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: Colors.TextSecondary,
    fontSize: 16,
  },
  signupLink: {
    color: Colors.Blue,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default Register;
