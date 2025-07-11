"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native"
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import { auth, db } from "../../src/firebase/config"
import { doc, setDoc } from "firebase/firestore"
import { router } from "expo-router"
import { useTheme } from "../../src/context/ThemeContext"
import { getErrorMessage } from "../../src/utils/getErrorMessage"
import DateTimePicker from "@react-native-community/datetimepicker"
import { AntDesign, Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function RegisterScreen() {
  const { colors, scheme } = useTheme()

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [birthdate, setBirthdate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true)

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setBirthdate(selectedDate)
    }
  }

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !confirmPassword || !birthdate) {
      Alert.alert("Missing Information", "Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCred.user.uid

      await setDoc(doc(db, "users", uid), {
        name,
        surname,
        birthdate: birthdate.toISOString(),
        email,
        createdAt: new Date().toISOString(),
      })

      await sendEmailVerification(userCred.user)
      await signOut(auth)

      Alert.alert(
        "Email Verification",
        "Registration successful. Please check your email to verify your account before logging in.",
      )
      router.replace("/(auth)/login")
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient
        colors={
          scheme === "dark"
            ? [colors.bg.DEFAULT, colors.primary[900]]
            : [colors.primary[100], colors.primary[200]]
        }
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Feather name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: colors.text.primary }]}>Create Account</Text>
            <Text style={[styles.headerSubtext, { color: colors.text.secondary }]}>Sign up to get started</Text>
          </View>

          <View style={[styles.formArea, { backgroundColor: scheme === "dark" ? colors.surface[100] : colors.bg.DEFAULT }]}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>First Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: scheme === "dark" ? colors.bg.DEFAULT : colors.surface[100] }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text.primary }]}
                    placeholder="First Name"
                    placeholderTextColor={colors.text.secondary}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Last Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: scheme === "dark" ? colors.bg.DEFAULT : colors.surface[100] }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text.primary }]}
                    placeholder="Last Name"
                    placeholderTextColor={colors.text.secondary}
                    value={surname}
                    onChangeText={setSurname}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Email Address</Text>
              <View style={[styles.inputWrapper, { backgroundColor: scheme === "dark" ? colors.bg.DEFAULT : colors.surface[100] }]}>
                <AntDesign name="mail" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text.secondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: scheme === "dark" ? colors.bg.DEFAULT : colors.surface[100] }]}>
                <AntDesign name="lock" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder="Create password"
                  placeholderTextColor={colors.text.secondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                />
                <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
                  <AntDesign name={secureTextEntry ? "eyeo" : "eye"} size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Confirm Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: scheme === "dark" ? colors.bg.DEFAULT : colors.surface[100] }]}>
                <AntDesign name="lock" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  placeholder="Confirm password"
                  placeholderTextColor={colors.text.secondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={secureConfirmTextEntry}
                />
                <TouchableOpacity
                  onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                  style={styles.eyeIcon}
                >
                  <AntDesign name={secureConfirmTextEntry ? "eyeo" : "eye"} size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Date of Birth</Text>
              <TouchableOpacity
                style={[styles.inputWrapper, { backgroundColor: scheme === "dark" ? colors.bg.DEFAULT : colors.surface[100] }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Feather name="calendar" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <Text
                  style={{
                    flex: 1,
                    padding: 16,
                    fontSize: 15,
                    color: birthdate ? colors.text.primary : colors.text.secondary,
                  }}
                >
                  {birthdate ? birthdate.toLocaleDateString() : "Select your date of birth"}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                value={birthdate || new Date(2000, 0, 1)}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary.DEFAULT,
                  marginTop: 12,
                },
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <>
                  <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Create Account</Text>
                  <Feather name="user-plus" size={20} color={colors.text.inverse} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.loginText, { color: colors.text.secondary }]}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={[styles.loginLink, { color: colors.primary.DEFAULT }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtext: {
    fontSize: 18,
    opacity: 0.8,
  },
  formArea: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  inputIcon: {
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 15,
  },
  eyeIcon: {
    paddingHorizontal: 14,
  },
  button: {
    flexDirection: "row",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
})
