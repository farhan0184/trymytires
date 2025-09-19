// 'use server'
import toast from "react-hot-toast";
import {
  changePassword,
  createLanguage,
  createProductCategories,
  deleteLanguage,
  deleteProductCategories,
  login,
  registration,
  resetPassword,
  sendOtp,
  updateLanguage,
  updateProductCategories,
  verifyOtp,
} from "./backend";

export const handleLoginSubmit = async (formdata, setLoading, navigate) => {
  setLoading(true);
  const { success, message: msg, data, errorMessage } = await login(formdata);

  if (success) {
    if (data?.user?.role === "admin") {
      // getUser();
      window.location.href = "/admin";
      toast.success(msg);
    } else {
      // getUser();
      window.location.href = "/user";
      toast.success(msg);
    }
    localStorage.setItem("token", data?.accessToken);
    // localStorage.setItem("user", data?.user ? JSON.stringify(data?.user) : "{}");

    setLoading(false);
  } else {
    toast.error(errorMessage);

    setLoading(false);
  }
};
export const handleOtpSend = async (
  formData,
  setOtpModel,
  setLoading,
  setData,
  action
) => {

  setLoading(true);
  try {
    delete formData.confirmPassword;
    const {
      success,
      message: msg,
      errorMessage,
    } = await sendOtp({
      identifier: formData?.email,
      action: action,
    });
    if (success) {
      toast.success(msg);
      setOtpModel(true);
      setData(formData);
    } else {
      toast.error(parseCastError(errorMessage));
      setOtpModel(false);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred while sending OTP. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
function parseCastError(errorMessage) {
  // Regex to capture field names after `path "` and before `"`
  const regex = /path "([^"]+)"/g;
  const fields = [];

  let match;
  while ((match = regex.exec(errorMessage)) !== null) {
    fields.push(match[1]);
  }

  // If no fields found, return original error message
  if (fields.length === 0) {
    return errorMessage;
  }

  // Return fields joined by comma
  return fields.join(", ");
}


export const handleOtpSubmit = async (
  otp,
  setOtpModel,
  setLoading,
  data,
  navigate,
  action
) => {

  setLoading(true);
  try {
    const {
      success,
      message,
      data: formData,
      errorMessage,
    } = action === "signup"
      ? await registration({ ...data, otp })
      : action === "forget_password" &&
        (await verifyOtp({ identifier: data?.email, otp, action }));
    if (success) {
      if (action === "signup") {
        navigate.push("/sign-in");
      } else if (action === "forget_password") {
        localStorage.setItem("token", formData?.accessToken);
        navigate.push(`/reset-password`);
      }

      toast.success(message);
      setOtpModel(false);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message ||
        "An error occurred while verifying OTP. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

export const handleOtpResend = async (email, setCountdown, setOtp, action) => {
  try {
    const { success, message, errorMessage } = await sendOtp({
      identifier: email,
      action: action,
    });
    if (success) {
      toast.success(message);
      setCountdown(120); // Reset countdown to 2 minutes
      setOtp(""); // Clear OTP input
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message ||
        "An error occurred while resending OTP. Please try again."
    );
  }
};

export const handleResetPassword = async (formData, setLoading, navigate) => {
  setLoading(true);
  try {
    const { success, message, errorMessage } = await resetPassword(formData);
    if (success) {
      toast.success(message);
      localStorage.removeItem("token");
      navigate.push("/sign-in");
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred while resetting password."
    );
  } finally {
    setLoading(false);
  }
};

export const handleUpdatePassword = async (formData, setLoading, navigate) => {
  setLoading(true);

  try {
    const { success, message, errorMessage } = await changePassword(formData);

    if (success) {
      toast.success(message);
      localStorage.removeItem("token");
      navigate.push("/sign-in")
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred while resetting password."
    );
  } finally {
    setLoading(false);
  }
};

export const handleCreateLanguage = async (formData, setLoading, setModal) => {
  setLoading(true);
  try {
    const { success, message, errorMessage } = await createLanguage(formData);
    if (success) {
      toast.success(message);
      setModal(false);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message ||
        "An error occurred during registration. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


export const handleCreateCategory = async (
  formData,
  setLoading,
  setModal,
  isEdit = false,
) => {
  setLoading(true);
  try {
    const { success, message, errorMessage } = isEdit
      ? await updateProductCategories(formData)
      : await createProductCategories(formData);
    if (success) {
      toast.success(message);
      setModal(false);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message ||
        "An error occurred during category registration. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
export const categoryStatusToggle = async (data) => {
  try {
    const { success, message, errorMessage } = await updateProductCategories(
      data
    );
    if (success) {
      toast.success(message);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred during delete. Please try again."
    );
  }
};
export const handleDeleteCreateCategory = async (data) => {
  try {
    const { success, message, errorMessage } = await deleteProductCategories(data);
    if (success) {
      toast.success(message);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred during delete. Please try again."
    );
  }
};


export const handleUpdateLanguage = async (formData, setLoading, setModal) => {
  setLoading(true);
  try {
    const { success, message, errorMessage } = await updateLanguage(formData);
    if (success) {
      toast.success(message);
      setModal(false);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred during update. Please try again."
    );
  } finally {
    setLoading(false);
  }
};
export const handleDeleteLanguage = async (data) => {
  try {
    const { success, message, errorMessage } = await deleteLanguage(data);
    if (success) {
      toast.success(message);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred during delete. Please try again."
    );
  }
};
export const handleContactForm = async (data) => {
  try {
    const { success, message, errorMessage } = await deleteLanguage(data);
    if (success) {
      toast.success(message);
    } else {
      toast.error(errorMessage);
    }
  } catch (error) {

    toast.error(
      error?.message || "An error occurred during delete. Please try again."
    );
  }
};



export const handleApiRequest = async ({
  apiFunc,
  payload,
  setLoading,
  setModal,
  successMessageOverride,
  errorMessageOverride,
  onSuccess,
  onError,
}) => {
  setLoading?.(true);
  try {
    const data = await apiFunc(payload);


    if (data?.success) {
      toast.success( data?.message || "Operation successful");
      setModal?.(false);
      onSuccess?.(); // Optional callback
    } else {
      toast.error(parseCastError(data.errorMessage), data?.errorMessage || "Something went wrong");
      onError?.();
    }
  } catch (error) {

    toast.error(
      error?.message ||
        "An unexpected error occurred. Please try again."
    );
    onError?.(error);
  } finally {
    setLoading?.(false);
  }
};

