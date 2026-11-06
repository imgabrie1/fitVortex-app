import { useEffect, useState, useContext } from "react";
import {
  Modal,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import AppText from "../AppText";
import { themas } from "@/global/themes";
import { UserContext } from "@/contexts/User/UserContext";
import { style } from "./styles";
import CustomAlertOneOption from "../AlertOneOptions";

type PasswordInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  isVisible: boolean;
  onToggle: () => void;
};

const PasswordInput = ({
  value,
  onChangeText,
  placeholder,
  isVisible,
  onToggle,
}: PasswordInputProps) => (
  <View style={style.passwordWrapper}>
    <TextInput
      style={[style.input, { paddingRight: 44 }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.5)"
      secureTextEntry={isVisible}
    />
    <Pressable style={style.eyeButton} onPress={onToggle} hitSlop={10}>
      <Octicons
        name={isVisible ? "eye-closed" : "eye"}
        size={20}
        color="rgba(255,255,255,0.7)"
      />
    </Pressable>
  </View>
);

type EditUserModalProps = {
  visible: boolean;
  onClose: () => void;
};

type AlertState = {
  visible: boolean;
  title: string;
  message: string;
  onClose?: () => void;
};

const EditUserModal = ({ visible, onClose }: EditUserModalProps) => {
  const { user, updateUser, updatePassword, loadingForm } =
    useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(true);
  const [showNew, setShowNew] = useState(true);
  const [showConfirm, setShowConfirm] = useState(true);

  // estado único para o alerta de 1 opção
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
  });

  const showAlert = (
    title: string,
    message: string,
    onClose?: () => void
  ) => {
    setAlert({ visible: true, title, message, onClose });
  };

  const closeAlert = () => {
    const cb = alert.onClose;
    setAlert({ visible: false, title: "", message: "" });
    cb?.();
  };

  useEffect(() => {
    if (visible && user) {
      setName(user.name);
      setEmail(user.email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(true);
      setShowNew(true);
      setShowConfirm(true);
    }
  }, [visible, user]);

  if (!user) return null;

  const wantsChangePassword =
    currentPassword.length > 0 ||
    newPassword.length > 0 ||
    confirmPassword.length > 0;

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      showAlert("Atenção", "Nome e email são obrigatórios.");
      return;
    }

    if (wantsChangePassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert(
          "Atenção",
          "Preencha senha atual, nova senha e confirmação para trocar a senha."
        );
        return;
      }
      if (newPassword.length < 6) {
        showAlert("Atenção", "A nova senha deve ter ao menos 6 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        showAlert(
          "Atenção",
          "A nova senha e a confirmação não coincidem."
        );
        return;
      }
      if (newPassword === currentPassword) {
        showAlert("Atenção", "A nova senha deve ser diferente da atual.");
        return;
      }
    }

    try {
      const profileChanged =
        trimmedName !== user.name || trimmedEmail !== user.email;

      if (profileChanged) {
        await updateUser({ name: trimmedName, email: trimmedEmail });
      }

      if (wantsChangePassword) {
        await updatePassword({ currentPassword, newPassword });
      }

      if (profileChanged || wantsChangePassword) {
        // só fecha o modal depois que o usuário confirmar o sucesso
        showAlert("Sucesso", "Dados atualizados!", onClose);
      } else {
        onClose();
      }
    } catch (err) {
      showAlert("Erro", (err as Error).message);
    }
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={style.overlay}>
          <View style={style.card}>
            <ScrollView
              contentContainerStyle={{ gap: 12 }}
              keyboardShouldPersistTaps="handled"
            >
              <AppText style={style.title}>Editar usuário</AppText>

              <AppText style={style.sectionLabel}>
                Informações de perfil
              </AppText>

              <TextInput
                style={style.input}
                value={name}
                onChangeText={setName}
                placeholder="Nome"
                placeholderTextColor="rgba(255,255,255,0.5)"
                autoCapitalize="words"
              />

              <TextInput
                style={style.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View style={style.divider} />

              <AppText style={style.sectionLabel}>
                Alterar senha (opcional)
              </AppText>

              <PasswordInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Senha atual"
                isVisible={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
              />

              <PasswordInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nova senha"
                isVisible={showNew}
                onToggle={() => setShowNew((v) => !v)}
              />

              <PasswordInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmar nova senha"
                isVisible={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
              />
            </ScrollView>

            <View style={style.actions}>
              <Pressable
                style={[style.button, style.cancel]}
                onPress={onClose}
                disabled={loadingForm}
              >
                <AppText style={style.buttonText}>Cancelar</AppText>
              </Pressable>

              <Pressable
                style={[
                  style.button,
                  style.save,
                  loadingForm && { opacity: 0.6 },
                ]}
                onPress={handleSave}
                disabled={loadingForm}
              >
                {loadingForm ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <AppText style={style.buttonText}>Salvar</AppText>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <CustomAlertOneOption
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </>
  );
};

export default EditUserModal;