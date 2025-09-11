"use client";
import css from "./EditProfilePage.module.css";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import { updateMe } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const router = useRouter();
  const userName = useAuthStore((state) => state.user);
  const setUserName = useAuthStore((state) => state.setUser);
  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData) as { username: string };
    try {
      const response = await updateMe();
      setUserName(response);
      router.push("/profile");
    } catch {
      throw new Error("Invalid name");
    }
  };

  const handlePush = () => {
    router.push("/profile");
  };
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <image
          src={userName?.avatar || "/avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" className={css.input} />
          </div>

          <p>Email: user_email@example.com</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
export default EditProfile;
