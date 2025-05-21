import { supabase } from "app";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ChangeEvent, Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";

type formValues = {
  username: string;
  profileName: string;
  profileImgUrl: string;
};

type OnBoardingFormProps ={
  handleChangeFunc: (usernameRef:MutableRefObject<HTMLInputElement | null>)=>void
}

// Validation schema
const onBoardingSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  profileName: Yup.string().required("Profile Name is required"),
});

const uploadImage = async (selectedImage:File, setProfileImgUrl:Dispatch<SetStateAction<string>>) => {
  const { error} = await supabase.storage.from('profileImages').upload(selectedImage.name, selectedImage,{
    contentType:'image/*'
  })

  const media = await supabase.storage.from('profileImages').getPublicUrl(selectedImage.name)
  media && setProfileImgUrl(media.data.publicUrl) 
  error && console.info("Image upload error:" + error?.message)
};

const OnBoardingForm = ({handleChangeFunc}:OnBoardingFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profileImgUrl, setProfileImgUrl] = useState<string>("");
  const userNameRef = useRef<HTMLInputElement|null>(null)

  const formik = useFormik<formValues>({
    initialValues: {
      username: "",
      profileName: "",
      profileImgUrl: "/profile.png",
    },
    validationSchema: onBoardingSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      values.profileImgUrl=profileImgUrl
      console.info("Setting profile"+JSON.stringify(values, null,2))      
    },
  });

  const handleChange  = (event:ChangeEvent<HTMLInputElement>)=>{
    handleChangeFunc(userNameRef)
    formik.handleChange(event)
  }

  useEffect(()=>{
    selectedImage && uploadImage(selectedImage, setProfileImgUrl)
  },[selectedImage])

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-2">
        <img
          style={{
            height: "200px",
            width: "200px",
            background: "black",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          onClick={() => document.getElementById("profileImg")?.click()}
          src={`${profileImgUrl ? profileImgUrl : "/profile.png"}`}
          alt="profile"
        />
        <input
          hidden
          type="file"
          accept="image/jpg"
          id="profileImg"
          onChange={(e) =>
            setSelectedImage(e.target.files ? e.target.files[0] : null)
          }
          name="profileImg"
        />
      </div>

      {/* Username Field */}
      <div className="flex flex-col mb-2">
        <label
          htmlFor="username"
          className="text-sm font-light text-gray-400 mb-1"
        >
          username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          ref={userNameRef}
          maxLength={30}
          className="w-full p-2 rounded bg-[#1C2B3A] text-white"
          value={formik.values.username}
          onChange={(event)=>handleChange(event)}
        />

        {formik.touched.username && formik.errors.username && (
          <div className="text-red-600 text-sm">{formik.errors.username}</div>
        )}
      </div>

      {/* Profile Name Field */}
      <div className="flex flex-col mb-2">
        <label
          htmlFor="profileName"
          className="text-sm font-light text-gray-400 mb-1"
        >
          Profile Name
        </label>
        <input
          type="text"
          id="profileName"
          name="profileName"
          className="w-full p-2 rounded bg-[#1C2B3A] text-white"
          value={formik.values.profileName}
          onChange={formik.handleChange}
        />
        {formik.touched.profileName && formik.errors.profileName && (
          <div className="text-red-600 text-sm">
            {formik.errors.profileName}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        disabled={formik.isSubmitting}
      >
        Submit
      </button>
    </form>
  );
};
export default OnBoardingForm;
